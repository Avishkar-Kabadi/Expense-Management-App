import { useState } from "react";
import { FaChartLine, FaEnvelope, FaLock, FaUnlock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import logo from "../../assets/logo.png";
import { authService } from "../../services/authService";
import "./login.css";
import { useAuth } from "../../AuthContext";
export default function Login() {
  const navigate = useNavigate();
  const [passwordVisibility, SetPasswordVisibility] = useState(false);
  const HideShowPasswordIcon = passwordVisibility ? FaUnlock : FaLock;

  const { login } = useAuth();

  const handleNavigation = () => {
    navigate("/register");
  };

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;
    try {
      const res = await authService.loginUser({
        email,
        password,
      });
      if (res && res.message) {
        Swal.fire({
          icon: "success",
          title: "Login Successful!",
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
        title: "Login Failed",
        text: error.message || "Something went wrong",
      });
    }
  };

  return (
    <div className="login_page">
      <div className="login_container">
        <div className="login_welcome">
          <div className="welcome_content">
            <div className="logo_section">
              <img src={logo || "/placeholder.svg"} alt="logo" />
              <FaChartLine className="chart_icon" />
            </div>
            <h1>Welcome Back!</h1>
            <p>
              Manage your expenses with ease and take control of your financial
              future.
            </p>
            <div className="features_list">
              <div className="feature_item">
                <span className="feature_dot"></span>
                Track daily expenses
              </div>
              <div className="feature_item">
                <span className="feature_dot"></span>
                Generate reports
              </div>
              <div className="feature_item">
                <span className="feature_dot"></span>
                Budget planning
              </div>
            </div>
          </div>
          <div className="welcome_decoration">
            <div className="decoration_circle circle1"></div>
            <div className="decoration_circle circle2"></div>
            <div className="decoration_circle circle3"></div>
          </div>
        </div>

        <div className="login_form-box">
          <div className="form_header">
            <h1>Sign In</h1>
            <p>Enter your credentials to access your account</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="login_input-box">
              <label htmlFor="email">Email Address</label>
              <div className="input_wrapper">
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  onChange={handleChange}
                  value={formData.email}
                  required
                />
                <FaEnvelope className="icon" />
              </div>
            </div>

            <div className="login_input-box">
              <label htmlFor="password">Password</label>
              <div className="input_wrapper">
                <input
                  id="password"
                  type={passwordVisibility ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  onChange={handleChange}
                  value={formData.password}
                  required
                />
                <HideShowPasswordIcon
                  className="icon password_toggle"
                  onClick={() => SetPasswordVisibility((prev) => !prev)}
                />
              </div>
            </div>

            <div className="form_options">
              <label className="remember_me">
                <input type="checkbox" />
                <span className="checkmark"></span>
                Remember me
              </label>
              <a href="#" className="forgot_password">
                Forgot Password?
              </a>
            </div>

            <button type="submit" className="login_btn">
              <span>Sign In</span>
              <div className="btn_overlay"></div>
            </button>
          </form>

          <div className="form_footer">
            <p>
              Don't have an account?{" "}
              <a onClick={handleNavigation}>Sign up here</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
