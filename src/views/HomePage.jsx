import React, { useState, useEffect } from "react";

export default function CityZenHomepage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const handleStartJourney = () => {
    // Navigate to /auth/signin
    window.location.href = '/auth/signin';
  };

  const services = [
    {
      icon: "📄",
      title: "File Grievances",
      description: "Report issues and track their resolution status in real-time",
      color: "bg-gradient-to-br from-sky-50 to-blue-100 dark:from-sky-900/20 dark:to-blue-900/30"
    },
    {
      icon: "🔧",
      title: "Book Utility Services",
      description: "Request water, electricity, sanitation, and other municipal services",
      color: "bg-gradient-to-br from-cyan-50 to-sky-100 dark:from-cyan-900/20 dark:to-sky-900/30"
    },
    {
      icon: "🔔",
      title: "City Alerts",
      description: "Stay informed about city events, announcements, and emergency updates",
      color: "bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/30"
    },
    {
      icon: "💬",
      title: "Provide Feedback",
      description: "Share your experience and help improve city services",
      color: "bg-gradient-to-br from-sky-50 to-cyan-100 dark:from-sky-900/20 dark:to-cyan-900/30"
    }
  ];

  const stats = [
    { number: "50K+", label: "Citizens Registered" },
    { number: "15K+", label: "Grievances Resolved" },
    { number: "98%", label: "Satisfaction Rate" },
    { number: "24/7", label: "Service Availability" }
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Resident, Sector 12",
      content: "CityZen made it so easy to report a water supply issue. The problem was resolved within 24 hours!",
      rating: 5
    },
    {
      name: "Rajesh Kumar",
      role: "Business Owner",
      content: "The utility booking system is fantastic. I can manage all my business requirements from one place.",
      rating: 5
    },
    {
      name: "Anita Patel",
      role: "Senior Citizen",
      content: "The interface is simple and user-friendly. Even I can easily navigate and get help when needed.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-100 to-blue-200 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/20 transition-all duration-500">
      {/* Logo and Name (Top Left) */}
      <div className="absolute top-4 left-4 z-50 flex items-center">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-sky-600 rounded-lg flex items-center justify-center shadow-lg">
          <span className="text-white font-bold text-lg">🏛️</span>
        </div>
        <span className="ml-2 text-xl font-bold bg-gradient-to-r from-blue-600 to-sky-600 bg-clip-text text-transparent">CityZen</span>
      </div>

      {/* Theme Toggle (Bottom Right) */}
      <button
        onClick={toggleTheme}
        className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg text-gray-700 dark:text-gray-300 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200"
      >
        {theme === "light" ? "🌙" : "☀️"}
      </button>

      {/* Hero Section */}
      <section id="home" className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-100 to-blue-200 dark:from-blue-900/30 dark:via-indigo-900/20 dark:to-blue-800/30 animate-gradient-x"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Design Better 
              <span className="bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-800 bg-clip-text text-transparent"> Cities</span> 
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-200 mb-8 max-w-3xl mx-auto">
              Enhance your experience with a cutting-edge digital platform that simplifies municipal services, resolves grievances, and keeps everyone connected to their city.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={handleStartJourney}
                className="group relative px-10 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:via-indigo-700 hover:to-blue-800 rounded-xl shadow-2xl hover:shadow-blue-500/25 transform hover:-translate-y-1 hover:scale-105 transition-all duration-300 flex items-center justify-center border border-blue-500/20 backdrop-blur-sm"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                <span className="relative">Start Your Journey</span>
                <span className="relative ml-2 group-hover:translate-x-1 transition-transform duration-300">→</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group hover:scale-105 transition-transform duration-300">
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-sky-600 bg-clip-text text-transparent mb-2 group-hover:from-sky-600 group-hover:to-cyan-600 transition-all duration-300">{stat.number}</div>
                <div className="text-gray-600 dark:text-gray-400 text-sm md:text-base">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-gradient-to-br from-blue-50/80 via-indigo-50/80 to-blue-100/80 dark:from-gray-900/80 dark:via-blue-900/10 dark:to-indigo-900/10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Our Services
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Comprehensive digital solutions for all your municipal needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div key={index} className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-sky-100 dark:border-sky-900/30">
                <div className={`w-16 h-16 ${service.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <span className="text-3xl">{service.icon}</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 transition-colors duration-300">{service.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              What Citizens Say
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Real experiences from our community members
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="group bg-gradient-to-br from-sky-50 to-blue-50 dark:from-gray-900 dark:to-blue-900/20 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-sky-100 dark:border-sky-900/30">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-lg group-hover:scale-110 transition-transform duration-300" style={{transitionDelay: `${i * 50}ms`}}>★</span>
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4 italic">"{testimonial.content}"</p>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors duration-300">{testimonial.name}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gradient-to-br from-blue-50/80 via-indigo-50/80 to-blue-100/80 dark:from-gray-900/80 dark:via-blue-900/10 dark:to-indigo-900/10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Get in Touch
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Have questions? We're here to help you navigate your city services
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-center border border-sky-100 dark:border-sky-900/30">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-sky-100 dark:from-blue-900/20 dark:to-sky-900/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl text-blue-600">📞</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 transition-colors duration-300">Phone</h3>
              <p className="text-gray-600 dark:text-gray-300">+91 123 456 7890</p>
            </div>
            
            <div className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-center border border-sky-100 dark:border-sky-900/30">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-sky-100 dark:from-blue-900/20 dark:to-sky-900/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl text-blue-600">✉️</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 transition-colors duration-300">Email</h3>
              <p className="text-gray-600 dark:text-gray-300">support@cityzen.gov.in</p>
            </div>
            
            <div className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-center border border-sky-100 dark:border-sky-900/30">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-sky-100 dark:from-blue-900/20 dark:to-sky-900/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl text-blue-600">📍</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 transition-colors duration-300">Address</h3>
              <p className="text-gray-600 dark:text-gray-300">City Hall, Main Street<br />Your City, State 123456</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 text-white py-12">
        {/* <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> */}
          {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-sky-400 rounded-lg flex items-center justify-center shadow-lg">
                  <span className="text-white text-lg">🏛️</span>
                </div>
                <span className="ml-2 text-xl font-bold bg-gradient-to-r from-blue-400 to-sky-400 bg-clip-text text-transparent">CityZen</span>
              </div>
              <p className="text-gray-400">
                Empowering citizens through digital transformation and smart city solutions.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-sky-400 transition-colors duration-200">File Grievances</a></li>
                <li><a href="#" className="hover:text-sky-400 transition-colors duration-200">Utility Services</a></li>
                <li><a href="#" className="hover:text-sky-400 transition-colors duration-200">City Alerts</a></li>
                <li><a href="#" className="hover:text-sky-400 transition-colors duration-200">Feedback</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-sky-400 transition-colors duration-200">Help Center</a></li>
                <li><a href="#" className="hover:text-sky-400 transition-colors duration-200">Contact Us</a></li>
                <li><a href="#" className="hover:text-sky-400 transition-colors duration-200">FAQs</a></li>
                <li><a href="#" className="hover:text-sky-400 transition-colors duration-200">Privacy Policy</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Connect</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-sky-400 transition-colors duration-200">Facebook</a></li>
                <li><a href="#" className="hover:text-sky-400 transition-colors duration-200">Twitter</a></li>
                <li><a href="#" className="hover:text-sky-400 transition-colors duration-200">LinkedIn</a></li>
                <li><a href="#" className="hover:text-sky-400 transition-colors duration-200">Instagram</a></li>
              </ul>
            </div>
          </div> */}
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 CityZen. All rights reserved. | Government of India Initiative</p>
          </div>
        {/* </div> */}
      </footer>

      <style jsx>{`
        @keyframes gradient-x {
          0%, 100% {
            background-size: 400% 400%;
            background-position: 0% 50%;
          }
          50% {
            background-size: 400% 400%;
            background-position: 100% 50%;
          }
        }
        .animate-gradient-x {
          animation: gradient-x 8s ease infinite;
        }
      `}</style>
    </div>
  );
}