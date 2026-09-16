import prisma from '../config/db.js';
import logger from '../config/logger.js';
import ApiError from '../utils/ApiError.js';

/**
 * Unified audit trail service — reads from AuditEvent and PacsBadgeEvent tables
 * with paginated, filterable, time-range queries. (Issue #47)
 */
export const auditService = {
  /**
   * Paginated, filterable audit trail.
   * Supports filters: type, actorId, targetId, txHash, from, to, page, limit
   * Unifies AuditEvent rows with PacsBadgeEvent rows (tagged PACS_ACCESS_GRANTED/DENIED).
   */
  async getAuditTrail(query) {
    if (!prisma) throw new ApiError(503, 'Database unavailable');

    const page  = Math.max(1, parseInt(query.page,  10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(query.limit, 10) || 20));
    const skip  = (page - 1) * limit;

    // --- AuditEvent filters ---
    const where = {};

    if (query.type) {
      // Support comma-separated types: ?type=ASSET_MINTED,OWNERSHIP_TRANSFERRED
      const types = query.type.split(',').map((t) => t.trim());
      where.type = types.length === 1 ? types[0] : { in: types };
    }

    if (query.actorId)  where.actorId  = query.actorId;
    if (query.targetId) where.targetId = query.targetId;
    if (query.txHash)   where.txHash   = query.txHash;

    if (query.from || query.to) {
      where.createdAt = {};
      if (query.from) where.createdAt.gte = new Date(query.from);
      if (query.to)   where.createdAt.lte = new Date(query.to);
    }

    // --- Whether to include PACS badge events in the unified trail ---
    const includePacs = !query.type ||
      query.type.includes('PACS_ACCESS_GRANTED') ||
      query.type.includes('PACS_ACCESS_DENIED');

    const [totalAudit, auditEvents] = await Promise.all([
      prisma.auditEvent.count({ where }),
      prisma.auditEvent.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          actor: {
            select: {
              id: true,
              displayName: true,
              walletAddress: true,
              role: true,
              sbu: true,
              clearanceLevel: true,
            },
          },
        },
      }),
    ]);

    // Normalize AuditEvent rows
    const normalizedAudit = auditEvents.map((e) => ({
      id:          e.id,
      source:      'AUDIT_EVENT',
      type:        e.type,
      actor:       e.actor,
      targetId:    e.targetId,
      txHash:      e.txHash,
      blockNumber: e.blockNumber ? e.blockNumber.toString() : null,
      payload:     e.payload,
      timestamp:   e.createdAt,
    }));

    // --- Optionally union PacsBadgeEvent rows ---
    let pacsRows = [];
    let totalPacs = 0;

    if (includePacs) {
      const pacsWhere = {};
      if (query.actorId) pacsWhere.employeeId = query.actorId;

      // Zone filter via targetId (zoneId)
      if (query.targetId) pacsWhere.zoneId = query.targetId;

      if (query.from || query.to) {
        pacsWhere.scannedAt = {};
        if (query.from) pacsWhere.scannedAt.gte = new Date(query.from);
        if (query.to)   pacsWhere.scannedAt.lte = new Date(query.to);
      }

      // type filter for PACS
      if (query.type) {
        const types = query.type.split(',').map((t) => t.trim());
        const pacsTypes = types.filter((t) =>
          ['PACS_ACCESS_GRANTED', 'PACS_ACCESS_DENIED'].includes(t)
        );
        if (pacsTypes.length > 0) {
          pacsWhere.decision = pacsTypes.length === 1
            ? (pacsTypes[0] === 'PACS_ACCESS_GRANTED' ? 'GRANTED' : 'DENIED')
            : { in: pacsTypes.map((t) => (t === 'PACS_ACCESS_GRANTED' ? 'GRANTED' : 'DENIED')) };
        }
      }

      [totalPacs, pacsRows] = await Promise.all([
        prisma.pacsBadgeEvent.count({ where: pacsWhere }),
        prisma.pacsBadgeEvent.findMany({
          where: pacsWhere,
          take: limit,
          orderBy: { scannedAt: 'desc' },
          include: {
            employee: {
              select: {
                id: true,
                displayName: true,
                walletAddress: true,
                role: true,
                sbu: true,
              },
            },
            zone: {
              select: { zoneId: true, name: true, requiredClearance: true, sbu: true },
            },
          },
        }),
      ]);
    }

    // Normalize PacsBadgeEvent rows into the unified shape
    const normalizedPacs = pacsRows.map((p) => ({
      id:          p.id,
      source:      'PACS_BADGE_EVENT',
      type:        p.decision === 'GRANTED' ? 'PACS_ACCESS_GRANTED' : 'PACS_ACCESS_DENIED',
      actor:       p.employee,
      targetId:    p.zoneId,
      txHash:      p.onChainTxHash || null,
      blockNumber: p.blockNumber ? p.blockNumber.toString() : null,
      payload: {
        readerId:     p.readerId,
        zone:         p.zone,
        decision:     p.decision,
        denialReason: p.denialReason || null,
      },
      timestamp: p.scannedAt,
    }));

    // Merge and sort unified trail by timestamp desc
    const unified = [...normalizedAudit, ...normalizedPacs].sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );

    return {
      events: unified.slice(0, limit),
      pagination: {
        total:      totalAudit + totalPacs,
        page,
        limit,
        totalPages: Math.ceil((totalAudit + totalPacs) / limit),
      },
    };
  },

  /**
   * Fetch a single AuditEvent by its UUID
   */
  async getAuditEventById(eventId) {
    if (!prisma) throw new ApiError(503, 'Database unavailable');

    const event = await prisma.auditEvent.findUnique({
      where: { id: eventId },
      include: {
        actor: {
          select: {
            id: true,
            displayName: true,
            walletAddress: true,
            role: true,
            sbu: true,
            clearanceLevel: true,
          },
        },
      },
    });

    if (!event) throw new ApiError(404, 'Audit event not found');

    return {
      id:          event.id,
      source:      'AUDIT_EVENT',
      type:        event.type,
      actor:       event.actor,
      targetId:    event.targetId,
      txHash:      event.txHash,
      blockNumber: event.blockNumber ? event.blockNumber.toString() : null,
      payload:     event.payload,
      timestamp:   event.createdAt,
    };
  },
};

export default auditService;
