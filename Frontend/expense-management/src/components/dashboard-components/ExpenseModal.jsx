import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { expenseService } from "../../services/expenseService";

import { FaFileAlt, FaRupeeSign, FaTag, FaTimes } from "react-icons/fa";

export default function ExpenseModal({
  mode,
  onSave,
  expense,
  onClose,
}) {
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    category: "",
    note: "",
    date: "",
  });

  useEffect(() => {
    if (mode === "edit" && expense) {
      setFormData({
        id: expense._id,
        title: expense.title,
        amount: expense.amount,
        category: expense.category,
        note: expense.note,
        date: new Date(expense.date).toISOString().split("T")[0],
      });
    }
  }, [mode, expense]);

  const categories = [
    "Food",
    "Transportation",
    "Utilities",
    "Entertainment",
    "Healthcare",
    "Shopping",
    "Other",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { title, amount, date, note, category, id } = formData;

    if (mode == "add") {
      try {
        const res = await expenseService.addExpense({
          title,
          amount,
          note,
          date,
          category,
        });
        if (res && res.message) {
          Swal.fire({
            icon: "success",
            title: "Expense Added!",
            text: res.message || "Expense Added successfully.",
            timer: 2000,
            showConfirmButton: false,
          });
          onClose();
          onSave();
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Failed to update",
          text: error.message || "Something went wrong",
        });
      }
    } else {
      try {
        const res = await expenseService.updateExpense(id, {
          title,
          amount,
          note,
          date,
          category,
        });
        if (res && res.message) {
          Swal.fire({
            icon: "success",
            title: "Expense Updated!",
            text: res.message || "Expense Updated successfully.",
            timer: 2000,
            showConfirmButton: false,
          });
          onClose();
          onSave();
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Failed to update",
          text: error.message || "Something went wrong",
        });
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="modal_overlay">
      <div className="modal">
        <div className="modal_header">
          <h2>{mode === "add" ? "Add New Expense" : "Edit Expense"}</h2>
          <button className="close_btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="modal_form">
          <div className="form_group">
            <label>
              <FaFileAlt /> Expense Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Enter expense title"
            />
          </div>
          <div className="form_group">
            <label>
              <FaRupeeSign /> Amount
            </label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              min="0"
              step="0.01"
              required
              placeholder="Enter amount"
            />
          </div>
          <div className="form_group">
            <label>
              <FaTag /> Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div className="form_group">
            <label>
              <FaFileAlt /> Note
            </label>
            <textarea
              name="note"
              value={formData.note}
              onChange={handleChange}
              placeholder="Enter note (optional)"
              rows="3"
            />
          </div>

          <div className="form_group">
            <label>
              <FaFileAlt /> Date
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              placeholder="Enter Date"
              rows="3"
            />
          </div>

          <div className="modal_actions_add-update">
            <button
              type="button"
              className="btn btn_secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn_primary">
              {mode === "add" ? "Add Expense" : "Update Expense"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
