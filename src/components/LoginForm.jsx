import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api_for_userService from '../Servicesimpl/api_for_userservice';
import '../Styling/Styling.css';
import Swal from 'sweetalert2';
import { jwtDecode } from 'jwt-decode'; 


const LoginForm = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); 

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await api_for_userService.post('/login', { username, password });
      const { token } = res.data;
      localStorage.setItem('token', token);
      const decoded = jwtDecode(token);
      localStorage.setItem('username', decoded.sub); // store username

      onLoginSuccess();
      navigate('/dashboard'); 
    } catch (err) {
      //alert('Invalid credentials!');
      Swal.fire({
        title: 'Error!',
        text: 'Invalid Credentials!',
        icon: 'error',
        confirmButtonText: 'Try Again'
      });
    }
  };

  return (
    <div className='a'>
<h1
  className="title"
  style={{
    fontSize: '2.8rem',
    color: '#654321',
    textAlign: 'center',
    margin: '30px 0',
    fontWeight: 'bold',
    fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
    letterSpacing: '2px',
    textShadow: '1px 1px 4px rgba(0, 0, 0, 0.2)'
  }}
>
  SCHOOL VACCINATION PORTAL
</h1>    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2 className="auth-title">Login</h2>

        <label className="auth-label">Username</label>
        <input
          className="auth-input"
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="Enter username"
          required
        />

        <label className="auth-label">Password</label>
        <input
          className="auth-input"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Enter password"
          required
        />

        <button className="auth-button" type="submit">Login</button>

        <p className="auth-toggle">
          Don’t have an account?{' '}
          <span className="auth-link" onClick={() => navigate('/register')}>
            Register here
          </span>
        </p>
      </form>
    </div>
    </div>
  );
};

export default LoginForm;