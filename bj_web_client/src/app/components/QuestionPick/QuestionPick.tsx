import { useEffect, useState } from "react";
import "./QuestionPick.css"
import { set } from "firebase/database";
import { motion } from "framer-motion";

interface QuestionPickProps {
    socket: any;
    room_id: string;
}

const QuestionPick : React.FC<QuestionPickProps> = ({ socket, room_id }) =>{
    
    const [questionList, setQuestionList] = useState([]);

    useEffect(() => {
        socket.emit("get_question_list");
        socket.on("send_question_list", (questionList: []) => {
            console.log("QuestionList: ", questionList);
            setQuestionList(questionList);
        });
    }, []);


    const PickQuestion = (answer : string) => {
        console.log("Picked question set: " + answer);
        socket.emit("pick_questionSet", [room_id, answer]);
    }
    
    return (
    <div className="MainSectionLobby">
        <motion.div className="ManageSectionLobby">

        <h1>QuestionPick</h1>
        {
            questionList.map((question: any) => {
                return (
                    <motion.div className="QuestionSection" key={question[0]}>
                        <motion.h4>{question[1]}</motion.h4>
                        <motion.button className="button" onClick={() => PickQuestion(question[0])}><h1 className="button-text">Pick</h1></motion.button>
                    </motion.div>
                )
            })
        }
        </motion.div>
        
    </div>
    );
}

export default QuestionPick;