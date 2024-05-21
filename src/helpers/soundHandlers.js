import { Howl, Howler } from "howler";
import punchSound from "../assets/punch.m4a";
import winSound from "../assets/win.m4a";
import loseSound from "../assets/lose.m4a";
import bellSound from "../assets/bell.m4a";
import t3Sound from "../assets/tier3powerup.m4a";
export function playSound(sound) {
  let sound;
  switch (soundType) {
    case "punch":
      sound = new Audio(punchSound);
      break;
    case "win":
      sound = new Audio(winSound);
      break;
    case "lose":
      sound = new Audio(loseSound);
      break;
    case "bell":
      sound = new Audio(bellSound);
      break;
    case "t3":
      sound = new Audio(t3Sound);
      break;
    default:
      return;
  }
  sound.play();
}

export function Bgm(soundRef, bgSound, intervalId) {
  if (!soundRef.current) {
    // Initialize and play the sound if it hasn't been initialized
    soundRef.current = new Howl({
      src: [bgSound],
      autoplay: true,
      loop: true,
      volume: 0.1,
    });
  }

  // Optional: Play the sound if not already playing (e.g., after being stopped manually elsewhere in your component)
  if (!soundRef.current.playing()) {
    soundRef.current.play();
  }

  return () => {
    clearInterval(intervalId);
  };
}
