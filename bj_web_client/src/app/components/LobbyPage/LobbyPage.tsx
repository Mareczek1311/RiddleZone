import { useEffect, useState } from "react";
import "./LobbyPage.css";
import "../../globals.css";
import { motion } from "framer-motion";

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
  updateStarted,
}) => {
  const [ready, setReady] = useState(false);

  function handleReady() {
    setReady(!ready);

    socket.emit("set_state", { room_id, ready: !ready });
  }
  {
    /* <h2>Room ID: {room_id}</h2> */
  }
  return (
    <motion.div className="MainSection">
      <motion.div className="ManageSection">
        <motion.div className="section-title">
          <motion.h1 className="title">LOBBY</motion.h1>
        </motion.div>
        <motion.div className="players-title-wrapper">
          <motion.h1 className="players-title">PLAYERS</motion.h1>
        </motion.div>

        <motion.div className="main_box_container">
          <motion.div className="players_container">
            <motion.div className="player-wrapper-ex">
              <motion.div className="player-value-wrapper-ex">
                <motion.h2 className="player-value-ex">IMG</motion.h2>
              </motion.div>
              <motion.div className="player-value-wrapper-ex">
                <motion.h2 className="player-value-ex">NAME</motion.h2>
              </motion.div>
              <motion.div className="player-value-wrapper-ex">
                <motion.h2 className="player-value-ex">LEVEL</motion.h2>
              </motion.div>
              <motion.div className="player-value-wrapper-ex">
                <motion.h2 className="player-value-ex">POINTS</motion.h2>
              </motion.div>
              <motion.div className="player-value-wrapper-ex">
                <motion.h2 className="player-value-ex">POLAND</motion.h2>
              </motion.div>
            </motion.div>

            {playerList.map((player, index) => {
              return (
                <motion.div className="player-wrapper" key={index}>
                  <motion.div className="player-value-wrapper">
                    <motion.h2 className="player-value">IMG</motion.h2>
                  </motion.div>
                  <motion.div className="player-value-wrapper">
                    <motion.h2 className="player-value">{player}</motion.h2>
                  </motion.div>
                  <motion.div className="player-value-wrapper">
                    <motion.h2 className="player-value">LEVEL</motion.h2>
                  </motion.div>
                  <motion.div className="player-value-wrapper">
                    <motion.h2 className="player-value">POINTS</motion.h2>
                  </motion.div>
                  <motion.div className="player-value-wrapper">
                    <motion.h2 className="player-value">POLAND</motion.h2>
                  </motion.div>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>
        <motion.div className="lobby_buttons-wrapper">
          {!ready ? (
            <motion.button
              className="button"
              onClick={() => {
                handleReady();
              }}
            >
              <motion.h1 className="button-text">Ready</motion.h1>
            </motion.button>
          ) : (
            <motion.button
              className="button"
              onClick={() => {
                handleReady();
              }}
            >
              <motion.h1 className="button-text">Not Ready</motion.h1>
            </motion.button>
          )}
          {readyCounter === playerList.length && playerData[0] ? (
            <motion.button
              className="button"
              style={{ marginTop: "2vh" }}
              onClick={() => {
                socket.emit("start_game", room_id);
                updateStarted(true);
              }}
            >
              <motion.h1 className="button-text">Start Game</motion.h1>
            </motion.button>
          ) : null}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default LobbyPage;
