import React from "react";

// Home View
import HomePage from "views/HomePage";

// Citizen Views
import CitizenDashboard from "./views/citizen/dashboard/index";
import Service from "views/citizen/services";
import HelpDesk from "views/citizen/help-desk";
import ComplaintForm from "views/citizen/help-desk/pages/ComplaintForm";
import ComplaintLog from "views/citizen/help-desk/pages/ComplaintLog";
import ComplaintFeedback from "views/citizen/help-desk/pages/ComplaintFeedback";
import ComplaintDetails from "views/citizen/help-desk/pages/ComplaintDetails";

// Admin Views
import AdminDashboard from "views/admin/dashboard/index";
import AdminTables from "views/admin/tables";
import AdminProfile from "views/admin/profile/Profile";
import AdminServices from "views/admin/services/index.jsx";
import ManageStaffs from "views/admin/services/component/ManageStaffs";
import ViewTasks from "views/admin/services/component/ViewTasks";
import ViewSchedule from "views/admin/services/component/ViewSchedule";
import AdminAnalytics from "views/admin/services/component/analytics";

import { MdBarChart } from "react-icons/md";
import AdminPro from "views/admin/services/component/AdminPro";

import AdminCityNews from "views/admin/news";
import AdminAddNews from "views/admin/news/components/AdminAddNews";
import FeedbackManage from "views/admin/services/component/FeedbackManage";
import ComplaintManagement from "views/admin/complaints";
import AssignStaff from "views/admin/complaints/pages/AssignStaff";
import ViewComplaint from "views/admin/complaints/pages/ViewComplaint";

// Staff Views
import StaffDashboard from "views/staff/dashboard";
import ManageServices from "views/admin/services/component/ManageServices";
import CityNews from "views/staff/news";
import StaffService from "views/staff/services";
import ComplaintTracker from "views/staff/help-desk";
import UpdateComplaintDetails from "views/staff/help-desk/pages/UpdateComplaintDetails";
import ComplaintInfo from "views/staff/help-desk/pages/ComplaintInfo";
import AddNews from "views/staff/news/components/AddNews";
import ViewNews from "views/staff/news/components/ViewNews";
import NewsUpdate from "views/citizen/news/components/NewsUpdate";
import StaffProfile from "views/staff/profile/profile";
// Auth Views
import SignIn from "views/auth/pages/SignIn";
import SignupCitizen from "views/auth/SignupCitizen";
import ResetPassword from "views/auth/ResetPassword";

// News Details
import NewsDetails from "views/citizen/news/components/NewsDetails";

// Service Form
import ServiceForm from "views/citizen/services/components/ServiceForm";
import FeedBack from "views/citizen/services/components/FeedBack";
// Icons
import {
  MdHome,
  MdLock,
  MdPerson,
  MdDashboard,
  MdTableView,
  MdAdminPanelSettings,
  MdChatBubble,
  MdLiveHelp,
  MdAssignment,
  MdBallot,
  MdBuild,
} from "react-icons/md";

import JobApplicationPage from "views/citizen/job-application";

import ReportForm from "views/citizen/services/components/ReportForm";
import { layout } from "@chakra-ui/system";
import Locker from "views/citizen/locker";
import DocumentInfo from "views/citizen/locker/components/DocumentInfo";

