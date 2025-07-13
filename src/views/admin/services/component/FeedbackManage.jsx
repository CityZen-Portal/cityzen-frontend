import React, { useState } from 'react';
import { ChatBubbleLeftEllipsisIcon, ExclamationTriangleIcon } from '@heroicons/react/24/solid';

function FeedbackManage() {
  const [activeTab, setActiveTab] = useState('feedback');
  const [selectedFeedback, setSelectedFeedback] = useState(null);

  const [feedbacks] = useState([
    {
      id: 1,
      type: 'feedback',
      citizen: 'Poovarasan',
      date: '2024-01-15',
      content: 'The new park maintenance service is excellent! Very satisfied with the cleanliness.',
      status: 'New',
    },
    {
      id: 2,
      type: 'complaint',
      citizen: 'Mary Johnson',
      date: '2024-01-14',
      service: 'Garbage Collection',
      content: 'Garbage was not collected on the scheduled day.',
      status: 'In Progress',
    },
  ]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'in progress': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      <div className="bg-white shadow-md rounded-md">
        <div className="bg-blue-600 text-white px-6 py-4 rounded-t-md">
          <h2 className="text-lg font-bold">Feedback Management</h2>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 px-6 pt-4 space-x-4">
          <button
            className={`flex items-center px-3 py-2 rounded-t-md font-medium ${activeTab === 'feedback' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('feedback')}
          >
            <ChatBubbleLeftEllipsisIcon className="h-4 w-4 mr-2" />
            General Feedback
          </button>
          <button
            className={`flex items-center px-3 py-2 rounded-t-md font-medium ${activeTab === 'complaints' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('complaints')}
          >
            <ExclamationTriangleIcon className="h-4 w-4 mr-2" />
            Service Complaints
          </button>
        </div>

        {/* Table */}
        <div className="p-4 overflow-x-auto">
          <table className="w-full table-auto text-sm text-left text-gray-700">
            <thead className="text-xs text-gray-500 uppercase">
              <tr>
                {activeTab === 'feedback' ? (
                  <>
                    <th className="px-4 py-2">Citizen</th>
                    <th className="px-4 py-2">Date</th>
                    <th className="px-4 py-2">Feedback</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2">Action</th>
                  </>
                ) : (
                  <>
                    <th className="px-4 py-2">Citizen</th>
                    <th className="px-4 py-2">Date</th>
                    <th className="px-4 py-2">Service</th>
                    <th className="px-4 py-2">Complaint</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2">Action</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {feedbacks
                .filter(f => f.type === activeTab)
                .map(item => (
                  <tr key={item.id} className="border-b">
                    <td className="px-4 py-2">{item.citizen}</td>
                    <td className="px-4 py-2">{item.date}</td>
                    {activeTab === 'feedback' ? (
                      <>
                        <td className="px-4 py-2">{item.content.slice(0, 50)}...</td>
                        <td className="px-4 py-2">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(item.status)}`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="px-4 py-2">
                          <button
                            onClick={() => setSelectedFeedback(item)}
                            className="text-blue-600 hover:underline"
                          >
                            View Details
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-4 py-2">{item.service}</td>
                        <td className="px-4 py-2">{item.content.slice(0, 40)}...</td>
                        <td className="px-4 py-2">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(item.status)}`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="px-4 py-2">
                          <button
                            onClick={() => setSelectedFeedback(item)}
                            className="text-blue-600 hover:underline"
                          >
                            View Details
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {selectedFeedback && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6">
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h3 className="text-lg font-bold">
                {selectedFeedback.type === 'complaint' ? 'Complaint Details' : 'Feedback Details'}
              </h3>
              <button onClick={() => setSelectedFeedback(null)} className="text-gray-500 hover:text-black">✕</button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm font-semibold text-gray-600">Citizen:</p>
                <p>{selectedFeedback.citizen}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600">Date:</p>
                <p>{selectedFeedback.date}</p>
              </div>
              {selectedFeedback.type === 'complaint' && (
                <div>
                  <p className="text-sm font-semibold text-gray-600">Service:</p>
                  <p>{selectedFeedback.service}</p>
                </div>
              )}
              <div>
                <p className="text-sm font-semibold text-gray-600">{selectedFeedback.type === 'complaint' ? 'Complaint:' : 'Feedback:'}</p>
                <p>{selectedFeedback.content}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600">Status:</p>
                <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(selectedFeedback.status)}`}>
                  {selectedFeedback.status}
                </span>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-1">Response:</p>
                <textarea
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  rows="3"
                  placeholder="Add your response here..."
                ></textarea>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button onClick={() => setSelectedFeedback(null)} className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100">
                Close
              </button>
              <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                Update Status
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FeedbackManage;
