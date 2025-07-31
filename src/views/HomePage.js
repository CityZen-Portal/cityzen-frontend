import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Bell,
  Users,
  Calendar,
  FileText,
  Settings,
  ChevronRight,
  Star,
  Shield,
  Zap,
  Phone,
  Mail,
  Menu,
  X,
  Sun,
  Moon,
  ArrowRight,
  Play,
  CheckCircle,
  TrendingUp
} from 'lucide-react';

export default function CityZenHomepage() {
  // Initialize theme from localStorage or system preference
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const storedTheme = localStorage.getItem('theme');
      if (storedTheme) {
        return storedTheme === 'dark';
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState({});

  const handleNavigation = (path) => {
    setIsLoading(prev => ({ ...prev, [path]: true }));
    setTimeout(() => {
      window.location.href = path;
      setIsLoading(prev => ({ ...prev, [path]: false }));
    }, 1000);
  };

  const heroSlides = [
    {
      title: "Smart Grievance System",
      description: "Report civic issues instantly and track resolution in real-time",
      icon: "🏛️",
      gradient: "from-blue-500 to-purple-600"
    },
    {
      title: "Digital Service Booking",
      description: "Book utility services online with zero paperwork hassle",
      icon: "⚡",
      gradient: "from-green-500 to-blue-600"
    },
    {
      title: "Real-time City Updates",
      description: "Stay informed with instant alerts and notifications",
      icon: "🔔",
      gradient: "from-purple-500 to-pink-600"
    }
  ];

  const services = [
    {
      icon: FileText,
      title: "File Grievances",
      desc: "Report and track civic issues seamlessly",
      color: "from-blue-500 to-blue-600",
      stats: "15K+ resolved"
    },
    {
      icon: Calendar,
      title: "Book Services",
      desc: "Schedule utility services instantly",
      color: "from-green-500 to-green-600",
      stats: "24/7 available"
    },
    {
      icon: Bell,
      title: "City Alerts",
      desc: "Get real-time city notifications",
      color: "from-purple-500 to-purple-600",
      stats: "Live updates"
    },
    {
      icon: MapPin,
      title: "Find Centers",
      desc: "Locate nearby civic centers",
      color: "from-red-500 to-red-600",
      stats: "500+ locations"
    },
    {
      icon: Users,
      title: "Community",
      desc: "Connect with fellow citizens",
      color: "from-orange-500 to-orange-600",
      stats: "50K+ members"
    },
    {
      icon: Settings,
      title: "Admin Panel",
      desc: "Municipal staff dashboard",
      color: "from-indigo-500 to-indigo-600",
      stats: "Secure access"
    }
  ];

  const stats = [
    { number: "50K+", label: "Active Citizens", icon: Users, change: "+12%" },
    { number: "15K+", label: "Issues Resolved", icon: CheckCircle, change: "+25%" },
    { number: "98%", label: "Satisfaction Rate", icon: Star, change: "+5%" },
    { number: "24/7", label: "Service Available", icon: Zap, change: "Always" }
  ];

  const features = [
    "Real-time issue tracking",
    "Digital service booking",
    "Instant notifications",
    "Multi-language support",
    "Mobile responsive",
    "Secure authentication"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Updated useEffect to save theme preference to localStorage
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  return (
    <div className={`min-h-screen transition-all duration-500 ${isDark ? 'dark' : ''}`}>
      <div className="bg-white dark:bg-gray-900 transition-colors duration-500">
        {/* Navigation */}
        <nav className="fixed top-0 w-full z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 transition-all duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <div className="flex items-center space-x-3 cursor-pointer" onClick={() => handleNavigation('/')}>
                <img
                  src="/brand-logo.png"
                  alt="CityZen Logo"
                  className="w-10 h-10 rounded-xl shadow-lg transform hover:scale-105 transition-transform object-cover bg-white p-1 dark:bg-white"
                />
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400 text-gray-900 dark:text-white">
                  CityZen
                </span>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-8">
                <a href="#home" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">Home</a>
                <a href="#services" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">Services</a>
                <a href="#about" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">About</a>
                <a href="#contact" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">Contact</a>
                {/* Theme Toggle */}
                <button
                  onClick={() => setIsDark(!isDark)}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300"
                >
                  {isDark ? (
                    <Sun className="w-5 h-5 text-yellow-500" />
                  ) : (
                    <Moon className="w-5 h-5 text-gray-600" />
                  )}
                </button>
                {/* Auth Buttons */}
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleNavigation('/auth/signin')}
                    disabled={isLoading['/auth/signin']}
                    className="px-4 py-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg font-medium transition-all duration-300 disabled:opacity-70"
                  >
                    {isLoading['/auth/signin'] ? (
                      <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      'Sign In'
                    )}
                  </button>
                  <button
                    onClick={() => handleNavigation('/auth/signup')}
                    disabled={isLoading['/auth/signup']}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-70 flex items-center"
                  >
                    {isLoading['/auth/signup'] ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      'Sign Up'
                    )}
                  </button>
                </div>
              </div>
              {/* Mobile Menu Button */}
              <div className="md:hidden flex items-center space-x-3">
                <button
                  onClick={() => setIsDark(!isDark)}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800"
                >
                  {isDark ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-gray-600" />}
                </button>
                <button
                  className="p-2"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </div>
            </div>
          </div>
          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-t border-gray-200 dark:border-gray-700 transition-all duration-300">
              <div className="px-4 py-4 space-y-3">
                <a href="#home" className="block text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium py-2">Home</a>
                <a href="#services" className="block text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium py-2">Services</a>
                <a href="#about" className="block text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium py-2">About</a>
                <a href="#contact" className="block text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium py-2">Contact</a>
                <div className="flex space-x-3 pt-3">
                  <button
                    onClick={() => handleNavigation('/auth/signin')}
                    className="flex-1 px-4 py-2 text-blue-600 dark:text-blue-400 border border-blue-600 dark:border-blue-400 rounded-lg font-medium"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => handleNavigation('/auth/signup')}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium"
                  >
                    Sign Up
                  </button>
                </div>
              </div>
            </div>
          )}
        </nav>
        {/* Hero Section */}
        <section id="home" className="pt-20 pb-16 relative overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0">
            <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 dark:bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute top-40 right-10 w-64 h-64 bg-purple-400/20 dark:bg-purple-400/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
            <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-indigo-400/10 dark:bg-indigo-400/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Hero Content */}
              <div className="space-y-8 animate-fadeIn">
                <div className="space-y-6">

                  <h1 className="text-5xl lg:text-7xl font-bold leading-tight text-gray-900 dark:text-white">
                    <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                      Transform
                    </span>
                    <br />
                    <span className="text-gray-900 dark:text-white">
                      Your City Experience
                    </span>
                  </h1>
                  <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-lg">
                    CityZen revolutionizes how citizens interact with municipal services.
                    Report issues, book utilities, and stay connected with your city—all from one powerful platform.
                  </p>
                </div>
                {/* Feature Pills */}
                <div className="flex flex-wrap gap-3">
                  {features.slice(0, 3).map((feature, index) => (
                    <div key={index} className="flex items-center px-3 py-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-full text-sm text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      {feature}
                    </div>
                  ))}
                </div>
                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => handleNavigation('/auth/signup')}
                    disabled={isLoading['/auth/signup']}
                    className="group px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-70 flex items-center justify-center"
                  >
                    {isLoading['/auth/signup'] ? (
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        Get Started
                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </div>
              </div>
              {/* Hero Animation */}
              <div className="relative">
                <div className="relative bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 dark:border-gray-700/20">
                  <div className="text-center space-y-6">
                    <div className={`inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r ${heroSlides[currentSlide].gradient} rounded-2xl shadow-lg`}>
                      <span className="text-4xl">{heroSlides[currentSlide].icon}</span>
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {heroSlides[currentSlide].title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        {heroSlides[currentSlide].description}
                      </p>
                    </div>
                  </div>
                  {/* Slide Indicators */}
                  <div className="flex justify-center space-x-2 mt-8">
                    {heroSlides.map((_, index) => (
                      <button
                        key={index}
                        className={`h-2 rounded-full transition-all duration-500 ${index === currentSlide
                          ? 'bg-blue-500 w-8'
                          : 'bg-gray-300 dark:bg-gray-600 w-2'
                          }`}
                        onClick={() => setCurrentSlide(index)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Stats Section */}
        <section className="py-16 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="group text-center p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50 hover:-translate-y-2"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-4 group-hover:shadow-lg transition-shadow">
                    <stat.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 dark:text-gray-300 font-medium mb-2">
                    {stat.label}
                  </div>
                  <div className="flex items-center justify-center text-green-500 text-sm">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    {stat.change}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        {/* Services Section */}
        <section id="services" className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium mb-4">
                <Settings className="w-4 h-4 mr-2" />
                Our Services
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                Everything You Need in{' '}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  One Platform
                </span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Comprehensive digital solutions designed to make civic engagement seamless and efficient
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <div
                  key={index}
                  className="group p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-200 dark:border-gray-700 hover:-translate-y-3 hover:rotate-1"
                >
                  <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${service.color} rounded-2xl mb-6 group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
                    <service.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    {service.desc}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                      {service.stats}
                    </span>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all duration-300" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        {/* About Section */}
        <section id="about" className="py-20 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium mb-4">
                <Shield className="w-4 h-4 mr-2" />
                About CityZen
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                Building the{' '}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Future of Urban Living
                </span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                CityZen is a civic technology platform built in collaboration with municipal bodies to modernize urban governance and foster inclusive citizen participation.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {/* Item 1 */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md text-center hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-full">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Transparent Governance</h4>
                <p className="text-gray-600 dark:text-gray-300">
                  Real-time tools and dashboards ensure accountability between citizens and public offices.
                </p>
              </div>
              {/* Item 2 */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md text-center hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 rounded-full">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M3 10h4l3 8 4-16 3 8h4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Empowered Citizens</h4>
                <p className="text-gray-600 dark:text-gray-300">
                  Mobile-first access to civic services promotes inclusivity and fast issue resolution.
                </p>
              </div>
              {/* Item 3 */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md text-center hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 rounded-full">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M12 8v4l3 3" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M20.4 14.5A9 9 0 1112 3a9 9 0 018.4 11.5z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Smart City Operations</h4>
                <p className="text-gray-600 dark:text-gray-300">
                  Data-driven insights help city officials improve services, traffic, and infrastructure.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600"></div>
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to Build a{' '}
              <span className="text-yellow-300">Smarter City</span>?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of citizens who are already transforming their city experience with CityZen
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => handleNavigation('/auth/signup')}
                disabled={isLoading['/auth/signup']}
                className="group px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-70 flex items-center justify-center"
              >
                {isLoading['/auth/signup'] ? (
                  <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    Start Your Journey
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </div>
        </section>
        {/* Footer */}
        <footer id="contact" className="bg-gray-900 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-8">
              <div className="col-span-2">
                {/* Updated logo section */}
                <div className="flex items-center space-x-3 mb-6">
                  <img
                    src="/brand-logo.png"
                    alt="CityZen Logo"
                    className="w-12 h-12 rounded-xl shadow-lg transform hover:scale-105 transition-transform object-cover bg-white p-1 dark:bg-white"
                  />
                  <span className="text-2xl font-bold">CityZen</span>
                </div>
                <p className="text-gray-400 mb-6 max-w-md leading-relaxed">
                  Empowering citizens to build smarter, more connected communities through digital innovation and efficient municipal services.
                </p>
              </div>
              {/* Rest of footer content remains the same */}
              <div>
                <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
                <ul className="space-y-3 text-gray-400">
                  <li><a href="#services" className="hover:text-white transition-colors">Services</a></li>
                  <li><a href="#about" className="hover:text-white transition-colors">About Us</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-6">Contact</h3>
                <div className="space-y-3 text-gray-400">
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-blue-400" />
                    <span>+91 98765 43210</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-blue-400" />
                    <span>support@cityzen.gov.in</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-blue-400" />
                    <span>Municipal Corporation</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 mb-4 md:mb-0">
                &copy; 2025 CityZen Smart City Portal. All rights reserved.
              </p>
              <p className="text-gray-500 text-sm">
                Government of India Initiative
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}