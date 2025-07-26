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

  const [openModal, setOpenModal] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [successMsg, setSuccessMsg] = useState("");

  const openUpload = () => {
    setSelectedFiles([]);
    setOpenModal(true);
  };

  const closeUpload = () => {
    setOpenModal(false);
    setSelectedFiles([]);
  };

  const onFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(files);
  };

  const uploadFiles = async () => {
    if (!selectedFiles.length) return;

    const newDocs = selectedFiles.map((f, idx) => ({
      id: Date.now() + idx,
      name: f.name,
      size: f.size,
      uploadedAt: new Date().toISOString(),
      url: "#",
    }));

    setDocs((d) => [...newDocs, ...d]);
    closeUpload();
    setSuccessMsg("Successfully uploaded");
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const downloadDoc = (doc) => {
    // replace with real download logic
    window.alert(`Downloading ${doc.name}`);
  };

  const deleteDoc = (id) => {
    setDocs((d) => d.filter((x) => x.id !== id));
  };

  const updateDoc = (id) => {
    const newName = window.prompt("Rename document:");
    if (!newName) return;
    setDocs((d) => d.map((x) => (x.id === id ? { ...x, name: newName } : x)));
  };

  return (
    <div className="min-h-screen w-full bg-lightPrimary p-6 dark:bg-navy-900">
      <div className="mx-auto w-full ">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-navy-700 dark:text-white">
            Documents
          </h1>

          <button
            onClick={openUpload}
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
                  <td className="px-6 py-4">{doc.name}</td>
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
                        onClick={() => updateDoc(doc.id)}
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

      {openModal && (
        <div className="bg-black/40 fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur-xl dark:bg-navy-800">
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
              <ul className="mt-4 max-h-40 overflow-auto rounded-xl border border-white/10 p-3 text-sm text-gray-700 dark:text-gray-200">
                {selectedFiles.map((f, i) => (
                  <li key={i} className="flex justify-between">
                    <span>{f.name}</span>
                    <span className="ml-4 shrink-0">{formatBytes(f.size)}</span>
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={closeUpload}
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
    </div>
  );
}
