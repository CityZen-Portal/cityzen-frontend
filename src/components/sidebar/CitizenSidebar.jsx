import React, { useEffect, useRef } from "react";
import { HiX } from "react-icons/hi";
import Links from "./components/Links";
import routes from "routes.js";
import brandIcon from "../../assets/img/dashboards/brand-logo.png";

const CitizenSidebar = ({ open, onClose }) => {
  // Filter routes for citizen only
  const citizenRoutes = routes.filter(route => route.layout === "/citizen");

  const sidebarRef = useRef();

  // Detect outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        window.innerWidth < 1200 &&
        open
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, onClose]);

  return (
    <div
      ref={sidebarRef}
      className={`sm:none duration-175 linear fixed !z-50 flex min-h-full flex-col bg-white pb-10 shadow-2xl shadow-white/5 transition-all dark:!bg-navy-800 dark:text-white md:!z-50 lg:!z-50 xl:!z-0 ${
        open ? "translate-x-0" : "-translate-x-96"
      }`}
    >
      <span
        className="absolute right-4 top-4 block cursor-pointer xl:hidden"
        onClick={onClose}
      >
        <HiX />
      </span>

      <div className={`mx-[56px] mt-[50px] flex items-center`}>
        <div className="ml-1 mt-1 h-2.5 font-poppins text-[26px] font-bold uppercase text-navy-700 dark:text-white">
          <img src={brandIcon} alt="Citizen Logo" />
          <p className="mt-2 text-lg font-medium">Citizen Portal</p>
        </div>
      </div>
      <div className="mb-7 mt-[58px] h-px bg-gray-300 dark:bg-white/30" />
      {/* Nav item */}

      <ul className="mb-auto pt-1">
        <Links routes={citizenRoutes} />
      </ul>

      {/* Nav item end */}
    </div>
  );
};

export default CitizenSidebar;