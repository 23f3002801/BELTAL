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
  AuditLog: import.meta.env.VITE_AUDIT_LOG_ADDRESS || AuditLogArtifact.address || '0x49F21Cbc42b7083ffD752fF0c226D5C84A65b336',
  IdentityRegistry: import.meta.env.VITE_IDENTITY_REGISTRY_ADDRESS || IdentityRegistryArtifact.address || '0xeF758B25C8e5C5880fa0f26a36A1eA66E9D04aB4',
  AccessControl: import.meta.env.VITE_ACCESS_CONTROL_ADDRESS || AccessControlArtifact.address || '0xE1B252E8811DD52c83F6C9234D36Ca5E5FF552E7',
  AssetNFT: import.meta.env.VITE_CONTRACT_ADDRESS || AssetNFTArtifact.address || '0xaFCB6CEf019c4dB0B3711A809ff63a80D747FCf4',
};

export const CONTRACT_ABIS = {
  AuditLog: AuditLogArtifact.abi || AuditLogArtifact,
  IdentityRegistry: IdentityRegistryArtifact.abi || IdentityRegistryArtifact,
  AccessControl: AccessControlArtifact.abi || AccessControlArtifact,
  AssetNFT: AssetNFTArtifact.abi || AssetNFTArtifact,
};
