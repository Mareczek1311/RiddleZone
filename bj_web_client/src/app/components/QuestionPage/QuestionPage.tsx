import "./QuestionPage.css";
import { motion } from "framer-motion";

interface QuestionPageProps {
    socket: any;
    room_id: string;
    currQuestion: string[];
    waitForPlayers: boolean;
    correct_answer: string;
}

const QuestionPage: React.FC<QuestionPageProps> = ({socket, room_id, currQuestion, waitForPlayers, correct_answer}) => {
 
    function sendAnswer(answer: string) {
        socket.emit('send_answer', {room_id, answer});
        
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
        </motion.div>
}

</motion.div>
    </motion.div>
        </div>
    )
}

export default QuestionPage;
