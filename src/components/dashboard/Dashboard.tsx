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
      className={`relative flex items-center mt-2 p-2 rounded cursor-pointer transition-all duration-350 ${
        isCollapsed ? "w-16 justify-center" : "w-full"
      } hover:w-50 hover:bg-gray-600 `}
    >
      {icon}
      <span>{text}</span>
    </div>
  );

  return (
    <div className=" flex">
      <div
        className={`bg-gray-700 h-screen p-4 flex flex-col text-white transition-all duration-400 ${
          isCollapsed ? "w-16" : "w-60"
        }`}
      >
        <button
          className="mb-4 ml-1.5 text-xl"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <FaBars /> : <FaTimes />}
        </button>

        <nav>
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
        </nav>
      </div>
      <Logout />
    </div>
  );
};

export default Dashboard;
