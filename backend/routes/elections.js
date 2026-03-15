import express from 'express';
import Election from '../models/Election.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/elections
// @desc    Get all elections
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const elections = await Election.find().sort({ createdAt: -1 });
    res.json(elections);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/elections/:id
// @desc    Get single election
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const election = await Election.findById(req.params.id);
    if (!election) {
      return res.status(404).json({ message: 'Election not found' });
    }
    res.json(election);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/elections
// @desc    Create election
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
  try {
    const { title, description, candidates, startDate, endDate } = req.body;

    const election = await Election.create({
      title,
      description,
      candidates,
      startDate,
      endDate,
      status: new Date() >= new Date(startDate) && new Date() <= new Date(endDate) ? 'active' : 'upcoming',
    });

    res.status(201).json(election);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/elections/:id
// @desc    Update election
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const election = await Election.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!election) {
      return res.status(404).json({ message: 'Election not found' });
    }
    res.json(election);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/elections/:id
// @desc    Delete election
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const election = await Election.findByIdAndDelete(req.params.id);
    if (!election) {
      return res.status(404).json({ message: 'Election not found' });
    }
    res.json({ message: 'Election deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;



