'use client';

import { useState } from "react";
import Navbar from "./components/Navbar/Navbar";
import { io } from "socket.io-client";
import Games from "./components/QuizPage/QuizPage";
import Head from "next/head";
import { MainPage } from "./components/MainPage/MainPage";

let socket: any;

export default function Home() {

  const [isLogged, setIsLogged] = useState(false)

  function connect(){
    socket = io("http://localhost:3001");

    socket.on("connect", () => {
      console.log(socket.id); 
      if(socket.connected){
        setIsLogged(true);
      }
    });
  }

  function sendMessage(){
    socket.emit("Hello", "message")
  }

  return (
      <div>
   
        <Navbar />
        
        {

          /*
        <button onClick={connect}>DOLACZ</button>

          isLogged ? 
            <div>
              <div>WE are in game</div>
              <button onClick={sendMessage}></button>
            </div>
          :
          null
          */
        }
        
        <MainPage />

      </div>
  );
}