const routes = [
  // Home
  {
    name: "Home",
    layout: "/",
    path: "",
    component: <HomePage />,
  },

  // Auth Routes
  {
    name: "Sign In",
    layout: "/auth",
    path: "signin",
    icon: <MdLock className="h-6 w-6" />,
    component: <SignIn />,
  },
  {
    name: "Reset Password",
    layout: "/auth",
    path: "reset-password",
    component: <ResetPassword />,
    hidden: true,
  },
  {
    name: "Sign Up",
    layout: "/auth",
    path: "signup",
    icon: <MdLock className="h-6 w-6" />,
    component: <SignupCitizen />,
  },

  // Citizen Routes
  {
    name: "Dashboard",
    layout: "/citizen",
    path: "dashboard",
    icon: <MdDashboard className="h-6 w-6" />,
    component: <CitizenDashboard />,
  },
  {
    name: "Services",
    layout: "/citizen",
    path: "Services",
    icon: <MdHome className="h-6 w-6" />,
    component: <Service />,
    children: [
      {
        name: "Service List",
        layout: "/citizen",
        path: "Services/form/:serviceName",
        component: <ServiceForm />,
      },
      {
        name: "Report form",
        layout: "/citizen",
        path: "Services/reportform",
        component: <ReportForm />,
      },
      {
        name: "FeedBack form",
        layout: "/citizen",
        path: "Services/feedform",
        component: <FeedBack />,
      },
    ],
  },
  {
    name: "Locker",
    layout: "/citizen",
    path: "Locker",
    icon: <MdLock className="h-6 w-6" />,
    component: <Locker />,
    children: [
      {
        name: "My Locker",
        layout: "/citizen",
        path: "Locker/my-locker",
        component: <DocumentInfo />,
      },
    ],
  },

  {
    name: "Help Desk",
    layout: "/citizen",
    path: "help-desk",
    icon: <MdLiveHelp className="h-6 w-6" />,
    component: <HelpDesk />,
    children: [
      {
        name: "Complaint Form",
        layout: "/citizen",
        path: "help-desk/complaint/form",
        component: <ComplaintForm />,
      },
      {
        name: "Complaint Log",
        layout: "/citizen",
        path: "help-desk/complaint/log",
        component: <ComplaintLog />,
      },
      {
        name: "Feedback",
        layout: "/citizen",
        path: "help-desk/complaint/feedback/:id",
        component: <ComplaintFeedback />,
      },
      {
        name: "View Complaint",
        layout: "/citizen",
        path: "help-desk/complaint/view/:id",
        component: <ComplaintDetails />,
      },
    ],
  },
  {
    name: "Job Application",
    layout: "/citizen",
    path: "job-application",
    icon: <MdDashboard className="h-6 w-6" />,
    component: <JobApplicationPage />,
  },

  // Admin Routes
  {
    name: "Admin Dashboard",
    layout: "/admin",
    path: "dashboard",
    icon: <MdDashboard className="h-6 w-6" />,
    component: <AdminDashboard />,
  },
  {
    name: "Admin Services",
    layout: "/admin",
    path: "services",
    icon: <MdBuild className="h-6 w-6" />,
    component: <AdminServices />,
    children: [
      {
        name: "Manage Services",
        layout: "/admin",
        path: "services/manage",
        component: <ManageServices />,
      },
      {
        name: "Manage Staff",
        layout: "/admin",
        path: "services/staff",
        component: <ManageStaffs />,
      },
      {
        name: "View Tasks",
        layout: "/admin",
        path: "services/tasks",
        component: <ViewTasks />,
      },
      {
        name: "View Schedule",
        layout: "/admin",
        path: "services/schedule",
        component: <ViewSchedule />,
      },
      {
        name: "Feedback Management",
        layout: "/admin",
        path: "services/feedback",
        component: <FeedbackManage />,
      },
    ],
  },
  {
    name: "Complaint Management",
    layout: "/admin",
    path: "complaints",
    icon: <MdAssignment className="h-6 w-6" />,
    component: <ComplaintManagement />,
    children: [
      {
        name: "View Complaint",
        layout: "/admin",
        path: "complaints/view/:id",
        component: <ComplaintDetails />,
      },
      {
        name: "Edit Staff Assignment",
        layout: "/admin",
        path: "complaints/update/:id",
        component: <AssignStaff />,
      },
    ],
  },
  {
    name: "Profile",
    layout: "/citizen",
    path: "profile",
    icon: <MdPerson className="h-6 w-6" />,
    component: <AdminProfile />,
    sidebar:false
  },
  {
    name: "Views and Analytics",
    layout: "/admin",
    path: "analytics",
    icon: <MdBarChart className="h-6 w-6" />,
    component: <AdminAnalytics />,
  },
  {
    name: "Profile",
    layout: "/admin",
    path: "AdminPro",
    icon: <MdPerson className="h-6 w-6" />,
    component: <AdminPro />,
  },

  // Staff Routes
  {
    name: "Staff Dashboard",
    layout: "/staff",
    path: "dashboard",
    icon: <MdAdminPanelSettings className="h-6 w-6" />,
    component: <StaffDashboard />,
  },
  {
    name: "Service Requests",
    layout: "/staff",
    path: "services",
    icon: <MdTableView className="h-6 w-6" />,
    component: <StaffService />,
  },
   
  {
    name: "Complaint Management",
    layout: "/staff",
    path: "complaints",
    icon: <MdBallot className="h-6 w-6" />,
    component: <ComplaintTracker />,
    children: [
      {
        name: "Update Complaint Details",
        layout: "/staff",
        path: "complaints/update-details/:id",
        component: <UpdateComplaintDetails />,
      },
      {
        name: "View Complaint Details",
        layout: "/staff",
        path: "complaints/view-details/:id",
        component: <ComplaintDetails />,
      },
    ],
  },
  {
    name: "City News & Alerts",
    layout: "/staff",
    path: "news",
    icon: <MdChatBubble className="h-6 w-6" />,
    component: <CityNews />,
    children: [
      {
        name: "Manage News",
        layout: "/staff",
        path: "news/add",
        component: <AddNews />,
      },
      {
        name: "Edit News ",
        layout: "/staff",
        path: "news/add/:id",
        component: <AddNews />,
      },
    ],
  },
  {
    name: "News Update",
    layout: "/citizen",
    path: "newsupdate",
    icon: <MdLock className="h-6 w-6" />,
    component: <NewsUpdate />,
    children: [
      {
        name: "News Details",
        layout: "/citizen",
        path: "/newsupdate/newsdetails/:id",
        component: <NewsDetails />,
      },
    ],
  },
  {
    name: "City News & Alerts",
    layout: "/admin",
    path: "news",
    icon: <MdChatBubble className="h-6 w-6" />,
    component: <AdminCityNews/>,
    children: [
      {
        name: "Manage News",
        layout: "/admin",
        path: "news/add",
        component: <AdminAddNews/>,
      },
      {
        name: "Edit News ",
        layout: "/admin",
        path: "news/add/:id",
        component: <AdminAddNews />,
      },
    ],
  },
  {
    name: "Profile",
    layout: "/staff",
    path: " profile",
    icon: <MdPerson className="h-6 w-6" />,
    component: <StaffProfile />,
  },
];

export default routes;
