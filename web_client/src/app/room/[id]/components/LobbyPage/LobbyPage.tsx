import { useEffect, useState } from "react";
import "./LobbyPage.css";
import "@/app/globals.css";
import { motion } from "framer-motion";
import { UserSocket } from "@/app/context/socketContext";
import { set } from "firebase/database";
import { redirect } from "next/navigation";
import { roomContext } from "@/app/context/roomContext";

const LoginPage = () =>{
  const [ready, setReady] = useState(false);

  const {socket, connectToSocket} = UserSocket();
  const [playerSet, setPlayerSet] = useState({});
  const [readyCounter, setReadyCounter] = useState(0);
  const [started, setStarted] = useState(false);
  const [questionSetName, setQuestionSetName] = useState("");
  const { room_id, SetRoomID } = roomContext();
  


  function handleReady() {
    setReady(!ready);

    socket.emit("PUT_REQ_SET_STATE", { room_id: room_id, ready: !ready });
    socket.emit("GET_REQ_ROOM_INFO", room_id);

  }

  useEffect(() => {
    socket.emit("GET_REQ_ROOM_INFO", room_id);
  }, []);

  useEffect(() => {
    socket.on("GET_RES_ROOM_INFO", (data : any) => {
      console.log("ROOM INFO: ", data)
      setPlayerSet(data.users);
      setQuestionSetName(data.questionSetName);

      let readyCount = 0;
      Object.keys(data.users).map((key, index) => {
        if (data.users[key].isReady) {
          readyCount++;
        }
      });
      setReadyCounter(readyCount);
    })

    socket.on("PUT_RES_START_GAME", () => {
      setStarted(true);
    })

    
  }, [socket]);

  useEffect(() => {
    if (started) {
      redirect(`/room/${room_id}/question`);
    }
  
  }, [started])

  return (
    <motion.div className="MainSectionLobby">
      <motion.div className="ManageSectionLobby">
        <motion.div className="section-title">
          <motion.h1 className="title">LOBBY</motion.h1>
          <motion.h3>ROOM ID: {room_id}</motion.h3>
          <motion.h3>QUESTION SET: {questionSetName}</motion.h3>
        </motion.div>
        <motion.div className="players-title-wrapper">
          <motion.h1 className="players-title">PLAYERS</motion.h1>
        </motion.div>

        <motion.div className="main_box_container">
          <motion.div className="players_container">
            <motion.div className="player-wrapper-ex">
              <motion.h5 className="example-text"></motion.h5>
              {/* <motion.div className="player-value-wrapper-ex">
                <motion.h2 className="player-value-ex">IMG</motion.h2>
              </motion.div> */}
              <motion.div className="player-value-wrapper-ex">
                <motion.h2 className="player-value-ex">NAME</motion.h2>
              </motion.div>
              {/* <motion.div className="player-value-wrapper-ex">
                <motion.h2 className="player-value-ex">LEVEL</motion.h2>
              </motion.div>
              <motion.div className="player-value-wrapper-ex">
                <motion.h2 className="player-value-ex">POINTS</motion.h2>
              </motion.div>
              <motion.div className="player-value-wrapper-ex">
                <motion.h2 className="player-value-ex">LOACTION</motion.h2>
              </motion.div> */}
            </motion.div>

{

  playerSet ?

  Object.keys(playerSet).map((key, index) => {
    return (
      <motion.div className="player-wrapper" key={index}>
        <motion.h5 className="example-text">{index + 1}</motion.h5>
        {/* <motion.div className="player-value-wrapper">
          <motion.h2 className="player-value">{playerSet[key].img}</motion.h2>
        </motion.div> */}
        <motion.div className="player-value-wrapper">
          <motion.h2 className="player-value">{playerSet[key].realID}</motion.h2>
        </motion.div>
        {/* <motion.div className="player-value-wrapper">
          <motion.h2 className="player-value">{playerSet[key].level}</motion.h2>
        </motion.div>
        <motion.div className="player-value-wrapper">
          <motion.h2 className="player-value">{playerSet[key].points}</motion.h2>
        </motion.div>
        <motion.div className="player-value-wrapper">
          <motion.h2 className="player-value">{playerSet[key].location}</motion.h2>
        </motion.div> */}
        <motion.div className="player-value-wrapper">
          <motion.h2 className="player-value">{!playerSet[key].isReady ? "UNREADY" : "READY"}</motion.h2>
        </motion.div>
      </motion.div>
    );
  })

  : null

}
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
          
          {
             playerSet[socket.id].isAdmin && readyCounter == Object.keys(playerSet).length ? (
            <motion.button
              className="button"
              style={{ marginTop: "2vh" }}
              onClick={() => {
                socket.emit("PUT_REQ_START_GAME", room_id);
              }}
            >
              <motion.h1 className="button-text">Start Game</motion.h1>
            </motion.button>
          ) : null
          
          /*
          <motion.button
              className="button"
              style={{ marginTop: "2vh" }}
              onClick={() => {
                socket.emit("start_game", room_id);
                setStarted(true);
              }}
            >
              <motion.h1 className="button-text">FORCE Start Game</motion.h1>
            </motion.button>*/
          
          }
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default LoginPage;