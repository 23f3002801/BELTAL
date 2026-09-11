import { ethers } from 'ethers';
import config from './env.js';

// No Contract instance here yet — ABI pending blockchain sub-team sign-off
// (issue #78). This just exports the provider so one can be attached later.
let provider = null;

if (config.rpcUrl) {
  provider = new ethers.JsonRpcProvider(config.rpcUrl);
} else {
  console.warn('RPC_URL is unset — blockchain provider not initialized; on-chain calls will be unavailable.');
}

export default provider;
