import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RoleContext } from "../context/roleContext";
import { UsernameContext } from "../context/UsernameContext";
import { StudentDetails, DeleteLeaveStudent } from "../API/details";
import { VscAccount } from "react-icons/vsc";
import { format, parseISO, set } from "date-fns";
import { SlOptions } from "react-icons/sl";
import { SiGoogleforms } from "react-icons/si";
import { showErrorToast, showSuccessToast } from "../utils/toastConfig";
import { LuRefreshCcw } from "react-icons/lu";
import NavBar from "./NavBar";
import { HashLoader } from "react-spinners";

const StudentDashboard = () => {
  const { role } = useContext(RoleContext);
  const { username } = useContext(UsernameContext);
  const navigate = useNavigate();

  const [userDetails, setUserDetails] = useState(null);
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true); // State for loader

  useEffect(() => {
    if (!username) return; // Prevent API call if username is not set

    const getDetails = async () => {
      try {
        setLoading(true); // Show loader while fetching data
        const { userDetails, leaves } = await StudentDetails(username);
        if (userDetails && leaves) {
          setUserDetails(userDetails);
          setLeaves(leaves);
        } else {
          showErrorToast("Failed to load student details.");
        }
      } catch (error) {
        console.error("Error fetching student details:", error);
        showErrorToast("Error fetching student details.");
      } finally {
        setLoading(false); // Hide loader after data is fetched
      }
    };

    getDetails();
  }, [username]);

  useEffect(() => {
    if (!role) {
      navigate("/");
    }
  }, [role, navigate]);

  const handleViewDetails = (leave) => {
    navigate(
      `/leave_details?leave_id=${leave.leave_id}&roll_number=${leave.roll_number}`
    );
  };

  const getDetails = async () => {
    try {
      setLoading(true);
      const { userDetails, leaves } = await StudentDetails(username);
      if (userDetails && leaves) {
        setUserDetails(userDetails);
        setLeaves(leaves);
      } else {
        showErrorToast("Failed to load student details.");
      }
    } catch (error) {
      console.error("Error fetching student details:", error);
      showErrorToast("Error fetching student details.");
    } finally {
      setLoading(false);
    }
  };

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

  const handleDeleteLeave = async (leaveId) => {
    try {
      console.log("deleting leave", leaveId);
      setLoading(true);
      const response = await DeleteLeaveStudent(leaveId);
      if (response.success) {
        handleCancelLeave(leaveId);
        showSuccessToast("Leave deleted successfully");
      } else {
        throw new Error("Delete failed");
      }
    } catch (error) {
      console.error("Error deleting leave:", error);
      showErrorToast("Error deleting leave");
    } finally {
      setLoading(false);
    }
  };

  const handleNewRequestClick = () => {
    navigate("/create_leave");
  };

  const LeaveDetailsTable = ({ leaves }) => {
    const [openMenuIndex, setOpenMenuIndex] = useState(null);

    const toggleMenu = (index) => {
      setOpenMenuIndex(openMenuIndex === index ? null : index);
    };

    return (
      <div className="w-full mt-8 mx-auto bg-white rounded-lg">
        <button
          className="bg-black text-white p-2 flex items-center gap-2"
          onClick={getDetails}
        >
          Refresh <LuRefreshCcw />
        </button>
        <div className="mt-4 shadow-md rounded-lg">
          <div className="grid grid-cols-6 gap-4 bg-gray-100 p-4 font-semibold">
            <div className="text-center">Date</div>
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
                <div className="text-center">
                  {formatDate(leave.created_date)}
                </div>
                <div className="text-center">{formatDate(leave.start)}</div>
                <div className="text-center">{formatDate(leave.end)}</div>
                <div className="text-center">{leave.status}</div>
                <div className="flex justify-center">
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
                        className="w-full px-4 py-2 text-left bg-white"
                        onClick={() => handleDeleteLeave(leave.leave_id)}
                      >
                        Delete Leave
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
          <p className="text-xl font-semibold">
            {(role === "Student" || role === "Parents") && userDetails
              ? userDetails.name
              : username}
          </p>
          {(role === "Student" || role === "Parents") && <p>{username}</p>}
        </div>
      </div>
      {role === "Student" && (
        <button
          className="p-2 bg-blue-700 hover:bg-blue-900 text-white rounded-md"
          onClick={handleNewRequestClick}
        >
          New Request
        </button>
      )}
    </div>
  );

  return (
    <div className="text-black flex flex-col min-h-screen">
      <NavBar />
      {loading ? (
        <div className="flex justify-center items-center min-h-screen">
          <HashLoader size={80} color="#3B82F6" />
        </div>
      ) : (
        <>
          <UserInfo />
          <LeaveDetailsTable leaves={leaves} />
        </>
      )}
    </div>
  );
};

export default StudentDashboard;
