import React, { useState, useCallback } from 'react';
import {
  Heart, MapPin, Calendar, Clock, Users, User, Phone, Mail, FileText, CheckCircle, Share2, Check, AlertTriangle
} from 'lucide-react';
import { useParams } from 'react-router-dom';

const sampleVolunteers = [
  {
    id: 2,
    programTitle: "Community Health Volunteer",
    location: "Various locations in Coimbatore",
    programDescription: "Join our community health initiative to promote healthcare awareness and support health programs in various neighborhoods. Volunteers will conduct health surveys, assist in vaccination drives, and educate communities about preventive healthcare measures.",
    programDate: "2025-08-10",
    programTime: "9:00 AM - 5:00 PM",
    duration: "6 months program",
    coordinatorName: "Ms. Priya Sharma",
    coordinatorPhone: "+91 87654 32109",
    coordinatorEmail: "priya.sharma@coimbatore.gov.in",
    coordinatorAddress: "Health Department, Municipal Corporation Office, Coimbatore",
    isActive: true
  },
  {
    id: 4,
    programTitle: "Tree Plantation Drive",
    location: "Coimbatore City Parks",
    programDescription: "Participate in our city-wide tree plantation initiative to increase green cover and promote environmental sustainability. Volunteers will help plant saplings, maintain plant records, and support ongoing tree care activities.",
    programDate: "2025-08-12",
    programTime: "6:00 AM - 10:00 AM",
    duration: "One-time event with follow-up care",
    coordinatorName: "Dr. Meera Nair",
    coordinatorPhone: "+91 76543 21098",
    coordinatorEmail: "meera.nair@coimbatore.gov.in",
    coordinatorAddress: "Environment Department, Municipal Corporation, Coimbatore",
    isActive: true
  }
];

const VolunteerDetailsPage = () => {
  const {id} = useParams();
  const volunteerId = parseInt(id, 10);
  const [copySuccess, setCopySuccess] = useState(false);
  
  const volunteer = sampleVolunteers.find(v => v.id.toString() === volunteerId.toString());

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const handleShare = useCallback(() => {
    if (navigator.share && volunteer) {
      navigator.share({
        title: volunteer.programTitle,
        text: `Check out this volunteer opportunity: ${volunteer.programTitle}`,
        url: window.location.href
      });
    } else {
      const url = `${window.location.origin}${window.location.pathname}#volunteer-${volunteerId}`;
      navigator.clipboard.writeText(url).then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      });
    }
  }, [volunteer, volunteerId]);

  if (!volunteer) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="text-gray-400" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Program Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">The volunteer program you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Program Details</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">Volunteer Opportunity</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={handleShare}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
                title="Share program"
              >
                {copySuccess ? (
                  <Check className="text-green-600 dark:text-green-400" size={20} />
                ) : (
                  <Share2 className="text-gray-600 dark:text-gray-400" size={20} />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-green-100 dark:bg-green-900/30">
                    <Heart className="text-green-600 dark:text-green-400" size={32} />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                      {volunteer.programTitle}
                    </h1>
                    <div className="flex items-center gap-4">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                        <Heart size={16} />
                        Volunteer Opportunity
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="flex items-center gap-3">
                  <MapPin className="text-gray-400" size={20} />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Location</p>
                    <p className="font-medium text-gray-900 dark:text-white">{volunteer.location}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="text-gray-400" size={20} />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Program Date</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {formatDate(volunteer.programDate)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="text-gray-400" size={20} />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Time</p>
                    <p className="font-medium text-gray-900 dark:text-white">{volunteer.programTime}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Users className="text-gray-400" size={20} />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Duration</p>
                    <p className="font-medium text-gray-900 dark:text-white">{volunteer.duration}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                <FileText className="text-green-600 dark:text-green-400" size={24} />
                Program Description
              </h2>
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap text-lg">
                  {volunteer.programDescription}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg p-6 sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                <User className="text-purple-600 dark:text-purple-400" size={20} />
                Coordinator Information
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <User className="text-gray-400 mt-1" size={18} />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Coordinator</p>
                    <p className="font-medium text-gray-900 dark:text-white">{volunteer.coordinatorName}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="text-gray-400 mt-1" size={18} />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                    <a 
                      href={`tel:${volunteer.coordinatorPhone}`}
                      className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      {volunteer.coordinatorPhone}
                    </a>
                  </div>
                </div>

                {volunteer.coordinatorEmail && (
                  <div className="flex items-start gap-3">
                    <Mail className="text-gray-400 mt-1" size={18} />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                      <a 
                        href={`mailto:${volunteer.coordinatorEmail}`}
                        className="font-medium text-blue-600 dark:text-blue-400 hover:underline break-all"
                      >
                        {volunteer.coordinatorEmail}
                      </a>
                    </div>
                  </div>
                )}

                {volunteer.coordinatorAddress && (
                  <div className="flex items-start gap-3">
                    <MapPin className="text-gray-400 mt-1" size={18} />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Address</p>
                      <p className="font-medium text-gray-900 dark:text-white leading-relaxed">
                        {volunteer.coordinatorAddress}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-2 gap-3">
                  <a
                    href={`tel:${volunteer.coordinatorPhone}`}
                    className="flex items-center justify-center gap-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 py-2 px-3 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors text-sm font-medium"
                  >
                    <Phone size={16} />
                    Call
                  </a>
                  {volunteer.coordinatorEmail && (
                    <a
                      href={`mailto:${volunteer.coordinatorEmail}`}
                      className="flex items-center justify-center gap-2 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 py-2 px-3 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors text-sm font-medium"
                    >
                      <Mail size={16} />
                      Email
                    </a>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Program Type</span>
                  <span className="font-medium text-gray-900 dark:text-white capitalize">
                    Volunteer Opportunity
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Date</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {formatDate(volunteer.programDate)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Time</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {volunteer.programTime}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Status</span>
                  <span className="font-medium text-green-600 dark:text-green-400">
                    Active
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VolunteerDetailsPage;