"use client";

import { UserSocket } from "@/app/context/socketContext";
import "./QuestionPage.css";
import { motion } from "framer-motion";
import React, { useCallback, useEffect, useState } from "react";
import { roomContext } from "@/app/context/roomContext";
import { set } from "firebase/database";
import { Loading } from "@/app/components/Loading/Loading";
import { redirect } from "next/navigation";

interface QuestionPageProps {
  room_id_: string;
}

const QuestionPage: React.FC<QuestionPageProps> = ({ room_id_ }) => {
  const { room_id, SetRoomID } = roomContext();
  const { socket, connectToSocket } = UserSocket();
  const [isClicked, updateIsClicked] = useState(false);
  const [correct_answer, setCorrectAnswer] = useState("");
  const [currQuestion, setCurrQuestion] = useState(["", "", "", "", ""]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [questionName, setQuestionName] = useState("");
  const [isEnded, setIsEnded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  function sendAnswer(answer: string) {
    if (isClicked) {
      return;
    }
    socket.emit("PUT_REQ_SEND_ANSWER", { room_id: room_id, answer: answer });

    //we should get correct answer at the end of the round
    socket.on("PUT_RES_SEND_ANSWER", (data: any) => {
      setCorrectAnswer(data.correctAnswer);
      console.log("correctAnswer: ", data.correctAnswer);

      //[TESTING] here we sould check if all players gave answers
      socket.emit("PUT_REQ_CHECK_IF_ALL_ANSWERED", room_id);
      //[TESTING]
    });

    updateIsClicked(true);
  }

  function SkipQuestion() {
    if (isClicked) {
      return;
    }
    socket.emit("PUT_REQ_SKIP_QUESTION", room_id);
    updateIsClicked(true);
  }

  useEffect(() => {
    
    console.log("room_id: ", room_id);
    socket.emit("GET_REQ_ROOM_INFO", room_id);
    socket.on("GET_RES_ROOM_INFO", (data: any) => {
      // we can optimise that
      setIsAdmin(data.users[socket.id].isAdmin);
    });

    console.log("GET_REQ_QUESTION+++++++")
    socket.emit("GET_REQ_QUESTION", room_id);

    return () => {
      socket.off("GET_RES_ROOM_INFO");
    }

  }, []);



  useEffect(() => {
    const handleGetResQuestion = (data: any) => {
      console.log("data: ", data);
      if (data.isEnded === true) {
        setIsEnded(true);
      }
  
      setCurrQuestion(data.questions);
      setQuestionName(data.name);
      setCorrectAnswer("");
      updateIsClicked(false);
      setIsLoading(false);
    };
  
    // Ustawienie nasłuchu na zdarzenie 'GET_RES_QUESTION'
    socket.on("GET_RES_QUESTION", handleGetResQuestion);
  
    // Czyszczenie nasłuchu na zdarzenie przy odmontowaniu komponentu
    return () => {
      socket.off("GET_RES_QUESTION", handleGetResQuestion);
    };
  }, [socket]); // Reagowanie na zmiany instancji `socket`


  
  useEffect(() => {
    // Definiowanie funkcji obsługującej zdarzenie wewnątrz useEffect
    const handlePutResCheckIfAllAnswered = (status: boolean) => {
      console.log(status); // Logowanie otrzymanego statusu
      if (status) { // Jeśli status jest prawdziwy, wykonaj pewne akcje
        setIsLoading(true);
        setCorrectAnswer(""); // Reset odpowiedzi
        updateIsClicked(false); // Zaktualizuj stan kliknięcia
        setCurrQuestion(["", "", "", "", ""]); // Reset aktualnego pytania
  
        // Emituj zdarzenie GET_REQ_QUESTION, gdy status jest prawdziwy
        console.log("Emitting GET_REQ_QUESTION");
        socket.emit("GET_REQ_QUESTION", room_id);
      }
    };
  
    // Rejestrowanie nasłuchiwacza zdarzeń
    socket.on("PUT_RES_CHECK_IF_ALL_ANSWERED", handlePutResCheckIfAllAnswered);
  
    // Czyszczenie nasłuchiwacza przy odmontowywaniu komponentu
    return () => {
      socket.off("PUT_RES_CHECK_IF_ALL_ANSWERED", handlePutResCheckIfAllAnswered);
    };
  }, [socket, room_id, setIsLoading, setCorrectAnswer, updateIsClicked, setCurrQuestion]);
  

  useEffect(() => {
    if(isAdmin && questionName != ""){
      socket.emit("PUT_REQ_SEND_ANSWER", { room_id: room_id, answer: "z" });

      socket.on("PUT_RES_SEND_ANSWER", (data: any) => {
        setCorrectAnswer(data.correctAnswer);
        console.log("correctAnswer: ", data.correctAnswer);
      });
    }



  }, [questionName])

  useEffect(() => {
    if (isEnded == true) {
      redirect("/room/" + room_id + "/end");
    }
  }, [isEnded]);

  return (
    <div>
      <motion.div className="MainSectionLobby">
        <motion.div className="ManageSectionLobby">
          {isLoading ? (
            <Loading />
          ) : (
            <>
              <motion.h1>{questionName}</motion.h1>
              {!(correct_answer == "") ? (
                <div className="question-page-container">
                  {"a" === correct_answer ? (
                    <div className="question-page-answer-correct button">
                      <motion.h1 className="button-text question-page-answer-correct-text">
                        {currQuestion[0]}
                      </motion.h1>
                    </div>
                  ) : (
                    <div className=" question-page-answer-uncorrent button">
                      <motion.h1 className="button-text question-page-answer-uncorrent-text">
                        {currQuestion[0]}
                      </motion.h1>
                    </div>
                  )}
                  {"b" === correct_answer ? (
                    <div className="question-page-answer-correct button">
                      <motion.h1 className="button-text question-page-answer-correct-text">
                        {currQuestion[1]}
                      </motion.h1>
                    </div>
                  ) : (
                    <div className=" question-page-answer-uncorrent button">
                      <motion.h1 className="button-text question-page-answer-uncorrent-text">
                        {currQuestion[1]}
                      </motion.h1>
                    </div>
                  )}
                  {"c" === correct_answer ? (
                    <div className="question-page-answer-correct button">
                      <motion.h1 className="button-text question-page-answer-correct-text">
                        {currQuestion[2]}
                      </motion.h1>
                    </div>
                  ) : (
                    <div className=" question-page-answer-uncorrent button">
                      <motion.h1 className="button-text question-page-answer-uncorrent-text">
                        {currQuestion[2]}
                      </motion.h1>
                    </div>
                  )}
                  {"d" === correct_answer ? (
                    <div className="question-page-answer-correct button">
                      <motion.h1 className="button-text question-page-answer-correct-text">
                        {currQuestion[3]}
                      </motion.h1>
                    </div>
                  ) : (
                    <div className=" question-page-answer-uncorrent button">
                      <motion.h1 className="button-text question-page-answer-uncorrent-text">
                        {currQuestion[3]}
                      </motion.h1>
                    </div>
                  )}
                </div>
              ) : (
                <motion.div className="question-page-container">
                  <motion.div className="question-page-answer">
                    <motion.button
                      onClick={() => {
                        sendAnswer("a");
                      }}
                      className="button"
                    >
                      <motion.h1 className="button-text thinner">
                        {currQuestion[0]}
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
                      <motion.h1 className="button-text">
                        {currQuestion[1]}
                      </motion.h1>
                    </motion.button>
                  </motion.div>
                  <motion.div className="question-page-answer">
                    <motion.button
                      onClick={() => {
                        sendAnswer("c");
                      }}
                      className="button"
                    >
                      <motion.h1 className="button-text">
                        {currQuestion[2]}
                      </motion.h1>
                    </motion.button>
                  </motion.div>
                  <motion.div className="question-page-answer">
                    <motion.button
                      onClick={() => {
                        sendAnswer("d");
                      }}
                      className="button"
                    >
                      <motion.h1 className="button-text">
                        {currQuestion[3]}
                      </motion.h1>
                    </motion.button>
                  </motion.div>
                  {isAdmin ? (
                    <motion.div className="question-page-answer">
                      <motion.button
                        onClick={() => {
                          SkipQuestion();
                        }}
                        className="button"
                      >
                        <motion.h1 className="button-text">
                          SKIP QUESTION
                        </motion.h1>
                      </motion.button>
                    </motion.div>
                  ) : null}
                </motion.div>
              )}
            </>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default QuestionPage;
