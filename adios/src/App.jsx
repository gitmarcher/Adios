import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Login from "./components/Login";
import ParentDashboard from "./components/ParentDashboard";
import StudentDashboard from "./components/StudentDashboard";
import FacultyDashboard from "./components/FacultyDashboard";
import WardenDashboard from "./components/WardenDashboard";
import AcademicsDashboard from "./components/AcademicsDashboard";
import { RoleContext } from "./context/roleContext";
import { UsernameContext } from "./context/UsernameContext";
import { useState } from "react";
import LeaveForm from "./components/LeaveForm";
import LeaveDetails from "./components/LeaveDetails";

function App() {
  const [role, setRole] = useState("");
  const [username, setUsername] = useState("");

  return (
    <RoleContext.Provider value={{ role, setRole }}>
      <UsernameContext.Provider value={{ username, setUsername }}>
        <Router>
          <ToastContainer />
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/parent_dashboard" element={<ParentDashboard />} />
            <Route path="/student_dashboard" element={<StudentDashboard />} />
            <Route path="/faculty_dashboard" element={<FacultyDashboard />} />
            <Route path="/warden_dashboard" element={<WardenDashboard />} />
            <Route
              path="/academics_dashboard"
              element={<AcademicsDashboard />}
            />
            <Route path="/create_leave" element={<LeaveForm />} />
            <Route path="/leave_details" element={<LeaveDetails />} />
          </Routes>
        </Router>
      </UsernameContext.Provider>
    </RoleContext.Provider>
  );
}

export default App;
