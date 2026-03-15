import express from 'express';
import { getBlockchain, getBlockchainAdapter } from '../utils/initBlockchain.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/blockchain
// @desc    Get blockchain
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const blockchain = getBlockchain();
    const adapter = getBlockchainAdapter();
    const chain = blockchain.getChain();
    res.json({
      chain,
      length: chain.length,
      isValid: blockchain.isChainValid(),
      adapter: adapter ? adapter.getStatus() : null,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/blockchain/mine
// @desc    Mine pending votes
// @access  Private
router.post('/mine', protect, async (req, res) => {
  try {
    const blockchain = getBlockchain();
    blockchain.minePendingVotes();
    res.json({
      message: 'Block mined successfully',
      chain: blockchain.getChain(),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/blockchain/verify
// @desc    Verify blockchain
// @access  Private
router.get('/verify', protect, async (req, res) => {
  try {
    const blockchain = getBlockchain();
    res.json({
      isValid: blockchain.isChainValid(),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/blockchain/votes
// @desc    Get all votes from blockchain
// @access  Private
router.get('/votes', protect, async (req, res) => {
  try {
    const blockchain = getBlockchain();
    const allVotes = blockchain.getAllVotes();
    
    // Also get pending votes
    const pendingVotes = blockchain.pendingVotes || [];
    
    res.json({
      votes: allVotes,
      pendingVotes: pendingVotes,
      totalVotes: allVotes.length,
      pendingCount: pendingVotes.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

