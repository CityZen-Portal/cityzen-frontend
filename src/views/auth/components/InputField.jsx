// Custom components
import React from "react";

function InputField(props) {
  const { label, id, extra, type, placeholder, variant, state, disabled, onChange, value } =
    props;

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
      <input
        disabled={disabled}
        type={type}
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`mt-2 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none focus:ring-2 dark:bg-navy-900 ${
          disabled === true
            ? "!border-none !bg-gray-100 dark:!bg-white/5 dark:placeholder:!text-[rgba(255,255,255,0.15)]"
            : state === "error"
            ? "border-red-500 text-black dark:!border-red-500 dark:!text-white focus:ring-red-300"
            : state === "success"
            ? "border-green-500 text-black dark:!border-green-400 dark:!text-white focus:ring-green-300"
            : "border-gray-200 dark:!border-white/10 dark:text-white focus:ring-blue-300"
        }`}
      />
    </div>
  );
}

export default InputField;
