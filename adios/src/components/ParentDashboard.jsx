import { useContext, useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { RoleContext } from "../context/roleContext";
import { UsernameContext } from "../context/UsernameContext";
import { VscAccount } from "react-icons/vsc";
import { format, parseISO } from "date-fns";
import { SlOptions } from "react-icons/sl";
import { SiGoogleforms } from "react-icons/si";
import NavBar from "./NavBar";
import Webcam from "react-webcam";
import { showErrorToast, showSuccessToast } from "../utils/toastConfig";
import { ParentDetails } from "../API/details";
import ParentApproval from "../API/approvals";

const ParentDashboard = () => {
  const { role } = useContext(RoleContext);
  const { username } = useContext(UsernameContext);
  const navigate = useNavigate();

  const [userDetails, setUserDetails] = useState(null);
  const [leaves, setLeaves] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [capturedPhotoURL, setCapturedPhotoURL] = useState(null);
  const [disclaimerChecked, setDisclaimerChecked] = useState(false);
  const [leaveId, setLeaveId] = useState(null);

  useEffect(() => {
    const getDetails = async () => {
      const { userDetails, leaves } = await ParentDetails(username);
      console.log(userDetails);
      setUserDetails(userDetails);
      setLeaves(leaves);
    };

    getDetails();
  }, [username]);

  useEffect(() => {
    if (role === "") {
      navigate("/");
    }
  }, [role, navigate]);

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
        <button className="p-2 bg-blue-700 hover:bg-blue-900 text-white rounded-md">
          New Request
        </button>
      )}
    </div>
  );

  const handleViewDetails = (leave) => {
    // Redirect to the LeaveDetails component with leave_id and roll_number
    navigate(
      `/leave_details?leave_id=${leave.leave_id}&roll_number=${leave.roll_number}`
    );
  };

  const formatDate = (dateString) => {
    let date;
    if (dateString.includes("T")) {
      date = parseISO(dateString);
      return format(date, "MMM d, yyyy, hh:mm a");
    } else {
      date = parseISO(dateString, "yyyy-MM-dd", new Date());
    }
    return format(date, "MMM d, yyyy");
  };

  const handleCancelLeave = (leaveId) => {
    setLeaves((prevLeaves) =>
      prevLeaves.filter((leave) => leave.leave_id !== leaveId)
    );
  };

  const handleAcceptLeave = async () => {
    if (!disclaimerChecked) {
      showErrorToast("Please agree to the disclaimer before proceeding.");
      return;
    }
    if (!capturedPhoto) {
      showErrorToast("Please capture an Image to proceed");
      return;
    }
    const formData = new FormData();
    formData.append("parent_image", capturedPhoto);
    formData.append("roll_number", username);
    formData.append("leave_id", leaveId);
    const response = await ParentApproval(formData);
    if (response.success) {
      showSuccessToast("Leave accepted successfully");
      handleCancelLeave(leaveId);
    } else {
      showErrorToast("Error accepting leave");
    }
    console.log("Leave accepted with photo:", capturedPhoto);
    setIsModalOpen(false);
  };

  const handleCapturePhoto = useCallback((getScreenshot) => {
    const screenshot = getScreenshot();
    const blob = dataURLtoBlob(screenshot);
    const file = new File([blob], "parent_image.jpg", { type: "image/jpeg" });
    setCapturedPhoto(file);
    setCapturedPhotoURL(screenshot);
  }, []);

  const dataURLtoBlob = (dataURL) => {
    const byteString = atob(dataURL.split(",")[1]);
    const mimeString = dataURL.split(",")[0].match(/:(.*?);/)[1];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  };

  const LeaveDetailsTable = ({ leaves }) => {
    const [openMenuIndex, setOpenMenuIndex] = useState(null);

    const toggleMenu = (index) => {
      setOpenMenuIndex(openMenuIndex === index ? null : index);
    };

    const openModal = (leaveId) => {
      setIsModalOpen(true);
      setCapturedPhoto(null);
      setCapturedPhotoURL(null);
      setDisclaimerChecked(false);
      setLeaveId(leaveId);
    };

    return (
      <div className="w-full mt-8 mx-auto bg-white shadow-md rounded-lg">
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
              key={index}
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
                {openMenuIndex === index && role === "Parents" && (
                  <div className="absolute right-0 mt-8 w-48 bg-white rounded-md shadow-xl z-50">
                    <button
                      className="w-full px-4 py-2 text-left bg-white"
                      onClick={() => openModal(leave.leave_id)}
                    >
                      Accept Leave
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

  return (
    <div className="text-black flex flex-col min-h-screen">
      <NavBar />
      <UserInfo />
      <LeaveDetailsTable leaves={leaves} />

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md">
            {!capturedPhotoURL ? (
              <Webcam
                audio={false}
                screenshotFormat="image/jpeg"
                width={500}
                height={375}
                onUserMediaError={() => showErrorToast("Webcam not accessible")}
                onUserMedia={() => console.log("Webcam activated")}
                className="mx-auto mt-4 rounded-md shadow-lg"
              >
                {({ getScreenshot }) => (
                  <div className="flex flex-col items-center">
                    <button
                      className="mt-4 p-2 bg-blue-500 text-white rounded-md"
                      onClick={() => handleCapturePhoto(getScreenshot)}
                    >
                      Capture Photo
                    </button>
                  </div>
                )}
              </Webcam>
            ) : (
              <div className="flex flex-col items-center">
                <img
                  src={capturedPhotoURL}
                  alt="Captured"
                  className="w-96 h-72 object-cover rounded-lg shadow-lg"
                />
                <button
                  className="mt-4 p-2 bg-yellow-500 text-white rounded-md"
                  onClick={() => {
                    setCapturedPhoto(null);
                    setCapturedPhotoURL(null);
                  }}
                >
                  Retake Photo
                </button>
              </div>
            )}

            <div className="mt-4 flex items-center">
              <input
                type="checkbox"
                id="disclaimer"
                checked={disclaimerChecked}
                onChange={(e) => setDisclaimerChecked(e.target.checked)}
              />
              <label htmlFor="disclaimer" className="ml-2">
                I acknowledge that my ward will be under my full responsibility
                during the leave period, and the college will not be held
                accountable for any incidents or occurrences involving my ward
                during this time.
              </label>
            </div>

            <button
              className="mt-4 p-2 bg-green-500 text-white rounded-md"
              onClick={handleAcceptLeave}
            >
              Accept Leave
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParentDashboard;
