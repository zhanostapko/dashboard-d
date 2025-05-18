import React from "react";

const Loader = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-white">
      <div className="w-12 h-12 border-4 border-gray-300 border-t-red-500 rounded-full animate-spin" />
    </div>
  );
};

export default Loader;
