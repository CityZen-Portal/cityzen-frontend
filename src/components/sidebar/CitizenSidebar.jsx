import React, { useEffect, useRef, useState } from "react";
import { HiX } from "react-icons/hi";
import Links from "./components/Links";
import routes from "routes.js";
import brandLight from "../../assets/img/dashboards/brand-logo.png";
import brandDark from "../../assets/img/dashboards/dark-logo.png";

const CitizenSidebar = ({ open, onClose }) => {
  const citizenRoutes = routes.filter(route => route.layout === "/citizen" && route.sidebar!==false) ;
  const sidebarRef = useRef();
  const [isDarkMode, setIsDarkMode] = useState(localStorage.getItem("theme") === "dark");

  useEffect(() => {
    const interval = setInterval(() => {
      const theme = localStorage.getItem("theme");
      const isDark = theme === "dark";
      // console.log("Polling theme:", theme);
      setIsDarkMode(prev => {
        if (prev !== isDark) {
          // console.log("Theme changed. Updating isDarkMode to:", isDark);
        }
        return isDark;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

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
      className={`sm:none duration-175 linear fixed !z-50 flex min-h-full flex-col bg-white pb-10 shadow-2xl shadow-white/5 transition-all dark:!bg-navy-800 dark:text-white md:!z-50 lg:!z-50 xl:!z-0 ${open ? "translate-x-0" : "-translate-x-96"}`}
    >
      <span
        className="absolute right-4 top-4 block cursor-pointer xl:hidden"
        onClick={onClose}
      >
        <HiX />
      </span>

      <div className="mx-[56px] mt-[50px] flex items-center">
        <div className="ml-1 mt-1 font-poppins text-[26px] font-bold uppercase text-navy-700 dark:text-white">
          <div>
            <img
              src={isDarkMode ? brandDark : brandLight}
              alt="Logo"
              className={isDarkMode ? "w-[150px]" : "w-[150px]"}
            />
          </div>
        </div>
      </div>

      <div className="mb-7 mt-[28px] h-px bg-gray-300 dark:bg-white/30" />
      <ul className="mb-auto pt-1">
        <Links routes={citizenRoutes} />
      </ul>
    </div>
  );
};

export default CitizenSidebar;
