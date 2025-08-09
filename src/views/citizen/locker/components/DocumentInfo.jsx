import axios from "axios";
import React, { useEffect, useState } from "react";
import { Loader2, Upload } from "lucide-react";
import DocumentCard from "./DocumentCard";

export default function DocumentInfo() {
  const MEDIA_API =
    "https://media-api-service-hzx2.onrender.com/api/images/upload/base";
  const LOCKER_API = "http://localhost:4000";
  const USER_API = process.env.REACT_APP_API_UMS_URL;
  const token = localStorage.getItem("token");

  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [userInfo, setUserInfo] = useState({
    email: localStorage.getItem("email") || "",
    username: localStorage.getItem("username") || "",
    aadharNumber: 0,
  });

  const [showModal, setShowModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileNameInput, setFileNameInput] = useState("");

  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateFileName, setUpdateFileName] = useState("");
  const [updateSelectedFile, setUpdateSelectedFile] = useState(null);
  const [updateDocData, setUpdateDocData] = useState(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const userRes = await axios.get(
          `${USER_API}/api/auth/getUser/${userInfo.email}`,
          { headers: { token } }
        );
        const aadharNumber = userRes.data.data.aadhaar;
        setUserInfo((prev) => ({ ...prev, aadharNumber }));
        const docsRes = await axios.get(
          `${LOCKER_API}/api/lock/listDocument/${aadharNumber}`,
          { headers: { token } }
        );
        setDocs(docsRes.data.data || []);
      } catch {
        setErrorMsg("Failed to fetch user or documents");
      } finally {
        setLoading(false);
      }
    };
    if (userInfo.email) fetchAll();
  }, []);

  const uploadDocument = async () => {
    if (!selectedFile || !userInfo.aadharNumber || !fileNameInput.trim())
      return;
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", selectedFile);
      const mediaRes = await axios.post(`${MEDIA_API}`, formData, {
        headers: { "Content-Type": "multipart/form-data", token },
      });
      const { filePath } = mediaRes.data;
      if (!filePath) return;
      const lockerRes = await axios.post(
        `${LOCKER_API}/api/lock/add`,
        {
          aadharNumber: userInfo.aadharNumber,
          filePath,
          fileName: fileNameInput,
        },
        { headers: { token } }
      );
      setDocs((prev) => [...prev, lockerRes.data.data]);
      setShowModal(false);
      setSelectedFile(null);
      setFileNameInput("");
      setSuccessMsg("Document uploaded successfully");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch {
      setErrorMsg("Failed to upload document");
      setTimeout(() => setErrorMsg(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  const updateDocument = async () => {
    if (!updateDocData || !updateFileName.trim()) return;
    try {
      setLoading(true);
      let filePath = updateDocData.filePath;

      if (updateSelectedFile) {
        const formData = new FormData();
        formData.append("file", updateSelectedFile);
        const mediaRes = await axios.post(`${MEDIA_API}`, formData, {
          headers: { "Content-Type": "multipart/form-data", token },
        });
        filePath = mediaRes.data.filePath || filePath;
      }

      const res = await axios.put(
        `${LOCKER_API}/api/lock/update`,
        {
          aadharNumber: userInfo.aadharNumber,
          fileId: updateDocData.fileId,
          fileName: updateFileName,
          filePath,
        },
        { headers: { token } }
      );

      setDocs((prev) =>
        prev.map((doc) =>
          doc.fileId === updateDocData.fileId ? res.data.data : doc
        )
      );
      setShowUpdateModal(false);
      setUpdateFileName("");
      setUpdateSelectedFile(null);
      setUpdateDocData(null);
      setSuccessMsg("Document updated successfully");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch {
      setErrorMsg("Failed to update document");
      setTimeout(() => setErrorMsg(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  const downloadDoc = async (doc) => {
    try {
      const response = await fetch(doc.filePath);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = doc.fileName || "document";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch {}
  };

  const deleteDoc = async (doc) => {
    try {
      await axios.delete(
        `${LOCKER_API}/api/lock/delete/${userInfo.aadharNumber}/${doc.fileId}`,
        { headers: { token } }
      );
      setDocs((prev) => prev.filter((d) => d.fileId !== doc.fileId));
      setSuccessMsg("Document deleted successfully");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch {
      setErrorMsg("Failed to delete document");
      setTimeout(() => setErrorMsg(""), 3000);
    }
  };

  const updateDoc = (doc) => {
    setUpdateDocData(doc);
    setUpdateFileName(doc.fileName);
    setShowUpdateModal(true);
  };

  return (
    <div className="min-h-screen w-full bg-lightPrimary p-6 dark:bg-navy-900">
      <div className="mx-auto w-full max-w-5xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-navy-700 dark:text-white">
            Documents
          </h1>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600"
          >
            <Upload className="h-4 w-4" /> Upload
          </button>
        </div>

        {successMsg && (
          <div className="mb-4 rounded-xl bg-green-500/10 p-3 text-sm text-green-600">
            {successMsg}
          </div>
        )}
        {errorMsg && (
          <div className="mb-4 rounded-xl bg-red-500/10 p-3 text-sm text-red-600">
            {errorMsg}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
          </div>
        ) : docs.length === 0 ? (
          <div className="text-center text-gray-500">No documents found</div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {docs.map((doc) => (
              <DocumentCard
                key={doc.fileId}
                doc={doc}
                onDownload={downloadDoc}
                onDelete={deleteDoc}
                onUpdate={updateDoc}
              />
            ))}
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showModal && (
        <div className="bg-black/40 fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-navy-800">
            <h2 className="mb-4 text-xl font-semibold">Upload Document</h2>
            <input
              type="text"
              value={fileNameInput}
              onChange={(e) => setFileNameInput(e.target.value)}
              placeholder="Enter file name"
              className="mb-4 w-full rounded-lg border px-4 py-2"
            />
            <input
              type="file"
              onChange={(e) => {
                setSelectedFile(e.target.files[0]);
                setFileNameInput(e.target.files[0]?.name.split(".")[0] || "");
              }}
            />
            <div className="mt-4 flex justify-end gap-3">
              <button onClick={() => setShowModal(false)}>Cancel</button>
              <button onClick={uploadDocument}>Upload</button>
            </div>
          </div>
        </div>
      )}

      {/* Update Modal */}
      {showUpdateModal && (
        <div className="bg-black/40 fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-navy-800">
            <h2 className="mb-4 text-xl font-semibold text-navy-700 dark:text-white">
              Update Document
            </h2>

            {/* File Name Input */}
            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                New File Name
              </label>
              <input
                type="text"
                value={updateFileName}
                onChange={(e) => setUpdateFileName(e.target.value)}
                placeholder="Enter new file name"
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 shadow-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-navy-700 dark:text-white"
              />
            </div>

            {/* File Upload */}
            <div className="mb-4">
              <label
                htmlFor="update-file-upload"
                className="flex w-full cursor-pointer items-center justify-between rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-100 dark:border-gray-600 dark:bg-navy-700 dark:text-white dark:hover:bg-navy-600"
              >
                {updateSelectedFile ? updateSelectedFile.name : "Choose a file"}
                <span className="ml-4 rounded-md bg-brand-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-600 dark:bg-brand-400 dark:hover:bg-brand-300">
                  Browse
                </span>
                <input
                  id="update-file-upload"
                  type="file"
                  onChange={(e) => setUpdateSelectedFile(e.target.files[0])}
                  className="hidden"
                />
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowUpdateModal(false);
                  setUpdateFileName("");
                  setUpdateSelectedFile(null);
                }}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-white dark:hover:bg-navy-700"
              >
                Cancel
              </button>
              <button
                onClick={updateDocument}
                disabled={!updateFileName.trim() && !updateSelectedFile}
                className="rounded-md bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-50"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
