import React, { useState } from "react";
import start from "../assets/start.png";
import DepositButton from "./DepositButton";
import CharacterSelection from "./CharacterSelection";

const GameCover = () => {
  const [characterSelection, setCharacterSelection] = useState(false);
  const handleOnDeposit = () => {
    setCharacterSelection(true);
  };
  
  return (
    <>
      {!characterSelection ? (
        <div>
          <img className="absolute right-0 bottom-0" src={start}></img>
          <div className="absolute bottom-8 left-0 right-0 scale-[135%]">
            <DepositButton
              text="Play"
              onDeposit={handleOnDeposit}
              isDisabled={false}
            />
          </div>
        </div>
      ) : (
        <CharacterSelection />
      )}
    </>
  );
};

export default GameCover;
