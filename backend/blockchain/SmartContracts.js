import crypto from 'crypto';

class VoterRegistrationContract {
  constructor() {
    this.registeredVoters = new Map(); // electionId -> Set of addresses
  }

  registerVoter(electionId, voterAddress) {
    if (!this.registeredVoters.has(electionId)) {
      this.registeredVoters.set(electionId, new Set());
    }
    this.registeredVoters.get(electionId).add(voterAddress);
    return { success: true, address: voterAddress };
  }

  isRegistered(electionId, voterAddress) {
    return this.registeredVoters.has(electionId) &&
           this.registeredVoters.get(electionId).has(voterAddress);
  }
}

class BallotContract {
  constructor(blockchain) {
    this.blockchain = blockchain;
    this.votes = new Map(); // electionId -> Map of anonymousAddress -> vote
    this.hasVoted = new Map(); // electionId -> Set of anonymousAddresses
  }

  castVote(voterAddress, electionId, encryptedVote, transactionHash, digitalSignature, ballotData, privateKey) {
    // Check if already voted
    if (this.hasVoted.has(electionId) && this.hasVoted.get(electionId).has(voterAddress)) {
      return {
        success: false,
        error: 'Double voting detected',
      };
    }

    // Verify signature
    if (!this.verifySignature(ballotData, digitalSignature, privateKey)) {
      return {
        success: false,
        error: 'Invalid digital signature',
      };
    }

    // Store vote
    if (!this.votes.has(electionId)) {
      this.votes.set(electionId, new Map());
      this.hasVoted.set(electionId, new Set());
    }

    this.votes.get(electionId).set(voterAddress, {
      encryptedVote,
      transactionHash,
      digitalSignature,
      timestamp: Date.now(),
    });
    this.hasVoted.get(electionId).add(voterAddress);

    // Add to blockchain
    this.blockchain.addVote({
      electionId,
      anonymousAddress: voterAddress,
      encryptedVote,
      transactionHash,
      digitalSignature,
    });

    return {
      success: true,
      transactionHash,
    };
  }

  verifySignature(ballotData, signature, privateKey) {
    const voteString = JSON.stringify(ballotData);
    const expectedSignature = crypto
      .createHmac('sha256', privateKey)
      .update(voteString)
      .digest('hex');
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  }

  hasVotedInElection(electionId, voterAddress) {
    return this.hasVoted.has(electionId) &&
           this.hasVoted.get(electionId).has(voterAddress);
  }
}

class TabulationContract {
  constructor() {
    this.results = new Map(); // electionId -> results
  }

  tabulateVotes(electionId, votes) {
    const voteCounts = {};
    votes.forEach((vote) => {
      voteCounts[vote.candidateName] = (voteCounts[vote.candidateName] || 0) + 1;
    });

    const results = {
      electionId,
      voteCounts,
      totalVotes: votes.length,
      timestamp: Date.now(),
    };

    this.results.set(electionId, results);
    return results;
  }

  getResults(electionId) {
    return this.results.get(electionId) || null;
  }
}

class AuditContract {
  constructor(blockchain) {
    this.blockchain = blockchain;
  }

  auditElection(electionId, votes) {
    const chain = this.blockchain.getChain();
    const chainVotes = this.blockchain.getAllVotes().filter(
      (v) => v.electionId === electionId
    );

    const audit = {
      electionId,
      chainLength: chain.length,
      chainValid: this.blockchain.isChainValid(),
      votesOnChain: chainVotes.length,
      votesInDB: votes.length,
      discrepancies: [],
    };

    // Check for discrepancies
    if (chainVotes.length !== votes.length) {
      audit.discrepancies.push({
        type: 'vote_count_mismatch',
        chain: chainVotes.length,
        database: votes.length,
      });
    }

    return audit;
  }
}

class SmartContractManager {
  constructor(blockchain) {
    this.blockchain = blockchain;
    this.voterRegistration = new VoterRegistrationContract();
    this.ballot = new BallotContract(blockchain);
    this.tabulation = new TabulationContract();
    this.audit = new AuditContract(blockchain);
  }
}

export default SmartContractManager;



