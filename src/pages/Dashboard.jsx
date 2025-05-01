import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api_for_studentService from '../Servicesimpl/api_for_studentService';
import api_for_driveService from '../Servicesimpl/api_for_driveService';
import '../Styling/Styling.css';


const Dashboard = ({ setLoggedIn }) => {
  const [studentCount, setStudentCount] = useState(0);
  const [vaccinatedCount, setVaccinatedCount] = useState(0);
  const [upcomingDrives, setUpcomingDrives] = useState([]);
  const navigate = useNavigate();

  const username = localStorage.getItem('username');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const studentRes = await api_for_studentService.get('/students/count');
      const vaccinatedRes = await api_for_studentService.get('/students/vaccinated/count');
      const driveRes = await api_for_driveService.get('/drives/upcoming');

      setStudentCount(studentRes.data);
      setVaccinatedCount(vaccinatedRes.data);
      setUpcomingDrives(driveRes.data);
    } catch (err) {
      console.error("Error loading dashboard data:", err);
    }
  };

  const vaccinationRate =
    studentCount > 0 ? ((vaccinatedCount / studentCount) * 100).toFixed(1) : 0;

  const handleLogout = () => {
    localStorage.removeItem('token');
    setLoggedIn(false);
    navigate('/');
  };

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div className="dashboard-wrapper">
      <div className="top-bar">
        <div className='title1'>
        <h2>Vaccination Dashboard</h2>
        <div className="welcome-message">
  <h3>Welcome,{username}!!!</h3>
</div>
<div className="action-buttons">
        <button onClick={() => handleNavigate('/students')}>Manage Students</button>
        <button onClick={() => handleNavigate('/drives')}>Manage Drives</button>
        <button onClick={() => handleNavigate('/report')}>Generate Reports</button>
      </div>

        </div>
        <div className='right-items'>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
        <div className="username-display">👤 {username}</div>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Students</h3>
          <p>{studentCount}</p>
        </div>
        <div className="stat-card">
          <h3>Vaccinated Students</h3>
          <p>{vaccinatedCount}</p>
        </div>
        <div className="stat-card">
          <h3>Vaccination Rate</h3>
          <p>{vaccinationRate}%</p>
          <div className="bar-graph">
            <div className="bar-filled" style={{ width: `${vaccinationRate}%` }}></div>
          </div>
        </div>
      </div>

      <div className="upcoming-section">
        <h2>Upcoming Vaccination Drives (within the next 30 days) :</h2>
        {upcomingDrives.length > 0 ? (
          <ul className="drive-list">
            {upcomingDrives.map((drive, index) => (
  <li key={index} className="drive-item">
    <div>
    <strong style={{ marginRight: '10px' }}>💉 {drive.vaccineName}</strong> <br />
<strong style={{ marginRight: '10px' }}>class:</strong> {drive.className} <span style={{ margin: '0 10px' }}>|</span> <strong style={{ marginRight: '10px' }}>Date:</strong> {drive.date} <span style={{ margin: '0 10px' }}>|</span> <strong>Avaialble Doses:</strong> {drive.dosesRequired}    </div>
  </li>
))}
          </ul>
        ) : (
          <p>No upcoming drives scheduled.</p>
        )}
      </div>

      
    </div>
  );
};

export default Dashboard;