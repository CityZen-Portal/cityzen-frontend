import axios from "axios";
import React, { useEffect, useState } from "react";

function formatBytes(bytes) {
  if (!bytes && bytes !== 0) return "-";
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

const MEDIA_API = "https://media-api-service-hzx2.onrender.com";
const LOCKER_API = "https://locker-management-service.onrender.com";
const USER_API = "https://auth-backend-cpcr.onrender.com";

export default function DocumentInfo() {
  const [docs, setDocs] = useState([]);
  const [openUpload, setOpenUpload] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedName, setSelectedName] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [openUpdate, setOpenUpdate] = useState(false);
  const [editingDoc, setEditingDoc] = useState(null);
  const [editName, setEditName] = useState("");
  const [editFile, setEditFile] = useState(null);

  const [userInfo, setUserInfo] = useState({
    email: localStorage.getItem("email"),
    aadharNumber: 0,
    username: localStorage.getItem("username"),
  });

  const fetchUserInfo = async () => {
    try {
      const response = await axios.get(
        `${USER_API}/api/auth/getUser/${userInfo.email}`
      );
      const aadharNumber = response.data.data.aadharNumber;

      setUserInfo((prev) => ({
        ...prev,
        aadharNumber: aadharNumber,
      }));
    } catch (err) {
      console.error("Error fetching user info:", err);
    }
  };

  console.log(userInfo);

  useEffect(() => {
    const fetchData = async () => {
      await fetchUserInfo();
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchAll = async () => {
      const response = await axios.get(
        `${LOCKER_API}/api/lock/listDocument/${userInfo.aadharNumber}`
      );
      console.log(
        `${LOCKER_API}/api/lock/listDocument/${userInfo.aadharNumber}`
      );
      setDocs(response.data.data || []);
    };
    fetchAll();
  }, [userInfo]);

  const refreshDataDocuments = async () => {
    try {
      const response = await axios.get(
        `${LOCKER_API}/api/lock/listDocument/${userInfo.aadharNumber}`
      );
      setDocs(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const openUploadModal = () => {
    setSelectedFile(null);
    setSelectedName("");
    setOpenUpload(true);
  };

  const closeUploadModal = () => {
    setOpenUpload(false);
    setSelectedFile(null);
    setSelectedName("");
  };

  const onFileChange = (e) => {
    const f = e.target.files?.[0] || null;
    setSelectedFile(f);
    setSelectedName(f?.name || "");
  };

  const uploadFiles = async () => {
    if (!selectedFile) return;

    const fileData = new FormData();
    fileData.append("name", selectedName);
    fileData.append("imageFile", selectedFile);

    const uploadDocumentResponse = await axios.post(
      `${MEDIA_API}/api/images/upload`,
      fileData
    );
    const fileName = uploadDocumentResponse.data.data.name;
    const filePath = uploadDocumentResponse.data.data.path;

    const addDocument = await axios.post(`${LOCKER_API}/api/lock/add`, {
      aadharNumber: userInfo.aadharNumber,
      fileName: fileName,
      filePath: filePath,
    });

    refreshDataDocuments();
    closeUploadModal();
    setSuccessMsg("Successfully uploaded");
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const downloadDoc = (doc) => {
    window.alert(`Downloading ${doc.fileName}`);
  };

  const deleteDoc = async (id) => {
    const res = await axios.delete(
      `${LOCKER_API}/api/lock/delete/${userInfo.aadharNumber}/${id}`
    );
    refreshDataDocuments();
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

    let fileName = editName;
    let filePath = editingDoc.filePath;

    if (editFile) {
      const updateForm = new FormData();
      updateForm.append("name", editFile.name);
      updateForm.append("imageFile", editFile);

      const mediaUpload = await axios.post(
        `${MEDIA_API}/api/images/upload`,
        updateForm
      );

      fileName = mediaUpload.data.data.name;
      filePath = mediaUpload.data.data.path;
    }

    await axios.put(`${LOCKER_API}/api/lock/update`, {
      aadharNumber: userInfo.aadharNumber,
      fileId: editingDoc.fileId,
      fileName: fileName,
      filePath: filePath,
    });

    refreshDataDocuments();
    closeUpdateModal();
    setSuccessMsg("Document updated");
    setTimeout(() => setSuccessMsg(""), 3000);
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
            Upload Document
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
      </div>

      {openUpload && (
        <div className="bg-black/40 fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl border border-white/20 bg-white/10 p-6 shadow-md backdrop-blur-xl dark:bg-navy-800">
            <h2 className="text-xl font-semibold text-navy-700 dark:text-white">
              Upload Document
            </h2>
            <div className="mt-4 space-y-3">
              <input
                type="file"
                onChange={onFileChange}
                className="w-full text-sm text-gray-700 file:mr-4 file:rounded-md file:border-0 file:bg-brand-500 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-brand-600 dark:text-gray-200"
              />
              {selectedFile && (
                <div className="rounded-xl border border-white/10 p-3 text-sm text-gray-700 dark:text-gray-200">
                  <label className="mb-1 block text-xs text-gray-500 dark:text-gray-400">
                    Document Name
                  </label>
                  <input
                    type="text"
                    value={selectedName}
                    onChange={(e) => setSelectedName(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 dark:border-white/20 dark:bg-navy-700 dark:text-white"
                  />
                </div>
              )}
            </div>
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
                disabled={!selectedFile}
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
                Name
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
                Old size: {editingDoc.size ? formatBytes(editingDoc.size) : "-"}
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
