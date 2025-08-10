const express = require('express');
const router = express.Router();
const { addExpense, updateExpense, deleteExpense, getAllExpenses, setOrUpdateBudget, getMonthlySummary, exportExpensesToCSV, getDashboardSummary } = require('../controllers/expenseController');
const authMiddleware = require('../middlewares/authMiddleware');


router.post('/add', authMiddleware, addExpense);

router.patch('/update/:id', authMiddleware, updateExpense);

router.delete('/delete/:id', authMiddleware, deleteExpense);

router.get('/list', authMiddleware, getAllExpenses);

router.post('/budget', authMiddleware, setOrUpdateBudget);

router.get('/get-monthly-summary', authMiddleware, getMonthlySummary);

router.get('/export-monthly-data', authMiddleware, exportExpensesToCSV);

router.get('/get-dashboard-summary', authMiddleware, getDashboardSummary);



module.exports = router;
