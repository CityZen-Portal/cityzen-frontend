import React from "react";
import { Plus, BarChart3, TrendingUp, Users, CheckCircle, Clock, AlertCircle } from "lucide-react";
import NewsGallery from "./components/NewsGallery.jsx";
import PieChartCard from "./components/PieChart";

const Dashboard = () => {
  const quickStats = [
    { 
      number: "12", 
      label: "Active Complaints", 
      icon: AlertCircle, 
      change: "+3 this week",
      color: "from-red-500 to-red-600"
    },
    { 
      number: "8", 
      label: "Resolved Issues", 
      icon: CheckCircle, 
      change: "+5 this month",
      color: "from-green-500 to-green-600"
    },
    { 
      number: "3", 
      label: "Pending Services", 
      icon: Clock, 
      change: "2 due soon",
      color: "from-orange-500 to-orange-600"
    },
    { 
      number: "95%", 
      label: "Satisfaction Score", 
      icon: TrendingUp, 
      change: "+2% improved",
      color: "from-blue-500 to-blue-600"  
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-500">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-white dark:bg-gray-800 transition-colors duration-500">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-72 h-72 bg-blue-400/10 dark:bg-blue-400/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-20 right-10 w-64 h-64 bg-purple-400/10 dark:bg-purple-400/5 rounded-full blur-2xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Citizen{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Dashboard
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
              Track your complaints, monitor service requests, and stay updated with municipal activities in your area.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {quickStats.map((stat, index) => (
              <div
                key={index}
                className="group bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-200 dark:border-gray-700 hover:-translate-y-3 cursor-pointer"
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl mb-4 group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  {stat.number}
                </div>
                <div className="text-gray-600 dark:text-gray-300 font-medium mb-2">
                  {stat.label}
                </div>
                <div className="text-sm text-blue-600 dark:text-blue-400 font-medium group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
                  {stat.change}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium mb-4">
            <BarChart3 className="w-4 h-4 mr-2" />
            Municipal Analytics
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            City{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Statistics
            </span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Real-time insights into municipal services and citizen engagement across different categories.
          </p>
        </div>

        <PieChartCard />
      </div>

      {/* News Section */}
      <div className="bg-white dark:bg-gray-800 transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Latest{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Municipal Updates
              </span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Stay informed about important civic developments, policy changes, and community announcements.
            </p>
          </div>

          <NewsGallery />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;