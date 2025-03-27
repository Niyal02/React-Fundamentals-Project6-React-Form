import { JSX, useState } from "react";
import Logout from "../logout/Logout";
import { FaBars, FaTimes } from "react-icons/fa";
import { FiHome } from "react-icons/fi";
import { MdOutlineCategory } from "react-icons/md";
import { GoBriefcase } from "react-icons/go";
import { GrMoney } from "react-icons/gr";
import { GoHistory } from "react-icons/go";

const Dashboard = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className=" flex">
      <div
        className={`bg-gray-700 h-screen p-4 flex flex-col text-white transition-all duration-400 ${
          isCollapsed ? "w-16" : "w-56"
        }`}
      >
        <button
          className="mb-4 ml-1.5 text-xl"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <FaBars /> : <FaTimes />}
        </button>

        <nav>
          <div>
            <NavItem
              icon={<FiHome />}
              text="Dashboard"
              isCollapsed={isCollapsed}
            />
            <NavItem
              icon={<MdOutlineCategory />}
              text="Category"
              isCollapsed={isCollapsed}
            />
            <NavItem
              icon={<GoBriefcase />}
              text="Products"
              isCollapsed={isCollapsed}
            />
            <NavItem
              icon={<GrMoney />}
              text="Payments"
              isCollapsed={isCollapsed}
            />
            <NavItem
              icon={<GoHistory />}
              text="Order History"
              isCollapsed={isCollapsed}
            />
          </div>
          <div className="mr-0 mt-100">
            <Logout />
          </div>
        </nav>
      </div>
      <div className="flex-1 p-6 bg-[#dad5cb] min-h-screen">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
      </div>
    </div>
  );
};

const NavItem = ({
  icon,
  text,
  isCollapsed,
}: {
  icon: JSX.Element;
  text: string;
  isCollapsed: boolean;
}) => (
  <div
    className={`relative flex items-center mt-4 p-2 rounded cursor-pointer transition-all duration-350 ${
      isCollapsed ? "w-16 justify-center" : "w-full"
    } hover:w-50 hover:bg-gray-600 `}
  >
    {icon}
    <span
      className={` absolute left-12 ${
        isCollapsed ? "opacity-0 group-hover:opacity-100" : "opacity-100"
      }`}
    >
      {text}
    </span>
  </div>
);

export default Dashboard;
