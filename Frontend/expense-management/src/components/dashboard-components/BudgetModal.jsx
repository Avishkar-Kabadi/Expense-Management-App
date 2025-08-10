"use client";

import { useState } from "react";
import { FaRupeeSign, FaTimes } from "react-icons/fa";
import Swal from "sweetalert2";
import { expenseService } from "../../services/expenseService";

export default function BudgetModal({ currentBudget, onSave, onClose }) {
  const [budget, setBudget] = useState(currentBudget);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (budget > 0) {
      onSave(budget);
      onClose();

      try {
        const res = await expenseService.setBudget({ amount: budget });
        if (res) {
          Swal.fire({
            icon: "success",
            title: "Budget Set",
            text: res.message || "Budget set successfully.",
            timer: 2000,
            showConfirmButton: false,
          });
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Failed to set",
          text: error.message || "Something went wrong",
        });
      }
    }
  };

  return (
    <div className="modal_overlay">
      <div className="modal modal_small">
        <div className="modal_header">
          <h2>Set Monthly Budget</h2>
          <button className="close_btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="modal_form">
          <div className="form_group">
            <label>
              <FaRupeeSign /> Monthly Budget Amount
            </label>
            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              min="0"
              step="0.01"
              required
              placeholder="Enter your monthly budget"
            />
          </div>
          <div className="modal_actions">
            <button
              type="button"
              className="btn btn_secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn_primary">
              Save Budget
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
