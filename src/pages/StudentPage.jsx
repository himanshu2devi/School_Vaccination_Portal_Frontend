import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  fetchStudents,
  addStudent,
  searchStudents,
  markVaccinated,
  uploadCSV,
} from '../Servicesimpl/StudentServiceImpl';
import '../Styling/Styling.css';
import Swal from 'sweetalert2';
import api_for_studentService from '../Servicesimpl/api_for_studentService';

const StudentsPage = () => {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ name: '', studentId: '', className: '' });
  const [file, setFile] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const pageSize = 10;
  const navigate = useNavigate();

  const username = localStorage.getItem('username');


  useEffect(() => {
    loadStudents();
  }, [page]);

  const loadStudents = async () => {
    try {
      const res = await fetchStudents(page, pageSize);
      setStudents(res.data.content);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      Swal.fire({
        title: 'Error!',
        text: 'Failed to load students.',
        icon: 'error',
        confirmButtonText: 'Try Again'
      });
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      // Check if the student ID already exists
      const existingStudents = await fetchStudents(0, totalPages * pageSize); // Fetch all students to check for duplicates
      const duplicate = existingStudents.data.content.find((student) => student.studentId === form.studentId);
  
      if (duplicate) {
        Swal.fire({
          title: 'Error!',
          text: 'Student ID already exists.',
          icon: 'error',
          confirmButtonText: 'Try Again',
        });
        return;
      }
  
      // Proceed to add the student
      await addStudent(form);
      setForm({ name: '', studentId: '', className: '' });
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Student added successfully in the portal',
      });
      loadStudents();
    } catch (err) {
      console.error('Add failed', err);
      alert('Add failed.');
    }
  };

  const handleUpload = async () => {
    try {
      if (file) {
        // Read the CSV file
        const reader = new FileReader();
        reader.onload = async (e) => {
          const fileContent = e.target.result;
          
          // Split the file content into rows
          const rows = fileContent.split('\n');
          
          // Parse the rows into an array of student objects
          const studentsFromFile = rows.map((row) => {
            const [name, studentId, className] = row.split(',').map((item) => item.trim());
            return { name, studentId, className };
          }).filter((student) => student.studentId); // Remove rows with missing student IDs
  
          // Check for duplicate student IDs from the file
          const existingStudents = await fetchStudents(0, totalPages * pageSize); // Fetch all students to check for duplicates
          const existingIds = existingStudents.data.content.map((student) => student.studentId);
  
          const duplicateStudents = studentsFromFile.filter((student) =>
            existingIds.includes(student.studentId)
          );
  
          if (duplicateStudents.length > 0) {
            // Show alert for duplicate student IDs
            Swal.fire({
              title: 'Error!',
              text: `Duplicate student IDs found: ${duplicateStudents.map((s) => s.studentId).join(', ')}`,
              icon: 'error',
              confirmButtonText: 'Try Again',
            });
            return;
          }
  
          // Proceed with CSV upload if no duplicates are found
          await uploadCSV(file);
          Swal.fire({
            icon: 'success',
            title: 'Import Successful',
            text: 'Bulk import from CSV file has been successful!',
          });
          loadStudents();
          setFile(null); // Reset the file state to clear the input
          document.getElementById('csvFile').value = ''; // Reset the file input value
        };
  
        reader.readAsText(file);
      } else {
        Swal.fire({
          title: 'Error!',
          text: 'Please select file first',
          icon: 'error',
          confirmButtonText: 'Try Again',
        });
      }
    } catch (err) {
      console.error('CSV Upload failed', err);
    }
  };

  const handleSearch = async (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (term.trim() === '') {
      loadStudents();
    } else {
      const res = await searchStudents(term);
      setStudents(res.data);
      setTotalPages(1); 
    }
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: 'You won’t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    });
  
    if (confirm.isConfirmed) {
      try {
        await api_for_studentService.delete(`/students/${id}`);
        Swal.fire('Deleted!', 'Student record has been deleted.', 'success');
        loadStudents();
      } catch (err) {
        Swal.fire('Error', 'Failed to delete student.', 'error');
      }
    }
  };

  const handleVaccinate = async (id) => {
    try {
      const res = await api_for_studentService.get('http://localhost:8083/drives');
      const drives = res.data;
  
      const optionsHtml = drives.map(
        (d) =>
          `<option value="${d.vaccineName}|${d.date}">${d.vaccineName} - ${d.date}</option>`
      ).join('');
  
      const { value: selected } = await Swal.fire({
        title: 'Mark as Vaccinated',
        html: `<select id="swal-vaccine-select" class="swal2-select">${optionsHtml}</select>`,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Submit',
        preConfirm: () => {
          const value = document.getElementById('swal-vaccine-select').value;
          if (!value) {
            Swal.showValidationMessage('Please select a vaccine');
            return;
          }
          const [vaccine, date] = value.split('|');
          return { vaccine, date };
        }
      });
  
      if (selected) {
        await markVaccinated(id, selected.vaccine, selected.date);
        Swal.fire('Success!', 'Student marked as vaccinated.', 'success');
        loadStudents();
      }
    } catch (error) {
      Swal.fire('Error', 'Failed to mark vaccination.', 'error');
    }
  };

  return (
    <div className="container">
      <div className="top-bar">
  <h2 className="title">Student Management</h2>
  <div className="right-items">
    <button className="dashboard-btn" onClick={() => navigate('/dashboard')}>
      Dashboard
    </button>
    <div className="username-display">👤 {username}</div>
  </div>
</div>

      <form onSubmit={handleAdd} className="form-row">
        <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input placeholder="Student ID" value={form.studentId} onChange={(e) => setForm({ ...form, studentId: e.target.value })} />
        <input placeholder="Class" value={form.className} onChange={(e) => setForm({ ...form, className: e.target.value })} />
        <button type="submit">Add</button>
      </form>

      <div className="actions">
  <div className="file-upload">
    <input
      type="file"
      id="csvFile"
      accept=".csv"
      onChange={(e) => setFile(e.target.files[0])}
    />
    <label htmlFor="csvFile">Choose File</label>
  </div>
  <button onClick={handleUpload}>Upload CSV</button>
  <input
    placeholder="Search by name/class/id..."
    value={searchTerm}
    onChange={handleSearch}
  />
</div>

      <table className="styled-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Student ID</th>
            <th>Class</th>
            <th>Vaccinated</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s.id}>
              <td>{s.name}</td>
              <td>{s.studentId}</td>
              <td>{s.className}</td>
              <td>{s.vaccinated ? 'Yes' : 'No'}</td>
              <td>
  {!s.vaccinated && (
    <button onClick={() => handleVaccinate(s.id)}>Mark Vaccinated</button>
  )}
  <button onClick={() => handleDelete(s.id)} style={{ marginLeft: '0.5rem', backgroundColor: 'red', color: 'white' }}>
    Delete
  </button>
</td>
            </tr>
          ))}
        </tbody>
      </table>

      {searchTerm === '' && (
        <div className="pagination">
          <button onClick={() => setPage((prev) => Math.max(0, prev - 1))} disabled={page === 0}>Previous</button>
          <span>Page {page + 1} of {totalPages}</span>
          <button onClick={() => setPage((prev) => (prev + 1 < totalPages ? prev + 1 : prev))} disabled={page + 1 >= totalPages}>Next</button>
        </div>
      )}
    </div>
  );
};

export default StudentsPage;
