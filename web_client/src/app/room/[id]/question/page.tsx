"use client"

import { UserSocket } from "@/app/context/socketContext";
import "./QuestionPage.css";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";

interface QuestionPageProps {
    room_id: string;
}

const QuestionPage: React.FC<QuestionPageProps> = ({room_id}) => {
    const {socket, connectToSocket} = UserSocket();
    const [isClicked, updateIsClicked] = useState(false);
    const [correct_answer, setCorrectAnswer] = useState("");
    const [currQuestion, setCurrQuestion] = useState(["", "", "", "", ""]);
    const [isAdmin, setIsAdmin] = useState(false);

    function sendAnswer(answer: string) {
        if (isClicked) {
            return;
        }
        socket.emit('PUT_REQ_SEND_ANSWER', {room_id, answer});
        
        //we should get correct answer at the end of the round
        socket.on('PUT_RES_SEND_ANSWER', (data: any) => {
            setCorrectAnswer(data.correct_answer);
        })

        updateIsClicked(true)
    }

    function SkipQuestion() {
        if (isClicked) {
            return;
        }
        socket.emit('PUT_REQ_SKIP_QUESTION', room_id);
        updateIsClicked(true)
    }

    useEffect(() => {
        
      socket.emit("GET_REQ_ROOM_INFO", room_id);
      socket.on("GET_RES_ROOM_INFO", (data: any) => {
        // we can optimise that
        

        setIsAdmin(data.users[socket.id].isAdmin);
      })

      socket.emit("GET_REQ_QUESTION", room_id);

    }, []);

    useEffect(() =>{
      socket.on("GET_RES_QUESTION", (data: any) => {
        setCurrQuestion(data.question);
        setCorrectAnswer("");
        updateIsClicked(false);
      })

      socket.on("GET_RES_CORRECT_ANSWER", (data: any) => {
        setCorrectAnswer(data.correct_answer);
      })
    }, [socket])



    return(
        <div>        
            <motion.div className="MainSectionLobby">
            <motion.div className="ManageSectionLobby">
            <motion.h1>{currQuestion[0]}</motion.h1>

            {
                !(correct_answer == "") ?
            <div className="question-page-container">
                {
                    "a" === correct_answer ?
                    < div className="question-page-answer-correct button">
                        <motion.h1 className="button-text question-page-answer-correct-text">
                        {currQuestion[1]}
                        </motion.h1>
                    </div>
                    :
                    <div className=" question-page-answer-uncorrent button">
                        <motion.h1 className="button-text question-page-answer-uncorrent-text">
                        {currQuestion[1]}
                        </motion.h1>
                    </div>
                }
                {
                    "b" === correct_answer ?
                    <div className="question-page-answer-correct button">
                        <motion.h1 className="button-text question-page-answer-correct-text">
                        {currQuestion[2]}
                        </motion.h1>
                    </div>
                    :
                    <div className=" question-page-answer-uncorrent button">
                        <motion.h1 className="button-text question-page-answer-uncorrent-text">
                        {currQuestion[2]}
                        </motion.h1>
                    </div>
                }
                {
                    "c" === correct_answer ?
                    <div className="question-page-answer-correct button">
                        <motion.h1 className="button-text question-page-answer-correct-text">
                        {currQuestion[3]}
                        </motion.h1>
                    </div>
                    :
                    <div className=" question-page-answer-uncorrent button">
                        <motion.h1 className="button-text question-page-answer-uncorrent-text">
                        {currQuestion[3]}
                        </motion.h1>
                    </div>
                }
                {
                    "d" === correct_answer ?
                    <div className="question-page-answer-correct button">
                        <motion.h1 className="button-text question-page-answer-correct-text">
                            {currQuestion[4]}
                        </motion.h1>
                    </div>
                    :
                    <div className=" question-page-answer-uncorrent button">
                        <motion.h1 className="button-text question-page-answer-uncorrent-text">
                        {currQuestion[4]}
                        </motion.h1>
                    </div>
                }
            </div>

            :

        <motion.div className="question-page-container">
          <motion.div className="question-page-answer">
            <motion.button
              onClick={() => {
                sendAnswer("a");
              }}
              className="button"
            >
              <motion.h1 className="button-text thinner">
                {currQuestion[1]}
              </motion.h1>
            </motion.button>
          </motion.div>
          <motion.div className="question-page-answer">
            <motion.button
              onClick={() => {
                sendAnswer("b");
              }}
              className="button"
            >
              <motion.h1 className="button-text">{currQuestion[2]}</motion.h1>
            </motion.button>
          </motion.div>
          <motion.div className="question-page-answer">
            <motion.button
              onClick={() => {
                sendAnswer("c");
              }}
              className="button"
            >
              <motion.h1 className="button-text">{currQuestion[3]}</motion.h1>
            </motion.button>
          </motion.div>
          <motion.div className="question-page-answer">
            <motion.button
              onClick={() => {
                sendAnswer("d");
              }}
              className="button"
            >
              <motion.h1 className="button-text">{currQuestion[4]}</motion.h1>
            </motion.button>
          </motion.div>
          {isAdmin ?
          <motion.div className="question-page-answer">
            <motion.button
              onClick={() => {
                SkipQuestion();
              }}
              className="button"
            >
              <motion.h1 className="button-text">SKIP QUESTION</motion.h1>
            </motion.button>
          </motion.div>
          : null
        }
        </motion.div>
        
}

</motion.div>
    </motion.div>
        </div>
    )
}

export default QuestionPage;
