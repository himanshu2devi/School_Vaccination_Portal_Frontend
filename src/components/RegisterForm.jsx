import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api_for_userService from '../Servicesimpl/api_for_userservice';
import '../Styling/Styling.css';
import Swal from 'sweetalert2';


const RegisterForm = () => {
  const [form, setForm] = useState({
    username: '', password: '', fullName: '', email: '', role: ''
  });
  const navigate = useNavigate(); 

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await api_for_userService.post('/register', form);
      //alert('Registered successfully! Now log in.');
      Swal.fire({
        title: 'Success!',
        text: 'Congratulations, you have successfully registered',
        icon: 'success',
        confirmButtonText: 'Okay'
      });
      navigate('/login');
    } catch (err) {
      if (err.response?.status === 409) {
        //alert('Email already exists. Please use a different one.');
        Swal.fire({
          title: 'Error!',
          text: 'User with same data already exists!',
          icon: 'error',
          confirmButtonText: 'Try Again'
        });
      
      }

        else{

      alert('Registration failed!');}
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
</h1>
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2 className="auth-title">Register</h2>

        <label className="auth-label">Username</label>
        <input
          className="auth-input"
          name="username"
          onChange={handleChange}
          placeholder="Enter username"
          required
        />

        <label className="auth-label">Full Name</label>
        <input
          className="auth-input"
          name="fullName"
          onChange={handleChange}
          placeholder="Enter full name"
          required
        />

        <label className="auth-label">Email</label>
        <input
          className="auth-input"
          name="email"
          type="email"
          onChange={handleChange}
          placeholder="Enter email"
          required
        />

        <label className="auth-label">Password</label>
        <input
          className="auth-input"
          name="password"
          type="password"
          onChange={handleChange}
          placeholder="Enter password"
          required
        />

        <label className="auth-label">Role</label>
        <select
          className="auth-input"
          name="role"
          onChange={handleChange}
          required
        >
          <option value="">Select Role</option>
          <option value="ADMIN">Admin</option>
          <option value="USER">User</option>
        </select>

        <button className="auth-button" type="submit">Register</button>

        <p className="auth-toggle">
          Already have an account?{' '}
          <span className="auth-link" onClick={() => navigate('/login')}>
            Login here
          </span>
        </p>
      </form>
    </div>
    </div>
  );
};

export default RegisterForm;