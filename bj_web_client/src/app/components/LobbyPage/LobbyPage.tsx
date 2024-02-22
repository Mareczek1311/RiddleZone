import { useEffect, useState } from "react";
import "./LobbyPage.css";

interface LobbyPageProps {
  socket: any;
  room_id: string;
  playerList: string[];
  readyCounter: number;
}

const LobbyPage: React.FC<LobbyPageProps> = ({
  socket,
  room_id,
  playerList,
  readyCounter
}) => {

  const [ready, setReady] = useState(false);

  function handleReady() {
    setReady(!ready);

    socket.emit("ready", {room_id, ready: !ready });
  }

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

      {!ready ? <button onClick={() => {handleReady()}}>Ready</button> : <button onClick={() => {handleReady()}}>Not Ready</button>}
      {readyCounter === playerList.length ? <button>Start Game</button> : null}
    </div>
  );
};

export default LobbyPage;
