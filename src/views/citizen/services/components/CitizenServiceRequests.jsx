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
  MdSort,
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
    let filtered = initialRequests.filter((req) => req.citizenName === currentCitizenName);
    if (viewMode !== 'all') {
      filtered = filtered.filter((req) => req.status === viewMode);
    }
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (req) =>
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
        return sortDirection === 'asc'
          ? new Date(aVal) - new Date(bVal)
          : new Date(bVal) - new Date(aVal);
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
    <div className="p-6 bg-white dark:bg-navy-800 text-slate-800 dark:text-slate-100 rounded-2xl ">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex flex-wrap gap-2">
          {['all', 'pending', 'completed'].map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold flex items-center gap-2 transition-all duration-200 
                ${viewMode === mode
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 dark:bg-navy-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-navy-600'}`}
            >
              {mode === 'all' && <MdOutlineAssignment />}
              {mode === 'pending' && <MdPendingActions />}
              {mode === 'completed' && <MdCheckCircleOutline />}
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </button>
          ))}
        </div>

        <input
          type="text"
          placeholder="Search service, status, date..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="border  dark:border-navy-600 bg-white dark:bg-navy-700 text-sm px-4 py-2 rounded-lg w-full sm:w-72 focus:outline-none focus:ring-2 focus:ring-indigo-500 "
        />
      </div>

      {/* <Card extra=" bg-white"> */}
        <div className=" rounded-xl">
          <table className="min-w-full text-sm text-left border-collapse">
            <thead className=" dark:bg-navy-700 text-slate-800 dark:text-slate-100">
              <tr className="text-xs uppercase tracking-wider">
                {['service', 'date', 'status'].map((field) => (
                  <th
                    key={field}
                    onClick={() => handleSort(field)}
                    className="px-6 py-3 cursor-pointer select-none hover:text-indigo-600"
                  >
                    <div className="flex items-center gap-1">
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                      {sortField === field ? (
                        sortDirection === 'asc' ? <MdArrowUpward /> : <MdArrowDownward />
                      ) : (
                        <MdSort className="text-gray-400 dark:text-slate-500" />
                      )}
                    </div>
                  </th>
                ))}
                <th className="px-6 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedRequests.length > 0 ? (
                paginatedRequests.map((request) => (
                  <tr
                    key={request.id}
                    className="bg-white dark:bg-navy-700 border-b dark:border-navy-600 hover:bg-slate-50 dark:hover:bg-navy-600 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                      {request.service}
                    </td>
                    <td className="px-6 py-4">{request.date}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold 
                          ${
                            request.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-200/20 dark:text-yellow-400'
                              : 'bg-green-100 text-green-800 dark:bg-green-200/20 dark:text-green-400'
                          }`}
                      >
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setViewingDetails(request)}
                        className="px-4 py-1.5 bg-indigo-100 dark:bg-indigo-600 text-indigo-700 dark:text-white rounded-lg text-xs font-medium hover:bg-indigo-200 dark:hover:bg-indigo-500 transition-all"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-white dark:text-slate-400">
                    No requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {filteredRequests.length > 0 && (
          <div className="mt-4 flex bg-white dark:bg-navy-800 flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-sm text-slate-600 dark:text-slate-300">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </div>
        )}
      {/* </Card> */}

      <RequestDetails viewingDetails={viewingDetails} setViewingDetails={setViewingDetails} />
    </div>
  );
};

export default CitizenServiceRequests;
