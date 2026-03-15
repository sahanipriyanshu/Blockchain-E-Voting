import express from 'express';
import Vote from '../models/Vote.js';
import { protect, admin } from '../middleware/auth.js';
import { getBlockchainAdapter, getSmartContracts } from '../utils/initBlockchain.js';
import { generateAnonymousAddress } from '../utils/encryption.js';

const router = express.Router();

// @route   POST /api/smart-contracts/register-voter
// @desc    Register voter for election
// @access  Private
router.post('/register-voter', protect, async (req, res) => {
  try {
    const { electionId } = req.body;
    const userId = req.user._id.toString();

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

    const adapter = getBlockchainAdapter();
    let result;
    if (adapter) {
      result = await adapter.registerVoter(electionId, anonymousAddress);
    } else {
      const smartContracts = getSmartContracts();
      result = smartContracts.voterRegistration.registerVoter(electionId, anonymousAddress);
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/smart-contracts/tabulate
// @desc    Tabulate votes for election
// @access  Private/Admin
router.post('/tabulate', protect, admin, async (req, res) => {
  try {
    const { electionId } = req.body;
    const votes = await Vote.find({ electionId });

    const adapter = getBlockchainAdapter();
    let result;
    if (adapter) {
      result = await adapter.tabulateVotes(electionId, votes);
    } else {
      const smartContracts = getSmartContracts();
      result = smartContracts.tabulation.tabulateVotes(electionId, votes);
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/smart-contracts/audit
// @desc    Audit election
// @access  Private/Admin
router.post('/audit', protect, admin, async (req, res) => {
  try {
    const { electionId } = req.body;
    const votes = await Vote.find({ electionId });

    const adapter = getBlockchainAdapter();
    let result;
    if (adapter) {
      result = await adapter.auditElection(electionId, votes);
    } else {
      const smartContracts = getSmartContracts();
      result = smartContracts.audit.auditElection(electionId, votes);
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/smart-contracts/verify-vote/:transactionHash
// @desc    Verify vote on blockchain
// @access  Private
router.get('/verify-vote/:transactionHash', protect, async (req, res) => {
  try {
    const { transactionHash } = req.params;

    const adapter = getBlockchainAdapter();
    let result;
    if (adapter) {
      result = await adapter.verifyVote(transactionHash);
    } else {
      const vote = await Vote.findOne({ transactionHash });
      result = {
        found: !!vote,
        vote: vote ? {
          electionId: vote.electionId,
          candidateName: vote.candidateName,
          timestamp: vote.createdAt,
        } : null,
      };
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;



