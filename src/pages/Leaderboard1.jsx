export default function Leaderboard({ leaderboard }) {
    const shortenAddress = (address) => {
      return `${address.slice(0, 4)}...${address.slice(-4)}`;
    };
    return (
      <div className="leaderboard custom-heading ">
        <h2 className="text-5xl text-amber-500">Leaderboard</h2>
        <ul className="text-2xl">
          {leaderboard.map((entry, index) => (
            <li key={index}>
              {/* {entry.name}: {entry.score} */}
              {shortenAddress(entry.wallet_address)} : Tokens - {entry.tokens}, Punches - {entry.punches}, Wins - {entry.win}
  
            </li>
          ))}
        </ul>
      </div>
    );
  }