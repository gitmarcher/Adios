import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
const NavBar = () => {
  const navigate = useNavigate();
  const handleLogoutClick = () => {
    navigate("/");
  };
  return (
    <nav className="flex justify-between items-center p-4">
      <div className="h-20 w-20">
        <img src={logo} alt="logo" />
      </div>
      <button
        className="bg-red-600 text-white rounded-lg p-2"
        onClick={handleLogoutClick}
      >
        LOGOUT
      </button>
    </nav>
  );
};

export default NavBar;
