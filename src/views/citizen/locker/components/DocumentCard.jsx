import React from "react";
import { Download, Trash2, Eye, Edit, Loader2 } from "lucide-react";

export default function DocumentCard({
  title,
  description,
  uploadedBy,
  date,
  fileType,
  onView,
  onDownload,
  onDelete,
  onUpdate,
  loadingView = false,
  loadingDownload = false,
  loadingUpdate = false,
  loadingDelete = false,
}) {
  return (
    <div className="relative flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-lg dark:border-gray-700 dark:bg-gray-900">
      {fileType && (
        <span className="absolute right-4 top-4 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300">
          {fileType.toUpperCase()}
        </span>
      )}

      <div>
        <h3 className="truncate text-lg font-semibold text-gray-900 dark:text-white">
          {title}
        </h3>

        <div className="mt-2 flex items-center justify-between text-xs text-gray-400 dark:text-gray-500">
          <span>
            {new Date(date).toLocaleDateString([], {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}{" "}
            {new Date(date).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      </div>

      <div className="flex justify-between gap-3">
        <IconButton
          onClick={onView}
          title="View"
          color="gray"
          loading={loadingView}
          icon={<Eye />}
        />
        <IconButton
          onClick={onDownload}
          title="Download"
          color="blue"
          loading={loadingDownload}
          icon={<Download />}
        />
        <IconButton
          onClick={onUpdate}
          title="Update"
          color="yellow"
          loading={loadingUpdate}
          icon={<Edit />}
        />
        <IconButton
          onClick={onDelete}
          title="Delete"
          color="red"
          loading={loadingDelete}
          icon={<Trash2 />}
        />
      </div>
    </div>
  );
}

function IconButton({ onClick, title, color, loading, icon }) {
  const colors = {
    gray: "border-gray-200 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300",
    blue: "border-blue-500 bg-blue-500 hover:bg-blue-600 text-white",
    yellow: "border-yellow-500 bg-yellow-500 hover:bg-yellow-600 text-white",
    red: "border-red-500 bg-red-500 hover:bg-red-600 text-white",
  };

  return (
    <button
      onClick={loading ? undefined : onClick}
      title={title}
      disabled={loading}
      className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-colors duration-200 ${
        colors[color]
      } ${loading ? "cursor-wait" : "cursor-pointer"}`}
    >
      {loading ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        React.cloneElement(icon, { className: "h-5 w-5" })
      )}
    </button>
  );
}
