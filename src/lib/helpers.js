import { Web3 } from 'web3';
import { abi, priceFeedV3Abi } from './abi.js'
import onboard from './onboard.js';
import EthCrypto from "eth-crypto";

// Load contract address from .env file
export const deployedAddress_Arb = import.meta.env.VITE_CONTRACT_ADDRESS;
export const priceFeedV3Address_Arb = import.meta.env.VITE_PRICE_FEED_V3_ADDRESS;

export const deployedAddress_Arb_Sepolia = import.meta.env.VITE_ARB_SEPOLIA_CONTRACT_ADDRESS
export const priceFeedV3Address_Arb_Sepolia = import.meta.env.VITE_ARB_SEPOLIA_PRICE_V3_ADDRESS;

export const deployedAddress_Sepolia = import.meta.env.VITE_SEPOLIA_CONTRACT_ADDRESS;
export const priceFeedV3Address_Sepolia = import.meta.env.VITE_SEPOLIA_PRICE_V3_ADDRESS;

// 42161
const ArbiChainId = 0xa4b1;

// 421614
const ArbiSepoliaChainId = 0x66eee;

// 11155111
const SepoliaChainId = 0xaa36a7;

const loadAddress = (chainId) => {
  switch (chainId) {
    case ArbiChainId:
      return { contractAddress: deployedAddress_Arb, priceFeedV3Address: priceFeedV3Address_Arb };
    case SepoliaChainId:
      return { contractAddress: deployedAddress_Sepolia, priceFeedV3Address: priceFeedV3Address_Sepolia };
    case ArbiSepoliaChainId:
      return { contractAddress: deployedAddress_Arb_Sepolia, priceFeedV3Address: priceFeedV3Address_Arb_Sepolia };
    default:
      console.warn(`Unsupported chainId: ${chainId}`);
      return { contractAddress: null, priceFeedV3Address: null };
  }
};

export const loadContract = async (loadProvider) => {
  try {
    const web3 = new Web3(loadProvider);
    const accounts = await web3.eth.getAccounts();
    const defaultAccount = accounts[0];

    const chainId = await web3.eth.getChainId();

    console.log("Chain ID:", chainId);

    const { contractAddress, _ } = loadAddress(Number(chainId));

    console.log("Contract Address:", contractAddress);

    const contract = new web3.eth.Contract(abi, contractAddress);

    return {
      defaultAccount,
      contract
    };

  } catch (error) {
    console.log("Error loading contract:", error);
  }
};

export const loadPriceFeedV3 = async (loadProvider) => {

  try {
    const web3 = new Web3(loadProvider);
    const accounts = await web3.eth.getAccounts();

    // Get network chain ID
    const chainId = await web3.eth.getChainId();

    console.log(chainId);

    const defaultAccount = accounts[0];

    const { _, priceFeedV3Address } = loadAddress(Number(chainId));

    const contract = new web3.eth.Contract(priceFeedV3Abi, priceFeedV3Address);

    return {
      defaultAccount: defaultAccount,
      contract: contract
    };

  } catch (error) {
    console.log(error);
  }
};

export const connectWallet = async () => {
  await onboard.connectWallet();
};

export const getCostAndPrice = async (provider, orderQty) => {
  try {
    const { contract } = await loadContract(provider);

    const costInWei = await contract.methods.totalCost(orderQty).call();

    // Convert BigInt to javascript string
    const totalCostInNumber = (Number(costInWei) / 10 ** 18).toString();

    // Slice some fraction for display purpose.
    const totalCost = totalCostInNumber.slice(0, 8);

    const perPrice = await contract.methods.price().call();

    const price = perPrice * BigInt(orderQty);

    const totalStock = await contract.methods.totalStock().call();

    return {
      totalCost,
      price,
      totalStock
    };
  } catch (error) {
    console.log(error);
  }
};

export const decryptForm = async (encryptedForm, privateKey) => {
  const stringData = EthCrypto.cipher.parse(encryptedForm);

  const formData = await EthCrypto.decryptWithPrivateKey(
    privateKey,
    stringData,
  );

  return formData;
};

export const encryptForm = async (publicKey, stringForm) => {
  const encryptedForm = await EthCrypto.encryptWithPublicKey(
    publicKey,
    stringForm,
  );

  // Transforms the object with the encrypted data into a smaller string-representation.
  const stringEncrypted = EthCrypto.cipher.stringify(encryptedForm);

  return stringEncrypted;
};

export const orderStatus = (orderNo) => {
  switch (orderNo) {
    case 1:
      return "Pending";
    case 2:
      return "Shipped";
    case 3:
      return "Cancelled";
    case 4:
      return "Refunded";
    default:
      return
  }
}





