import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface LoginModalProps {
  onClose: () => void;
  onSignup: () => void;
  onLoginSuccess?: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onClose, onSignup, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; form?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    let isValid = true;

    if (!email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
      isValid = false;
    }

    if (!password) {
      newErrors.password = 'Password is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsLoading(true);
      
      try {
        // Make actual API call
        const response = await axios.post("http://localhost:5000/api/login", {
          email,
          password,
        });

        // Store user information
        const userData = {
          email,
          token: response.data.token
        };
        
        // Handle remember me functionality
        if (rememberMe) {
          localStorage.setItem("user", JSON.stringify(userData));
        } else {
          sessionStorage.setItem("user", JSON.stringify(userData));
        }

        console.log("Login success:", response.data);
        
        // Call the success callback to trigger redirect
        if (onLoginSuccess) {
          onLoginSuccess();
        }
        
        // Close modal after successful login
        onClose();
      } catch (error) {
        console.error("Login error:", error);
        setErrors({
          form: 'Invalid email or password. Please try again.'
        });
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
    
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        if (userData?.token) {
          setEmail(userData.email || '');
          console.log("User is already logged in");
          
          // If already logged in, trigger success callback
          if (onLoginSuccess) {
            onLoginSuccess();
          }
        }
      } catch (error) {
        console.error("Error parsing saved user data", error);
      }
    }
    
    // Prevent body scrolling when modal is open
    document.body.style.overflow = 'hidden';
    
    return () => {
      // Re-enable body scrolling when modal is closed
      document.body.style.overflow = 'auto';
    };
  }, [onLoginSuccess]);

  // Handle modal click outside to close
  const handleModalClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleModalClick}>
      <div className="modal-content login-modal">
        <button 
          className="modal-close" 
          onClick={onClose}
          aria-label="Close login modal"
        >×</button>
        
        <div className="modal-header">
          <div className="modal-logo">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 9V3H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3 15V21H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21 3L14 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M10 14L3 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h2>Log in to RESTLab</h2>
          <p>Welcome back! Please enter your details.</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          {errors.form && (
            <div className="form-error-message">{errors.form}</div>
          )}
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={errors.email ? 'error' : ''}
              placeholder="Enter your email"
              autoComplete="email"
            />
            {errors.email && <div className="error-message">{errors.email}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={errors.password ? 'error' : ''}
              placeholder="Enter your password"
              autoComplete="current-password"
            />
            {errors.password && <div className="error-message">{errors.password}</div>}
          </div>
          
          <div className="form-row">
            <div className="checkbox-group">
              <input
                type="checkbox"
                id="remember-me"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label htmlFor="remember-me">Remember me</label>
            </div>
            <a href="#" className="forgot-password">Forgot password?</a>
          </div>
          
          <button 
            type="submit" 
            className={`submit-button ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="loading-spinner"></span>
                <span>Logging in...</span>
              </>
            ) : 'Log in'}
          </button>
        </form>
        
        <div className="modal-footer">
          <p>
            Don't have an account?{' '}
            <button className="text-button" onClick={onSignup}>
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;