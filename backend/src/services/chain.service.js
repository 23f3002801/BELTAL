import provider from '../config/blockchain.js';
import config from '../config/env.js';
import logger from '../config/logger.js';

// No Contract instance yet — ABI/address pending sign-off with the blockchain
// sub-team (issues.txt #94, GitHub #78). Every method below degrades to a
// logged no-op instead of throwing, so the rest of the write flow (DB cache
// write, IPFS dossier pin) stays fully usable in the meantime. Once a real
// ethers.Contract can be built (provider + CONTRACT_ADDRESS + ABI), wire it in
// here — callers don't need to change.
function isConfigured() {
  return Boolean(provider && config.contractAddress);
}

export const chainService = {
  isConfigured,

  async registerIdentityOnChain({ walletAddress, identityHash }) {
    if (!isConfigured()) {
      logger.warn(
        `On-chain identity registration skipped for ${walletAddress} — contract not yet configured (pending ABI, see #78/#94).`
      );
      return { txHash: null, blockNumber: null, confirmed: false };
    }

    // TODO(#78/#94): contract.registerIdentity(walletAddress, identityHash) once
    // the ABI/address are agreed with the blockchain sub-team.
    throw new Error('CONTRACT_ADDRESS is set but registerIdentityOnChain has no contract wiring yet');
  },

  async assignRoleOnChain({ walletAddress, role, clearanceLevel }) {
    if (!isConfigured()) {
      logger.warn(
        `On-chain role/clearance assignment skipped for ${walletAddress} — contract not yet configured (pending ABI, see #78/#94).`
      );
      return { txHash: null, blockNumber: null, confirmed: false };
    }

    // TODO(#78/#94): contract.assignRole(walletAddress, role, clearanceLevel).
    throw new Error('CONTRACT_ADDRESS is set but assignRoleOnChain has no contract wiring yet');
  },

  async mintAssetOnChain({ custodianWallet, assetTag, classificationTier, sbu, ipfsCid }) {
    if (!isConfigured()) {
      logger.warn(
        `On-chain asset minting skipped for ${custodianWallet} (${assetTag || 'Asset'}) — contract not yet configured (pending ABI, see #78/#94).`
      );
      return { txHash: null, blockNumber: null, tokenId: null, confirmed: false };
    }

    // TODO(#78/#94): contract.mintAsset(custodianWallet, assetTag, classificationTier, sbu, ipfsCid)
    throw new Error('CONTRACT_ADDRESS is set but mintAssetOnChain has no contract wiring yet');
  },

  async reassignCustodyOnChain({ tokenId, newCustodianWallet, reason }) {
    if (!isConfigured()) {
      logger.warn(
        `On-chain custody reassignment skipped for token #${tokenId} to ${newCustodianWallet} — contract not yet configured (pending ABI, see #78/#94).`
      );
      return { txHash: null, blockNumber: null, confirmed: false };
    }

    // TODO(#78/#94): contract.reassignCustody(tokenId, newCustodianWallet, reason)
    throw new Error('CONTRACT_ADDRESS is set but reassignCustodyOnChain has no contract wiring yet');
  },
};

export default chainService;
