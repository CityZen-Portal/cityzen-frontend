import React, { useEffect } from "react";
import { redirect, useNavigate } from "react-router-dom";

export default function Unauthorized() {
  const navigate = useNavigate();
  const redirectHome = () => {
    const role = JSON.stringify(localStorage.getItem("role"));
    if(role.includes("ROLE_ADMIN")){
      navigate("/admin")
    }
    else if(role.includes("ROLE_STAFF")){
      navigate("/staff")
    }
    else{
      navigate("/citizen")
    }
  }
  return (
    <div className="flex min-h-screen items-center justify-center bg-white dark:bg-gray-900">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-red-500">401</h1>
        <p className="mt-4 text-2xl text-gray-700 dark:text-gray-300">
          Unauthorized Access
        </p>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          You do not have permission to view this page.
        </p>
        <button
          onClick={redirectHome}
          className="mt-6 inline-block rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Go Previous
        </button>
      </div>
    </div>
  );
}
