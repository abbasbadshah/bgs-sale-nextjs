"use client";

export default function Button({ type = "submit", className, children, disabled = false }) {
  return (
    <button
      type={type}
      disabled = {disabled}
      className={`px-10 py-3 rounded-md text-white bg-transparent border-2 border-white hover:bg-white transition-colors hover:text-black hover:border-white ${className}`}
    >
      {children}
    </button>
  );
}
