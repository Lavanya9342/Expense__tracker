const express = require('express');
const router = express.Router();
const Goal = require('../models/Goal');
const { protect } = require('../middleware/authMiddleware'); // Corrected Import!

// @route   GET /api/goals
// @desc    Get all goals for the logged-in user
router.get('/', protect, async (req, res) => {
  try {
    const goals = await Goal.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(goals);
  } catch (error) {
    res.status(500).json({ message: 'Server Error in fetching goals' });
  }
});

// @route   POST /api/goals
// @desc    Create a new saving goal
router.post('/', protect, async (req, res) => {
  try {
    const { title, targetAmount } = req.body;
    
    const newGoal = new Goal({
      user: req.user._id, // Corrected User ID format
      title,
      targetAmount
    });

    const savedGoal = await newGoal.save();
    res.status(201).json(savedGoal);
  } catch (error) {
    res.status(500).json({ message: 'Server Error in creating goal' });
  }
});

// @route   PUT /api/goals/:id/add-funds
// @desc    Add money to a specific goal
router.put('/:id/add-funds', protect, async (req, res) => {
  try {
    const { amount } = req.body;
    const goal = await Goal.findById(req.params.id);

    if (!goal) return res.status(404).json({ message: 'Goal not found' });
    
    // Ensure the user owns this goal
    if (goal.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    goal.currentAmount += Number(amount);
    const updatedGoal = await goal.save();
    
    res.json(updatedGoal);
  } catch (error) {
    res.status(500).json({ message: 'Server Error in adding funds' });
  }
});

// @route   DELETE /api/goals/:id
// @desc    Delete a goal
router.delete('/:id', protect, async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);
    
    if (!goal) return res.status(404).json({ message: 'Goal not found' });
    
    // Ensure the user owns this goal
    if (goal.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await goal.deleteOne();
    res.json({ message: 'Goal removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error in deleting goal' });
  }
});

module.exports = router;