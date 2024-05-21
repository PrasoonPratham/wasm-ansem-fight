import * as SolanaWeb3 from "@solana/web3.js";
import * as splToken from "@solana/spl-token";
export const generateLink = (npunch, wif, tweetImage) => {
  const text = `I landed ${npunch} punches and donated ${wif} !!!!`;
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&image=${tweetImage}`;
};
