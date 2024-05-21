import React, { useContext, useState, useEffect, useRef } from 'react';
import { Context } from '../App';
import '../App.css'; // Make sure to import the CSS file containing the animation

 const DepositWifPopUp = ({ onClose, setOpen }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const hasLoaded = useRef(false);


  useEffect(() => {
    if (!hasLoaded.current) {
      setIsLoaded(true);
      hasLoaded.current = true; 
    }
  }, []);
  const {wifAmount, setWifAmount} = useContext(Context);

  const onSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    await onClose();

    
    setIsSubmitting(false);
  };
  const onClick = () => {
    setOpen(false);
  } 
  if (isSubmitting) {
    return (
      <div className="fixed inset-0 text-7xl text-center flex items-center justify-center z-[200]">
        <div className="fixed inset-0 bg-gray-800/50"></div>
        <h2 className="font-bold custom-heading text-white text-8xl z-50 drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">
          Processing
          <span className="dot">.</span>
          <span className="dot">.</span>
          <span className="dot">.</span>
        </h2>
      </div>
    );
  }
  
  return (
    <div className={`fixed inset-0 flex items-center justify-center z-[200] ${isLoaded ? 'loaded' : ''}`}>
      <div className="fixed inset-0 bg-gray-800/50" onClick={onClick}></div>
      <div className="pixel3 relative z-[300] bg-white px-4 pt-4 pb-6 text-black space-y-2" >
        <h2 className="font-bold custom-heading text-black text-7xl">Deposit WIF</h2>
        <form onSubmit={onSubmit} className="space-x-2">
          <input
            type="number"
            value={wifAmount}
            onChange={(e) => setWifAmount(e.target.value)}
            className="bg-white ring-2 ring-black"
          />
          <button type="submit" className="bg-white">OK!</button>
        </form>
      </div>
    </div>
  );
};

export default DepositWifPopUp;