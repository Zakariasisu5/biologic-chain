
import { ethers } from "ethers";

// Types for wallet connection
export interface WalletInfo {
  address: string;
  balance: string;
  chainId: number;
  network: string;
  isConnected: boolean;
}

// Default wallet info for initialization
export const defaultWalletInfo: WalletInfo = {
  address: "",
  balance: "0",
  chainId: 0,
  network: "",
  isConnected: false
};

// Networks supported by the app
export const supportedNetworks = {
  1: "Ethereum Mainnet",
  5: "Goerli Testnet",
  11155111: "Sepolia Testnet",
  137: "Polygon Mainnet",
  80001: "Mumbai Testnet",
};

// Connect wallet function
export const connectWallet = async (): Promise<WalletInfo> => {
  try {
    if (!window.ethereum) {
      throw new Error("No Ethereum wallet detected. Please install MetaMask or another wallet provider.");
    }
    
    // Request account access
    // Ensure ethereum has the required request method for BrowserProvider
    if (!window.ethereum.request) {
      throw new Error("Ethereum provider doesn't support required methods");
    }
    
    const provider = new ethers.BrowserProvider(window.ethereum as ethers.Eip1193Provider);
    await provider.send("eth_requestAccounts", []);
    
    const signer = await provider.getSigner();
    const address = await signer.getAddress();
    const network = await provider.getNetwork();
    const chainId = Number(network.chainId);
    const balance = ethers.formatEther(await provider.getBalance(address));
    
    // Return wallet info
    return {
      address,
      balance,
      chainId,
      network: supportedNetworks[chainId as keyof typeof supportedNetworks] || "Unknown Network",
      isConnected: true
    };
  } catch (error) {
    console.error("Error connecting wallet:", error);
    throw error;
  }
};

// Disconnect wallet function (for UI state management, doesn't actually disconnect the wallet)
export const disconnectWallet = (): WalletInfo => {
  return defaultWalletInfo;
};

// Check if MetaMask or another wallet is installed
export const isWalletInstalled = (): boolean => {
  return typeof window !== 'undefined' && !!window.ethereum;
};

// Listen to account changes
export const setupWalletEventListeners = (
  handleAccountsChanged: (accounts: string[]) => void,
  handleChainChanged: (chainId: string) => void
) => {
  if (window.ethereum) {
    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);
    
    // Return cleanup function
    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum.removeListener('chainChanged', handleChainChanged);
    };
  }
  return () => {};
};
