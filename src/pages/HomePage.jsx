import React, { useState, useEffect, useRef, useContext } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

import CharacterSelection from "./CharacterSelection";
import WalletSection from "./WalletSection";
import Leaderboard from "./Leaderboard";
import GameImage from "./GameImage";
import DepositButton from "./DepositButton";
import {
  SoundTypes,
  dodgeProbs,
  imageSets,
  sounds,
  PunchesConfig,
  SPEED,
} from "./gameConfig"; // Assuming these are extracted to a config file
import { Howl } from "howler";

import ansemPunch from "../assets/idlee.png";
import t3ansemPunch from "../assets/t33.png";
import upansemPunch from "../assets/uppercut.png";
import "./Homepage.css";
import cook_dodge_1 from "../assets/dodge_1_rev.png";
import cook_dodge_2 from "../assets/dodge_2_rev.png";
import ansem_dodge_1 from "../assets/dodge_1.png";
import ansem_dodge_2 from "../assets/dodge_2.png";
import cook_t3_pwrup from "../assets/t33_rev.png";
import t3_cook_win from "../assets/t3_cook_win.png";
import t1ansemPunch from "../assets/T1-Ansem-Punch2.png";
import t2ansemPunch from "../assets/Tier_22.png";
import opponent_t1 from "../assets/cook_punch_t1.png";
import opponent_t2 from "../assets/cook_punch_t2.png";
import GameOverPopup from "./GameOverPopUp";
import { FaSquareXTwitter } from "react-icons/fa6";
import winImage from "../assets/win.png";
import loseImage from "../assets/lose.png";
import loseImage_cook from "../assets/lose_cook.png";
import { Context } from "../App";
function HomePage() {
  const { wifAmount, leaderboard, setLeaderboard } = useContext(Context);
  const wallet = useWallet();
  const shortenAddress = (address) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };
  const fetchInitialLeaderboard = async () => {
    try {
      const leaderboardResponse = await fetch('http://localhost:5000/api/leaderboard');
      if (!leaderboardResponse.ok) {
        throw new Error('Failed to fetch leaderboard data');
      }
      const leaderboardData = await leaderboardResponse.json();
      setLeaderboard(leaderboardData);
    } catch (error) {
      console.error('Error fetching leaderboard data:', error);
    }
  };
  useEffect(() => {
    fetchInitialLeaderboard();
  }, []);

  return (
    <>
      {/* <GameOverPopup isOpen={isOpen} onClose={closePopUp} image={tweetImage} link={SNSlink} /> */}

      <GameImage />
      <h1 className="custom-heading text-[61px] text-[#2196F3]">
        Ansem vs. Kook
      </h1>
      <div className="card custom-heading text-[30px]">
        <p>WIF Deposited: {wifAmount}</p>
      </div>
      <div className="wallet-status custom-heading text-4xl z-30">
        {wallet.connected ? (
          <p>Connected: {shortenAddress(wallet.publicKey.toBase58())}</p>
        ) : (
          <p>Wallet not connected</p>
        )}
      </div>
      <Leaderboard leaderboard={leaderboard} />
    </>
  );
}

export default HomePage;
