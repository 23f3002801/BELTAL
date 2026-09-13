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
  AssetNFT: import.meta.env.VITE_CONTRACT_ADDRESS || '0x764a4993CfeF679AA0999d7Fa324D16c66d07E0a',
};

export const CONTRACT_ABIS = {
  AssetNFT: AssetNFTArtifact.abi || AssetNFTArtifact,
};
