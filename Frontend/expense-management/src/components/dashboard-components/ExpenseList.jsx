import { FaCalendar, FaEdit, FaTag, FaTrash } from "react-icons/fa";

export default function ExpenseList({ expenses, onEdit, onDelete }) {
  return (
    <div className="expense_list">
      <h3>Recent Expenses</h3>
      <div className="expense_cards">
        {expenses.map((expense) => (
          <div key={expense._id} className="expense_card">
            <div className="expense_header">
              <h4>{expense.title}</h4>
              <span className="expense_amount">₹{expense.amount}</span>
            </div>
            <div className="expense_details">
              <div className="expense_meta">
                <span className="expense_category">
                  <FaTag /> {expense.category}
                </span>
                <span className="expense_date">
                  <FaCalendar /> {new Date(expense.date).toLocaleDateString()}
                </span>

                <span className="expense_date">
                  <p>Created At</p>
                  <FaCalendar />{" "}
                  {new Date(expense.createdAt).toLocaleDateString()}
                </span>

                {expense.createdAt !== expense.updatedAt ? (
                  <span className="expense_date">
                    <p>Updated At</p>
                    <FaCalendar />{" "}
                    {new Date(expense.createdAt).toLocaleDateString()}
                  </span>
                ) : null}
              </div>
              <p className="expense_description">{expense.note}</p>
            </div>
            <div className="expense_actions">
              <button
                className="action_btn edit_btn"
                onClick={() => onEdit(expense)}
              >
                <FaEdit /> Edit
              </button>
              <button
                className="action_btn delete_btn"
                onClick={() => onDelete(expense._id)}
              >
                <FaTrash /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
