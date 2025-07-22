import React, { useState, useMemo } from 'react';
import RequestDetails  from '../../../staff/services/component/RequestDetails';
import initialRequests from '../../../staff/services/variable/sample';
import Card from 'components/card';
import { MdOutlineAssignment, MdPendingActions, MdCheckCircleOutline } from "react-icons/md";

const CitizenServiceRequests = ({ currentCitizenName }) => {
  const [viewingDetails, setViewingDetails] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('all');
  console.log(initialRequests)
  const filteredRequests = useMemo(() => {
    let filtered = initialRequests.filter(req => req.citizenName === currentCitizenName);
    if (viewMode !== 'all') {
      filtered = filtered.filter(req => req.status === viewMode);
    }
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(req =>
        req.service.toLowerCase().includes(term) ||
        req.date.toLowerCase().includes(term) ||
        req.status.toLowerCase().includes(term) ||
        (req.description && req.description.toLowerCase().includes(term))
      );
    }
    return filtered;
  }, [searchTerm, viewMode, currentCitizenName]);

  return (
    <div className="mt-5">
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          {['all', 'pending', 'completed'].map(mode => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-3 py-2 rounded-lg text-sm font-medium ${
                viewMode === mode ? 'bg-brand-500 text-white' : 'bg-white text-navy-700 dark:bg-navy-700 dark:text-white'
              }`}
            >
              {mode === 'all' && <MdOutlineAssignment className="inline mr-1" />}
              {mode === 'pending' && <MdPendingActions className="inline mr-1" />}
              {mode === 'completed' && <MdCheckCircleOutline className="inline mr-1" />}
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="Search..."
          className="border px-3 py-2 rounded-lg text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredRequests.length === 0 ? (
        <div className="p-5 bg-gray-50 dark:bg-navy-900 rounded-xl text-center">
          <p className="text-lg font-semibold text-navy-700 dark:text-white">No Service Requests Found</p>
          <p className="text-gray-500 dark:text-gray-400">You have not submitted any requests yet.</p>
        </div>
      ) : (
        <Card extra="">
          <div className="overflow-x-auto rounded-xl">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100 dark:bg-navy-900 border-b">
                  <th className="py-3 px-4 text-left">Service</th>
                  <th className="py-3 px-4 text-left">Date</th>
                  <th className="py-3 px-4 text-left">Status</th>
                  <th className="py-3 px-4 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map((request) => (
                  <tr key={request.id} className="border-b hover:bg-gray-50 dark:hover:bg-navy-800">
                    <td className="py-3 px-4">{request.service}</td>
                    <td className="py-3 px-4">{request.date}</td>
                    <td className="py-3 px-4">
                      <span className={`text-xs px-3 py-1 rounded-full font-semibold ${request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => setViewingDetails(request)}
                        className="px-3 py-1 rounded-lg text-sm bg-blue-100 text-blue-700 hover:bg-blue-200"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <RequestDetails viewingDetails={viewingDetails} setViewingDetails={setViewingDetails} />
    </div>
  );
};

export default CitizenServiceRequests;
