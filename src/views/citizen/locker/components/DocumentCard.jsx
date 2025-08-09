import React from "react";
import { ArrowDownToLine, Trash2, Pencil } from "lucide-react";

const DocumentCard = ({ doc, onDownload, onDelete, onUpdate }) => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xl transition-all dark:border-navy-600 dark:bg-navy-800 dark:text-white">
      {/* Header */}
      <div className="mb-4">
        <h2 className="break-words text-lg font-semibold">
          {doc.fileName || "unknown file"}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-300">
          Uploaded: {new Date(doc.creationDate).toLocaleString()}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap justify-between gap-2">
        <button
          onClick={() => onUpdate(doc)}
          className="flex w-full items-center justify-center gap-1 rounded-md bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-600 dark:bg-indigo-400 dark:hover:bg-indigo-300"
        >
          <Pencil size={16} />
          Update
        </button>
        <button
          onClick={() => onDownload(doc)}
          className="flex w-full items-center justify-center gap-1 rounded-md bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-600"
        >
          <ArrowDownToLine size={16} />
          Download
        </button>
        <button
          onClick={() => onDelete(doc)}
          className="flex w-full items-center justify-center gap-1 rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
        >
          <Trash2 size={16} />
          Delete
        </button>
      </div>
    </div>
  );
};

export default DocumentCard;
