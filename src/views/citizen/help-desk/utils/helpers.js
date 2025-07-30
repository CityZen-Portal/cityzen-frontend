
export const statusPriority = {
  'pending': 1,
  'under review': 2,
  'assigned': 3,
  'in progress': 4,
  'on hold': 5,
  'resolved': 6,
  'rejected': 7,
};

export const getStatusColor = (status = '') => {
  const option = status.trim().toLowerCase().replace(/ /g, "-");
  switch (option) {
    case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-200 dark:text-yellow-900';
    case 'under-review': return 'bg-amber-100 text-amber-800 dark:bg-amber-200 dark:text-amber-900';
    case 'assigned': return 'bg-blue-100 text-blue-800 dark:bg-blue-200 dark:text-blue-900';
    case 'in-progress': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-200 dark:text-indigo-900';
    case 'on-hold': return 'bg-gray-200 text-gray-700 dark:bg-gray-400 dark:text-gray-900';
    case 'resolved': return 'bg-green-100 text-green-800 dark:bg-green-200 dark:text-green-900';
    case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-200 dark:text-red-900';
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-200 dark:text-gray-900';
  }
};

export const getStatusText = (status = '') => {
  const option = status.trim().toLowerCase();
  switch (option) {
    case 'pending': return 'Pending';
    case 'under review': return 'Under Review';
    case 'assigned': return 'Assigned';
    case 'in progress': return 'In Progress';
    case 'on hold': return 'On Hold';
    case 'resolved': return 'Resolved';
    case 'rejected': return 'Rejected';
    default: return status.charAt(0).toUpperCase() + status.slice(1);
  }
};

export const filterComplaints = (complaints, statusFilter, searchTerm) => {
  return complaints.filter((c) => {
    const matchesStatus = statusFilter
      ? (c.status?.toLowerCase?.() || '') === statusFilter.toLowerCase()
      : true;

    const matchesSearch = searchTerm?.trim()
      ? (c.issue?.toLowerCase?.() || '').includes(searchTerm.toLowerCase()) ||
        (c.street?.toString?.().trim()?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (c.department?.toLowerCase?.() || '').includes(searchTerm.toLowerCase()) ||
        c.id.toString().includes(searchTerm)
      : true;

    return matchesStatus && matchesSearch;
  });
};

export const sortComplaints = (complaints, sortConfig) => {
  return [...complaints].sort((a, b) => {
    const { key, direction } = sortConfig;
    if (!key) return 0;

    if (key === 'status') {
      const aPriority = statusPriority[a.status?.toLowerCase()] || 999;
      const bPriority = statusPriority[b.status?.toLowerCase()] || 999;
      return direction === 'asc' ? aPriority - bPriority : bPriority - aPriority;
    }

    if (key === 'id') {
      const aVal = a[key];
      const bVal = b[key];
      if (aVal < bVal) return direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return direction === 'asc' ? 1 : -1;
      return 0;
    }

    if (key === 'createdAt') {
      const dateA = new Date(a['createdAt']);
      const dateB = new Date(b['createdAt']);
      return direction === 'asc' ? dateA - dateB : dateB - dateA;
    }

    const aVal = a[key]?.toString().toLowerCase();
    const bVal = b[key]?.toString().toLowerCase();
    if (aVal < bVal) return direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return direction === 'asc' ? 1 : -1;
    return 0;
  });
};

export const paginateComplaints = (complaints, currentPage, rowsPerPage) => {
  const totalPages = Math.ceil(complaints.length / rowsPerPage);
  const paginated = complaints.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );
  return { paginated, totalPages };
};

export const handleSortChange = (key, prevSortConfig) => {
  return {
    key,
    direction: prevSortConfig.key === key && prevSortConfig.direction === 'asc' ? 'desc' : 'asc',
  };
};
