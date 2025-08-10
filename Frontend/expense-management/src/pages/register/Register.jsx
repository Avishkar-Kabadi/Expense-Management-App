import { useState } from "react";
import {
  FaChartLine,
  FaEnvelope,
  FaLock,
  FaUnlock,
  FaUser,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import logo from "../../assets/logo.png";
import { useAuth } from "../../AuthContext";
import { authService } from "../../services/authService";
import "./register.css";

export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const handleNavigation = () => {
    navigate("/login");
  };
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [passwordVisibility, SetPasswordVisibility] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password } = formData;
    try {
      const res = await authService.registerUser({
        name,
        email,
        password,
      });
      if (res && res.message) {
        Swal.fire({
          icon: "success",
          title: "Registration Successful!",
          text: res.message || "You are now logged in.",
          timer: 2000,
          showConfirmButton: false,
        });
        login(res.access);
        navigate("/dashboard");
        setFormData({ email: "", password: "" });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: error.message || "Something went wrong",
      });
    }
  };

  const HideShowPasswordIcon = passwordVisibility ? FaUnlock : FaLock;

  return (
    <div className="register_page">
      <div className="register_container">
        <div className="register_welcome">
          <div className="welcome_content">
            <div className="logo_section">
              <img src={logo || "/placeholder.svg"} alt="logo" />
              <FaChartLine className="chart_icon" />
            </div>
            <h1>Start Your Journey!</h1>
            <p>
              Take control of your finances with our comprehensive expense
              management platform.
            </p>
            <div className="benefits_list">
              <div className="benefit_item">
                <span className="benefit_dot"></span>
                Real-time expense tracking
              </div>
              <div className="benefit_item">
                <span className="benefit_dot"></span>
                Smart budget insights
              </div>
              <div className="benefit_item">
                <span className="benefit_dot"></span>
                Detailed financial reports
              </div>
              <div className="benefit_item">
                <span className="benefit_dot"></span>
                Secure data protection
              </div>
            </div>
          </div>
          <div className="welcome_decoration">
            <div className="decoration_circle circle1"></div>
            <div className="decoration_circle circle2"></div>
            <div className="decoration_circle circle3"></div>
          </div>
        </div>
        <div className="register_form-box">
          <div className="form_header">
            <h1>Create Account</h1>
            <p>Join us and start managing your expenses today</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="register_input-box">
              <label htmlFor="name">Full Name</label>
              <div className="input_wrapper">
                <input
                  id="name"
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                <FaUser className="icon" />
              </div>
            </div>

            <div className="register_input-box">
              <label htmlFor="email">Email Address</label>
              <div className="input_wrapper">
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <FaEnvelope className="icon" />
              </div>
            </div>

            <div className="register_input-box">
              <label htmlFor="password">Password</label>
              <div className="input_wrapper">
                <input
                  id="password"
                  type={passwordVisibility ? "text" : "password"}
                  name="password"
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <HideShowPasswordIcon
                  className="icon password_toggle"
                  onClick={() => SetPasswordVisibility((prev) => !prev)}
                />
              </div>
            </div>

            <button type="submit" className="register_btn">
              <span>Create Account</span>
              <div className="btn_overlay"></div>
            </button>
          </form>

          <div className="form_footer">
            <p>
              Already have an account?{" "}
              <a onClick={handleNavigation}>Sign in here</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
