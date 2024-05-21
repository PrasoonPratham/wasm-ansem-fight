import React, { useEffect, useState } from "react";
import { FaSquareXTwitter } from "react-icons/fa6";
import { FiCopy } from "react-icons/fi";

const GameOverPopUp = ({ isOpen, onClose, image, link }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    // Set a short timeout to simulate loading
    const timeout = setTimeout(() => {
      setIsLoaded(true);
    }, 500);

    return () => clearTimeout(timeout);
  }, []);
  return (
    <>
      {isOpen && (
        <div
          className={`fixed inset-0 flex items-center justify-center z-[200] ${isLoaded ? "loaded" : ""}`}
        >
          <div className="fixed inset-0 bg-gray-800/50" onClick={onClose}></div>
          <div className="pixel3 relative z-50 bg-white px-4 pt-4 pb-6 text-black space-y-2">
            <h2 className="font-bold custom-heading text-black text-7xl">
              Game Over
            </h2>
            <div className="mt-2 mx-[7px] flex justify-center items-center space-x-3">
              <input
                type="text"
                readOnly
                value={link}
                className="bg-white ring-2 w-full ring-black rounded-sm "
              />
              <FiCopy
                className="scale-[1.25] cursor-pointer"
                onClick={() => navigator.clipboard.writeText(link)}
              />
              <a href={link} className="visited:text-black">
                <FaSquareXTwitter className="scale-[2] text-black cursor-pointer" />
              </a>
            </div>
            <div className="image-container2 rounded-md overflow-hidden">
              <img src={image} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GameOverPopUp;
