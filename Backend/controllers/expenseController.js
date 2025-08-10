const expenseModel = require('../models/expense');
const budgetModel = require('../models/budget');
const { Parser } = require('json2csv');




exports.addExpense = async (req, res) => {
    const { title, amount, category, date, note } = req.body;

    const { userid } = req.user;

    const missingFields = [];
    if (!title) missingFields.push('title');
    if (!amount) missingFields.push('amount');
    if (!date) missingFields.push('date');

    if (missingFields.length > 0) {
        return res.status(400).json({
            message: `Missing required field${missingFields.length > 1 ? 's' : ''}: ${missingFields.join(', ')}`
        });
    }

    try {
        const newExpense = await expenseModel.create({
            user: userid,
            title,
            amount,
            category,
            date,
            note
        });

        return res.status(201).json({
            message: "Expense added successfully",
            expense: newExpense
        });

    } catch (error) {
        console.error("Error while adding expense:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};



exports.updateExpense = async (req, res) => {
    const { id } = req.params;
    const { title, amount, category, date, note } = req.body;

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (amount !== undefined) updateData.amount = amount;
    if (date !== undefined) updateData.date = date;
    if (note !== undefined) updateData.note = note;
    if (category !== undefined) updateData.category = category;

    if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ message: "No fields provided to update" });
    }

    try {
        const updatedExpense = await expenseModel.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedExpense) {
            return res.status(404).json({ message: "Expense not found" });
        }

        return res.status(200).json({ message: "Expense updated successfully", expense: updatedExpense });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server error", error: error.message });
    }
};



exports.deleteExpense = async (req, res) => {
    const { id } = req.params;
    const { userid } = req.user;

    try {
        const expense = await expenseModel.findOne({ _id: id, user: userid });
        if (!expense) {
            return res.status(401).json({ message: "Unauthorized user or Expense not found" });
        }

        const result = await expenseModel.findByIdAndDelete(id);
        if (!result) {
            return res.status(400).json({ message: "Failed to delete expense" });
        }

        return res.status(200).json({ message: "Expense deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}



exports.getAllExpenses = async (req, res) => {
    let { userid } = req.user;

    try {
        const userExpenses = await expenseModel.find({ user: userid });
        if (!userExpenses) return res.status(400).json({ message: "Failed to fetch expenses" });
        return res.status(200).json({
            message: "User expenses fetched successfully",
            expenseData: userExpenses
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}



exports.setOrUpdateBudget = async (req, res) => {
    const { userid } = req.user;
    const { amount } = req.body;
    try {
        const updatedBudget = await budgetModel.findOneAndUpdate(
            { user: userid },
            { amount },
            { upsert: true, new: true }
        );

        return res.status(200).json({
            message: "Budget set/updated successfully",
            budget: updatedBudget
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};



exports.getMonthlySummary = async (req, res) => {
    const { userid } = req.user;

    let yearMonth = new Date().toISOString().slice(0, 7);
    try {

        const [year, mon] = yearMonth.split('-');
        rangeStart = new Date(year, mon - 1, 1);
        rangeEnd = new Date(year, mon, 1);


        const expenses = await expenseModel.find({
            user: userid,
            date: { $gte: rangeStart, $lt: rangeEnd }
        });

        const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
        const userBudget = await budgetModel.findOne({ user: userid });

        return res.status(200).json({
            totalSpent,
            expenses: expenses.map(e => ({
                title: e.title,
                category: e.category,
                amount: e.amount
            })),
            monthlyBudget: userBudget?.amount || 0,
            status: userBudget && totalSpent > userBudget.amount ? "Over budget" : "Within budget"
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};



exports.exportExpensesToCSV = async (req, res) => {
    const { userid } = req.user;
    const { month, start, end } = req.body;

    let rangeStart, rangeEnd;

    try {
        if (month) {
            const [year, mon] = month.split('-');
            rangeStart = new Date(year, mon - 1, 1);
            rangeEnd = new Date(year, mon, 1);
        } else if (start && end) {
            rangeStart = new Date(start);
            rangeEnd = new Date(end);
        } else {
            return res.status(400).json({ message: "Provide either 'month' or both 'start' and 'end'" });
        }

        const expenses = await expenseModel.find({
            user: userid,
            date: { $gte: rangeStart, $lt: rangeEnd }
        });

        if (expenses.length === 0) {
            return res.status(404).json({ message: "No expenses found for the selected period." });
        }

        const totalSpent = expenses.reduce((acc, exp) => acc + exp.amount, 0);

        const fields = ['title', 'category', 'amount', 'date'];
        const parser = new Parser({ fields });

        const expenseData = expenses.map(exp => ({
            title: exp.title,
            category: exp.category,
            amount: exp.amount,
            date: exp.date.toISOString().split('T')[0]
        }));

        const csvBody = parser.parse(expenseData);
        const totalLine = `Total Spent:,${totalSpent}\n`; // prepend line

        const csvWithTotal = totalLine + csvBody;

        res.header('Content-Type', 'text/csv');
        res.attachment(`expenses_${userid}_${Date.now()}.csv`);
        return res.send(csvWithTotal);

    } catch (error) {
        console.error("CSV export error:", error);
        return res.status(500).json({ message: "Internal server error while exporting CSV" });
    }
};



exports.getDashboardSummary = async (req, res) => {
    try {
        const { year } = req.body;
        const startDate = new Date(`${year}-01-01T00:00:00.000Z`);
        const endDate = new Date(`${parseInt(year) + 1}-01-01T00:00:00.000Z`);

        const expenses = await expenseModel.find({
            user: req.user.userid,
            date: { $gte: startDate, $lt: endDate }
        });

        let total = 0;
        let monthlyRaw = {};

        for (let i = 1; i <= 12; i++) {
            const monthKey = i.toString().padStart(2, '0');
            monthlyRaw[monthKey] = {
                total: 0,
                categories: {}
            };
        }

        expenses.forEach((expense) => {
            const month = (expense.date.getMonth() + 1).toString().padStart(2, '0');
            const category = expense.category;
            const amount = expense.amount;

            total += amount;
            monthlyRaw[month].total += amount;
            if (!monthlyRaw[month].categories[category]) {
                monthlyRaw[month].categories[category] = 0;
            }
            monthlyRaw[month].categories[category] += amount;
        });

        const monthlyArray = Object.keys(monthlyRaw)
            .sort((a, b) => parseInt(a) - parseInt(b))
            .map((key) => ({
                month: key,
                ...monthlyRaw[key]
            }));

        res.json({
            year,
            total,
            monthly: monthlyArray
        });
    } catch (error) {
        console.error('Dashboard error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
