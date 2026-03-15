import express from 'express';
import crypto from 'crypto';
import Vote from '../models/Vote.js';
import { protect } from '../middleware/auth.js';
import {
  encryptBallot,
  signVote,
  generateAnonymousAddress,
  createVoteHash,
} from '../utils/encryption.js';
import { getBlockchainAdapter, getSmartContracts } from '../utils/initBlockchain.js';

const router = express.Router();

// @route   POST /api/votes
// @desc    Cast a vote
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { electionId, candidateId, candidateName } = req.body;
    
    // Ensure user is authenticated and has an ID
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    
    const userId = req.user._id.toString();
    
    // Validate required fields
    if (!electionId || !candidateId || !candidateName) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if user already voted
    const existingVote = await Vote.findOne({ electionId, userId });
    if (existingVote) {
      return res.status(400).json({ message: 'You have already voted in this election' });
    }

    // Get or generate anonymous address
    let anonymousAddress = req.user.anonymousAddresses?.get(electionId);
    if (!anonymousAddress) {
      anonymousAddress = generateAnonymousAddress();
      if (!req.user.anonymousAddresses) {
        req.user.anonymousAddresses = new Map();
      }
      req.user.anonymousAddresses.set(electionId, anonymousAddress);
      await req.user.save();
    }

    // Create ballot data
    const ballotData = {
      electionId,
      candidateId,
      candidateName,
      timestamp: Date.now(),
    };

    // Encrypt ballot
    const password = process.env.ENCRYPTION_KEY || 'default-encryption-key';
    const encryptedVote = encryptBallot(ballotData, password);

    // Sign vote
    const privateKey = process.env.SIGNATURE_KEY || 'default-signature-key';
    const digitalSignature = signVote(ballotData, privateKey);

    // Create vote hash
    const voteHash = createVoteHash(ballotData);

    // Generate transaction hash
    const transactionHash = crypto
      .createHash('sha256')
      .update(JSON.stringify({ ...ballotData, anonymousAddress, timestamp: Date.now() }))
      .digest('hex');

    // Cast vote on blockchain
    const adapter = getBlockchainAdapter();
    let ballotResult;
    if (adapter) {
      ballotResult = await adapter.castVote(
        anonymousAddress,
        electionId,
        encryptedVote,
        transactionHash,
        digitalSignature,
        ballotData,
        privateKey
      );
    } else {
      const smartContracts = getSmartContracts();
      ballotResult = smartContracts.ballot.castVote(
        anonymousAddress,
        electionId,
        encryptedVote,
        transactionHash,
        digitalSignature,
        ballotData,
        privateKey
      );
    }

    if (!ballotResult.success) {
      return res.status(400).json({ message: ballotResult.error });
    }

    // Save vote to database
    const vote = await Vote.create({
      electionId,
      userId,
      anonymousAddress,
      candidateId,
      candidateName,
      encryptedVote,
      digitalSignature,
      voteHash,
      transactionHash: ballotResult.transactionHash || transactionHash,
    });

    res.status(201).json({
      message: 'Vote cast successfully',
      vote: {
        id: vote._id,
        transactionHash: vote.transactionHash,
      },
    });
  } catch (error) {
    console.error('Vote error:', error);
    res.status(500).json({ message: error.message || 'Failed to cast vote' });
  }
});

// @route   GET /api/votes
// @desc    Get votes
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const query = {};
    if (req.query.election) {
      query.electionId = req.query.election;
    }
    if (req.user.role !== 'admin') {
      query.userId = req.user._id;
    }

    const votes = await Vote.find(query)
      .populate('electionId', 'title')
      .populate('userId', 'name email') // Populate user info for admins
      .select('-encryptedVote -digitalSignature -decryptedData')
      .sort({ createdAt: -1 });

    res.json(votes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/votes/:id
// @desc    Get single vote
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const vote = await Vote.findById(req.params.id)
      .populate('electionId', 'title')
      .select('-encryptedVote -digitalSignature -decryptedData');

    if (!vote) {
      return res.status(404).json({ message: 'Vote not found' });
    }

    if (req.user.role !== 'admin' && vote.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(vote);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

