"use client"

import { userNameContext } from "@/app/context/userNameContext";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react"
import { UserSocket } from "@/app/context/socketContext";
import LobbyPage from "./components/LobbyPage/LobbyPage";
import { set } from "firebase/database";
import { roomContext } from "@/app/context/roomContext";

export default function Page({ params }: { params: { id: string } }) {
  const { room_id, SetRoomID } = roomContext();
  const {socket, connectToSocket} = UserSocket();
  const {userName, setUserNameFunction} = userNameContext();
  const [error, setError] = useState(false);
  //room id is in link
  const [roomID, setRoomID_local] = useState("");
  useEffect(() => {
    console.log(params.id)

    if(socket == null){
      connectToSocket();
      //we should give a nickname also
    }

    if(userName == ""){
      redirect("/");
    }


    console.log(userName)

    socket.emit("PUT_REQ_JOIN_ROOM", {room_id: params.id, user_id: userName});

    socket.on("PUT_RES_JOIN_ROOM", (data: any) => {
      if (data == "ERROR") {
        setError(true);
        return;
      }
      SetRoomID(params.id);
      setRoomID_local(params.id);
      console.log("Connected to room");
    });
  }, []);



  useEffect(() => {
    if(error){
      redirect("/");
    }

  }, [error])

  return (
    <>
    { roomID == ""?
        <></>:
      <LobbyPage />
    }
    </>
  )
}