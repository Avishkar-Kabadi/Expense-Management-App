import { useState } from "react";
import { FaChevronDown, FaUser } from "react-icons/fa";
import { useAuth } from "../AuthContext";
import Swal from "sweetalert2";
import logo from "../assets/logo.png";
import { authService } from "../services/authService";
import { useEffect } from "react";

export default function Navbar({
  monthlyBudget,
  totalExpenses,
  onShowProfile,
  onShowBudget,
  onLogout,
}) {
  const { logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  const Logout = () => {
    Swal.fire({
      title: "Are you sure you want to logout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Logout!",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
      }
    });
  };

  return (
    <nav className="navbar">
      <div className="navbar_brand">
        <img src={logo} alt="Logo" />
        <h2>ExpenseTracker</h2>
      </div>

      <div className="navbar_info">
        <div className="budget_info">
          <div className="budget_item">
            <span className="budget_label">Monthly Budget</span>
            <span className="budget_amount budget_total">
              ₹{monthlyBudget?.toLocaleString() ?? "  0.00"}
            </span>
          </div>
          <div className="budget_item">
            <span className="budget_label">Total Monthly Expenses</span>
            <span className="budget_amount budget_spent">
              ₹{totalExpenses?.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="profile_section">
          <button
            className="profile_btn"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <FaUser />
            <FaChevronDown
              className={`dropdown_icon ${showDropdown ? "rotated" : ""}`}
            />
          </button>

          {showDropdown && (
            <div className="profile_dropdown">
              <button
                onClick={() => {
                  onShowProfile();
                  setShowDropdown(false);
                }}
              >
                Profile
              </button>
              <button
                onClick={() => {
                  onShowBudget();
                  setShowDropdown(false);
                }}
              >
                Set Monthly Budget
              </button>
              <button onClick={Logout} className="logout_btn">
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
