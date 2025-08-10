import React, { useEffect, useState } from "react";
import Dropdown from "components/dropdown";
import { FiAlignJustify, FiSearch } from "react-icons/fi";
import { useNavigate, Link } from "react-router-dom";
import { IoMdNotificationsOutline } from "react-icons/io";
import { RiMoonFill, RiSunFill } from "react-icons/ri";
import avatar from "assets/img/avatars/avatar4.png";
import { motion } from "framer-motion";
import ProfileDropdown from "../dropdown/ProfileDropdown";
import axios from "axios";
import { useUser } from "contexts/UserContext";

const Navbar = (props) => {
  const { onOpenSidenav, brandText, newsState } = props;
  const { logout } = useUser();
  const navigate = useNavigate();
  
  // Theme state management
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
    // Set favicon
    const favicon = document.querySelector("link[rel='icon']");
    if (favicon) {
      favicon.href = "/brand-logo.png";
    } else {
      const newFavicon = document.createElement("link");
      newFavicon.rel = "icon";
      newFavicon.href = "/brand-logo.png";
      document.head.appendChild(newFavicon);
    }
    
    // Cleanup function to reset favicon when component unmounts
    return () => {
      if (favicon) {
        favicon.href = "/favicon.ico";
      }
    };
  }, []);

  useEffect(() => {
    if (darkmode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkmode]);

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

  return (
    <nav className="sticky top-4 z-40 flex flex-row flex-wrap items-center justify-between rounded-2xl bg-white/90 p-4 backdrop-blur-xl shadow-lg dark:bg-[#0b14374d] dark:shadow-2xl transition-all duration-300">
      <div className="ml-[6px] flex items-center">
        {/* Logo/Brand Section */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 flex items-center justify-center">
            <img
              src="/brand-logo.png"
              alt="CityZen Logo"
              className={`w-10 h-10 rounded-lg transform hover:scale-105 transition-transform object-cover bg-white p-1 ${
                darkmode ? "border-2 border-white" : "border-2 border-black"
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
      
      <div className="relative mt-[3px] flex h-[61px] w-[355px] flex-grow items-center justify-around gap-2 rounded-full bg-gray-50 px-2 py-2 shadow-sm dark:bg-gray-800 md:w-[365px] md:flex-grow-0 md:gap-1 xl:w-[365px] xl:gap-2 transition-all duration-300">
        {/* Search */}
        <div className="flex h-full items-center rounded-full bg-white px-4 text-gray-700 dark:bg-gray-700 dark:text-white xl:w-[225px] shadow-sm transition-all duration-300">
          <p className="pr-2 text-xl">
            <FiSearch className="h-4 w-4 text-gray-400 dark:text-gray-300" />
          </p>
          <input
            type="text"
            placeholder="Search..."
            className="block h-full w-full rounded-full bg-white text-sm font-medium text-gray-700 outline-none placeholder:text-gray-400 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 sm:w-fit transition-all duration-300"
          />
        </div>
        
        {/* Mobile menu button */}
        <span
          className="flex cursor-pointer text-xl text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 xl:hidden transition-colors duration-300"
          onClick={onOpenSidenav}
        >
          <FiAlignJustify className="h-5 w-5" />
        </span>
        
        {/* Notifications */}
        {newsState && (
          <Dropdown
            isOpen={isNotifOpen}
            setIsOpen={setIsNotifOpen}
            button={
              <div
                className="relative cursor-pointer"
                onClick={() => {
                  setNotifKey((prev) => prev + 1);
                  setHighlightNotif(false);
                  setIsNotifOpen((prev) => !prev);
                }}
              >
                {highlightNotif && (
                  <span className="absolute -inset-1 rounded-full animate-ping bg-red-400 opacity-75"></span>
                )}
                <div className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300">
                  <IoMdNotificationsOutline
                    className={`h-5 w-5 ${
                      highlightNotif
                        ? "text-red-500"
                        : "text-gray-600 dark:text-gray-300"
                    }`}
                  />
                  {highlightNotif && (
                    <span className="absolute top-0 right-0 z-10 inline-flex h-2 w-2 rounded-full bg-red-500" />
                  )}
                </div>
              </div>
            }
            classNames={"py-2 top-4 -left-[230px] md:-left-[440px] w-max"}
            children={
              <motion.div
                key={notifKey}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="flex w-[360px] flex-col gap-3 rounded-2xl bg-white p-4 shadow-xl dark:bg-gray-800 dark:text-white dark:shadow-2xl sm:w-[460px] border border-gray-100 dark:border-gray-700"
              >
                <div className="flex items-center justify-between">
                  <p className="text-base font-bold text-gray-800 dark:text-white">
                    Notifications
                  </p>
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400 cursor-pointer hover:underline">
                    Mark all read
                  </p>
                </div>
                {breakingNews.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <p>No breaking news</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                    {breakingNews.map((news, idx) => (
                      <button
                        key={idx}
                        className="flex w-full items-center rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:bg-gray-50 dark:hover:bg-gray-750 transition-all duration-300"
                        onClick={() =>
                          handleNotificationClick(
                            `/citizen/newsupdate/newsdetails/${news.id}`
                          )
                        }
                      >
                        <div className="ml-2 flex h-full w-full flex-col justify-center text-left">
                          <p className="mb-1 text-base font-bold text-gray-800 dark:text-white">
                            {news.title}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                            {news.description || "Breaking news update"}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>
            }
          />
        )}
        
        {/* Theme Toggle */}
        <div
          className="flex items-center justify-center p-2 rounded-full cursor-pointer text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300"
          onClick={toggleTheme}
        >
          {darkmode ? (
            <RiSunFill className="h-5 w-5" />
          ) : (
            <RiMoonFill className="h-5 w-5" />
          )}
        </div>
        
        {/* Profile Dropdown */}
        <ProfileDropdown
          button={
            <div className="relative">
              <img
                className="h-10 w-10 rounded-full border-2 border-transparent hover:border-blue-500 transition-all duration-300 cursor-pointer"
                src={avatar}
                alt="User Avatar"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></span>
            </div>
          }
          children={
            <div className="flex w-56 flex-col justify-start rounded-2xl bg-white p-4 shadow-xl dark:bg-gray-800 dark:text-white dark:shadow-2xl border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-100 dark:border-gray-700">
                <img
                  className="h-12 w-12 rounded-full"
                  src={avatar}
                  alt="User Avatar"
                />
                <div>
                  <p className="text-base font-bold text-gray-800 dark:text-white">
                    Adela Parkson
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Citizen
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-3 pt-4">
                <Link
                  to="/citizen/profile"
                  className="flex items-center gap-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300"
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
                  className="flex items-center gap-3 text-sm font-medium text-red-500 hover:text-red-700 transition-colors duration-300 w-full text-left"
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