import React, { useEffect, useState } from 'react';
import api_for_studentService from '../Servicesimpl/api_for_studentService';
import { useNavigate } from 'react-router-dom';
import '../Styling/Styling.css';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const ReportPage = () => {
  const navigate = useNavigate();
  const [report, setReport] = useState([]);
  const [filters, setFilters] = useState({ className: '', vaccineName: '', vaccinated: '' });
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;

  const username = localStorage.getItem('username');


  const fetchReport = async () => {
    const params = {
      page,
      size: pageSize
    };

    if (filters.className) params.className = filters.className;
    if (filters.vaccineName) params.vaccineName = filters.vaccineName;
    if (filters.vaccinated) params.vaccinated = filters.vaccinated === 'true';

    try {
      const res = await api_for_studentService.get('/students/report', { params });
      setReport(res.data.content);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error("Failed to fetch report", err);
    }
  };

  const exportExcel = async () => {
    const params = {
      page: 0,
      size: 10000,
    };

    if (filters.className) params.className = filters.className;
    if (filters.vaccineName) params.vaccineName = filters.vaccineName;
    if (filters.vaccinated) params.vaccinated = filters.vaccinated === 'true';

    try {
      const res = await api_for_studentService.get('/students/report', { params });
      const fullData = res.data.content;

      if (fullData.length === 0) {
        Swal.fire({
          icon: 'info',
          title: 'No Data Found',
          text: 'There are no records to export with the selected filters.',
        });
        return;
      }

      const excelData = fullData.map(s => ({
        Name: s.name,
        'Student ID': s.studentId,
        Class: s.className,
        Vaccine: s.vaccineName || '-',
        Date: s.vaccinationDate || '-',
        Vaccinated: s.vaccinated ? 'Yes' : 'No'
      }));

      const worksheet = XLSX.utils.json_to_sheet(excelData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');

      XLSX.writeFile(workbook, 'vaccination_report.xlsx');

      Swal.fire({
        icon: 'success',
        title: 'Export Successful',
        text: 'The report has been downloaded as an Excel file.',
      });

    } catch (err) {
      console.error("Failed to export Excel report", err);
      Swal.fire({
        icon: 'error',
        title: 'Export Failed',
        text: 'Something went wrong while exporting the Excel file.',
      });
    }
  };

  const exportPDF = async () => {
    const params = {
      page: 0,
      size: 10000,
    };

    if (filters.className) params.className = filters.className;
    if (filters.vaccineName) params.vaccineName = filters.vaccineName;
    if (filters.vaccinated) params.vaccinated = filters.vaccinated === 'true';

    try {
      const res = await api_for_studentService.get('/students/report', { params });
      const fullData = res.data.content;

      if (fullData.length === 0) {
        Swal.fire({
          icon: 'info',
          title: 'No Data Found',
          text: 'There are no records to export with the selected filters.',
        });
        return;
      }

      const doc = new jsPDF();

      doc.text('Vaccination Report', 14, 15);

      const tableColumn = ["Name", "Student ID", "Class", "Vaccine", "Date", "Vaccinated"];
      const tableRows = fullData.map(s => [
        s.name,
        s.studentId,
        s.className,
        s.vaccineName || '-',
        s.vaccinationDate || '-',
        s.vaccinated ? 'Yes' : 'No',
      ]);

      doc.autoTable({
        startY: 20,
        head: [tableColumn],
        body: tableRows,
        styles: { fontSize: 10 },
        headStyles: { fillColor: [41, 128, 185] },
      });

      doc.save('vaccination_report.pdf');

      Swal.fire({
        icon: 'success',
        title: 'Export Successful',
        text: 'The report has been downloaded as a PDF file.',
      });

    } catch (err) {
      console.error("Failed to export PDF report", err);
      Swal.fire({
        icon: 'error',
        title: 'Export Failed',
        text: 'Something went wrong while exporting the PDF.',
      });
    }
  };

  const exportCSV = async () => {
    const params = {
      page: 0,
      size: 10000,
    };

    if (filters.className) params.className = filters.className;
    if (filters.vaccineName) params.vaccineName = filters.vaccineName;
    if (filters.vaccinated) params.vaccinated = filters.vaccinated === 'true';

    try {
      const res = await api_for_studentService.get('/students/report', { params });
      const fullData = res.data.content;

      if (fullData.length === 0) {
        Swal.fire({
          icon: 'info',
          title: 'No Data Found',
          text: 'There are no records to export with the selected filters.',
        });
        return;
      }

      const csv = [
        ["Name", "Student ID", "Class", "Vaccine", "Date", "Vaccinated"],
        ...fullData.map(s => [
          s.name,
          s.studentId,
          s.className,
          s.vaccineName || '-',
          s.vaccinationDate || '-',
          s.vaccinated ? "Yes" : "No"
        ])
      ].map(row => row.join(",")).join("\n");

      const blob = new Blob([csv], { type: "text/csv" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "vaccination_report.csv";
      link.click();

      Swal.fire({
        icon: 'success',
        title: 'Export Successful',
        text: 'The vaccination report has been downloaded as a CSV file.',
      });

    } catch (err) {
      console.error("Failed to export full report", err);
      Swal.fire({
        icon: 'error',
        title: 'Export Failed',
        text: 'Something went wrong while exporting the report. Please try again.',
      });
    }
  };

  useEffect(() => {
    fetchReport();
  }, [page]);

  const handleFilter = () => {
    setPage(0);
    fetchReport();
  };

  return (
    <div style={{ padding: '2rem' }}>
      <div className="top-bar">
        <h2 className='title'>Vaccination Report</h2>
        <div className="right-items">
          <button className="dashboard-btn" onClick={() => navigate('/dashboard')}>
            Dashboard
          </button>
          <div className="username-display">👤 {username}</div>
        </div>
      </div>

      <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem' }}>
        <input
          placeholder="Class"
          value={filters.className}
          onChange={e => setFilters({ ...filters, className: e.target.value })}
        />
        <input
          placeholder="Vaccine"
          value={filters.vaccineName}
          onChange={e => setFilters({ ...filters, vaccineName: e.target.value })}
        />
        <select
          value={filters.vaccinated}
          onChange={e => setFilters({ ...filters, vaccinated: e.target.value })}
        >
          <option value="">All</option>
          <option value="true">Vaccinated</option>
          <option value="false">Not Vaccinated</option>
        </select>
        <button onClick={handleFilter}>Apply Filters</button>
        <button onClick={exportCSV}>Export CSV</button>
        <button onClick={exportExcel}>Export Excel</button>
        <button onClick={exportPDF}>Export PDF</button>
      </div>

      <table border="1" cellPadding="8" width="100%">
        <thead>
          <tr>
            <th>Name</th>
            <th>Student ID</th>
            <th>Class</th>
            <th>Vaccine</th>
            <th>Vaccination Date</th>
            <th>Vaccinated</th>
          </tr>
        </thead>
        <tbody>
          {report.map((student, idx) => (
            <tr key={idx}>
              <td>{student.name}</td>
              <td>{student.studentId}</td>
              <td>{student.className}</td>
              <td>{student.vaccineName || '-'}</td>
              <td>{student.vaccinationDate || '-'}</td>
              <td>{student.vaccinated ? 'Yes' : 'No'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {filters.className === '' && filters.vaccineName === '' && filters.vaccinated === '' && (
  <div className="pagination">
    <button onClick={() => setPage((prev) => Math.max(0, prev - 1))} disabled={page === 0}>
      Previous
    </button>
    <span>Page {page + 1} of {totalPages}</span>
    <button onClick={() => setPage((prev) => (prev + 1 < totalPages ? prev + 1 : prev))} disabled={page + 1 >= totalPages}>
      Next
    </button>
  </div>
)}
    </div>
  );
};

export default ReportPage;