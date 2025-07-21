import React from "react";
import Dropdown from "components/dropdown";
import { FiAlignJustify, FiSearch } from "react-icons/fi";
import { Link } from "react-router-dom";
import { BsArrowBarUp } from "react-icons/bs";
import {
  IoMdNotificationsOutline,
  IoMdInformationCircleOutline,
} from "react-icons/io";
import { RiMoonFill, RiSunFill } from "react-icons/ri";
import avatar from "assets/img/avatars/avatar4.png";
import { motion } from "framer-motion";

const Navbar = (props) => {
  const { onOpenSidenav, brandText } = props;
  const [darkmode, setDarkmode] = React.useState(() => {
    const saved = localStorage.getItem("theme");
    return saved === "dark";
  });

  const [notifKey, setNotifKey] = React.useState(0);
  const [highlightNotif, setHighlightNotif] = React.useState(true);

  React.useEffect(() => {
    if (darkmode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [darkmode]);

  return (
    <nav className="sticky top-4 z-40 flex flex-row flex-wrap items-center justify-between rounded-xl bg-white/10 p-2 backdrop-blur-xl dark:bg-[#0b14374d]">
      <div className="ml-[6px]">
        <div className="h-6 w-[224px] pt-1">
          <a
            className="text-sm font-normal text-navy-700 hover:underline dark:text-white dark:hover:text-white"
            href=" "
          >
            Pages
            <span className="mx-1 text-sm text-navy-700 hover:text-navy-700 dark:text-white">
              /
            </span>
          </a>
          <Link
            className="text-sm font-normal capitalize text-navy-700 hover:underline dark:text-white dark:hover:text-white"
            to="#"
          >
            {brandText}
          </Link>
        </div>
        <p className="shrink text-[33px] capitalize text-navy-700 dark:text-white">
          <Link
            to="#"
            className="font-bold capitalize hover:text-navy-700 dark:hover:text-white"
          >
            {brandText}
          </Link>
        </p>
      </div>

      <div className="relative mt-[3px] flex h-[61px] w-[355px] flex-grow items-center justify-around gap-2 rounded-full bg-white px-2 py-2 shadow-xl shadow-shadow-500 dark:!bg-navy-800 dark:shadow-none md:w-[365px] md:flex-grow-0 md:gap-1 xl:w-[365px] xl:gap-2">
        <div className="flex h-full items-center rounded-full bg-lightPrimary text-navy-700 dark:bg-navy-900 dark:text-white xl:w-[225px]">
          <p className="pl-3 pr-2 text-xl">
            <FiSearch className="h-4 w-4 text-gray-400 dark:text-white" />
          </p>
          <input
            type="text"
            placeholder="Search..."
            className="block h-full w-full rounded-full bg-lightPrimary text-sm font-medium text-navy-700 outline-none placeholder:!text-gray-400 dark:bg-navy-900 dark:text-white dark:placeholder:!text-white sm:w-fit"
          />
        </div>

        <span
          className="flex cursor-pointer text-xl text-gray-600 dark:text-white xl:hidden"
          onClick={onOpenSidenav}
        >
          <FiAlignJustify className="h-5 w-5" />
        </span>

        <Dropdown
          button={
            <div
              className="relative cursor-pointer"
              onClick={() => {
                setNotifKey((prev) => prev + 1);
                setHighlightNotif(false);
              }}
            >
              {highlightNotif && (
                <span className="absolute -inset-1 rounded-full animate-ping bg-red-400 opacity-75"></span>
              )}
              <IoMdNotificationsOutline
                className={`
          relative z-10 h-5 w-5 
          ${highlightNotif ? "text-red-500" : "text-gray-600 dark:text-white"}
        `}
              />
              {highlightNotif && (
                <span className="absolute top-0 right-0 z-10 inline-flex h-2 w-2 rounded-full bg-red-500" />
              )}
            </div>
          }

          animation="origin-[65%_0%] md:origin-top-right transition-all duration-300 ease-in-out"
          classNames={"py-2 top-4 -left-[230px] md:-left-[440px] w-max"}
          children={
            <motion.div
              key={notifKey}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="flex w-[360px] flex-col gap-3 rounded-[20px] bg-white p-4 shadow-xl shadow-shadow-500 dark:!bg-navy-700 dark:text-white dark:shadow-none sm:w-[460px]"
            >
              <div className="flex items-center justify-between">
                <p className="text-base font-bold text-navy-700 dark:text-white">
                  Notification
                </p>
                <p className="text-sm font-bold text-navy-700 dark:text-white cursor-pointer">
                  Mark all read
                </p>
              </div>
              <button className="flex w-full items-center">
                <div className="flex h-full w-[85px] items-center justify-center rounded-xl bg-gradient-to-b from-brandLinear to-brand-500 py-4 text-2xl text-white">
                  <BsArrowBarUp />
                </div>
                <div className="ml-2 flex h-full w-full flex-col justify-center rounded-lg px-1 text-sm">
                  <Link to="/citizen/newsupdate/newsdetails/Climate Change Impacts">
                  <p className="mb-1 text-left text-base font-bold text-gray-900 dark:text-white">
                    Climate Change Impacts
                  </p>
                  </Link>
                 
                </div>
              </button>
            </motion.div>
          }
        />

        <div
          className="cursor-pointer text-gray-600"
          onClick={() => {
            if (darkmode) {
              document.body.classList.remove("dark");
              setDarkmode(false);
              localStorage.setItem("theme", "light");
            } else {
              document.body.classList.add("dark");
              setDarkmode(true);
              localStorage.setItem("theme", "dark");
            }
          }}
        >
          {darkmode ? (
            <RiSunFill className="h-4 w-4 text-gray-600 dark:text-white" />
          ) : (
            <RiMoonFill className="h-4 w-4 text-gray-600 dark:text-white" />
          )}
        </div>

        <Dropdown
          button={
            <img
              className="h-10 w-10 rounded-full"
              src={avatar}
              alt="Profile"
            />
          }
          children={
            <div className="flex w-56 flex-col justify-start rounded-[20px] bg-white bg-cover bg-no-repeat shadow-xl shadow-shadow-500 dark:!bg-navy-700 dark:text-white dark:shadow-none">
              <div className="p-4">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-navy-700 dark:text-white">
                    👋 Hey, Adela
                  </p>
                </div>
              </div>
              <div className="h-px w-full bg-gray-200 dark:bg-white/20" />
              <div className="flex flex-col p-4">
                <a
                  href=" "
                  className="mt-3 text-sm font-medium text-red-500 hover:text-red-500 transition duration-150 ease-out hover:ease-in"
                >
                  Log Out
                </a>
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
