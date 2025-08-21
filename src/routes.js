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
import ViewComplaint from "views/citizen/help-desk/pages/ViewComplaint";
import ComplaintTable from "views/citizen/help-desk/components/ComplaintTable";

// Admin Views
import AdminDashboard from "views/admin/dashboard/index";
import AdminTables from "views/admin/tables";
import AdminProfile from "views/admin/profile/Profile";
import AdminServices from "views/admin/services/index.jsx";
import ManageStaffs from "views/admin/services/component/ManageStaffs";
import ViewTasks from "views/admin/services/component/ViewTasks";
import ViewSchedule from "views/admin/services/component/ViewSchedule";
import AdminAnalytics from "views/admin/services/component/analytics";
import { MdBook, MdMiscellaneousServices } from "react-icons/md";
import { MdBarChart } from "react-icons/md";
import AdminPro from "views/admin/services/component/AdminPro";

import FeedbackManage from "views/admin/services/component/FeedbackManage";
import ComplaintManagement from "views/admin/complaints";
import AssignStaff from "views/admin/complaints/pages/AssignStaff";

// Staff Views
import StaffDashboard from "views/staff/dashboard";
import ManageServices from "views/admin/services/component/ManageServices";
import CityNews from "views/staff/news";
import StaffService from "views/staff/services";
import ComplaintTracker from "views/staff/help-desk";
import UpdateComplaintDetails from "views/staff/help-desk/pages/UpdateComplaintDetails";
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
  MdWork,
} from "react-icons/md";

import ReportForm from "views/citizen/services/components/ReportForm";
import { layout } from "@chakra-ui/system";
import Locker from "./views/citizen/locker/index.js";
import DocumentInfo from "views/citizen/locker/components/DocumentInfo";
import AdminCityNews from "views/admin/news";
import AdminAddNews from "views/admin/news/components/AdminAddNews";
// import JobApplicationsPost from "views/admin/job-applications/pages/JobApplicationsPost";
import NewsHomeDetails from "views/citizen/news/components/NewsHomeDetails";
import JobApplicationsPost from "views/admin/job-applications/pages/JobApplicationsPost";
// import JobFormPages from "views/admin/job-applications/pages/JobFormPages";
// import CitizenJobBoard from "views/citizen/job-application/pages/CitizenJobBoard";
// import JobDetailsPage from "views/citizen/job-application/pages/JobDetailsPage";
import JobApplicationSystem from "views/citizen/job-application/pages/JobApplicationSystem";
import JobDetailsPage from "views/citizen/job-application/pages/JobDetailsPage";
import VolunteerDetailsPage from "views/citizen/job-application/pages/VolunteerDetailsPage";
import MunicipalJobForm from "views/admin/job-applications/pages/MunicipalJobForm";
import VolunteerJobForm from "views/admin/job-applications/pages/VolunteerJobForm";
import MunicipalEditForm from "views/admin/job-applications/pages/MunicipalEditForm";
import VolunteerEditForm from "views/admin/job-applications/pages/VolunteerEditForm";
import AdminJobDetailsPage from "views/admin/job-applications/pages/AdminJobDetails";
import AdminVolunteerDetailsPage from "views/admin/job-applications/pages/AdminVolunteerDetailsPage";

