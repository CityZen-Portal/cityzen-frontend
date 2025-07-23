import React, { useState, useMemo } from 'react';
import Card from 'components/card';
import Pagination from 'components/pagination';
import RequestDetails from '../../../staff/services/component/RequestDetails';
import initialRequests from '../../../staff/services/variable/sample';
import {
  MdOutlineAssignment,
  MdPendingActions,
  MdCheckCircleOutline,
  MdArrowUpward,
  MdArrowDownward,
  MdSort
} from 'react-icons/md';

const CitizenServiceRequests = ({ currentCitizenName }) => {
  const [viewingDetails, setViewingDetails] = useState(null);
  const [viewMode, setViewMode] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

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

  const sortedRequests = useMemo(() => {
    return [...filteredRequests].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (sortField === 'date') {
        return sortDirection === 'asc' ? new Date(aVal) - new Date(bVal) : new Date(bVal) - new Date(aVal);
      }
      if (typeof aVal === 'string') {
        return sortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
    });
  }, [filteredRequests, sortField, sortDirection]);

  const totalPages = Math.ceil(sortedRequests.length / itemsPerPage);
  const paginatedRequests = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedRequests.slice(start, start + itemsPerPage);
  }, [sortedRequests, currentPage, itemsPerPage]);

  return (
    <div className="p-6 bg-slate-50 dark:bg-navy-900 rounded-xl shadow-xl">
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-3">
          {['all', 'pending', 'completed'].map(mode => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-200 shadow-sm flex items-center gap-1 ${
                viewMode === mode ? 'bg-indigo-600 text-white' : 'bg-white text-slate-700 border border-slate-300'
              }`}
            >
              {mode === 'all' && <MdOutlineAssignment className="inline" />}
              {mode === 'pending' && <MdPendingActions className="inline" />}
              {mode === 'completed' && <MdCheckCircleOutline className="inline" />}
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </button>
          ))}
        </div>

        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          className="border border-slate-300 px-4 py-2 rounded-lg text-sm shadow-sm w-60 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <Card extra="">
        <div className="overflow-x-auto rounded-xl">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-700 bg-slate-100">
              <tr>
                {['service', 'date', 'status'].map(field => (
                  <th
                    key={field}
                    scope="col"
                    className="px-6 py-3 cursor-pointer select-none"
                    onClick={() => handleSort(field)}
                  >
                    <div className="flex items-center gap-1">
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                      {sortField === field ? (
                        sortDirection === 'asc' ? <MdArrowUpward /> : <MdArrowDownward />
                      ) : (
                        <MdSort className="text-gray-400" />
                      )}
                    </div>
                  </th>
                ))}
                <th scope="col" className="px-6 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedRequests.map((request) => (
                <tr key={request.id} className="bg-white border-b hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium text-slate-900">{request.service}</td>
                  <td className="px-6 py-4">{request.date}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => setViewingDetails(request)}
                      className="px-4 py-1.5 bg-indigo-100 text-indigo-700 rounded-lg text-xs font-medium hover:bg-indigo-200"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredRequests.length > 0 && (
          <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-sm text-slate-600">
            <div>
              {/* Showing {Math.min((currentPage - 1) * itemsPerPage + 1, sortedRequests.length)}
              -{Math.min(currentPage * itemsPerPage, sortedRequests.length)} of {sortedRequests.length} requests */}
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={page => setCurrentPage(page)}
            />
          </div>
        )}
      </Card>

      <RequestDetails viewingDetails={viewingDetails} setViewingDetails={setViewingDetails} />
    </div>
  );
};

export default CitizenServiceRequests;
