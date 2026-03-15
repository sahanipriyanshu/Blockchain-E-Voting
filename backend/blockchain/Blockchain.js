import crypto from 'crypto';

class Block {
  constructor(timestamp, data, previousHash = '') {
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
    this.nonce = 0;
  }

  calculateHash() {
    return crypto
      .createHash('sha256')
      .update(
        this.previousHash +
        this.timestamp +
        JSON.stringify(this.data) +
        this.nonce
      )
      .digest('hex');
  }

  mineBlock(difficulty) {
    const target = Array(difficulty + 1).join('0');
    while (this.hash.substring(0, difficulty) !== target) {
      this.nonce++;
      this.hash = this.calculateHash();
    }
    console.log(`Block mined: ${this.hash}`);
  }
}

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 2;
    this.pendingVotes = [];
    this.miningReward = 0;
  }

  createGenesisBlock() {
    return new Block(Date.now(), { votes: [] }, '0');
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addVote(vote) {
    this.pendingVotes.push(vote);
  }

  minePendingVotes() {
    const block = new Block(
      Date.now(),
      { votes: this.pendingVotes },
      this.getLatestBlock().hash
    );
    block.mineBlock(this.difficulty);
    this.chain.push(block);
    this.pendingVotes = [];
  }

  getBalance(address) {
    let balance = 0;
    for (const block of this.chain) {
      if (block.data && block.data.votes) {
        for (const vote of block.data.votes) {
          if (vote.voterId === address) {
            balance++;
          }
        }
      }
    }
    return balance;
  }

  getAllVotes() {
    const votes = [];
    for (const block of this.chain) {
      if (block.data && block.data.votes) {
        votes.push(...block.data.votes);
      }
    }
    return votes;
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }

      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }
    return true;
  }

  getChain() {
    return this.chain;
  }
}

export default Blockchain;