import NewsStaffDetails from "views/staff/news/components/NewsStaffDetails";
import ViewNewsDetails from "views/staff/news/components/ViewNewsDetails";
import AdminViewNewsDetails from "views/admin/news/components/AdminViewNewsDetails";

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
    path: "locker",
    icon: <MdLock className="h-6 w-6" />,
    component: <Locker />,
    children: [
      {
        name: "My Locker",
        layout: "/citizen",
        path: "locker/my-locker",
        component: <DocumentInfo />,
      },
    ],
  },
  {
    name: "Job Application",
    layout: "/citizen",
    path: "job-application",
    icon: <MdWork className="h-6 w-6" />,
    component: <JobApplicationSystem />,
    children: [
      {
        name: "Job Details",
        layout: "/citizen",
        path: "job-application/job/:id",
        component: <JobDetailsPage />,
      },
      {
        name: "Volunteer Details",
        layout: "/citizen",
        path: "job-application/volunteer/:id",
        component: <VolunteerDetailsPage />,
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
        path: "help-desk/complaint/:id",
        component: <ViewComplaint User={'citizen'}/>,
      },
      {
        name: "Complaint Table",
        layout: "/citizen",
        path: "help-desk/complaint/table",
        component: <ComplaintTable />,
      },
    ],
  },

  // Admin Routes
  {
    name: "Dashboard",
    layout: "/admin",
    path: "dashboard",
    icon: <MdDashboard className="h-6 w-6" />,
    component: <AdminDashboard />,
  },
  {
    name: "Services",
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
    name: "Job Applications",
    layout: "/admin",
    path: "job-application",
    icon: <MdBallot className="h-6 w-6" />,
    component: <JobApplicationsPost />,
    children: [
      {
        name: "Add Municipal Job",
        layout: "/admin",
        path: "job-application/add/municipal",
        component: <MunicipalJobForm />,
      },
      {
        name: "Add Volunteer Job",
        layout: "/admin",
        path: "job-application/add/volunteer",
        component: <VolunteerJobForm />,
      },
      {
        name: "Edit Municipal Job",
        layout: "/admin",
        path: "job-application/edit/municipal/:id",
        component: <MunicipalEditForm />,
      },
      {
        name: "Edit Volunteer Job",
        layout: "/admin",
        path: "job-application/edit/volunteer/:id",
        component: <VolunteerEditForm />,
      },
      {
        name: "Admin job Details view",
        layout: "/admin",
        path: "job-application/job-details/:id",
        component: <AdminJobDetailsPage />,
      },
      {
        name: "Admin volunteer Details view",
        layout: "/admin",
        path: "job-application/volunteer-details/:id",
        component: <AdminVolunteerDetailsPage />,
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
        component: <ViewComplaint User={'admin'} />,
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
    sidebar: false,
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
    sidebar: false,
  },

  // Staff Routes
  {
    name: "Dashboard",
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
    name: "Complaints",
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
        component: <ViewComplaint User={'staff'} />,
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
      {
        name: "News Details",
        layout: "/staff",
        path: "news/newshomedetails",
        component: <NewsStaffDetails />,
      },
      {
        name: "View News Details",
        layout: "/staff",
        path: "news/view/:id",
        component: <ViewNewsDetails />,
      },
    ],
  },
  {
    name: "News Update",
    layout: "/citizen",
    path: "newsupdate",
    icon: <MdBook className="h-6 w-6" />,
    component: <NewsUpdate />,
    children: [
      {
        name: "News Details",
        layout: "/citizen",
        path: "/newsupdate/newsdetails/:id",
        component: <NewsDetails />,
      },
      {
        name: "News Details",
        layout: "/citizen",
        path: "/newsupdate/newshomedetails",
        component: <NewsHomeDetails />,
      },
    ],
  },
  {
    name: "City News & Alerts",
    layout: "/admin",
    path: "news",
    icon: <MdChatBubble className="h-6 w-6" />,
    component: <AdminCityNews />,
    children: [
      {
        name: "Manage News",
        layout: "/admin",
        path: "news/add",
        component: <AdminAddNews />,
      },
      {
        name: "Edit News ",
        layout: "/admin",
        path: "news/add/:id",
        component: <AdminAddNews />,
      },
      {
        name: "View News ",
        layout: "/admin",
        path: "news/view/:id",
        component: <AdminViewNewsDetails />,
      },
    ],
  },
  {
    name: "Profile",
    layout: "/staff",
    path: "profile",
    icon: <MdPerson className="h-6 w-6" />,
    component: <StaffProfile />,
  },
];

export default routes;
