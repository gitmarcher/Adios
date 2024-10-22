import React, { useState, useContext, useEffect } from "react";
import { RoleContext } from "../context/roleContext";
import { UsernameContext } from "../context/UsernameContext";
import { useNavigate } from "react-router-dom";
import { showSuccessToast, showErrorToast } from "../utils/toastConfig";
import "react-toastify/dist/ReactToastify.css";
import login from "../API/auth";
import { HashLoader } from "react-spinners"; // Import HashLoader

const FloatingLabelInput = ({ id, type, label, value, onChange }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);

  const handleFocus = () => setIsFocused(true);

  const handleBlur = (e) => {
    setIsFocused(false);
    setHasValue(e.target.value !== "");
  };

  return (
    <div className="relative mb-8">
      <input
        type={type}
        id={id}
        value={value}
        className="peer w-full h-10 px-3 py-2 border bg-white border-gray-300 rounded-md text-gray-900 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        placeholder={label}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={onChange}
      />
      <label
        htmlFor={id}
        className={`absolute left-3 transition-all duration-300 ${
          isFocused || hasValue
            ? "-top-6 text-sm text-blue-500"
            : "top-2 text-base text-gray-400"
        }`}
      >
        {label}
      </label>
    </div>
  );
};

const Login = () => {
  const [selected, setSelected] = useState("Student");
  const navigate = useNavigate();
  const { setRole } = useContext(RoleContext);
  const { setUsername } = useContext(UsernameContext);

  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });

  const [loading, setLoading] = useState(false); // State for loading

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading
    try {
      const data = await login(formData.username, formData.password, selected);
      console.log("Login successful:", data);
      if (data.login) {
        // Store credentials in localStorage
        localStorage.setItem("username", formData.username);
        localStorage.setItem("role", selected);

        setRole(selected);
        setUsername(formData.username);
        if (selected === "Student") {
          navigate("/student_dashboard");
        } else if (selected === "Parents") {
          navigate("/parent_dashboard");
        } else if (selected === "Faculty") {
          navigate("/faculty_dashboard");
        } else if (selected === "Warden") {
          navigate("/warden_dashboard");
        } else if (selected === "Academics") {
          navigate("/academics_dashboard");
        }
      } else {
        console.error("Login error:", data.error);
        showErrorToast("Invalid credentials!");
      }
    } catch (error) {
      showErrorToast("Invalid credentials");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const roles = ["Student", "Parents", "Faculty", "Warden", "Academics"];

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="border-2 p-6 rounded-lg shadow-lg bg-white">
        <div className="flex gap-8 justify-between mb-4">
          {roles.map((role) => (
            <p
              key={role}
              className={`cursor-pointer transition-all duration-300 ease-in-out
              ${
                selected === role
                  ? "text-blue-500 scale-110 font-semibold"
                  : "text-gray-600 hover:text-blue-400"
              }`}
              onClick={() => setSelected(role)}
            >
              {role}
            </p>
          ))}
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mt-8">
            <FloatingLabelInput
              id="username"
              type="text"
              label="Username"
              value={formData.username}
              onChange={handleInputChange}
            />
            <FloatingLabelInput
              id="password"
              type="password"
              label="Password"
              value={formData.password}
              onChange={handleInputChange}
            />
          </div>
          <div className="mt-6">
            {loading ? ( // Display loader when loading
              <div className="flex justify-center">
                <HashLoader color={"#3B82F6"} loading={loading} size={50} />
              </div>
            ) : (
              <button className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
                Login as {selected}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
