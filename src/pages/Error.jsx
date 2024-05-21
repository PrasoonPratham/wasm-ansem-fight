import React, { useState, useEffect } from "react";

const Error = ({ err, color }) => {
  const [isVisible, setIsVisible] = useState(false);

  // Function to handle setting isVisible to false after 10 seconds
  const hideError = () => {
    setIsVisible(false);
  };

  useEffect(() => {
    setIsVisible(true); // Trigger transition when the component mounts or when `err` prop changes

    // Start the timeout when the component mounts or when `err` prop changes
    const timeout = setTimeout(hideError, 10000); // 10 seconds

    // Clear the timeout when the component unmounts or when isVisible becomes false
    return () => {
      clearTimeout(timeout);
    };
  }, [err]); // Re-run the effect when `err` prop changes

  return (
    <>
      {isVisible && (
        <div
          className={`text-xl p-2 rounded-sm ${color === "red" ? "bg-red-500" : "bg-green-500"} text-white`}
        >
          {err}
        </div>
      )}
    </>
  );
};

export default Error;
