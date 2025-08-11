import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowCircleLeft,
  FaBackward,
  FaCalendar,
  FaChevronDown,
  FaDownload,
  FaFilter,
} from "react-icons/fa";
import { ExpenseList } from "../../components/dashboard-components";
import ExpenseCard from "../../components/expenses-components/ExpenseCards";
import FilterModal from "../../components/expenses-components/FilterModal";
import { expenseService } from "../../services/expenseService";
import "./expenses.css";

export default function Expenses() {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showEditExpense, setShowEditExpense] = useState(false);
  const [currentFilter, setCurrentFilter] = useState({
    type: "all",
    month: "",
    startDate: "",
    endDate: "",
  });
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    fetchExpenses();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [expenses, currentFilter]);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const res = await expenseService.getAllExpenses();
      setTimeout(() => {
        setExpenses(res.expenseData);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error fetching expenses:", error);
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...expenses];

    if (currentFilter.type === "month" && currentFilter.month) {
      const [year, month] = currentFilter.month.split("-");
      filtered = filtered.filter((expense) => {
        const expenseDate = new Date(expense.date);
        return (
          expenseDate.getFullYear() === Number.parseInt(year) &&
          expenseDate.getMonth() === Number.parseInt(month) - 1
        );
      });
    } else if (
      currentFilter.type === "range" &&
      currentFilter.startDate &&
      currentFilter.endDate
    ) {
      const startDate = new Date(currentFilter.startDate);
      const endDate = new Date(currentFilter.endDate);
      filtered = filtered.filter((expense) => {
        const expenseDate = new Date(expense.date);
        return expenseDate >= startDate && expenseDate <= endDate;
      });
    }

    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    setFilteredExpenses(filtered);
  };

  const handleFilterApply = (filterData) => {
    setCurrentFilter(filterData);
    setShowFilterModal(false);
  };

  const handleExportData = async () => {
    try {
      setExporting(true);

      const filterParams = {
        type: currentFilter.type,
        ...(currentFilter.type === "month" && { month: currentFilter.month }),
        ...(currentFilter.type === "range" && {
          startDate: currentFilter.startDate,
          endDate: currentFilter.endDate,
        }),
      };
      setTimeout(() => {
        const csvContent = generateCSV(filteredExpenses);
        downloadCSV(csvContent, `expenses_${Date.now()}.csv`);
        setExporting(false);
      }, 1000);
      // console.log("Exporting with filters:", filterParams);
    } catch (error) {
      console.error("Error exporting data:", error);
      setExporting(false);
    }
  };

  const generateCSV = (data) => {
    const headers = ["Title", "Amount", "Category", "Date", "Note"];
    const csvRows = [headers.join(",")];

    data.forEach((expense) => {
      const row = [
        `"${expense.title}"`,
        expense.amount,
        `"${expense.category}"`,
        new Date(expense.date).toLocaleDateString(),
        `"${expense.note || ""}"`,
      ];
      csvRows.push(row.join(","));
    });

    const totalAmount = data.reduce((sum, expense) => sum + expense.amount, 0);

    csvRows.push(`"Total Spent",${totalAmount},,,`);

    return csvRows.join("\n");
  };

  const downloadCSV = (content, filename) => {
    const blob = new Blob([content], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const getFilterDisplayText = () => {
    if (currentFilter.type === "month" && currentFilter.month) {
      const date = new Date(currentFilter.month + "-01");
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      });
    } else if (
      currentFilter.type === "range" &&
      currentFilter.startDate &&
      currentFilter.endDate
    ) {
      const start = new Date(currentFilter.startDate).toLocaleDateString();
      const end = new Date(currentFilter.endDate).toLocaleDateString();
      return `${start} - ${end}`;
    }
    return "All Expenses";
  };

  const getTotalAmount = () => {
    return filteredExpenses.reduce(
      (total, expense) => total + expense.amount,
      0
    );
  };

  if (loading) {
    return (
      <div className="dashboard_loader_container">
        <div className="dashboard_loader_spinner">
          <div className="dashboard_loader_dot"></div>
          <div className="dashboard_loader_dot"></div>
          <div className="dashboard_loader_dot"></div>
        </div>
        <h2 className="dashboard_loader_text">Loading All Expenses...</h2>
      </div>
    );
  }

  return (
    <div className="all_expenses_page">
      <div className="expenses_header">
        <div className="header_left">
          <div className="back-button">
            <FaArrowCircleLeft
              size={24}
              color="#333"
              onClick={() => navigate("/dashboard")}
            />

            <h1>All Expenses</h1>
          </div>

          <div className="expenses_summary">
            <span className="total_count">
              {filteredExpenses.length} expenses
            </span>
            <span className="total_amount">
              Total: ₹{getTotalAmount().toLocaleString()}
            </span>
          </div>
        </div>

        <div className="header_actions">
          <button
            className="filter_btn"
            onClick={() => setShowFilterModal(true)}
          >
            <FaFilter />
            <span>{getFilterDisplayText()}</span>
            <FaChevronDown />
          </button>

          <button
            className="export_btn"
            onClick={handleExportData}
            disabled={exporting}
          >
            <FaDownload />
            <span>{exporting ? "Exporting..." : "Export Data"}</span>
          </button>
        </div>
      </div>

      <div className="expenses_content">
        {filteredExpenses.length === 0 ? (
          <div className="no_expenses">
            <FaCalendar className="no_expenses_icon" />
            <h3>No expenses found</h3>
            <p>
              Try adjusting your filters or add some expenses to get started.
            </p>
          </div>
        ) : (
          <div className="expenses_grid">
            {filteredExpenses.map((expense) => (
              <ExpenseCard key={expense._id} expense={expense} />
            ))}
          </div>
        )}
      </div>

      {showFilterModal && (
        <FilterModal
          currentFilter={currentFilter}
          onApply={handleFilterApply}
          onClose={() => setShowFilterModal(false)}
        />
      )}

      {showEditExpense && (
        <ExpenseList
          expenses={expenses}
          onEdit={handleEditExpense}
          onDelete={handleDeleteExpense}
        />
      )}
    </div>
  );
}
