import Blockchain from '../blockchain/Blockchain.js';
import SmartContractManager from '../blockchain/SmartContracts.js';
import BlockchainAdapter from './blockchainAdapter.js';

let blockchain = null;
let smartContracts = null;
let blockchainAdapter = null;

export const initBlockchain = () => {
  if (!blockchain) {
    blockchain = new Blockchain();
  }

  if (!smartContracts) {
    smartContracts = new SmartContractManager(blockchain);
  }

  // Try to initialize Solidity adapter
  try {
    if (!blockchainAdapter) {
      blockchainAdapter = new BlockchainAdapter();
      blockchainAdapter.init().catch((error) => {
        console.log('Solidity adapter not available, using JavaScript fallback:', error.message);
        blockchainAdapter = null;
      });
    }
  } catch (error) {
    console.log('Solidity adapter not available, using JavaScript fallback:', error.message);
    blockchainAdapter = null;
  }

  return { blockchain, smartContracts, blockchainAdapter };
};

export const getBlockchain = () => {
  if (!blockchain) {
    initBlockchain();
  }
  return blockchain;
};

export const getSmartContracts = () => {
  if (!smartContracts) {
    initBlockchain();
  }
  return smartContracts;
};

export const getBlockchainAdapter = () => {
  return blockchainAdapter;
};



