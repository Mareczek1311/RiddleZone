"use client";

/*
  for every button click we need to do a loading screen
*/

import './globals.css';
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
import MessagePage from "./components/MessagePage/MessagePage";
import EndPage from "./components/EndPage/EndPage";
import { useNavigation } from "react-router-dom";

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
  const [ranking, setRanking] = useState([]);

  function updateUser(user: User | null) {
    setUser(user);
  }

  function updateRoomID(room_id: string) {
    setRoomID(room_id);
  }

  function updateStarted(started: boolean) {
    setIsStarted(started);
  }

  const ConnectToRoom = async (room_id: string, nickname: string) => {
    socket = await io("https://vv1753wm-3001.euw.devtunnels.ms/");


    /*
    if(nickname == ""){
      return;
    }
    */
   
    //LINE THAT NEEDS TO BE REMOVED
    nickname = "PLAYER" + Math.floor(Math.random() * 1000); 
    //!!!!!!!!!!!!!!!!!!!!!!!!!!

    console.log("Connecting to room: ", room_id);
    socket.on("connect", async () => {
      console.log("Connected to server");
      socket.emit("connect_to_room", { room_id, nickname });
    

      socket.on("get_room_id", async (room_id: string) => {
        console.log("Room ID: ", room_id);
        updateRoomID(room_id);
    
        
        await socket.emit("get_player_data", room_id);

                
  
      });
    });

   
  };
  
  if(socket != null){
    socket.on("update_ready", (data: any) => {
      setReadyCounter(data);
      console.log("Ready Counter: ", data);
    });

    socket.on("error_send_question", () => {
      console.log("Error: ", "No question set selected");
      socket.emit("get_question", room_id);
      
    })

    socket.on("send_player_list", (playerList: []) => {
      setPlayerList(playerList);
      console.log("PlayerList: ", playerList);
    });

    socket.on("error_send_player_data", (data: any) => {
      console.log("Error: ", data);
      socket.emit("get_player_data", room_id);
    })


    socket.on("send_player_data", (data: any) => {
      setPlayerData(data);
      console.log("PlayerData: ", data);

        socket.emit("get_player_list", room_id);
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

    socket.on("send_ranking", (ranking: any) => {
      setRanking(ranking);
    })

    socket.on("restart_game", () =>{
      setisGameEnded(false);
      setQuestionSetSelected(false);
      updateStarted(false);
      setWaitForPlayers(false);
      setReadyCounter(0);
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

  
  const [isOnMainPage, setIsOnMainPage] = useState(true);
  useEffect(() => {
    room_id === "" ? setIsOnMainPage(true) : setIsOnMainPage(false);
  }, [room_id])
  return (
    <div className="App">
      <Navbar isOnMainPage={isOnMainPage} />

      {
      //user 
      true
      ? (
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
          !questionSetSelected ? 
          playerData[0] ?
          (
            <QuestionPick
              socket={socket}
              room_id={room_id}
            />
          ) 
          : 
          (
            <MessagePage message="Waiting for the host to pick a question set" />
          )
          : 
            isGameEnded ? (
              <EndPage
                socket={socket}
                room_id={room_id}
                ranking={ranking}
                playerData={playerData}
              />
            ) :

            waitForPlayers ? (
            
              <MessagePage message="Waiting for players to answer" />

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
