import { useEffect, useState } from "react";

export default function Leaderboard({ leaderboard }) {
  const [changeColor, setChangeColor] = useState("text-red-500");
  const shortenAddress = (address) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };
  useEffect(() => {
    const t = setTimeout(() => setChangeColor((p) => {
      if (p === "text-red-500") {
        return "text-blue-500";
      } else {
        return "text-red-500";
      }
    }), 350);
    return () => clearTimeout(t); // Correctly clear the timeout on cleanup
  }, [changeColor]); // Depend on changeColor to toggle continuously

  return (
    <div className="my-20">
          <div className="p-2 leaderboard pixel2 w-[80%] before:bg-amber-500 bg-amber-500">
      <div className="pixel2 p-2 custom-heading before:bg-amber-500 bg-amber-500 absolute top-0 left-0 right-0 -translate-y-10">
        <h2 className="text-5xl text-amber-500">Leaderboard</h2>
      </div>
      <table className="custom-heading text-4xl text-center table-auto w-full border-spacing-2">
        <thead>
          <tr className={`${changeColor} text-[44px]`}>
            <th className="px-4 py-2">Address</th>
            <th className="px-4 py-2">WIF</th>
            <th className="px-4 py-2">Punches</th>
            <th className="px-4 py-2">Wins</th>
          </tr>
        </thead>
        <tbody className="text-3xl"> {/* Add the class here */}
          {leaderboard.map((entry, index) => (
            <tr key={index} className="border-t border-gray-300">
              <td className="px-4 py-2">{shortenAddress(entry.wallet_address)}</td>
              <td className="px-4 py-2">{entry.tokens}</td>
              <td className="px-4 py-2">{entry.punches}</td>
              <td className="px-4 py-2">{entry.win}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    </div>
  );
}
