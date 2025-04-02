import { Toaster } from "react-hot-toast";
import { FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/");
  };

  return (
    <div className="flex justify-end mb-4">
      <button className="flex mr-4 cursor-pointer" onClick={handleLogout}>
        {" "}
        Logout <FaSignOutAlt className="ml-2 size-5" />
      </button>
      <Toaster />
    </div>
  );
};

export default Logout;
