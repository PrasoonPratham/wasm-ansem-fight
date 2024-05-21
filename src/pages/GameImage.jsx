import { useContext } from "react";
import ansem from "../assets/start.png";
import DepositButton from "./DepositButton";
import CharacterSelection from "./CharacterSelection";
import React, { useState, useEffect, useRef } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { SoundTypes, sounds } from "./gameConfig"; // Assuming these are extracted to a config file
import { Howl } from "howler";

import "./Homepage.css";
import t3_cook_win from "../assets/t3_cook_win.png";
import { Context } from "../App";

import "@solana/wallet-adapter-react-ui/styles.css";

import Error from "./Error";

//import jwt from "jsonwebtoken";
import GameCover from "./GameCover";

export default function GameImage() {
  const containerRef = useRef(null);

  const intervalRef = useRef(null);

  const wallet = useWallet();

  // const [currentImageArray, setCurrentImageArray] = useState(imageSets.default);
  // const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const {
    loggerBuf,
  } = useContext(Context);

  const soundRef = useRef({
    background: new Howl({ src: [sounds.background], loop: true, volume: 0.1 }),
  });


  useEffect(() => {
    // Try to play background music on load
    try {
      soundRef.current.background.play();
    } catch (error) {
      console.error("Background music failed to play:", error);
    }

    return () => {
      soundRef.current.background.stop(); // Stop background sound on unmount
    };
  }, []);

  return (
    <>
      <div
        ref={containerRef}
        className="image-container relative overflow-hidden"
      >
        <GameCover />
      </div>
      <div className="absolute z-[1000] bottom-0 left-0 space-y-2">
        {loggerBuf &&
          loggerBuf.map((l, i) => {
            return (
              <Error
                key={i}
                err={typeof l.error === "string" ? l.error : l.error.message}
                color={l.color}
              />
            );
          })}
      </div>
    </>
  );
}
// {!characterSelection && currentImageArray[currentImageIndex] === ansem && <div className="absolute bottom-8 scale-[135%]"><DepositButton onDeposit={handleOnDeposit} isDisabled={false}/></div>}
