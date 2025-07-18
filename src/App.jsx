
import React from "react";
import { Routes, Route } from "react-router-dom";

import CitizenLayout from "layouts/citizen";
import AdminLayout from "layouts/admin";
import AuthLayout from "layouts/auth";
import HomePage from "views/HomePage";
import StaffLayout from "layouts/staff";
import ScrollToTop from "views/citizen/news/components/ScrollToTop";
const App = () => {

  return (
    <>
    <ScrollToTop/>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="citizen/*" element={<CitizenLayout />} />
      <Route path="auth/*" element={<AuthLayout />} />
      <Route path="admin/*" element={<AdminLayout />} />
      <Route path="staff/*" element={<StaffLayout />} />
      <Route path="/*" element={<CitizenLayout />} />
    </Routes>
</>  );
};

export default App