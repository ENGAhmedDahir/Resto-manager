import React from "react";

const LoadingSpinner = ({ size = "md", message = "Loading..." }) => {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div
        className={`${sizeClasses[size]} rounded-full animate-spin`}
        style={{
          background:
            "conic-gradient(from 0deg, hsl(32 95% 55%), hsl(25 95% 45%), transparent)",
          mask: "radial-gradient(farthest-side, transparent 65%, black 66%)",
          WebkitMask:
            "radial-gradient(farthest-side, transparent 65%, black 66%)",
        }}
      />
      {message && <p className="mt-4 text-gray-600">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;
