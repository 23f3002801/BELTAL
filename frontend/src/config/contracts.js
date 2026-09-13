import AuditLogArtifact from '../contracts/AuditLog.json';
import IdentityRegistryArtifact from '../contracts/IdentityRegistry.json';
import AccessControlArtifact from '../contracts/AccessControl.json';
import AssetNFTArtifact from '../contracts/AssetNFT.json';

export const SEPOLIA_CONFIG = {
  chainId: 11155111,
  chainIdHex: '0xaa36a7',
  name: 'Ethereum Sepolia',
  rpcUrl: import.meta.env.VITE_RPC_URL || 'https://ethereum-sepolia-rpc.publicnode.com',
  explorerUrl: 'https://sepolia.etherscan.io',
  nativeCurrency: {
    name: 'Sepolia Ether',
    symbol: 'ETH',
    decimals: 18,
  },
};

export const CONTRACT_ADDRESSES = {
  AuditLog: import.meta.env.VITE_AUDIT_LOG_ADDRESS || AuditLogArtifact.address || '0xea89806aaAa59F322A3f30C97f812B3fC9B36e22',
  IdentityRegistry: import.meta.env.VITE_IDENTITY_REGISTRY_ADDRESS || IdentityRegistryArtifact.address || '0x1e39BDfA04A40fA2273d46d8eC9EEf6804C8B4c0',
  AccessControl: import.meta.env.VITE_ACCESS_CONTROL_ADDRESS || AccessControlArtifact.address || '0x8278dF42EF08584eE12333Eaaa4AA53A57f516f7',
  AssetNFT: import.meta.env.VITE_CONTRACT_ADDRESS || AssetNFTArtifact.address || '0xf7C27dAbcBeea549c7a7C95DdB3EDfC6CB2d2B8A',
};

export const CONTRACT_ABIS = {
  AuditLog: AuditLogArtifact.abi || AuditLogArtifact,
  IdentityRegistry: IdentityRegistryArtifact.abi || IdentityRegistryArtifact,
  AccessControl: AccessControlArtifact.abi || AccessControlArtifact,
  AssetNFT: AssetNFTArtifact.abi || AssetNFTArtifact,
};
