import React, { useState, useContext, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { UsernameContext } from "../context/UsernameContext";
import { RoleContext } from "../context/RoleContext";
import { useNavigate } from "react-router-dom";
import { getLeaveDetails } from "../API/leaveDetails";
import { format, parseISO } from "date-fns";
import HashLoader from "react-spinners/HashLoader";
import { SyncLoader } from "react-spinners";

const LeaveDetails = () => {
  const { username } = useContext(UsernameContext);
  const { role } = useContext(RoleContext);
  const navigate = useNavigate();
  const location = useLocation();
  const queryParam = new URLSearchParams(location.search);
  const leave_id = queryParam.get("leave_id");
  const roll_number = queryParam.get("roll_number");

  const [leaveDetail, setLeaveDetail] = useState(null);
  const [studentDetail, setStudentDetail] = useState(null);
  const [parentDetail, setParentDetail] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state
  const [imageLoading, setImageLoading] = useState(true); // Loading state for images

  const formatDate = (dateString) => {
    const date = parseISO(dateString);
    return dateString.includes("T")
      ? format(date, "MMM d, yyyy, hh:mm a")
      : format(date, "MMM d, yyyy");
  };

  useEffect(() => {
    const fetchLeaveDetails = async () => {
      if (!role) {
        navigate("/");
      } else {
        try {
          console.log("leave_id", leave_id);
          console.log("roll_number", roll_number);
          const response = await getLeaveDetails({ leave_id, roll_number });
          console.log("response", response);
          setLeaveDetail(response.leaveDetail);
          setStudentDetail(response.studentDetail);
          setParentDetail(response.parentDetail);
        } catch (error) {
          console.error("Error fetching leave details:", error);
        } finally {
          setLoading(false); // Set loading to false when done
        }
      }
    };

    fetchLeaveDetails();
  }, [role, leave_id, roll_number, navigate]);

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white rounded-xl shadow-lg border border-gray-100 my-8">
      <h2 className="text-3xl font-bold text-blue-500 mb-8">Leave Details</h2>

      {loading ? ( // Show loader while loading
        <div className="flex justify-center items-center h-64">
          <HashLoader color={"#3B82F6"} loading={loading} size={60} />
        </div>
      ) : leaveDetail && studentDetail && parentDetail ? (
        <div className="space-y-8">
          {/* Student Details */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-blue-500 mb-4">
              Student Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex gap-2">
                <p className="font-semibold text-gray-700">Roll Number:</p>
                <p className="text-gray-600">{studentDetail.roll_number}</p>
              </div>
              <div className="flex gap-2">
                <p className="font-semibold text-gray-700">Name:</p>
                <p className="text-gray-600">{studentDetail.name}</p>
              </div>
              <div className="flex gap-2">
                <p className="font-semibold text-gray-700">Email:</p>
                <p className="text-gray-600">{studentDetail.email}</p>
              </div>
              <div className="flex gap-2">
                <p className="font-semibold text-gray-700">Phone:</p>
                <p className="text-gray-600">{studentDetail.phone}</p>
              </div>
              <div className="flex gap-2">
                <p className="font-semibold text-gray-700">Hostel:</p>
                <p className="text-gray-600">{studentDetail.hostel}</p>
              </div>
              <div className="flex gap-2">
                <p className="font-semibold text-gray-700">Address:</p>
                <p className="text-gray-600">{studentDetail.address}</p>
              </div>
            </div>
          </div>

          {/* Parent Details */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-blue-500 mb-4">
              Parent Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex gap-2">
                <p className="font-semibold text-gray-700">Name:</p>
                <p className="text-gray-600">{parentDetail.name}</p>
              </div>
              <div className="flex gap-2">
                <p className="font-semibold text-gray-700">Phone:</p>
                <p className="text-gray-600">{parentDetail.phone}</p>
              </div>
              <div className="flex gap-2">
                <p className="font-semibold text-gray-700">Email:</p>
                <p className="text-gray-600">{parentDetail.email}</p>
              </div>
            </div>
          </div>

          {/* Leave Details */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-blue-500 mb-4">
              Leave Details
            </h3>
            <div className="space-y-4">
              <div className="flex gap-2">
                <p className="font-semibold text-gray-700">Purpose:</p>
                <p className="text-gray-600">{leaveDetail.purpose}</p>
              </div>
              <div className="flex gap-2">
                <p className="font-semibold text-gray-700">Number of days:</p>
                <p className="text-gray-600">{leaveDetail.days}</p>
              </div>
              <div className="flex gap-2">
                <p className="font-semibold text-gray-700">From:</p>
                <p className="text-gray-600">{formatDate(leaveDetail.start)}</p>
              </div>
              <div className="flex gap-2">
                <p className="font-semibold text-gray-700">To:</p>
                <p className="text-gray-600">{formatDate(leaveDetail.end)}</p>
              </div>
              <div className="flex gap-2">
                <p className="font-semibold text-gray-700">Address:</p>
                <p className="text-gray-600">{leaveDetail.address}</p>
              </div>

              {leaveDetail.parent_consent !== "pending" && (
                <div className="mt-6">
                  <p className="font-semibold text-gray-700 mb-2">
                    Parent Consent:
                  </p>
                  <div className="flex justify-center h-64">
                    {/* {imageLoading ? (
                      <SyncLoader
                        color={"#3B82F6"}
                        loading={imageLoading}
                        className="flex justify-center items-center"
                      />
                    ) : ( */}
                    <img
                      src={leaveDetail.parent_consent}
                      alt="Parent Consent"
                      className="h-64"
                      onLoad={() => setImageLoading(false)}
                    />
                    {/* )} */}
                  </div>
                </div>
              )}

              {leaveDetail.faculty_approval !== "pending" && (
                <div className="flex gap-2">
                  <p className="font-semibold text-gray-700">
                    Faculty Advisor:
                  </p>
                  <p className="text-gray-600">
                    <span className="text-xs">Approved by</span>{" "}
                    <span className="font-bold italic">
                      {leaveDetail.faculty_approval}
                    </span>
                  </p>
                </div>
              )}

              {leaveDetail.warden_approval !== "pending" && (
                <div className="flex gap-2">
                  <p className="font-semibold text-gray-700">Warden:</p>
                  <p className="text-gray-600">
                    <span className="text-xs">Approved by</span>{" "}
                    <span className="font-bold italic">
                      {leaveDetail.warden_approval}
                    </span>
                  </p>
                </div>
              )}

              {leaveDetail.academics_approval !== "pending" && (
                <div className="flex gap-2">
                  <p className="font-semibold text-gray-700">Academics:</p>
                  <p className="text-gray-600">
                    {leaveDetail.academics_approval}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default LeaveDetails;
