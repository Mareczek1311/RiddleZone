import { useEffect, useState } from "react";
import "./LobbyPage.css";

interface LobbyPageProps {
  socket: any;
  room_id: string;
  playerList: string[];
}

const LobbyPage: React.FC<LobbyPageProps> = ({
  socket,
  room_id,
  playerList,
}) => {

  const [ready, setReady] = useState(false);

  return (
    <div>
      <h1>Lobby Page</h1>
      <h2>Room ID: {room_id}</h2>
      <h3>Players:</h3>

      {playerList.map((player, index) => {
        return (
          <div key={index}>
            <h3>{player}</h3>
          </div>
        );
      })}

      {!ready ? <button>Ready</button> : <button>Not Ready</button>}

    </div>
  );
};

export default LobbyPage;
