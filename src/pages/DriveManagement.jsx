import React, { useEffect, useState } from 'react';
import { getDrives, addDrive, updateDrive,deleteDrive } from '../Servicesimpl/driverServiceImpl';
import { Link, useNavigate } from 'react-router-dom';
import '../Styling/Styling.css';
import Swal from 'sweetalert2';

const DriveManagementPage = () => {
  const [drives, setDrives] = useState([]);
  const [form, setForm] = useState({
    id: null,
    vaccineName: '',
    className: '',
    date: '',
    dosesRequired: 1
  });

  const username = localStorage.getItem('username');


  const [editing, setEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadDrives();
  }, []);

  const loadDrives = async () => {
    try {
      const res = await getDrives();
      setDrives(res.data);
    } catch (err) {
      console.error("Failed to load drives", err);
    }
  };

  const validateDate = (selectedDate) => {
    const today = new Date();
    const inputDate = new Date(selectedDate);
    const diffDays = (inputDate - today) / (1000 * 60 * 60 * 24);
    return diffDays >= 15;
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: 'This will permanently delete the drive!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    });
  
    if (confirm.isConfirmed) {
      try {
        await deleteDrive(id);
        Swal.fire('Deleted!', 'The drive has been deleted.', 'success');
        loadDrives();
      } catch (err) {
        Swal.fire('Error!', 'Failed to delete drive.', 'error');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateDate(form.date)) {
      Swal.fire({
        title: 'Error!',
        text: 'Drive date must be at least 15 days from today',
        icon: 'error',
        confirmButtonText: 'Try Again'
      });
      return;
    }

    try {
      if (editing) {
        await updateDrive(form.id, form);
        Swal.fire({
          title: 'Success!',
          text: 'Drive updated successfully!',
          icon: 'success',
          confirmButtonText: 'Okay'
        });
      } else {
        await addDrive(form);
        Swal.fire({
          title: 'Success!',
          text: 'Drive scheduled successfully!',
          icon: 'success',
          confirmButtonText: 'Okay'
        });
      }

      setForm({ id: null, vaccineName: '', className: '', date: '', dosesRequired: 1 });
      setEditing(false);
      loadDrives();
    } catch (err) {
      const message = err?.response?.data;
      Swal.fire({
        title: 'Oops!',
        text: typeof message === 'string' ? message : "Failed to process drive.",
        icon: 'error',
        confirmButtonText: 'Okay'
      });
    }
  };

  const handleEdit = (drive) => {
    const driveDate = new Date(drive.date);
    const today = new Date();
    if (driveDate < today) {
      Swal.fire({
        title: 'Error!',
        text: 'Cannot edit a past drive.',
        icon: 'error',
        confirmButtonText: 'Try Again'
      });
      return;
    }

    setForm({ ...drive });
    setEditing(true);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <div className="top-bar">
        <h2 className="title">Drive Management</h2>
        <div className="right-items">
          <button className="dashboard-btn" onClick={() => navigate('/dashboard')}>
          Dashboard
          </button>
          <div className="username-display">👤 {username}</div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Vaccine Name"
          value={form.vaccineName}
          onChange={(e) => setForm({ ...form, vaccineName: e.target.value })}
          required
        />
        <input
          placeholder="Class Name"
          value={form.className}
          onChange={(e) => setForm({ ...form, className: e.target.value })}
          required
        />
        <input
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Number of Doses"
          value={form.dosesRequired}
          onChange={(e) => setForm({ ...form, dosesRequired: e.target.value })}
          min={1}
          required
        />
        <button type="submit">{editing ? 'Update Drive' : 'Add Drive'}</button>
        {editing && (
          <button
            type="button"
            onClick={() => {
              setEditing(false);
              setForm({ id: null, vaccineName: '', className: '', date: '', dosesRequired: 1 });
            }}
          >
            Cancel Edit
          </button>
        )}
      </form>

      <h3>All Vaccination Drives</h3>
      {drives.length === 0 ? (
        <p>No drives found.</p>
      ) : (
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>Vaccine</th>
              <th>Class</th>
              <th>Date</th>
              <th>No. of Doses</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {drives.map((drive, idx) => {
              const isPast = new Date(drive.date) < new Date();

              return (
                <tr key={idx}>
                  <td>{drive.vaccineName}</td>
                  <td>{drive.className}</td>
                  <td>{drive.date}</td>
                  <td>{drive.dosesRequired}</td>
                  <td>
                    <button
                      onClick={() => handleEdit(drive)}
                      disabled={isPast}
                      title={isPast ? "Drive completed" : "Edit drive"}
                      style={{
                        backgroundColor: isPast ? '#ccc' : '#4a90e2',
                        color: 'white',
                        padding: '6px 10px',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: isPast ? 'not-allowed' : 'pointer'
                      }}
                    >
                      Edit
                    </button>
                    <button
  onClick={() => handleDelete(drive.id)}
  style={{
    backgroundColor: '#e74c3c',
    color: 'white',
    padding: '6px 10px',
    border: 'none',
    borderRadius: '4px',
    marginLeft: '8px',
    cursor: 'pointer'
  }}
>
  Delete
</button>
                    
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DriveManagementPage;