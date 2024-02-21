"use client";

import { useEffect, useState } from "react";
import Navbar from "./components/Navbar/Navbar";
import { io } from "socket.io-client";
import Games from "./components/QuizPage/QuizPage";
import Head from "next/head";
import Footer from "./components/Footer/Footer";
import { User } from "firebase/auth";
import LoginPage from "./components/LoginPage/LoginPage";
import MenuPage from "./components/MenuPage/MenuPage";
import LobbyPage from "./components/LobbyPage/LobbyPage";

var socket: any;

export default function Home() {
  socket = io("http://localhost:3001");

  const [user, setUser] = useState<User | null>(null);
  const [room_id, setRoomID] = useState("");
  const [started, setIsStarted] = useState(false);
  const [playerList, setPlayerList] = useState<string[]>([]);

  function updateUser(user: User | null) {
    setUser(user);
  }

  function updateRoomID(room_id: string) {
    setRoomID(room_id);
  }

  const ConnectToRoom = (room_id: string) => {
    socket.on("connect", () => {
      console.log("Connected to server");
    });

    socket.emit("connect_to_room", room_id);
    socket.on("get_room_id", (room_id: string) => {
      console.log("Room ID: ", room_id);
      updateRoomID(room_id);
      socket.emit("get_player_list", room_id);
      socket.on("send_player_list", (playerList: string[]) => {
        setPlayerList(playerList);
        console.log(playerList);
      });
    });
  };

  useEffect(() => {
    // Na unmountu komponentu rozłączamy socket
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div>
      <Navbar />

      {user ? (
        <>
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
            />
          ) : (
            <Games />
          )}
        </>
      ) : (
        <LoginPage updateUser={updateUser} />
      )}

      <Footer />
    </div>
  );
}
