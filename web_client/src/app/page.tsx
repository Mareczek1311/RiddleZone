"use client";

//REPAIR SPAMMING ON BUTTONS
/*
  for every button click we need to do a loading screen
*/

import './globals.css';
import { use, useEffect, useState } from "react";
import Navbar from "./components/Navbar/Navbar";
import { io } from "socket.io-client";
import Footer from "./components/Footer/Footer";
import { User } from "firebase/auth";
import LoginPage from "./login/page";
import MenuPage from "./components/MenuPage/MenuPage";
import LobbyPage from "./components/LobbyPage/LobbyPage";
import QuestionPick from "./components/QuestionPick/QuestionPick";
import QuestionPage from "./components/QuestionPage/QuestionPage";
import MessagePage from "./components/MessagePage/MessagePage";
import EndPage from "./components/EndPage/EndPage";
import { redirect } from "next/navigation";
import { UserSocket } from './context/socketContext';

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
  const [correctQuestion, setCorrectQuestion] = useState(false);
  const [correct_answer, setCorrect_answer] = useState("");
  const [isClickedForQuestionPage, setIsClickedForQuestionPage] = useState(false) //I THINK IT SUCS
  const [refresh, setRefresh] = useState(1);


  var { socket, connectToSocket } = UserSocket();

  function updateClieckedForQuestionPage(data : boolean){
    setIsClickedForQuestionPage(data);
  }

  function updateRoomID(room_id: string) {
    setRoomID(room_id);
    return true
  }

  function updateStarted(started: boolean) {
    setIsStarted(started);
  }

  const ConnectToRoom = async (room_id: string, nickname: string) => {

    if(nickname == ""){
      nickname = "PLAYER" + Math.floor(Math.random() * 1000); 
    }

    setRefresh(refresh + 1);

    socket.emit("connect_emit");
    console.log("Connecting to room: ", room_id);

    socket.on("connect_on", async () => {
      socket.emit("connect_to_room", { room_id, nickname });
      socket.on("RES_connect_to_room", (data : any) => {
        console.log(data.room_id)
        if(data.room_id == "ERROR")
        {
          console.log("No room found");
          updateRoomID("");
          return;
        }
        console.log("Connected to server");
        updateRoomID(data.room_id);
        socket.emit("get_player_data", data.room_id);
      })
    });
  };
  useEffect(() => {
  if(socket != null){
    socket.on("correct_answer", (data: any) => {
      console.log("Correct answer")
      setCorrectQuestion(true);
      setCorrect_answer(data);
    })

    socket.on("wrong_answer", (data :any) => {
      console.log("Wrong answer")
      setCorrectQuestion(false);
      setCorrect_answer(data);
    })

    socket.on("update_ready", (data: any) => {
      setReadyCounter(data);
      console.log("Ready Counter: ", data);
      socket.emit("get_player_list", room_id);
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
      setCorrect_answer("");
      updateClieckedForQuestionPage(false)
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
      setCorrectQuestion(false);
      setCorrect_answer("");
    })
  }
  }
  , [refresh]);


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

            <QuestionPage
              socket={socket}
              room_id={room_id}
              currQuestion={currQuestion}
              waitForPlayers={waitForPlayers}
              correct_answer={correct_answer}
              isClicked={isClickedForQuestionPage}
              updateIsClicked={updateClieckedForQuestionPage}
              isAdmin={playerData[0]}
            />
          }
        </div>
      ) :
      
      <div></div>
      }

      <Footer />
    </div>
  );
 
}
