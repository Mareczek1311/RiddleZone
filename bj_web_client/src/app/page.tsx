'use client';

import { useState } from "react";
import Navbar from "./components/Navbar/Navbar";
import { io } from "socket.io-client";
import Games from "./components/QuizPage/QuizPage";
import Head from "next/head";
import Footer from "./components/Footer/Footer";
import { User } from "firebase/auth";
import LoginPage from "./components/LoginPage/LoginPage";
import MenuPage from "./components/MenuPage/MenuPage";

let socket: any;

export default function Home() {

  const [user, setUser] = useState<User | null>(null)
  const [room_id, setRoomID] = useState("")


  function updateUser(user : User | null){
    setUser(user);
  }

  function updateRoomID(room_id : string){
    setRoomID(room_id);
  }

  function sendMessage(){
    socket.emit("Hello", "message")
  }

  return (
      <div>
   
        <Navbar />

        {

          user ? 
            <>
              {
                room_id == "" ?
                <MenuPage socket={socket} updateRoomID={updateRoomID} /> 
                :
                //THERE SHOULD BE A LOBBY MENU
                <Games />

              }
            
            </>
          
          : 
          <LoginPage updateUser={updateUser} />
        }

        <Footer />

      </div>
  );
}