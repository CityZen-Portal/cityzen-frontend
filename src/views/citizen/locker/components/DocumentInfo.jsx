import axios from "axios";
import React, { useEffect, useState } from "react";

export default function DocumentInfo() {
  const MEDIA_API = process.env.REACT_APP_API_MEDIA_URL;
  const LOCKER_API = process.env.REACT_APP_API_LOCKER_URL;
  const USER_API = process.env.REACT_APP_API_UMS_URL;
  // const USER_API = "http://localhost:8080";
  // const LOCKER_API = "http://localhost:4000";

  const token = localStorage.getItem("token");

  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [openUpload, setOpenUpload] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedName, setSelectedName] = useState("");

  const [openUpdate, setOpenUpdate] = useState(false);
  const [editingDoc, setEditingDoc] = useState(null);
  const [editName, setEditName] = useState("");
  const [editFile, setEditFile] = useState(null);

  const [userInfo, setUserInfo] = useState({
    email: localStorage.getItem("email") || "",
    username: localStorage.getItem("username") || "",
    aadharNumber: 0,
  });

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const userRes = await axios.get(
          `${USER_API}/api/auth/getUser/${userInfo.email}`,
          {
            headers: {
              token,
            },
          }
        );
        const aadharNumber = userRes.data.data;

        const newUser = { ...userInfo, aadharNumber };
        setUserInfo(newUser);

        const docsRes = await axios.get(
          `${LOCKER_API}/api/lock/listDocument/${aadharNumber}`,
          {
            headers: {
              token,
            },
          }
        );
        setDocs(docsRes.data.data || []);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setErrorMsg("Failed to fetch user or documents");
        setLoading(false);
      }
    };

    if (userInfo.email) {
      fetchAll();
    }
  }, []);

  const refreshDocuments = async () => {
    try {
      const res = await axios.get(
        `${LOCKER_API}/api/lock/listDocument/${userInfo.aadharNumber}`,
        {
          headers: {
            token,
          },
        }
      );
      setDocs(res.data.data || []);
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to refresh documents");
    }
  };

  const uploadFiles = async () => {
    if (!selectedFile) return;

    try {
      const formData = new FormData();
      formData.append("name", selectedName);
      formData.append("imageFile", selectedFile);

      const mediaRes = await axios.post(
        `${MEDIA_API}/api/images/upload`,
        formData,
        {
          headers: {
            token,
          },
        }
      );
      const { name: fileName, path: filePath } = mediaRes.data.data;

      await axios.post(
        `${LOCKER_API}/api/lock/add`,
        {
          aadharNumber: userInfo.aadharNumber,
          fileName,
          filePath,
        },
        {
          headers: {
            token,
          },
        }
      );

      setSuccessMsg("Document uploaded successfully");
      setTimeout(() => setSuccessMsg(""), 3000);
      closeUploadModal();
      refreshDocuments();
    } catch (err) {
      console.error(err);
      setErrorMsg("Upload failed");
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
    } catch (err) {
      console.error("Download failed:", err);
    }
  };

  const deleteDoc = async (fileId) => {
    try {
      await axios.delete(
        `${LOCKER_API}/api/lock/delete/${userInfo.aadharNumber}/${fileId}`,
        {
          headers: {
            token,
          },
        }
      );
      refreshDocuments();
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to delete document");
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

  const openUpdateModal = (id) => {
    const doc = docs.find((d) => d.fileId === id);
    if (doc) {
      setEditingDoc(doc);
      setEditName(doc.fileName);
      setEditFile(null);
      setOpenUpdate(true);
    }
  };

  const closeUpdateModal = () => {
    setOpenUpdate(false);
    setEditingDoc(null);
    setEditName("");
    setEditFile(null);
  };

  const saveUpdate = async () => {
    if (!editingDoc) return;

    try {
      let fileName = editName;
      let filePath = editingDoc.filePath;

      if (editFile) {
        const updateForm = new FormData();
        updateForm.append("name", editFile.name);
        updateForm.append("imageFile", editFile);

        const uploadRes = await axios.post(
          `${MEDIA_API}/api/images/upload`,
          updateForm,
          {
            headers: {
              token,
            },
          }
        );
        fileName = uploadRes.data.data.name;
        filePath = uploadRes.data.data.path;
      }

      await axios.put(
        `${LOCKER_API}/api/lock/update`,
        {
          aadharNumber: userInfo.aadharNumber,
          fileId: editingDoc.fileId,
          fileName,
          filePath,
        },
        {
          headers: {
            token,
          },
        }
      );

      setSuccessMsg("Document updated");
      setTimeout(() => setSuccessMsg(""), 3000);
      closeUpdateModal();
      refreshDocuments();
    } catch (err) {
      console.error(err);
      setErrorMsg("Update failed");
    }
  };

  const onFileChange = (e) => {
    const f = e.target.files?.[0] || null;
    setSelectedFile(f);
    setSelectedName(f?.name || "");
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
            className="rounded-xl bg-brand-500 px-5 py-2 text-sm font-semibold text-white hover:bg-brand-600"
          >
            Upload Document
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
              {loading ? (
                <tr>
                  <td
                    colSpan={3}
                    className="px-6 py-10 text-center text-gray-500 dark:text-gray-400"
                  >
                    Loading...
                  </td>
                </tr>
              ) : docs.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className="px-6 py-10 text-center text-gray-500 dark:text-gray-400"
                  >
                    No documents found
                  </td>
                </tr>
              ) : (
                docs.map((doc) => (
                  <tr
                    key={doc.fileId}
                    className="border-b border-white/5 last:border-none"
                  >
                    <td className="break-all px-6 py-4">{doc.fileName}</td>
                    <td className="px-6 py-4">
                      {new Date(doc.creationDate).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => downloadDoc(doc)}
                        className="mr-2 text-xs text-brand-500 hover:underline"
                      >
                        Download
                      </button>
                      <button
                        onClick={() => openUpdateModal(doc.fileId)}
                        className="mr-2 text-xs text-yellow-500 hover:underline"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => deleteDoc(doc.fileId)}
                        className="text-xs text-red-500 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {openUpload && (
        <div className="bg-black/40 fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur-xl dark:bg-navy-800">
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
                <input
                  type="text"
                  value={selectedName}
                  onChange={(e) => setSelectedName(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 dark:border-white/20 dark:bg-navy-700 dark:text-white"
                  placeholder="Document Name"
                />
              )}
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={closeUploadModal}
                className="text-sm font-semibold text-gray-600 hover:underline dark:text-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={uploadFiles}
                disabled={!selectedFile}
                className="rounded-xl bg-brand-500 px-5 py-2 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-60"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}

      {openUpdate && editingDoc && (
        <div className="bg-black/40 fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur-xl dark:bg-navy-800">
            <h2 className="text-xl font-semibold text-navy-700 dark:text-white">
              Update Document
            </h2>
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="mt-4 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 dark:border-white/20 dark:bg-navy-700 dark:text-white"
              placeholder="Document Name"
            />
            <input
              type="file"
              onChange={(e) => setEditFile(e.target.files?.[0] || null)}
              className="mt-4 w-full text-sm text-gray-700 file:mr-4 file:rounded-md file:border-0 file:bg-brand-500 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-brand-600 dark:text-gray-200"
            />

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={closeUpdateModal}
                className="text-sm font-semibold text-gray-600 hover:underline dark:text-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={saveUpdate}
                className="rounded-xl bg-brand-500 px-5 py-2 text-sm font-semibold text-white hover:bg-brand-600"
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
