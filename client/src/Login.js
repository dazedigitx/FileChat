import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import axiosInstance from './API/axiosInstance';
import './Login.css';
import './Style.css';

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showNextButton, setShowNextButton] = useState(false);
  const [emailReadOnly, setEmailReadOnly] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log('Using environment file:', process.env.NODE_ENV);
    console.log('REACT_APP_API_URL:', process.env.REACT_APP_API_URL);
    console.log('WebSocket URL:', process.env.REACT_APP_WEBSOCKET_URL);
  }, []);

  const handleEmailChange = (e) => {
    const enteredEmail = e.target.value;
    setEmail(enteredEmail);
    setShowNextButton(enteredEmail.includes('@'));
  };

  const handleNext = () => {
    setEmailReadOnly(true);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (password && !loading) {
      setLoading(true);
      try {
        const response = await axiosInstance.post('/api/users/login', { email, password });
        const { token, id, username } = response.data;
        setUser({ id, email, username, token });
        localStorage.setItem('accessToken', token);
        setMessage('User logged in successfully');
        setError('');
        navigate('/dashboard');
      } catch (error) {
        console.error('Login error:', error);
        setError(`Error logging in. Details: ${error.response?.data.message || error.message}`);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="login-page">
      <div className="login-hero-image"></div>
      <div className="login-form-container">
        <div className="login-box">
          <h2>Login</h2>
          {error && <p className="error-message">{error}</p>}
          {message && <p className="success-message">{message}</p>}
          <form onSubmit={handlePasswordSubmit}>
            <input
              type="email"
              placeholder="Email"
              id="email"
              value={email}
              onChange={handleEmailChange}
              readOnly={emailReadOnly}
              required
              aria-label="Email"
            />
            {!emailReadOnly && showNextButton && (
              <button type="button" className="continue-button" onClick={handleNext}>Continue</button>
            )}
            {emailReadOnly && (
              <>
                <input
                  type="password"
                  placeholder="Password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  aria-label="Password"
                />
                <button type="submit" disabled={loading}>
                  {loading ? 'Logging in...' : 'Login'}
                </button>
              </>
            )}
          </form>
          <div className="register-link">
            <span>Don't have an account?</span>
            <Link to="/signup" className="register-button">Register</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
