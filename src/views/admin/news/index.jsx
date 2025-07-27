// views/staff/news/index.jsx

import React, { useState } from "react";
import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import Card from "components/card";
import ManageNews from "./components/AdminAddNews";
import ViewNews from "./components/AdminViewNews";
import { newsData } from "./variables/data";
const AdminCityNews = () => {
  const location = useLocation();
  const [newsItems, setNewsItems] = useState(newsData);
  const getActiveTab = () => {
    if (location.pathname.includes("/manage")) return "manage";
    if (location.pathname.includes("/view")) return "view";
    return "";
  };

  const activeTab = getActiveTab();
  const navigate = useNavigate();

  return (
    <div className="mt-5 flex flex-col gap-5">
      {/* <ManageNews context={{ newsItems, setNewsItems }} /> */}
      <ViewNews
        newsItems={newsItems}
        setNewsItems={setNewsItems}
        onClick={() => navigate("/admin/news/add")}
        onCancel={() => navigate("/admin/news/view")}
      />
    </div>
  );
};

export default AdminCityNews;
