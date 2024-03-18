"use client";
import { useEffect, useState } from "react";
import { UserAuth } from "../context/authContext";
import { redirect } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { UserSocket } from "../context/socketContext";

export default function Menu() {
  const { user, googleSignIn, logOut } = UserAuth();
  const {socket, connectToSocket} = UserSocket();
  const [myQuizies, setMyQuizies] = useState([] as any[]);

  useEffect(() => {
    if (user == null) {
      redirect("/login");
    }
  }, [user]);

  useEffect(() => {
    socket.emit("GET_REQ_quizzies", user.uid);
    socket.on("GET_RES_quizzies", (data : any) => {
      console.log("GET_RES_quizzies", data);
      setMyQuizies(data);
    });
  }, [])

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
          {
            myQuizies.map((quiz : any, index) => {
              return (
                <motion.button key={index} className="button">
                  <motion.h2 className="button-text"> {quiz.name} </motion.h2>
                </motion.button>
              )
            })
          }
        </div>
      </div>
    </div>
  );
}
