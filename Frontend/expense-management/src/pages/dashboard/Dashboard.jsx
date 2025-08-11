"use client";

import { useState } from "react";
import Swal from "sweetalert2";
import {
  BudgetModal,
  DashboardCharts,
  ExpenseList,
  ExpenseModal,
  Navbar,
  ProfileModal,
} from "../../components/dashboard-components";
import { authService } from "../../services/authService";
import "./dashboard.css";

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { expenseService } from "../../services/expenseService";

export default function Dashboard() {
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [expenseModalMode, setExpenseModalMode] = useState("add");
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [monthlyBudget, setMonthlyBudget] = useState();
  const [totalExpenses, setTotalExpenses] = useState();
  const [user, setUser] = useState([]);

  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      setMonthlyBudget(localStorage.getItem("budget"));
      getRecentExpense();
      getMonthlyBudgetAndExpense();
      getUserDetails();
    }, 1200);

    return () => clearTimeout(timer);
  }, [setExpenses, setMonthlyBudget, setTotalExpenses]);

  const getUserDetails = async () => {
    try {
      const res = await authService.getUser();
      // console.log(res.userData);
      setUser(res.userData);
      if (res) {
      }
    } catch (error) {
      // console.log(error);
    }
  };

  const getRecentExpense = async () => {
    try {
      const res = await expenseService.getAllExpenses();
      setExpenses(res.expenseData);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed to fetch expenses",
        text: error.message || "Something went wrong",
      });
    }
  };

  const getMonthlyBudgetAndExpense = async () => {
    try {
      const res = await expenseService.getMonthlySummary();

      if (res) {
        setMonthlyBudget(res.monthlyBudget);
        setTotalExpenses(res.totalSpent);
      }
    } catch (error) {}
  };

  const handleAddExpense = () => {
    setExpenseModalMode("add");
    setSelectedExpense(null);
    setShowExpenseModal(true);
  };

  const handleEditExpense = (expense) => {
    setExpenseModalMode("edit");
    setSelectedExpense(expense);
    setShowExpenseModal(true);
  };

  const handleDeleteExpense = async (expenseId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this expense?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await expenseService.deleteExpense(expenseId);

          if (res) {
            Swal.fire({
              icon: "success",
              title: "Deleted!",
              text: "Expense has been deleted successfully.",
              timer: 2000,
              showConfirmButton: false,
            });
            getMonthlyBudgetAndExpense();
            getRecentExpense();
          } else {
            Swal.fire({
              icon: "error",
              title: "Failed to delete",
              text: res.message || "Something went wrong.",
            });
          }
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: error.message || "Something went wrong.",
          });
        }
      }
    });
  };

  const handleSaveExpense = () => {
    getRecentExpense();
    getMonthlyBudgetAndExpense();
  };

  const handleUpdateUser = () => {
    getUserDetails();
  };

  const handleSetBudget = (newBudget) => {
    setMonthlyBudget(newBudget);
    setShowBudgetModal(false);
  };
  if (isLoading) {
    return (
      <div className="dashboard_loader_container">
        <div className="dashboard_loader_spinner">
          <div className="dashboard_loader_dot"></div>
          <div className="dashboard_loader_dot"></div>
          <div className="dashboard_loader_dot"></div>
        </div>
        <h2 className="dashboard_loader_text">Loading Dashboard...</h2>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <Navbar
        monthlyBudget={monthlyBudget}
        totalExpenses={totalExpenses}
        onShowProfile={() => setShowProfileModal(true)}
        onShowBudget={() => setShowBudgetModal(true)}
      />

      <main className="dashboard_main">
        <div className="dashboard_header">
          <h1>Dashboard</h1>
          <div className="dashboard_actions">
            <button className="btn btn_primary" onClick={handleAddExpense}>
              Add Expense
            </button>
            <button
              className="btn btn_secondary"
              onClick={() =>
                navigate("/expenses", {
                  state: { monthlyBudget, totalExpenses },
                })
              }
            >
              View All Expenses
            </button>
          </div>
        </div>

        <DashboardCharts
          monthlyBudget={monthlyBudget}
          totalExpenses={totalExpenses}
          expenses={expenses}
        />

        <ExpenseList
          expenses={expenses}
          onEdit={handleEditExpense}
          onDelete={handleDeleteExpense}
        />
      </main>

      {showProfileModal && (
        <ProfileModal
          onClose={() => setShowProfileModal(false)}
          userData={user}
          onSave={() => handleUpdateUser()}
        />
      )}

      {showBudgetModal && (
        <BudgetModal
          currentBudget={monthlyBudget}
          onSave={handleSetBudget}
          onClose={() => setShowBudgetModal(false)}
        />
      )}

      {showExpenseModal && (
        <ExpenseModal
          mode={expenseModalMode}
          expense={selectedExpense}
          onSave={handleSaveExpense}
          onClose={() => setShowExpenseModal(false)}
        />
      )}
    </div>
  );
}
