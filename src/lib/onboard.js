import Onboard from '@web3-onboard/core';
import injectedModule from '@web3-onboard/injected-wallets';
import metamaskSDK from "@web3-onboard/metamask";
import walletConnectModule from '@web3-onboard/walletconnect';

const injected = injectedModule();

export const PROJECT_ID = import.meta.env.VITE_PROJECTID;

const wcInitOptions = {
  projectId: PROJECT_ID,
  dappUrl: 'http://apsostore.com'
}

const walletConnect = walletConnectModule(wcInitOptions)

// initialize the module with options
const metamaskSDKWallet = metamaskSDK({options: {
  extensionOnly: false,
  dappMetadata: {
    name: 'ApsoStore'
  }
}});

const wallets = [
  injected,
  metamaskSDKWallet,
  walletConnect
];

const chains = [
  {
    id: 1,
    token: 'ETH',
    label: "Ethereum Mainnet",
    rpcUrl: 'https://mainnet.infura.io'
  },
  {
    id: 42161,
    token: 'ARB-ETH',
    label: 'Arbitrum One',
    rpcUrl: 'https://arb1.arbitrum.io/rpc'
  },
  {
    id: 1115511,
    token: 'ETH',
    label: 'Sepolia',
    rpcUrl: 'https://sepolia.infura.io'
  },
  {
    id: 421614,
    token: 'ARB-ETH',
    label: 'Sepolia Arbitrum',
    rpcUrl: 'https://sepolia-rollup.arbitrum.i/rpc'
  },
];

const appMetadata = {
  name: 'apsoStore',
  icon: '<svg>My App Icon</svg>',
  description: 'decentralize shop.',
  recommendedInjectedWallets: [
    { name: 'MetaMask', url: 'https://metamask.io' },
    { name: 'Coinbase', url: 'https://wallet.coinbase.com/' }
  ]
};

const onboard = Onboard({
  wallets,
  chains,
  appMetadata,
  accountCenter: {
    desktop: {
      enabled: false    
    },
    mobile: {
      enabled: false    
    }
  }
});

export default onboard;
