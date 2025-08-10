import React, { useEffect, useState } from "react";
import Dropdown from "components/dropdown";
import { FiAlignJustify } from "react-icons/fi";
import { useNavigate, Link } from "react-router-dom";
import { RiMoonFill, RiSunFill } from "react-icons/ri";
import avatar from "assets/img/avatars/avatar4.png";
import ProfileDropdown from "../dropdown/ProfileDropdown";
import axios from "axios";
import { useUser } from "contexts/UserContext";

const Navbar = (props) => {
  const { onOpenSidenav, brandText } = props;
  const { logout, userName, role, email } = useUser();

  const navigate = useNavigate();

  // Safely parse role array from localStorage
  let userRoleArr = [];
  try {
    const userRoleLocal = localStorage.getItem("role");
    userRoleArr = userRoleLocal ? JSON.parse(userRoleLocal) : [];
  } catch {
    userRoleArr = [];
  }

  const firstRole = userRoleArr.length > 0 ? userRoleArr[0] : null;

  // Dark mode state with localStorage and system preference fallback
  const [darkmode, setDarkmode] = useState(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme) {
        return savedTheme === "dark";
      }
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });

  // Favicon setup
  useEffect(() => {
    const favicon = document.querySelector("link[rel='icon']");
    if (favicon) {
      favicon.href = "/brand-logo.png";
    } else {
      const newFavicon = document.createElement("link");
      newFavicon.rel = "icon";
      newFavicon.href = "/brand-logo.png";
      document.head.appendChild(newFavicon);
    }
    return () => {
      if (favicon) {
        favicon.href = "/favicon.ico";
      }
    };
  }, []);

  // Apply dark/light theme classes and save preference
  useEffect(() => {
    if (darkmode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkmode]);

  // News fetching (not modified)
  const [news, setNews] = useState(null);
  const [breakingNews, setBreakingNews] = useState([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get(
          "https://city-news-alert-backend-new.onrender.com/api/news/get-all"
        );
        const records = response.data.data.records;
        const now = new Date();
        const eightHoursAgo = new Date(now.getTime() - 6 * 60 * 60 * 1000);
        const filteredBreakingNews = records.filter((item) => {
          const createdDate = new Date(item.created_date);
          return item.breaking && createdDate >= eightHoursAgo;
        });
        setBreakingNews(filteredBreakingNews);
        setNews(records);
      } catch (err) {
        console.log(err);
      }
    };
    fetchNews();
  }, []);

  const [notifKey, setNotifKey] = useState(0);
  const [highlightNotif, setHighlightNotif] = useState(true);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const handleNotificationClick = (path) => {
    setIsNotifOpen(false);
    setTimeout(() => {
      navigate(path);
    }, 0);
  };

  const toggleTheme = () => {
    setDarkmode(!darkmode);
  };

  // Helper to format role display (optional)
  const formatRole = (userRole) => {
    if (!userRole) return "User";
    if (Array.isArray(userRole)) {
      const primaryRole = userRole[0] || "User";
      return (
        primaryRole.charAt(0).toUpperCase() + primaryRole.slice(1).toLowerCase()
      );
    }
    return userRole.charAt(0).toUpperCase() + userRole.slice(1).toLowerCase();
  };

  // Get display name fallback from userName or email
  const getDisplayName = () => {
    if (userName) return userName;
    if (email) return email.split("@")[0];
    return "User";
  };

  // Determine profile route based on role
  const profileRoute =
    firstRole === "STAFF"
      ? "/staff/profile"
      : firstRole === "ADMIN"
      ? "/admin/AdminPro"
      : "/citizen/profile";

  return (
    <nav className="sticky top-4 z-40 flex flex-row flex-wrap items-center justify-between rounded-2xl bg-white/90 p-4 shadow-lg backdrop-blur-xl transition-all duration-300 dark:bg-[#0b14374d] dark:shadow-2xl">
      <div className="ml-[6px] flex items-center">
        {/* Logo/Brand Section */}
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center">
            <img
              src="/brand-logo.png"
              alt="CityZen Logo"
              className={`h-10 w-10 transform rounded-lg bg-white object-cover p-1 transition-transform hover:scale-105 ${
                darkmode ? "border-2 border-white" : "border-black border-2"
              }`}
            />
          </div>
        </div>
        {/* Page Title */}
        <div className="ml-8">
          <p className="text-[28px] font-bold text-gray-800 dark:text-white">
            {brandText}
          </p>
        </div>
      </div>

      <div className="relative mt-[3px] flex h-[61px] w-[355px] flex-grow items-center justify-around gap-2 rounded-full bg-gray-200 px-2 py-2 shadow-sm transition-all duration-300 dark:bg-gray-800 md:w-[165px] md:flex-grow-0 md:gap-1 xl:w-[165px] xl:gap-2">
        <span
          className="flex cursor-pointer text-xl text-gray-600 transition-colors duration-300 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 xl:hidden"
          onClick={onOpenSidenav}
        >
          <FiAlignJustify className="h-5 w-5" />
        </span>

        <div
          className="flex cursor-pointer items-center justify-center rounded-full p-2 text-gray-600 transition-all duration-300 hover:bg-gray-100 hover:text-blue-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-blue-400"
          onClick={toggleTheme}
        >
          {darkmode ? (
            <RiSunFill className="h-5 w-5" />
          ) : (
            <RiMoonFill className="h-5 w-5" />
          )}
        </div>

        <ProfileDropdown
          button={
            <div className="relative">
              <img
                className="border-transparent h-10 w-10 cursor-pointer rounded-full border-2 transition-all duration-300 hover:border-blue-500"
                src={avatar}
                alt="User Avatar"
              />
              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500 dark:border-gray-800"></span>
            </div>
          }
          children={
            <div className="flex w-56 flex-col justify-start rounded-2xl border border-gray-100 bg-white p-4 shadow-xl dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:shadow-2xl">
              <div className="flex items-center gap-3 border-b border-gray-100 pb-4 dark:border-gray-700">
                <img
                  className="h-12 w-12 rounded-full"
                  src={avatar}
                  alt="User Avatar"
                />
                <div>
                  <p className="text-base font-bold text-gray-800 dark:text-white">
                    {getDisplayName()}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {formatRole(role)}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-4">
                <Link
                  to={profileRoute}
                  className="flex items-center gap-3 text-sm font-medium text-gray-700 transition-colors duration-300 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Profile
                </Link>

                <button
                  onClick={() => {
                    logout();
                    navigate("/auth/signin");
                  }}
                  className="flex w-full items-center gap-3 text-left text-sm font-medium text-red-500 transition-colors duration-300 hover:text-red-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Log Out
                </button>
              </div>
            </div>
          }
          classNames={"py-2 top-8 -left-[180px] w-max"}
        />
      </div>
    </nav>
  );
};

export default Navbar;
