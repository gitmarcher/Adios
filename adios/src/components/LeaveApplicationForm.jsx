import React, { useState } from 'react';
import BackButton from './BackButton';

const LeaveApplicationForm = () => {
  const [formData, setFormData] = useState({
    purpose: '',
    placeOfVisit: '',
    address: '',
    startDate: '',
    endDate: '',
    workingDays: '',
    timeIn: '',
    timeOut: '',
    undertaking: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Here you would typically send the data to a server
  };

  return (
    <div className="leave-application-form">
      <h2>Leave Application Form</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="purpose">Purpose of Visit:</label>
          <textarea id="purpose" name="purpose" value={formData.purpose} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="placeOfVisit">Place of Visit:</label>
          <input type="text" id="placeOfVisit" name="placeOfVisit" value={formData.placeOfVisit} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="address">Address During Leave Period:</label>
          <textarea id="address" name="address" value={formData.address} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="startDate">Start Date:</label>
          <input type="date" id="startDate" name="startDate" value={formData.startDate} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="endDate">End Date:</label>
          <input type="date" id="endDate" name="endDate" value={formData.endDate} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="workingDays">Number of Working Days During Leave Period:</label>
          <input type="number" id="workingDays" name="workingDays" value={formData.workingDays} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="timeIn">Time In:</label>
          <input type="time" id="timeIn" name="timeIn" value={formData.timeIn} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="timeOut">Time Out:</label>
          <input type="time" id="timeOut" name="timeOut" value={formData.timeOut} onChange={handleChange} required />
        </div>
        <div className="form-group checkbox">
          <input type="checkbox" id="undertaking" name="undertaking" checked={formData.undertaking} onChange={handleChange} required />
          <label htmlFor="undertaking">I understand that the institute won't be responsible for anything that happens to me after I leave campus.</label>
        </div>
        <button type="submit">Submit Application</button>
      </form>
      <BackButton />
    </div>
  );
};

export default LeaveApplicationForm;