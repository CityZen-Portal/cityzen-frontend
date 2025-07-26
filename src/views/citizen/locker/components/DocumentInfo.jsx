import React, { useState } from "react";

function formatBytes(bytes) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export default function DocumentInfo() {
  const [docs, setDocs] = useState([
    {
      id: 1,
      name: "OfferLetter.pdf",
      size: 120_000,
      uploadedAt: new Date().toISOString(),
      url: "#",
    },
    {
      id: 2,
      name: "AadharCard.png",
      size: 540_320,
      uploadedAt: new Date().toISOString(),
      url: "#",
    },
  ]);

  const [openUpload, setOpenUpload] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [successMsg, setSuccessMsg] = useState("");

  const [openUpdate, setOpenUpdate] = useState(false);
  const [editingDoc, setEditingDoc] = useState(null);
  const [editName, setEditName] = useState("");
  const [editFile, setEditFile] = useState(null);

  const openUploadModal = () => {
    setSelectedFiles([]);
    setOpenUpload(true);
  };

  const closeUploadModal = () => {
    setOpenUpload(false);
    setSelectedFiles([]);
  };

  const onFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    // <-- fixed missing parenthesis here -->
    setSelectedFiles(files.map((f) => ({ file: f, name: f.name })));
  };

  const uploadFiles = async () => {
    if (!selectedFiles.length) return;

    const newDocs = selectedFiles.map((f, idx) => ({
      id: Date.now() + idx,
      name: f.name || f.file.name,
      size: f.file.size,
      uploadedAt: new Date().toISOString(),
      url: "#",
    }));

    setDocs((d) => [...newDocs, ...d]);
    closeUploadModal();
    setSuccessMsg("Successfully uploaded");
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const downloadDoc = (doc) => {
    window.alert(`Downloading ${doc.name}`);
  };

  const deleteDoc = (id) => {
    setDocs((d) => d.filter((x) => x.id !== id));
  };

  const openUpdateModal = (id) => {
    const doc = docs.find((x) => x.id === id);
    if (!doc) return;
    setEditingDoc(doc);
    setEditName(doc.name);
    setEditFile(null);
    setOpenUpdate(true);
  };

  const closeUpdateModal = () => {
    setOpenUpdate(false);
    setEditingDoc(null);
    setEditName("");
    setEditFile(null);
  };

  const saveUpdate = () => {
    if (!editingDoc) return;
    setDocs((prev) =>
      prev.map((d) =>
        d.id === editingDoc.id
          ? {
              ...d,
              name: editName || d.name,
              size: editFile ? editFile.size : d.size,
              uploadedAt: editFile ? new Date().toISOString() : d.uploadedAt,
            }
          : d
      )
    );
    closeUpdateModal();
    setSuccessMsg("Document updated");
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const changeSelectedName = (index, value) => {
    setSelectedFiles((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], name: value };
      return copy;
    });
  };

  return (
    <div className="min-h-screen w-full bg-lightPrimary p-6 dark:bg-navy-900">
      <div className="mx-auto w-full">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-navy-700 dark:text-white">
            Documents
          </h1>

          <button
            onClick={openUploadModal}
            className="rounded-xl bg-brand-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-brand-600"
          >
            Upload Documents
          </button>
        </div>

        {successMsg && (
          <div className="mb-4 rounded-xl bg-green-500/10 p-3 text-sm text-green-600 dark:text-green-400">
            {successMsg}
          </div>
        )}

        <div className="overflow-hidden rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl dark:bg-navy-800">
          <table className="min-w-full table-auto text-left">
            <thead className="text-xs uppercase text-gray-500 dark:text-gray-400">
              <tr className="border-b border-white/10">
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Size</th>
                <th className="px-6 py-4">Uploaded</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm text-navy-700 dark:text-white">
              {docs.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-10 text-center text-gray-500 dark:text-gray-400"
                  >
                    No documents found
                  </td>
                </tr>
              )}

              {docs.map((doc) => (
                <tr
                  key={doc.id}
                  className="border-b border-white/5 last:border-none"
                >
                  <td className="break-all px-6 py-4">{doc.name}</td>
                  <td className="px-6 py-4">{formatBytes(doc.size)}</td>
                  <td className="px-6 py-4">
                    {new Date(doc.uploadedAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => downloadDoc(doc)}
                        className="rounded-lg px-3 py-1 text-xs font-medium text-brand-500 hover:underline"
                      >
                        Download
                      </button>
                      <button
                        onClick={() => openUpdateModal(doc.id)}
                        className="rounded-lg px-3 py-1 text-xs font-medium text-yellow-500 hover:underline"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => deleteDoc(doc.id)}
                        className="rounded-lg px-3 py-1 text-xs font-medium text-red-500 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {openUpload && (
        <div className="bg-black/40 fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl border border-white/20 bg-white/10 p-6 shadow-md backdrop-blur-xl dark:bg-navy-800">
            <h2 className="text-xl font-semibold text-navy-700 dark:text-white">
              Upload Documents
            </h2>

            <div className="mt-4">
              <input
                type="file"
                multiple
                onChange={onFileChange}
                className="w-full text-sm text-gray-700 file:mr-4 file:rounded-md file:border-0 file:bg-brand-500 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-brand-600 dark:text-gray-200"
              />
            </div>

            {selectedFiles.length > 0 && (
              <div className="mt-4 max-h-52 space-y-3 overflow-auto rounded-xl border border-white/10 p-3 text-sm text-gray-700 dark:text-gray-200">
                {selectedFiles.map((sf, i) => (
                  <div key={i} className="flex flex-col">
                    <label className="mb-1 text-xs text-gray-500 dark:text-gray-400">
                      {`Document ${i + 1}`}
                    </label>
                    <input
                      type="text"
                      value={sf.name}
                      onChange={(e) => changeSelectedName(i, e.target.value)}
                      className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 dark:border-white/20 dark:bg-navy-700 dark:text-white"
                    />
                    <span className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Size: {formatBytes(sf.file.size)}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={closeUploadModal}
                className="rounded-xl px-4 py-2 text-sm font-semibold text-gray-600 hover:underline dark:text-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={uploadFiles}
                className="rounded-xl bg-brand-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-brand-600 disabled:opacity-60"
                disabled={!selectedFiles.length}
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}

      {openUpdate && editingDoc && (
        <div className="bg-black/40 fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl border border-white/20 bg-white/10 p-6 shadow-md backdrop-blur-xl dark:bg-navy-800">
            <h2 className="text-xl font-semibold text-navy-700 dark:text-white">
              Update Document
            </h2>

            <div className="mt-4">
              <label className="mb-1 block text-xs text-gray-500 dark:text-gray-400">
                Current Name
              </label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 dark:border-white/20 dark:bg-navy-700 dark:text-white"
              />
            </div>

            <div className="mt-4">
              <label className="mb-1 block text-xs text-gray-500 dark:text-gray-400">
                Replace File (optional)
              </label>
              <input
                type="file"
                onChange={(e) => setEditFile(e.target.files?.[0] || null)}
                className="w-full text-sm text-gray-700 file:mr-4 file:rounded-md file:border-0 file:bg-brand-500 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-brand-600 dark:text-gray-200"
              />
              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Old size: {formatBytes(editingDoc.size)}
                {editFile && <> → New size: {formatBytes(editFile.size)}</>}
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={closeUpdateModal}
                className="rounded-xl px-4 py-2 text-sm font-semibold text-gray-600 hover:underline dark:text-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={saveUpdate}
                className="rounded-xl bg-brand-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-brand-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
