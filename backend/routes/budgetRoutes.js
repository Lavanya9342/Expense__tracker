const express = require('express');
const Budget = require('../models/Budget');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// Get budgets for a specific month
router.get('/', protect, async (req, res) => {
  try {
    const { month } = req.query; // Expecting ?month=YYYY-MM
    const query = { userId: req.user._id };
    if (month) query.month = month;
    
    const budgets = await Budget.find(query);
    res.json(budgets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create or Update a budget
router.post('/', protect, async (req, res) => {
  const { category, amount, month } = req.body;
  try {
    // Check if budget already exists for this category and month
    let budget = await Budget.findOne({ userId: req.user._id, category, month });
    
    if (budget) {
      budget.amount = amount;
      await budget.save();
    } else {
      budget = await Budget.create({ userId: req.user._id, category, amount, month });
    }
    res.status(201).json(budget);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a budget
router.delete('/:id', protect, async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);
    if (!budget || budget.userId.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: 'Budget not found' });
    }
    await budget.deleteOne();
    res.json({ message: 'Budget removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;