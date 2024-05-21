import React, { useContext, useEffect, useState, useRef } from "react";
import init, { render } from "ansem-wasm";
import { Context } from "../App";
import t3_cook_win from "../assets/t3_cook_win.png";
import { generateLink } from "../helpers/generateLink";
import GameCover from "./GameCover";
import GameOverPopUp from "./GameOverPopUp";
import { useWallet } from "@solana/wallet-adapter-react";
import { getLeaderboardData, handleSendData } from "../helpers/dataHandlers";
import { WIN_PUNCHES } from "./gameConfig";
import winImage from "../assets/win.png";
import loseImage from "../assets/lose.png";
import loseImage_cook from "../assets/lose_cook.png";
const MainGame = () => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    wifAmount,
    setWifAmount,
    player,
    setLeaderboard,
    referredBy
  } = useContext(Context);
  const [tweetImage, setTweetImage] = useState("");
  const [SNSlink, setSNSLink] = useState("");
  const [gameCover, setGameCover] = useState(false);
  const wallet = useWallet();
  const hasLoaded = useRef(false); // Ref to track if the component has already loaded
  
  const onLoad = async () => {
    await init();
    const npunch = await render(player, wifAmount);
    setSNSLink(generateLink(npunch, wifAmount, tweetImage));
    // await handleSendData(wallet, npunch);
    // await getLeaderboardData();
    await handleSendData(npunch, wifAmount, referredBy, wallet)
    await getLeaderboardData(setLeaderboard);
    setIsOpen(true);
    setGameCover(true);
    if (npunch > WIN_PUNCHES){
      if (player === "ansem"){
        setTweetImage(winImage);
      }else{
        setTweetImage(t3_cook_win);
      }
    }else{
      if (player === "ansem"){
        setTweetImage(loseImage)
      }else{
        setTweetImage(loseImage_cook);
      }
    }
  };

  useEffect(() => {
    if (!hasLoaded.current) {
      // Check if the component has already loaded
      const loadGame = async () => {
        await onLoad();
      };
      loadGame();
      hasLoaded.current = true; // Mark as loaded
    }
  }, []);

  const closePopUp = () => {
    setIsOpen(false);
    setSNSLink("");
    setWifAmount(0);
  };

  return (
    <>
      <GameOverPopUp
        isOpen={isOpen}
        onClose={closePopUp}
        image={tweetImage}
        link={SNSlink}
      />
      {!gameCover ? (
        <>
          <img id="gameImageId" alt="Game character" />
          <div className="absolute left-7 text-3xl custom-heading">
            <p>
              Punches Landed: <span id="punchesCounterId"></span>
            </p>
            <p>
              Dodges: <span id="dodgesCounterId"></span>
            </p>
          </div>
        </>
      ) : (
        <GameCover />
      )}
    </>
  );
};

export default MainGame;
