import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ethers } from 'ethers';
import provider from '../config/blockchain.js';
import config from '../config/env.js';
import logger from '../config/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const contractArtifactPath = path.join(__dirname, '../config/contracts/AssetNFT.json');

let assetNftAbi = null;
try {
  if (fs.existsSync(contractArtifactPath)) {
    const raw = fs.readFileSync(contractArtifactPath, 'utf8');
    assetNftAbi = JSON.parse(raw).abi;
  }
} catch (err) {
  logger.warn(`Failed to load AssetNFT ABI: ${err.message}`);
}

function isConfigured() {
  return Boolean(provider && config.contractAddress && assetNftAbi);
}

function getSigner() {
  if (!config.deployerPrivateKey || !provider) return null;
  try {
    return new ethers.Wallet(config.deployerPrivateKey.trim(), provider);
  } catch {
    return null;
  }
}

function getAssetContract() {
  const signer = getSigner();
  if (!signer || !config.contractAddress || !assetNftAbi) return null;
  return new ethers.Contract(config.contractAddress, assetNftAbi, signer);
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

    // Degrades gracefully pending IdentityRegistry contract deployment
    logger.warn(`On-chain identity registration skipped for ${walletAddress} — IdentityRegistry pending deployment.`);
    return { txHash: null, blockNumber: null, confirmed: false };
  },

  async assignRoleOnChain({ walletAddress, role, clearanceLevel }) {
    if (!isConfigured()) {
      logger.warn(
        `On-chain role/clearance assignment skipped for ${walletAddress} — contract not yet configured (pending ABI, see #78/#94).`
      );
      return { txHash: null, blockNumber: null, confirmed: false };
    }

    logger.warn(`On-chain role assignment skipped for ${walletAddress} — IdentityRegistry pending deployment.`);
    return { txHash: null, blockNumber: null, confirmed: false };
  },

  async mintAssetOnChain({ custodianWallet, assetTag, classificationTier, sbu, ipfsCid }) {
    const contract = getAssetContract();
    if (!isConfigured() || !contract) {
      logger.warn(
        `On-chain asset minting skipped for ${custodianWallet} (${assetTag || 'Asset'}) — contract or deployer key not configured.`
      );
      return { txHash: null, blockNumber: null, tokenId: null, confirmed: false };
    }

    try {
      const sbuBytes32 = ethers.encodeBytes32String((sbu || 'SBU_RADAR').slice(0, 31));
      const tx = await contract.mintAsset(
        custodianWallet,
        assetTag || 'BEL-ASSET',
        classificationTier,
        sbuBytes32,
        `ipfs://${ipfsCid || ''}`
      );
      const receipt = await tx.wait();

      let tokenId = null;
      for (const log of receipt.logs) {
        try {
          const parsed = contract.interface.parseLog(log);
          if (parsed && parsed.name === 'AssetMinted') {
            tokenId = parsed.args.tokenId.toString();
            break;
          }
        } catch {
          // ignore unparsed logs
        }
      }

      logger.info(`Asset minted on Ethereum Sepolia: Token #${tokenId}, Tx: ${receipt.hash}`);
      return {
        txHash: receipt.hash,
        blockNumber: receipt.blockNumber,
        tokenId,
        confirmed: true,
      };
    } catch (err) {
      logger.error(`On-chain asset minting transaction failed: ${err.message}`);
      return { txHash: null, blockNumber: null, tokenId: null, confirmed: false, error: err.message };
    }
  },

  async reassignCustodyOnChain({ tokenId, newCustodianWallet, reason }) {
    const contract = getAssetContract();
    if (!isConfigured() || !contract || !tokenId) {
      logger.warn(
        `On-chain custody reassignment skipped for token #${tokenId} to ${newCustodianWallet} — contract/deployer or tokenId not present.`
      );
      return { txHash: null, blockNumber: null, confirmed: false };
    }

    try {
      const tx = await contract.reassignCustody(
        BigInt(tokenId),
        newCustodianWallet,
        reason || 'AUTHORIZED_HANDOVER'
      );
      const receipt = await tx.wait();

      logger.info(`Custody reassigned on Ethereum Sepolia: Token #${tokenId} -> ${newCustodianWallet}, Tx: ${receipt.hash}`);
      return {
        txHash: receipt.hash,
        blockNumber: receipt.blockNumber,
        confirmed: true,
      };
    } catch (err) {
      logger.error(`On-chain custody reassignment failed: ${err.message}`);
      return { txHash: null, blockNumber: null, confirmed: false, error: err.message };
    }
  },
};

export default chainService;
