import React from "react";

// Citizen Views
import CitizenDashboard from "./views/citizen/dashboard/index";
import Service from "views/citizen/services";
import HelpDesk from "views/citizen/help-desk";
import ComplaintForm from "views/citizen/help-desk/pages/ComplaintForm";
import ComplaintLog from "views/citizen/help-desk/pages/ComplaintLog";
import ComplaintFeedback from "views/citizen/help-desk/pages/ComplaintFeedback";
import ComplaintDetails from "views/citizen/help-desk/pages/ComplaintDetails";

// Admin Views
import AdminDashboard from "views/admin/default";
import AdminTables from "views/admin/tables";
import AdminProfile from "views/admin/profile";
import AdminServices from "views/admin/services/index.jsx";
import ManageStaffs from "views/admin/services/component/ManageStaffs";
import ViewTasks from "views/admin/services/component/ViewTasks";
import ViewSchedule from "views/admin/services/component/ViewSchedule";

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

import NewsUpdate from "views/citizen/news/components/NewsUpdate"

// Auth Views
import SignIn from "views/auth/SignIn";
import GetStarted from "views/auth/SignUp/get-started";
import SignupCitizen from "views/auth/SignUp/SignUpClient";
import SignupStaff from "views/auth/SignUp/SignUpStaff";
import ServiceForm from "views/citizen/services/components/ServiceForm";
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
} from "react-icons/md";

const routes = [
  // Auth Routes
  {
    name: "Sign In",
    layout: "/auth",
    path: "sign-in",
    icon: <MdLock className="h-6 w-6" />,
    component: <SignIn />,
  },
  {
  name: "Sign Up",
  layout: "/auth",
  path: "signup",
  icon: <MdLock className="h-6 w-6" />,
  children: [
    {
      name: "Get Started",
      layout: "/auth",
      path: "get-started",
      component: <GetStarted />
    },
    {
      name: "Citizen SignUp",
      layout: "/auth",
      path: "get-started/citizen",
      component: <SignupCitizen />
    },
    {
      name: "Staff SignUp",
      layout: "/auth",
      path: "get-started/staff",
      component: <SignupStaff />
    }
  ]
},
  // Citizen Routes
  {
    name: " Dashboard",
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
        component: <ServiceForm/>
      }
    ]
  },
  // Help Desk
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
        component: <ComplaintForm />
      },
      {
        name: "Complaint Log",
        layout: "/citizen",
        path: "help-desk/complaint/log",
        component: <ComplaintLog />
      },
      {
        name: "Feedback",
        layout: "/citizen",
        path: "help-desk/complaint/feedback/:id",
        component: <ComplaintFeedback />
      },
      {
        name: "View Complaint",
        layout: "/citizen",
        path: "help-desk/complaint/view/:id",
        component: <ComplaintDetails />
      }
    ]
  },
  // Admin Routes
  {
    name: "Admin Dashboard",
    layout: "/admin",
    path: "default",
    icon: <MdDashboard className="h-6 w-6" />,
    component: <AdminDashboard />,
  },

  {
    name: "Admin Services",
    layout: "/admin",
    path: "services",
    icon: <MdDashboard className="h-6 w-6" />,
    component: <AdminServices />,
    // Define nested routes for Admin Services
    children: [
      {
        name: "Manage Services",
        layout: "/admin",
        path: "services/manage",
        component: <ManageServices />
      },
      {
        name: "Manage Staff",
        layout: "/admin",
        path: "services/staff",
        component: <ManageStaffs />
      },
      {
        name: "View Tasks",
        layout: "/admin",
        path: "services/tasks",
        component: <ViewTasks />
      },
      {
        name: "View Schedule",
        layout: "/admin",
        path: "services/schedule",
        component: <ViewSchedule />
      },
      {
        name: "Feedback Management",
        layout: "/admin",
        path: "services/feedback",
        component: <FeedbackManage />
      }
    ]
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
        component: <ViewComplaint />
      },
      {
        name: "Edit Staff Assignment",
        layout: "/admin",
        path: "complaints/update/:id",
        component: <AssignStaff />
      },
    ]
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
        component: <UpdateComplaintDetails />
      },
      {
        name: "View Complaint Details",
        layout: "/staff",
        path: "complaints/view-details/:id",
        component: <ComplaintInfo />
      },
    ],
  },
  {
    name: "City News & Alerts",
    layout: "/staff",
    path: "news",
    icon: <MdChatBubble className="h-6 w-6" />,
    component: <CityNews/>,
    children: [
      {
        name: "Manage News",
        layout: "/staff",
        path: "news/add",
        component: <AddNews/>
      },
      {
        name: "Edit News ",
        layout: "/staff",
        path: "news/add/:id",
        component: <AddNews/>
      }
    ]
  }
  ,
 {
    name: "News Update",
    layout: "/citizen",
    path: "newsupdate",
    icon: <MdLock className="h-6 w-6" />,
    component: <NewsUpdate/>,
  }
];

export default routes;
