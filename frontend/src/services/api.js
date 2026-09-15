import axios from 'axios';

/**
 * Axios API client — BELTAL / TrustChain backend
 *
 * Auth flow:
 *  - Request interceptor reads JWT from localStorage and attaches
 *    `Authorization: Bearer <token>` to every outgoing request.
 *  - Response interceptor handles 401 Unauthorized globally:
 *    clears storage and fires a custom `beltal:session-expired` event
 *    so any listener (AuthContext, Toast, etc.) can react gracefully.
 */

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 15_000,
});

/* ── Request interceptor — attach JWT ──────────────────── */
api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem('token') ||
      sessionStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/* ── Response interceptor — handle 401 ────────────────── */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear persisted credentials
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');

      // Broadcast expiry event — AuthContext & Toast listen for this
      window.dispatchEvent(new CustomEvent('beltal:session-expired'));
    }

    // Normalise error message for UI consumption
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'An unexpected error occurred';

    return Promise.reject({ ...error, uiMessage: message });
  }
);

/* ── Typed convenience wrappers ────────────────────────── */
export const get = (url, config) => api.get(url, config);
export const post = (url, data, config) => api.post(url, data, config);
export const put = (url, data, config) => api.put(url, data, config);
export const patch = (url, data, config) => api.patch(url, data, config);
export const del = (url, config) => api.delete(url, config);

/* ── Auth-specific typed helpers ───────────────────────── */
export const authApi = {
  /**
   * Request a single-use SIWE challenge nonce from the backend.
   * POST /auth/nonce  { walletAddress }
   * @param {string} walletAddress  — checksummed Ethereum address
   * @returns {Promise<{ walletAddress, nonce, message, expiresAt }>}
   */
  getNonce: (walletAddress) =>
    api.post('/auth/nonce', { walletAddress }).then((r) => r.data.data),

  /**
   * Exchange a signed nonce for a JWT.
   * POST /auth/verify  { walletAddress, signature }
   * @returns {Promise<{ token, user }>}
   */
  verify: (walletAddress, signature) =>
    api.post('/auth/verify', { walletAddress, signature }).then((r) => r.data.data),
};

/* ── Admin-specific typed helpers ──────────────────────── */
export const adminApi = {
  /**
   * Fetch dashboard metric stats.
   * GET /admin/stats
   * @returns {Promise<{ totalIdentities, activeAssets, pendingTransfers, consensusHealth }>}
   */
  getStats: () =>
    api.get('/admin/stats').then((r) => r.data.data),

  /**
   * List identities on the sovereign ledger with optional filters.
   * GET /admin/identities?search=&sbu=&clearance=&page=&limit=
   * @param {{ search?, sbu?, clearance?, page?, limit? }} params
   * @returns {Promise<{ users, total, page, limit }>}
   */
  listIdentities: (params = {}) =>
    api.get('/admin/identities', { params }).then((r) => r.data.data),

  /**
   * Register a new identity on the sovereign ledger.
   * POST /admin/identities
   * @param {{ walletAddress, role, clearanceLevel, sbu, displayName, identityHash? }} payload
   * @returns {Promise<{ id, walletAddress, role, clearanceLevel, sbu, chain, ... }>}
   */
  registerIdentity: (payload) =>
    api.post('/admin/identities', payload).then((r) => r.data.data),

  /**
   * Update an identity's role and/or clearance level.
   * PATCH /admin/identities/:id/role
   * @param {string} id
   * @param {{ role?, clearanceLevel? }} payload
   * @returns {Promise<{ id, role, clearanceLevel, chain }>}
   */
  updateRole: (id, payload) =>
    api.patch(`/admin/identities/${id}/role`, payload).then((r) => r.data.data),
};

export const assetApi = {
  /** POST /assets — pins asset metadata and mints an asset to a custodian. */
  mint: (payload) => api.post('/assets', payload).then((r) => r.data.data),
  /** GET /assets — administrator asset ledger. */
  list: (params = {}) => api.get('/assets', { params }).then((r) => r.data.data),
};

/* ── Transfer-specific typed helpers ────────────────── */
export const transferApi = {
  /** GET /transfers - list all transfer requests with filters */
  list: (params = {}) => api.get('/transfers', { params }).then((r) => r.data.data),

  /** POST /transfers - create a new transfer request */
  create: (payload) => api.post('/transfers', payload).then((r) => r.data.data),

  /** PATCH /transfers/:id/approve - approve a transfer request */
  approve: (id) => api.patch(`/transfers/${id}/approve`).then((r) => r.data.data),

  /** PATCH /transfers/:id/reject - reject a transfer request */
  reject: (id) => api.patch(`/transfers/${id}/reject`).then((r) => r.data.data),
};

export default api;
