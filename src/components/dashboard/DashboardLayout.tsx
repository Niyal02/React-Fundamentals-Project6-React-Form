import { JSX, useState } from "react";
import Logout from "../logout/Logout";
import { FaBars, FaTimes } from "react-icons/fa";
import { FiHome } from "react-icons/fi";
import { MdOutlineCategory } from "react-icons/md";
import { GoBriefcase } from "react-icons/go";
import { GrMoney } from "react-icons/gr";
import { GoHistory } from "react-icons/go";
import { Link, Outlet, useLocation } from "react-router-dom";

const DashboardLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const [activeItem, setActiveItem] = useState(location.pathname);

  return (
    <div className=" flex h-screen">
      <div
        className={`bg-gray-700 h-screen p-4 flex flex-col text-white transition-all duration-400 fixed ${
          isCollapsed ? "w-16" : "w-56"
        }`}
      >
        <button
          className="mb-4 ml-1.5 text-xl"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <FaBars /> : <FaTimes />}
        </button>

        <nav className="flex flex-col gap-4">
          <div>
            <NavItem
              to="/user/dashboard"
              icon={<FiHome />}
              text="Dashboard"
              isCollapsed={isCollapsed}
              activeItem={activeItem}
              setActiveItem={setActiveItem}
            />
            <NavItem
              to="/user/category"
              icon={<MdOutlineCategory />}
              text="Category"
              isCollapsed={isCollapsed}
              activeItem={activeItem}
              setActiveItem={setActiveItem}
            />
            <NavItem
              to="/user/products"
              icon={<GoBriefcase />}
              text="Products"
              isCollapsed={isCollapsed}
              activeItem={activeItem}
              setActiveItem={setActiveItem}
            />
            <NavItem
              to="/user/payment"
              icon={<GrMoney />}
              text="Payments"
              isCollapsed={isCollapsed}
              activeItem={activeItem}
              setActiveItem={setActiveItem}
            />
            <NavItem
              to="/user/order-history"
              icon={<GoHistory />}
              text="Order History"
              isCollapsed={isCollapsed}
              activeItem={activeItem}
              setActiveItem={setActiveItem}
            />
          </div>
          <div
            className={`relative flex  mt-90 p-2 rounded cursor-pointer transition-all duration-350 size-2${
              isCollapsed ? "w-16 justify-center" : "w-full"
            } hover:w-30 hover:bg-gray-600 `}
          >
            <Logout />
          </div>
        </nav>
      </div>

      <div
        className={`flex-1 p-6 bg-[#dad5cb] min-h-screen overflow-y-auto transition-all duration-400 `}
        style={{
          marginLeft: isCollapsed ? "4rem" : "14rem",
          width: isCollapsed ? "calc(100% - 4rem)" : "calc(100% - 14rem)",
        }}
      >
        <Outlet />
      </div>
    </div>
  );
};

const NavItem = ({
  to,
  icon,
  text,
  isCollapsed,
  activeItem,
  setActiveItem,
}: {
  to: string;
  icon: JSX.Element;
  text: string;
  isCollapsed: boolean;
  activeItem: string;
  setActiveItem: (item: string) => void;
}) => (
  <Link to={to}>
    <div
      className={`relative flex items-center mt-4 p-2 rounded cursor-pointer transition-all duration-350 ${
        isCollapsed ? "w-16 justify-center" : "w-full"
      } hover:w-50 hover:bg-gray-600 ${
        activeItem === to ? "border border-gray-600 bg-gray-600" : ""
      }`}
      onClick={() => setActiveItem(to)}
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
  </Link>
);

export default DashboardLayout;
