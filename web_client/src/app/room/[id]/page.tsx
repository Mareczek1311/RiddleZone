"use client"

import { userNameContext } from "@/app/context/userNameContext";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react"
import { UserSocket } from "@/app/context/socketContext";

export default function Page({ params }: { params: { id: string } }) {

  const {socket, connectToSocket} = UserSocket();
  const {userName, setUserNameFunction} = userNameContext();
  const [error, setError] = useState(false);

  useEffect(() => {
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
      console.log("Connected to room");
    });
  }, []);

  useEffect(() => {
    if(error){
      redirect("/");
    }

  }, [error])

  return <div>My Room: {params.id}</div>
}