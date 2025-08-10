"use client";

import { useState } from "react";
import { FaTimes, FaCalendar, FaFilter } from "react-icons/fa";

export default function FilterModal({ currentFilter, onApply, onClose }) {
  const [filterType, setFilterType] = useState(currentFilter.type);
  const [month, setMonth] = useState(currentFilter.month);
  const [startDate, setStartDate] = useState(currentFilter.startDate);
  const [endDate, setEndDate] = useState(currentFilter.endDate);

  const handleApply = () => {
    const filterData = {
      type: filterType,
      month: filterType === "month" ? month : "",
      startDate: filterType === "range" ? startDate : "",
      endDate: filterType === "range" ? endDate : "",
    };
    onApply(filterData);
  };

  const handleReset = () => {
    setFilterType("all");
    setMonth("");
    setStartDate("");
    setEndDate("");
  };

  const isApplyDisabled = () => {
    if (filterType === "month") return !month;
    if (filterType === "range") return !startDate || !endDate;
    return false;
  };

  return (
    <div className="modal_overlay">
      <div className="modal filter_modal">
        <div className="modal_header">
          <h2>
            <FaFilter /> Filter Expenses
          </h2>
          <button className="close_btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="modal_form">
          <div className="filter_options">
            <div className="filter_option">
              <label className="radio_label">
                <input
                  type="radio"
                  name="filterType"
                  value="all"
                  checked={filterType === "all"}
                  onChange={(e) => setFilterType(e.target.value)}
                />
                <span className="radio_custom"></span>
                <span className="radio_text">All Expenses</span>
              </label>
            </div>

            <div className="filter_option">
              <label className="radio_label">
                <input
                  type="radio"
                  name="filterType"
                  value="month"
                  checked={filterType === "month"}
                  onChange={(e) => setFilterType(e.target.value)}
                />
                <span className="radio_custom"></span>
                <span className="radio_text">Select Month</span>
              </label>
              {filterType === "month" && (
                <div className="filter_input_group">
                  {/* <FaCalendar className="input_icon" /> */}
                  <input
                    type="month"
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    className="filter_input"
                  />
                </div>
              )}
            </div>

            <div className="filter_option">
              <label className="radio_label">
                <input
                  type="radio"
                  name="filterType"
                  value="range"
                  checked={filterType === "range"}
                  onChange={(e) => setFilterType(e.target.value)}
                />
                <span className="radio_custom"></span>
                <span className="radio_text">Select Date Range</span>
              </label>
              {filterType === "range" && (
                <div className="date_range_inputs">
                  <div className="filter_input_group">
                    <label>Start Date</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="filter_input"
                    />
                  </div>
                  <div className="filter_input_group">
                    <label>End Date</label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="filter_input"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="modal_actions">
            <button
              type="button"
              className="btn btn_secondary"
              onClick={handleReset}
            >
              Reset
            </button>
            <button
              type="button"
              className="btn btn_tertiary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn_primary"
              onClick={handleApply}
              disabled={isApplyDisabled()}
            >
              Apply Filter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
