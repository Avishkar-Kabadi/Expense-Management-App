export default function DashboardCharts({
  monthlyBudget,
  totalExpenses,
  expenses,
}) {
  const remainingBudget = monthlyBudget - totalExpenses;
  const budgetPercentage = (totalExpenses / monthlyBudget) * 100;

  const categoryData = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {});

  const categories = Object.entries(categoryData).map(([name, amount]) => ({
    name,
    amount,
    percentage: (amount / totalExpenses) * 100,
  }));

  return (
    <div className="charts_container">
      <div className="chart_card">
        <h3>Budget Overview</h3>
        <div className="budget_chart">
          <div className="budget_circle">
            <div
              className="budget_progress"
              style={{ "--progress": `${budgetPercentage}%` }}
            >
              <div className="budget_center">
                <span className="budget_percentage">
                  {budgetPercentage?.toFixed(1)}%
                </span>
                <span className="budget_text">Used</span>
              </div>
            </div>
          </div>
          <div className="budget_details">
            <div className="budget_detail">
              <span className="detail_label">Remaining</span>
              <span className="detail_amount remaining">
                ₹{remainingBudget?.toLocaleString()}
              </span>
            </div>
            <div className="budget_detail">
              <span className="detail_label">Spent</span>
              <span className="detail_amount spent">
                ₹{totalExpenses?.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="chart_card">
        <h3>Expenses by Category</h3>
        <div className="category_chart">
          {categories.map((category, index) => (
            <div key={category.name} className="category_item">
              <div className="category_info">
                <span className="category_name">{category.name}</span>
                <span className="category_amount">
                  ₹{category.amount.toLocaleString()}
                </span>
              </div>
              <div className="category_bar">
                <div
                  className="category_progress"
                  style={{
                    width: `${category.percentage}%`,
                    backgroundColor: `hsl(${index * 60}, 70%, 60%)`,
                  }}
                ></div>
              </div>
              <span className="category_percentage">
                ₹{category.percentage.toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
