import React, { useState } from "react";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";

function PasswordField(props) {
  const {
    label,
    id,
    extra,
    placeholder,
    variant,
    state,
    disabled,
    onChange,
    value,
  } = props;

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={`${extra}`}>
      <label
        htmlFor={id}
        className={`text-sm text-navy-700 dark:text-white ${
          variant === "auth" ? "ml-1.5 font-medium" : "ml-3 font-bold"
        }`}
      >
        {label}
      </label>

      <div
        className={`mt-2 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm 
          dark:bg-navy-900 transition-all duration-200
          focus-within:ring-2 
          ${
            disabled
              ? "!border-none !bg-gray-100 dark:!bg-white/5 dark:placeholder:!text-[rgba(255,255,255,0.15)]"
              : state === "error"
              ? "border-red-500 text-black placeholder:text-red-500 dark:!border-red-500 dark:!text-white dark:placeholder:!text-red-500 focus-within:ring-red-300"
              : state === "success"
              ? "border-green-500 text-black placeholder:text-green-500 dark:!border-green-400 dark:!text-white dark:placeholder:!text-green-400 focus-within:ring-green-300"
              : "border-gray-200 dark:!border-white/10 dark:text-white focus-within:ring-blue-300"
          }`}
        >
        <input
          disabled={disabled}
          type={showPassword ? "text" : "password"}
          id={id}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`flex h-12 w-full items-center justify-center rounded-xl border-none p-3 text-sm outline-none bg-[rgba(255,255,255,0)]`}
        />

        <button
          type="button"
          className="ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 outline-none"
          onClick={() => setShowPassword(!showPassword)}
          tabIndex={-1}
        >
          {showPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
        </button>
      </div>
    </div>
  );
}

export default PasswordField;
