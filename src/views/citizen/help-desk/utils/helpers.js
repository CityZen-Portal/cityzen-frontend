// utils.js

export const statusOptions = [
  'pending',
  'under-review',
  'in-progress',
  'on-hold',
  'resolved',
  'rejected',
];

export const statusPriority = {
  pending:       1,
  "under-review": 2,
  assigned:      3,
  "in-progress": 4,
  "on-hold":     5,
  resolved:      6,
  rejected:      7,
};

export const getStatusColor = (status = "") => {
  const opt = status.trim().toLowerCase().replace(/ /g, "-");
  switch (opt) {
    case "pending":       return "bg-yellow-100 text-yellow-800 dark:bg-yellow-200 dark:text-yellow-900";
    case "under-review":  return "bg-amber-100 text-amber-800    dark:bg-amber-200  dark:text-amber-900";
    case "assigned":      return "bg-blue-100 text-blue-800      dark:bg-blue-200    dark:text-blue-900";
    case "in-progress":   return "bg-indigo-100 text-indigo-800  dark:bg-indigo-200  dark:text-indigo-900";
    case "on-hold":       return "bg-gray-200 text-gray-700      dark:bg-gray-400    dark:text-gray-900";
    case "resolved":      return "bg-green-100 text-green-800    dark:bg-green-200   dark:text-green-900";
    case "rejected":      return "bg-red-100 text-red-800        dark:bg-red-200     dark:text-red-900";
    default:              return "bg-gray-100 text-gray-800      dark:bg-gray-200    dark:text-gray-900";
  }
};

export const getStatusText = (status = "") => {
  const opt = status.trim().toLowerCase();
  switch (opt) {
    case "pending":       return "Pending";
    case "under-review":  return "Under-Review";
    case "assigned":      return "Assigned";
    case "in-progress":   return "In-Progress";
    case "on-hold":       return "On-Hold";
    case "resolved":      return "Resolved";
    case "rejected":      return "Rejected";
    default:              return status.charAt(0).toUpperCase() + status.slice(1);
  }
};

/**
 * Filters an array of complaints by optional statusFilter and free-text searchTerm.
 * - If statusFilter is provided, only complaints whose `.status` matches (case-insensitive) are kept.
 * - If searchTerm is non-empty, complaints whose `id` or any string field contains that substring (case-insensitive) are kept.
 * - Otherwise, all are returned.
 */
export const filterComplaints = (complaints, statusFilter = "", searchTerm = "") => {
  const lowerSearch = searchTerm.trim().toLowerCase();

  return complaints.filter((c) => {
    // 1) status filter
    if (
      statusFilter &&
      (c.status || "").toLowerCase() !== statusFilter.toLowerCase()
    ) {
      return false;
    }

    // 2) free-text search
    if (lowerSearch) {
      // match numeric id
      if (c.id.toString().includes(lowerSearch)) {
        return true;
      }

      // match any string field
      for (const val of Object.values(c)) {
        if (
          typeof val === "string" &&
          val.toLowerCase().includes(lowerSearch)
        ) {
          return true;
        }
      }

      // nothing matched
      return false;
    }

    // no search term ⇒ passed both filters
    return true;
  });
};

export const sortComplaints = (complaints, sortConfig) => {
  const { key, direction } = sortConfig || {};
  if (!key) return [...complaints];

  return [...complaints].sort((a, b) => {
    // special case: status by priority map
    if (key === "status") {
      const pa = statusPriority[a.status?.toLowerCase()] || 999;
      const pb = statusPriority[b.status?.toLowerCase()] || 999;
      return direction === "asc" ? pa - pb : pb - pa;
    }

    // numeric id
    if (key === "id") {
      return direction === "asc" ? a.id - b.id : b.id - a.id;
    }

    // date
    if (key === "createdAt") {
      const da = new Date(a.createdAt);
      const db = new Date(b.createdAt);
      return direction === "asc" ? da - db : db - da;
    }

    // fallback: string compare
    const sa = (a[key] || "").toString().toLowerCase();
    const sb = (b[key] || "").toString().toLowerCase();
    if (sa < sb) return direction === "asc" ? -1 : 1;
    if (sa > sb) return direction === "asc" ? 1 : -1;
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

export const handleSortChange = (key, prevSortConfig) => ({
  key,
  direction:
    prevSortConfig.key === key && prevSortConfig.direction === "asc"
      ? "desc"
      : "asc",
});
