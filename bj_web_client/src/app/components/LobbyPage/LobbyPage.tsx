import { useEffect, useState } from "react";
import "./LobbyPage.css";

interface LobbyPageProps {
  socket: any;
  room_id: string;
  playerList: string[];
  readyCounter: number;
  playerData: [boolean, boolean, string];
  updateStarted: (started: boolean) => void;
}

const LobbyPage: React.FC<LobbyPageProps> = ({
  socket,
  room_id,
  playerList,
  readyCounter,
  playerData,
  updateStarted
}) => {

  const [ready, setReady] = useState(false);

  function handleReady() {
    setReady(!ready);

    socket.emit("set_state", {room_id, ready: !ready });
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

      {(!ready) ? <button onClick={() => {handleReady()}}>Ready</button> : <button onClick={() => {handleReady()}}>Not Ready</button>}
      {(readyCounter === playerList.length && playerData[0]) ? 
      <button onClick={() => {
        //socket.emit("start_game", room_id);
        updateStarted(true);
      }}>Start Game</button> : null}
    </div>
  );
};

export default LobbyPage;
