import axios from "axios";
import React, { useEffect, useState } from "react";

export default function DocumentInfo() {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [openUpload, setOpenUpload] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [successMsg, setSuccessMsg] = useState("");

  const [openUpdate, setOpenUpdate] = useState(false);
  const [editingDoc, setEditingDoc] = useState(null);
  const [editName, setEditName] = useState("");
  const [editFile, setEditFile] = useState(null);

  const aadharNumber = "1234564447421241778";
  const API_BASE = "http://localhost:8080";

  useEffect(() => {
    let cancelled = false;
    const fetchData = async () => {
      setLoading(true);
      setErrorMsg("");
      try {
        const response = await axios.get(
          `${API_BASE}/api/lock/listDocument/${aadharNumber}`
        );
        if (!cancelled) {
          setDocs(response.data?.data || []);
        }
      } catch (error) {
        if (!cancelled) {
          console.error(error);
          setErrorMsg(
            error?.response?.data?.message || "Failed to fetch documents"
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchData();
    return () => {
      cancelled = true;
    };
  }, [API_BASE, aadharNumber]);

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
    setSelectedFiles(files.map((f) => ({ file: f, name: f.name })));
  };

  const uploadFiles = async () => {
    if (!selectedFiles.length) return;

    const newDocs = selectedFiles.map((f, idx) => ({
      fileId: Date.now() + idx,
      fileName: f.name || f.file.name,
      creationDate: new Date().toISOString(),
      url: "#",
    }));

    setDocs((d) => [...newDocs, ...d]);
    closeUploadModal();
    setSuccessMsg("Successfully uploaded");
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const downloadDoc = (doc) => {
    window.alert(`Downloading ${doc.fileName}`);
  };

  const deleteDoc = (id) => {
    setDocs((d) => d.filter((x) => x.fileId !== id));
    setSuccessMsg("Document deleted");
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const openUpdateModal = (id) => {
    const doc = docs.find((x) => x.fileId === id);
    if (!doc) return;
    setEditingDoc(doc);
    setEditName(doc.fileName);
    setEditFile(null);
    setOpenUpdate(true);
  };

  const closeUpdateModal = () => {
    setOpenUpdate(false);
    setEditingDoc(null);
    setEditName("");
    setEditFile(null);
  };

  const saveUpdate = async () => {
    if (!editingDoc) return;

    setDocs((prev) =>
      prev.map((d) =>
        d.fileId === editingDoc.fileId
          ? {
              ...d,
              fileName: editName || d.fileName,
              creationDate: editFile
                ? new Date().toISOString()
                : d.creationDate,
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
    <div className="min-h-screen w-full bg-lightPrimary p-4 dark:bg-navy-900 sm:p-6">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-6 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <h1 className="text-xl font-bold text-navy-700 dark:text-white sm:text-2xl">
            Documents
          </h1>
          <button
            onClick={openUploadModal}
            className="rounded-xl bg-brand-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-600"
          >
            Upload Documents
          </button>
        </div>

        {successMsg && (
          <div className="mb-4 rounded-xl bg-green-500/10 p-3 text-sm text-green-600 dark:text-green-400">
            {successMsg}
          </div>
        )}
        {errorMsg && (
          <div className="mb-4 rounded-xl bg-red-500/10 p-3 text-sm text-red-600 dark:text-red-400">
            {errorMsg}
          </div>
        )}
        {loading && (
          <div className="rounded-2xl border border-white/10 p-6 text-center text-sm text-gray-500 dark:text-gray-400">
            Loading documents...
          </div>
        )}

        {!loading && (
          <>
            {/* Desktop / Tablet table */}
            <div className="hidden overflow-x-auto rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl dark:bg-navy-800 sm:block">
              <table className="min-w-full table-auto text-left">
                <thead className="text-xs uppercase text-gray-500 dark:text-gray-400">
                  <tr className="border-b border-white/10">
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Uploaded</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-navy-700 dark:text-white">
                  {docs.length === 0 && (
                    <tr>
                      <td
                        colSpan={3}
                        className="px-6 py-10 text-center text-gray-500 dark:text-gray-400"
                      >
                        No documents found
                      </td>
                    </tr>
                  )}
                  {docs.map((doc) => (
                    <tr
                      key={doc.fileId}
                      className="border-b border-white/5 last:border-none"
                    >
                      <td className="break-all px-6 py-4">{doc.fileName}</td>
                      <td className="px-6 py-4">
                        {new Date(doc.creationDate).toLocaleString()}
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
                            onClick={() => openUpdateModal(doc.fileId)}
                            className="rounded-lg px-3 py-1 text-xs font-medium text-yellow-500 hover:underline"
                          >
                            Update
                          </button>
                          <button
                            onClick={() => deleteDoc(doc.fileId)}
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

            {/* Mobile cards */}
            <div className="space-y-3 sm:hidden">
              {docs.length === 0 && (
                <div className="rounded-2xl border border-white/20 bg-white/10 p-4 text-center text-gray-500 dark:text-gray-400">
                  No documents found
                </div>
              )}
              {docs.map((doc) => (
                <div
                  key={doc.fileId}
                  className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-xl dark:bg-navy-800"
                >
                  <p className="break-all text-sm font-semibold text-navy-700 dark:text-white">
                    {doc.fileName}
                  </p>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {new Date(doc.creationDate).toLocaleString()}
                  </p>

                  <div className="mt-3 flex items-center justify-end gap-2">
                    <button
                      onClick={() => downloadDoc(doc)}
                      className="rounded-lg px-3 py-1 text-xs font-medium text-brand-500 hover:underline"
                    >
                      Download
                    </button>
                    <button
                      onClick={() => openUpdateModal(doc.fileId)}
                      className="rounded-lg px-3 py-1 text-xs font-medium text-yellow-500 hover:underline"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => deleteDoc(doc.fileId)}
                      className="rounded-lg px-3 py-1 text-xs font-medium text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {openUpload && (
        <div className="bg-black/40 fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-2xl border border-white/20 bg-white/10 p-6 shadow-md backdrop-blur-xl dark:bg-navy-800 md:max-w-lg">
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
          <div className="w-full max-w-sm rounded-2xl border border-white/20 bg-white/10 p-6 shadow-md backdrop-blur-xl dark:bg-navy-800 md:max-w-lg">
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
