import { useRef } from "react";
import { MdClose } from "react-icons/md";

const FileUpload = ({ file, setFile }) => {
  const fileInputRef = useRef(null);

  const handleRemove = () => {
    setFile(null); // clear state
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // clear input field
    }
  };

  return (
    <div>
      <label className="block font-bold text-sm sm:text-base mb-1 sm:mb-2">
        Upload File
      </label>

      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf, image/*"
        onChange={(e) => setFile(e.target.files[0])}
        className="w-full text-xs text-gray-500 file:mr-2 file:py-2 file:px-3 file:rounded-md file:border-0 file:font-semibold file:bg-brand-500 file:text-white hover:file:bg-brand-600 cursor-pointer rounded-md outline-none focus:ring-2 focus:ring-brand-500"
      />

      {file && (
        <div className="flex items-center justify-between mt-1">
          <p className="text-xs text-green-600 truncate max-w-[200px]">
            Selected: {file.name}
          </p>
          <button
            type="button"
            onClick={handleRemove}
            className="text-xs text-red-500 hover:underline"
          >
            <MdClose />
          </button>
        </div>
      )}
    </div>
  );
}

export default FileUpload;