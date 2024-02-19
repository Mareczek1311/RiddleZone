'use client';

import { useState } from "react";
import Navbar from "./components/Navbar/Navbar";
import { io } from "socket.io-client";
import Games from "./components/QuizPage/QuizPage";
import Head from "next/head";
import { MainPage } from "./components/MainPage/MainPage";
import Footer from "./components/Footer/Footer";
import { User } from "firebase/auth";
import LoginPage from "./components/LoginPage/LoginPage";

let socket: any;

export default function Home() {

  const [isLogged, setIsLogged] = useState(false)
  const [user, setUser] = useState<User | null>(null)

  function connect(){
    socket = io("http://localhost:3001");

    socket.on("connect", () => {
      console.log(socket.id); 
      if(socket.connected){
        setIsLogged(true);
      }
    });
  }

  function updateUser(user : User | null){
    setUser(user);
  }

  function sendMessage(){
    socket.emit("Hello", "message")
  }

  return (
      <div>
   
        <Navbar />

        {
          user ? <MainPage /> : <LoginPage updateUser={updateUser} />
        }

        <Footer />

      </div>
  );
}