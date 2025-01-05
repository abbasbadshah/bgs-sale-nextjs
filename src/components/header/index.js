"use client";
export default function Header({ pageHeading, className }) {
  return (
    <header
      className={`bg-primary text-white text-center h-20 lg:h-40 flex justify-center items-center rounded-md ${className}`}
    >
      <h1 className="text-xl lg:text-5xl font-bold capitalize">
        {pageHeading}
      </h1>
    </header>
  );
}
