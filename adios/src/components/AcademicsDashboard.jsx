import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RoleContext } from "../context/roleContext";
import { UsernameContext } from "../context/UsernameContext";
import { VscAccount } from "react-icons/vsc";
import { format, parseISO } from "date-fns";
import { SlOptions } from "react-icons/sl";
import { SiGoogleforms } from "react-icons/si";
import { showErrorToast, showSuccessToast } from "../utils/toastConfig";
import { AcademicsDetails } from "../API/details";
import { AcademicsApproval } from "../API/approvals";
import NavBar from "./NavBar";

const AcademicsDashboard = () => {
  const { role } = useContext(RoleContext);
  const { username } = useContext(UsernameContext);
  const navigate = useNavigate();

  const [leaves, setLeaves] = useState([]);

  const handleViewDetails = (leave) => {
    // Redirect to the LeaveDetails component with leave_id and roll_number
    navigate(
      `/leave_details?leave_id=${leave.leave_id}&roll_number=${leave.roll_number}`
    );
  };

  useEffect(() => {
    if (!username) return;

    const getDetails = async () => {
      try {
        const { success, leaves } = await AcademicsDetails();
        console.log("leaves", leaves);
        if (success) {
          if (leaves.length > 0) {
            setLeaves(leaves);
          } else {
            showSuccessToast("No pending Leave requests.");
          }
        } else {
          showErrorToast("Error fetching leaves.");
        }
      } catch (error) {
        console.error("Error fetching student details:", error);
        showErrorToast("Error fetching student details.");
      }
    };

    getDetails();
  }, [username]);

  useEffect(() => {
    if (!role) {
      navigate("/");
    }
  }, [role, navigate]);

  const handleCancelLeave = (leaveId) => {
    setLeaves((prevLeaves) =>
      prevLeaves.filter((leave) => leave.leave_id !== leaveId)
    );
  };

  const formatDate = (dateString) => {
    const date = parseISO(dateString);
    return dateString.includes("T")
      ? format(date, "MMM d, yyyy, hh:mm a")
      : format(date, "MMM d, yyyy");
  };

  const handleApproveLeave = async (leaveId) => {
    try {
      console.log("deleting leave", leaveId);
      const response = await AcademicsApproval(leaveId);
      if (response.success) {
        handleCancelLeave(leaveId);
        showSuccessToast("Leave approved successfully");
      } else {
        throw new Error("Delete failed");
      }
    } catch (error) {
      console.error("Error deleting leave:", error);
      showErrorToast("Error deleting leave");
    }
  };

  const LeaveDetailsTable = ({ leaves }) => {
    const [openMenuIndex, setOpenMenuIndex] = useState(null);

    const toggleMenu = (index) => {
      setOpenMenuIndex(openMenuIndex === index ? null : index);
    };

    return (
      <div className="w-full mt-8 mx-auto bg-white shadow-md rounded-lg">
        <div className="grid grid-cols-6 gap-4 bg-gray-100 p-4 font-semibold">
          <div className="text-center">Roll No.</div>
          <div className="text-center">From Date</div>
          <div className="text-center">To Date</div>
          <div className="text-center">Status</div>
          <div className="text-center">Details</div>
          <div className="text-center">Action</div>
        </div>
        {leaves.length > 0 ? (
          leaves.map((leave, index) => (
            <div
              key={leave.id}
              className="grid grid-cols-6 gap-4 p-4 border-b border-gray-200 hover:bg-gray-50 relative"
            >
              <div className="text-center">{leave.roll_number}</div>
              <div className="text-center">{formatDate(leave.start)}</div>
              <div className="text-center">{formatDate(leave.end)}</div>
              <div className="text-center">{leave.status}</div>
              <div className="flex justify-center ">
                <SiGoogleforms
                  className="cursor-pointer"
                  onClick={() => handleViewDetails(leave)}
                />
              </div>
              <div className="flex justify-center">
                <SlOptions
                  className="w-5 h-5 cursor-pointer"
                  onClick={() => toggleMenu(index)}
                />
                {openMenuIndex === index && (
                  <div className="absolute right-0 mt-8 w-48 bg-white rounded-md shadow-xl z-50">
                    <button
                      className="w-full text-center py-2  bg-white"
                      onClick={() => handleApproveLeave(leave.leave_id)}
                    >
                      Approve Leave
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center p-4 text-gray-500">
            No leave records found.
          </div>
        )}
      </div>
    );
  };

  const UserInfo = () => (
    <div className="p-4 rounded-lg flex justify-between items-center mt-8">
      <div className="border-2 p-4 rounded-lg flex items-center gap-4">
        <div className="flex items-center justify-center h-12 w-12 bg-gray-200 rounded-full shadow-lg">
          <VscAccount className="h-10 w-10 text-blue-500" />
        </div>
        <div className="flex flex-col text-left">
          <p className="text-xl font-semibold">{username}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="text-black flex flex-col min-h-screen">
      <NavBar />
      <UserInfo />
      <LeaveDetailsTable leaves={leaves} />
    </div>
  );
};

export default AcademicsDashboard;
