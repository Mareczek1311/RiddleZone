"use client";
import { useEffect, useState } from "react";
import { UserAuth } from "../context/authContext";
import Link from "next/link";
import { motion } from "framer-motion";
import { UserSocket } from "../context/socketContext";
import { redirect } from "next/navigation";
import { userNameContext } from "../context/userNameContext";

export default function Menu() {
  const { user, googleSignIn, logOut } = UserAuth();
  const { socket, connectToSocket } = UserSocket();
  const [myQuizies, setMyQuizies] = useState([] as any[]);
  const [allQuizies, setAllQuizies] = useState([] as any[]);

  const [roomid, setRoomid] = useState("");

  const {userName, setUserNameFunction} = userNameContext();


  useEffect(() => {
    if (user == null) {
      redirect("/login");
    }
  }, [user]);

  useEffect(() => {
    socket.emit("GET_REQ_quizzies", user.uid);
    socket.on("GET_RES_quizzies", (data: any) => {
      console.log("GET_RES_quizzies", data);
      setMyQuizies(data);
    });
  }, []);

  useEffect(() =>{
    if(roomid != ""){
      redirect(`/room/${roomid}`);
    }
  },[roomid])

  const createRoom = async (id : string) => {
    console.log("user id", user.uid);
    await setUserNameFunction(user.uid);

    socket.emit("PUT_REQ_CREATE_ROOM", {user_id: user.uid, questionSetId: id});
    socket.on("PUT_RES_CREATE_ROOM", (data: any) => {
      console.log("CREATE_ROOM_RES", data);
      setRoomid(data.room_id);
    });
  }

  return (
    <div className="MainSection">
      <div className="ManageSection">
        <h1>Menu</h1>

        <motion.button className="button">
          <Link href="/createQuestionSet">
            <motion.h2 className="button-text"> CREATE NEW QUIZ </motion.h2>
          </Link>
        </motion.button>
        <motion.button onClick={logOut} className="button">
          <motion.h2 className="button-text"> LOGOUT </motion.h2>
        </motion.button>

        <div>
          <h1>MY QUIZZIES</h1>
          {myQuizies.map((quiz: any, index) => {
            return (
              <motion.button key={index} className="button" onClick={() =>createRoom(quiz[1]) }>
                <motion.h2 className="button-text"> {quiz[0].name} </motion.h2>
              </motion.button>
            );
          })}
        </div>

        <motion.button className="button">
          <motion.h2 className="button-text"> SEE MORE </motion.h2>
        </motion.button>
      </div>
      
    </div>
  );
}
