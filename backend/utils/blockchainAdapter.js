import { ethers } from 'ethers';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class BlockchainAdapter {
  constructor() {
    this.provider = null;
    this.contracts = {};
    this.initialized = false;
  }

  async init() {
    try {
      const addressesPath = path.join(__dirname, '..', 'contract-addresses.json');
      if (!fs.existsSync(addressesPath)) {
        throw new Error('Contract addresses file not found');
      }

      const addresses = JSON.parse(fs.readFileSync(addressesPath, 'utf8'));

      // Connect to Hardhat network
      this.provider = new ethers.JsonRpcProvider('http://127.0.0.1:8545');

      // Load contract ABIs
      const systemABI = this.loadABI('EVotingSystem');
      const voterRegABI = this.loadABI('VoterRegistration');
      const ballotABI = this.loadABI('BallotContract');
      const tabulationABI = this.loadABI('TabulationContract');
      const auditABI = this.loadABI('AuditContract');

      // Initialize contracts
      this.contracts.system = new ethers.Contract(addresses.system, systemABI, this.provider);
      this.contracts.voterRegistration = new ethers.Contract(
        addresses.voterRegistration,
        voterRegABI,
        this.provider
      );
      this.contracts.ballot = new ethers.Contract(addresses.ballotContract, ballotABI, this.provider);
      this.contracts.tabulation = new ethers.Contract(
        addresses.tabulationContract,
        tabulationABI,
        this.provider
      );
      this.contracts.audit = new ethers.Contract(addresses.auditContract, auditABI, this.provider);

      this.initialized = true;
      return true;
    } catch (error) {
      console.error('BlockchainAdapter init error:', error);
      this.initialized = false;
      throw error;
    }
  }

  loadABI(contractName) {
    try {
      const artifactsPath = path.join(
        __dirname,
        '..',
        '..',
        'artifacts',
        'contracts',
        `${contractName}.sol`,
        `${contractName === 'EVotingSystem' ? 'EVotingSystem' : contractName === 'VoterRegistration' ? 'VoterRegistrationContract' : contractName}.json`
      );
      const artifact = JSON.parse(fs.readFileSync(artifactsPath, 'utf8'));
      return artifact.abi;
    } catch (error) {
      console.error(`Error loading ABI for ${contractName}:`, error);
      return [];
    }
  }

  async registerVoter(electionId, voterAddress) {
    if (!this.initialized) {
      throw new Error('Adapter not initialized');
    }
    // Implementation would call Solidity contract
    return { success: true, address: voterAddress };
  }

  async castVote(voterAddress, electionId, encryptedVote, transactionHash, digitalSignature, ballotData, privateKey) {
    if (!this.initialized) {
      throw new Error('Adapter not initialized');
    }
    // Implementation would call Solidity contract
    return { success: true, transactionHash };
  }

  async tabulateVotes(electionId, votes) {
    if (!this.initialized) {
      throw new Error('Adapter not initialized');
    }
    // Implementation would call Solidity contract
    const voteCounts = {};
    votes.forEach((vote) => {
      voteCounts[vote.candidateName] = (voteCounts[vote.candidateName] || 0) + 1;
    });
    return {
      electionId,
      voteCounts,
      totalVotes: votes.length,
    };
  }

  async auditElection(electionId, votes) {
    if (!this.initialized) {
      throw new Error('Adapter not initialized');
    }
    // Implementation would call Solidity contract
    return {
      electionId,
      votesOnChain: 0,
      votesInDB: votes.length,
      isValid: true,
    };
  }

  async verifyVote(transactionHash) {
    if (!this.initialized) {
      throw new Error('Adapter not initialized');
    }
    // Implementation would call Solidity contract
    return { found: false, vote: null };
  }

  getStatus() {
    return {
      initialized: this.initialized,
      network: 'hardhat',
    };
  }
}

export default BlockchainAdapter;



