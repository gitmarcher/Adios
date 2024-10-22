import React, { useState, useContext, useEffect } from "react";
import DateTime from "react-datetime";
import { UsernameContext } from "../context/UsernameContext";
import { RoleContext } from "../context/roleContext";
import { useNavigate } from "react-router-dom";
import { createLeave } from "../API/crateLeave";
import { showErrorToast, showSuccessToast } from "../utils/toastConfig";
import { HashLoader } from "react-spinners"; // Import the HashLoader
import "react-datetime/css/react-datetime.css";

const LeaveForm = () => {
  const { username } = useContext(UsernameContext);
  const { role } = useContext(RoleContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!role) {
      navigate("/");
    }
  }, [role, navigate]);

  const [formData, setFormData] = useState({
    purpose: "",
    address: "",
    days: "",
    startDate: null,
    endDate: null
  });

  const [loading, setLoading] = useState(false); // State for loading

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value
    }));
  };

  const handleDateChange = (id, date) => {
    setFormData((prevData) => ({
      ...prevData,
      [id]: date
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true); // Start loading

    const startDate = formData.startDate
      ? formData.startDate.toISOString()
      : null;
    const endDate = formData.endDate ? formData.endDate.toISOString() : null;
    const days = parseInt(formData.days);

    if (
      !formData.purpose ||
      !formData.address ||
      !formData.days ||
      !formData.startDate ||
      !formData.endDate
    ) {
      showErrorToast("All fields are required.");
      setLoading(false); // Stop loading
      return;
    }

    // Check if days is zero
    if (days === 0) {
      showErrorToast("Number of days cannot be zero.");
      setLoading(false); // Stop loading
      return;
    }

    if (days < 0) {
      showErrorToast("Number of days cannot be negative.");
      setLoading(false); // Stop loading
      return;
    }

    if (!startDate || !endDate) {
      showErrorToast("Invalid date selection.");
      setLoading(false); // Stop loading
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Check if start date is in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day for accurate comparison
    start.setHours(0, 0, 0, 0); // Reset time to start of day for accurate comparison

    if (start < today) {
      showErrorToast("Start date cannot be in the past.");
      setLoading(false); // Stop loading
      return;
    }

    const differenceInTime = end - start;
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);

    if (differenceInDays < 0) {
      showErrorToast("Start date cannot be greater than end date.");
      setLoading(false); // Stop loading
      return;
    }

    if (days !== differenceInDays) {
      showErrorToast(
        `The number of days should match the selected dates (${differenceInDays}).`
      );
      setLoading(false); // Stop loading
      return;
    }

    const dataToSubmit = {
      ...formData,
      startDate,
      endDate,
      days,
      username: username
    };

    try {
      console.log("Submitting leave request:", dataToSubmit);
      const response = await createLeave(dataToSubmit);
      if (response.success) {
        showSuccessToast("Leave request submitted successfully.");
        navigate("/student_dashboard");
      } else {
        showErrorToast("Submission failed. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting leave request:", error);
      showErrorToast("Error submitting leave request.");
    } finally {
      setLoading(false); // Stop loading regardless of success or failure
    }
  };

  return (
    <form
      className="max-w-lg mx-auto mt-[4rem] p-6 bg-gray-50 rounded-lg shadow-md space-y-6 text-left text-gray-800"
      onSubmit={handleSubmit}
    >
      <div>
        <h2 className="text-2xl font-semibold text-center">Leave Details</h2>
      </div>
      <div className="flex flex-col">
        <label htmlFor="purpose" className="mb-2 font-semibold">
          Purpose of Leave:
        </label>
        <input
          type="text"
          id="purpose"
          placeholder="Enter the reason for leave"
          value={formData.purpose}
          onChange={handleChange}
          className="p-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="address" className="mb-2 font-semibold">
          Contact Address During Leave Period:
        </label>
        <input
          type="text"
          id="address"
          placeholder="Enter your contact address"
          value={formData.address}
          onChange={handleChange}
          className="p-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="days" className="mb-2 font-semibold">
          Number of Leave Days:
        </label>
        <input
          type="number"
          id="days"
          placeholder="Enter the total days"
          value={formData.days}
          onChange={handleChange}
          className="p-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="startDate" className="mb-2 font-semibold">
          Start Date and Time:
        </label>
        <DateTime
          id="startDate"
          dateFormat="YYYY-MM-DD"
          timeFormat="HH:mm"
          closeOnSelect
          value={formData.startDate}
          onChange={(date) => handleDateChange("startDate", date)}
          className="border border-gray-300 rounded-md p-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="endDate" className="mb-2 font-semibold">
          End Date and Time:
        </label>
        <DateTime
          id="endDate"
          dateFormat="YYYY-MM-DD"
          timeFormat="HH:mm"
          closeOnSelect
          value={formData.endDate}
          onChange={(date) => handleDateChange("endDate", date)}
          className="border border-gray-300 rounded-md p-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        type="submit"
        className="w-full mt-4 p-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition-colors"
        disabled={loading} // Disable button when loading
      >
        {loading ? (
          <div className="flex justify-center">
            <HashLoader color="#3B82F6" loading={loading} size={20} />{" "}
            {/* Loading Spinner */}
          </div>
        ) : (
          "Submit Leave Request"
        )}
      </button>
    </form>
  );
};

export default LeaveForm;
