import "./QuestionPage.css";
import { motion } from "framer-motion";
import React, { useState } from "react";

interface QuestionPageProps {
    socket: any;
    room_id: string;
    currQuestion: string[];
    waitForPlayers: boolean;
    correct_answer: string;
    isClicked: boolean;
    updateIsClicked: (data: boolean) => void;
    isAdmin: boolean;
}

const QuestionPage: React.FC<QuestionPageProps> = ({socket, room_id, currQuestion, waitForPlayers, correct_answer, isClicked, updateIsClicked, isAdmin}) => {


    function sendAnswer(answer: string) {
        if (isClicked) {
            return;
        }
        socket.emit('send_answer', {room_id, answer});
        updateIsClicked(true)
    }

    function SkipQuestion() {
        if (isClicked) {
            return;
        }
        socket.emit('skip_question', room_id);
        updateIsClicked(true)
    }

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
