import React from "react";
import FixedPlugin from "components/fixedPlugin/FixedPlugin";

export default function CityZenHomepage() {
  const handleStartJourney = () => {
    window.location.href = '/auth/signin';
  };

  const services = [
    {
      icon: "📄",
      title: "File Grievances",
      description: "Report issues and track their resolution status in real-time",
      color: "bg-blue-100 dark:bg-blue-900/30"
    },
    {
      icon: "🔧",
      title: "Utility Services",
      description: "Request water, electricity, sanitation, and other municipal services",
      color: "bg-blue-100 dark:bg-blue-900/30"
    },
    {
      icon: "🔔",
      title: "City Alerts",
      description: "Stay informed about city events, announcements, and emergency updates",
      color: "bg-blue-100 dark:bg-blue-900/30"
    },
    {
      icon: "💬",
      title: "Citizen Feedback",
      description: "Share your experience and help improve city services",
      color: "bg-blue-100 dark:bg-blue-900/30"
    }
  ];

  const stats = [
    { number: "50K+", label: "Citizens Registered" },
    { number: "15K+", label: "Issues Resolved" },
    { number: "98%", label: "Satisfaction Rate" },
    { number: "24/7", label: "Service Availability" }
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Resident, Sector 12",
      content: "CityZen made it so easy to report a water supply issue. The problem was resolved within 24 hours!",
      rating: 5,
      avatar: "👩"
    },
    {
      name: "Rajesh Kumar",
      role: "Business Owner",
      content: "The utility booking system saves me hours each week. I can manage all requirements from one place.",
      rating: 5,
      avatar: "👨"
    },
    {
      name: "Anita Patel",
      role: "Senior Citizen",
      content: "Simple interface that even I can use easily. The support team was very helpful when I had questions.",
      rating: 5,
      avatar: "🧓"
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Logo (Top Left) */}
      <div className="absolute top-8 left-8 z-50 flex items-center">
        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
          <span className="text-white text-2xl">🏛️</span>
        </div>
        <span className="ml-3 text-2xl font-bold text-blue-600 dark:text-blue-400">CityZen</span>
      </div>

      <FixedPlugin />

      {/* Hero Section - Updated Layout */}
      <section id="home" className="relative pt-40 pb-28">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/10 dark:to-blue-900/20"></div>
        <div className="relative max-w-6xl mx-auto px-6">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              <span className="block">Building Better</span>
              <span className="text-blue-600 dark:text-blue-400">Cities Together</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              A modern digital platform connecting citizens with municipal services. 
              <br />Report issues, book utilities, and stay informed—all in one place.
            </p>
            <button 
              onClick={handleStartJourney}
              className="px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              Start Your Journey
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section - Updated Layout */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center p-6 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-900/20">
                <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-3">{stat.number}</div>
                <div className="text-gray-600 dark:text-gray-400 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section - Updated Layout */}
      <section id="services" className="py-24 bg-blue-50 dark:bg-blue-900/10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-5">
              Our Services
            </h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Comprehensive digital solutions for all your municipal needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 dark:border-gray-700">
                <div className={`w-16 h-16 ${service.color} rounded-xl flex items-center justify-center mb-6 mx-auto`}>
                  <span className="text-4xl">{service.icon}</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 text-center">{service.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-center">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section - Updated Layout */}
      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-5">
              Citizen Testimonials
            </h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Hear what our community members have to say
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 dark:border-gray-700">
                <div className="flex justify-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-2xl">★</span>
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-8 italic text-center">"{testimonial.content}"</p>
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4 text-3xl">
                    {testimonial.avatar}
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-gray-900 dark:text-white text-lg">{testimonial.name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section - Updated Layout */}
      <section id="contact" className="py-24 bg-blue-50 dark:bg-blue-900/10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-5">
              Contact Us
            </h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              We're here to help with any questions
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-100 dark:border-gray-700 text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl text-blue-600 dark:text-blue-400">📞</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Phone</h3>
              <p className="text-gray-600 dark:text-gray-300">+91 123 456 7890</p>
              <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">Mon-Fri, 9AM-6PM</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-100 dark:border-gray-700 text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl text-blue-600 dark:text-blue-400">✉️</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Email</h3>
              <p className="text-gray-600 dark:text-gray-300">support@cityzen.gov.in</p>
              <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">24/7 Support</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-100 dark:border-gray-700 text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl text-blue-600 dark:text-blue-400">📍</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Address</h3>
              <p className="text-gray-600 dark:text-gray-300">City Hall, Main Street</p>
              <p className="text-gray-600 dark:text-gray-300">Your City, State 123456</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - Updated Layout */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-8 md:mb-0">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-4">
                <span className="text-white text-xl">🏛️</span>
              </div>
              <span className="text-2xl font-bold">CityZen</span>
            </div>
            <div className="text-center md:text-right">
              <p className="text-gray-400 mb-2">&copy; {new Date().getFullYear()} CityZen Municipal Services</p>
              <p className="text-gray-500 text-sm">A Government of India Initiative</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}