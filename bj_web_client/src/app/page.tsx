"use client";

/*
  for every button click we need to do a loading screen
*/

import { useEffect, useState } from "react";
import Navbar from "./components/Navbar/Navbar";
import { io } from "socket.io-client";
import Games from "./components/QuizPage/QuizPage";
import Footer from "./components/Footer/Footer";
import { User } from "firebase/auth";
import LoginPage from "./components/LoginPage/LoginPage";
import MenuPage from "./components/MenuPage/MenuPage";
import LobbyPage from "./components/LobbyPage/LobbyPage";
import QuestionPick from "./components/QuestionPick/QuestionPick";
import QuestionPage from "./components/QuestionPage/QuestionPage";

var socket: any;
socket = null;

export default function Home() {

  const [user, setUser] = useState<User | null>(null);
  const [room_id, setRoomID] = useState("");
  const [started, setIsStarted] = useState(false);
  const [playerList, setPlayerList] = useState([]);
  const [readyCounter, setReadyCounter] = useState(0);
  const [playerData, setPlayerData] = useState<[boolean, boolean, string]>([false, false, "-1"]);
  const [questionSetSelected, setQuestionSetSelected] = useState(false);
  const [currQuestion, setCurrQuestion] = useState([]);
  const [waitForPlayers, setWaitForPlayers] = useState(false);
  const [isGameEnded, setisGameEnded] = useState(false);

  function updateUser(user: User | null) {
    setUser(user);
  }

  function updateRoomID(room_id: string) {
    setRoomID(room_id);
  }

  function updateStarted(started: boolean) {
    setIsStarted(started);
  }

  const ConnectToRoom = async (room_id: string) => {
    console.log("Connecting to room: ", room_id);
    socket = await io("http://localhost:3001");
    socket.on("connect", () => {
      console.log("Connected to server");
    });

    socket.emit("connect_to_room", room_id);
    socket.on("get_room_id", async (room_id: string) => {
      console.log("Room ID: ", room_id);
      updateRoomID(room_id);
      await socket.emit("get_player_list", room_id);
  
      
      await socket.emit("get_player_data", room_id);
      socket.on("send_player_data", (data: any) => {
        setPlayerData(data);
        console.log("PlayerData: ", data);
      });

    });
  };
  
  if(socket != null){
    socket.on("update_ready", (data: any) => {
      setReadyCounter(data);
      console.log("Ready Counter: ", data);
    });

    socket.on("send_player_list", (playerList: []) => {
      setPlayerList(playerList);
      console.log("PlayerList: ", playerList);
    });

    socket.on("send_player_data", (data: any) => {
      setPlayerData(data);
      console.log("PlayerData: ", data);
    });

    socket.on("send_questionSet", () => {
      setQuestionSetSelected(true);
      socket.emit("get_question", room_id);

    })

    socket.on("send_question", (question: any) => {
      console.log("Question: ", question);
      setCurrQuestion(question);
      setWaitForPlayers(false);
    })

    socket.on("start_game", () => {
      updateStarted(true);
    })

    socket.on("wait_for_players", () => {
      setWaitForPlayers(true);
    })

    socket.on("end_game", () => {
      setisGameEnded(true);
    })

  }

  useEffect(() => {
    // Na unmountu komponentu rozłączamy socket
    return () => {
      if(socket != null)
      {
        socket.disconnect();
      }
    };
  }, []);

  return (
    <div>
      <Navbar />

      {user ? (
        <div>
          {room_id == "" ? (
            <MenuPage
              socket={socket}
              updateRoomID={updateRoomID}
              ConnectToRoom={ConnectToRoom}
            />
          ) : !started ? (
            <LobbyPage
              socket={socket}
              room_id={room_id}
              playerList={playerList}
              readyCounter={readyCounter}
              playerData={playerData}
              updateStarted={updateStarted}
            />
          ) : 
          !questionSetSelected ? (
            <QuestionPick
              socket={socket}
              room_id={room_id}
            />
          ) : 
            isGameEnded ? (
              <div>
                <h1>Game Ended</h1>
              </div>
            ) :

            waitForPlayers ? (
            
            <div>
              <h1>Waiting for players to answer</h1>
            </div>

            ) : (
            <QuestionPage
              socket={socket}
              room_id={room_id}
              currQuestion={currQuestion}
            />
          )}
        </div>
      ) : (
        <LoginPage updateUser={updateUser} />
      )}

      <Footer />
    </div>
  );
 
}
