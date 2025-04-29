import { Toaster } from "react-hot-toast";
import { FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import instance from "../../axios/axios";
import { toast } from "react-toastify";

const Logout = () => {
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await instance.post<{ accessToken: string }>("auth/logout");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("role");
      navigate("/home");
      toast("Logged out Successfully. Refresh the page once.");
    } catch (error) {
      console.log("Logout Failed", error);
    }
  };

  return (
    <div className="flex justify-end mb-4">
      <button
        className=" rounded flex mr-4 cursor-pointer"
        onClick={handleLogout}
      >
        Logout <FaSignOutAlt className="ml-2 size-5" />
      </button>
      <Toaster />
    </div>
  );
};

export default Logout;
