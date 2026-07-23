import React, { useState, useEffect } from 'react';
import './App.css';
import Dashboard from './components/Dashboard';

export default function App() {
  const [username, setUsername] = useState('Admin');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({ username: '', password: '' });
  const [pageLoading, setPageLoading] = useState(true);

  // Authentication State: defaults to true so user lands on Dashboard, but can switch to Login
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [loggedInUser, setLoggedInUser] = useState('Admin User');

  // Pre-loader fadeout simulation
  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const validateForm = () => {
    let valid = true;
    const newErrors = { username: '', password: '' };

    if (!username.trim()) {
      newErrors.username = 'Please Enter User Name';
      valid = false;
    }
    if (!password) {
      newErrors.password = 'Password is required';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleFocus = (field) => {
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    // Simulate ASP.NET Login postback / AJAX call
    setTimeout(() => {
      setIsLoading(false);
      setLoggedInUser(username);
      setIsLoggedIn(true);
    }, 800);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <>
      {/* Preloader */}
      {pageLoading && <div className="se-pre-con"></div>}

      {isLoggedIn ? (
        <Dashboard username={loggedInUser} onLogout={handleLogout} />
      ) : (
        <div className="limiter">
          <div className="container-login100">
            <div className="wrap-login100">
              {/* Sign In Form */}
              <form onSubmit={handleLoginSubmit} className="login100-form validate-form" noValidate>
                <center>
                  <img
                    src="/assets/images/vishal_mega_mart.png"
                    className="logo"
                    alt="Logo"
                  />
                </center>

                <div className="login100-form-title p-b-15">
                  VISHAL MEGA MART
                </div>

                <div className="hr-sect p-b-20">
                  SIGN IN
                </div>

                {/* Username Input */}
                <div
                  className={`wrap-input100 validate-input ${errors.username ? 'alert-validate' : ''}`}
                  data-validate={errors.username || "Please Enter User Name"}
                >
                  <input
                    id="txtUsername"
                    type="text"
                    className={`input100 ${username.trim() !== '' ? 'has-val' : ''}`}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onFocus={() => handleFocus('username')}
                    autoFocus
                  />
                  <span className="focus-input100"></span>
                  <span className="label-input100">User Name</span>
                </div>

                {/* Password Input */}
                <div
                  className={`wrap-input100 validate-input ${errors.password ? 'alert-validate' : ''}`}
                  data-validate={errors.password || "Password is required"}
                >
                  <input
                    id="txtPassword"
                    type={showPassword ? 'text' : 'password'}
                    className={`input100 ${password.trim() !== '' ? 'has-val' : ''}`}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => handleFocus('password')}
                  />
                  <span className="focus-input100"></span>
                  <span className="label-input100">Password</span>
                </div>

                {/* Checkbox */}
                <div className="flex-sb-m w-full p-t-3 p-b-20">
                  <div className="contact100-form-checkbox">
                    <input
                      className="input-checkbox100"
                      id="ckb1"
                      type="checkbox"
                      name="remember-me"
                      checked={showPassword}
                      onChange={(e) => setShowPassword(e.target.checked)}
                    />
                    <label className="label-checkbox100" htmlFor="ckb1">
                      Show Password
                    </label>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="container-login100-form-btn">
                  <button
                    type="submit"
                    id="btnLogin"
                    className="login100-form-btn"
                    disabled={isLoading}
                  >
                    {isLoading ? 'SIGNING IN...' : 'SIGN IN'}
                  </button>
                </div>

                {/* Footer */}
                <div className="text-center p-t-15 p-b-10">
                  <div className="txt2">
                    Copyright &copy; {new Date().getFullYear()} | V 3.4 | Markss Infotech Ltd | Designed & Developed by <br />
                    <div className="footer-dev">
                      <img
                        src="/assets/images/vyapti_logo.png"
                        title="Markss Infotech Ltd"
                        alt="Vyapti Logo"
                        className="vyapti-logo-img"
                      />
                    </div>
                  </div>
                </div>
              </form>

              {/* Left/Right Background Image Banner */}
              <div
                className="login100-more"
                style={{ backgroundImage: "url('/assets/images/SignIn_page_background_image.png')" }}
              ></div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}