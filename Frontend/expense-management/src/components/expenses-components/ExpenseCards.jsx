"use client";
import { FaCalendar, FaTag, FaStickyNote } from "react-icons/fa";

export default function ExpenseCard({ expense }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      Food: "#FF6B6B",
      Transportation: "#4ECDC4",
      Utilities: "#45B7D1",
      Entertainment: "#96CEB4",
      Healthcare: "#FFEAA7",
      Shopping: "#DDA0DD",
      Other: "#95A5A6",
    };
    return colors[category] || colors.Other;
  };

  return (
    <div className="allexpenses_list_item">
      <div className="allexpenses_main_info">
        <div className="allexpenses_title_amount">
          <h4 className="allexpenses_title">{expense.title}</h4>
          <span className="allexpenses_amount">
            ₹{expense.amount.toLocaleString()}
          </span>
        </div>

        <div className="allexpenses_meta_info">
          <div
            className="allexpenses_category"
            style={{ color: getCategoryColor(expense.category) }}
          >
            <FaTag />
            <span>{expense.category}</span>
          </div>
          <div className="allexpenses_date">
            <FaCalendar />
            <span>{formatDate(expense.date)}</span>
          </div>
        </div>

        {expense.note && (
          <div className="allexpenses_note">
            <FaStickyNote />
            <span>{expense.note}</span>
          </div>
        )}
      </div>
    </div>
  );
}
