const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const auth = require('../middleware/auth');

// POST /api/expenses (Protected)
router.post('/', auth, async (req, res) => {
  try {
    const { title, amount, category, date } = req.body;

    const newExpense = new Expense({
      userId: req.user.id,
      title,
      amount,
      category,
      date: date ? new Date(date) : Date.now()
    });

    const expense = await newExpense.save();
    res.status(201).json(expense);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// GET /api/expenses (Protected)
router.get('/', auth, async (req, res) => {
  try {
    // Optionally filter by category if provided in query ?category=Food
    const query = { userId: req.user.id };
    if (req.query.category && req.query.category !== 'All') {
      query.category = req.query.category;
    }

    const expenses = await Expense.find(query).sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
