"use client";

import { useState } from "react";
import { FaEnvelope, FaTimes, FaUser, FaPhone } from "react-icons/fa";
import Swal from "sweetalert2";
import { authService } from "../../services/authService";
export default function ProfileModal({ onClose, userData, onSave }) {
  const [profileData, setProfileData] = useState(userData);
  // console.log(userData);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, phone } = profileData;
    try {
      const res = await authService.updateUser({ name, email, phone });

      if (res) {
        Swal.fire({
          icon: "success",
          title: "User details updated!",
          text: res.message || "User details updated successfully.",
          timer: 2000,
          showConfirmButton: false,
        });
        setProfileData(res.user);
        onSave();
        onClose();
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed to update",
        text: error.message || "Something went wrong",
      });
    }
  };

  return (
    <div className="modal_overlay">
      <div className="modal">
        <div className="modal_header">
          <h2>Profile Settings</h2>
          <button className="close_btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="modal_form">
          <div className="form_group">
            <label>
              <FaUser /> Full Name
            </label>
            <input
              type="text"
              value={profileData.name}
              onChange={(e) =>
                setProfileData({ ...profileData, name: e.target.value })
              }
              required
            />
          </div>
          <div className="form_group">
            <label>
              <FaEnvelope /> Email Address
            </label>
            <input
              type="email"
              value={profileData.email}
              onChange={(e) =>
                setProfileData({ ...profileData, email: e.target.value })
              }
              required
            />
          </div>
          <div className="form_group">
            <label>
              <FaPhone /> Phone Number
            </label>
            <input
              type="tel"
              value={profileData.phone}
              onChange={(e) =>
                setProfileData({ ...profileData, phone: e.target.value })
              }
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
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
