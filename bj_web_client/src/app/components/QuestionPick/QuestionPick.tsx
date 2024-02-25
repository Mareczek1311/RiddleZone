import { useEffect, useState } from "react";
import "./QuestionPick.css"
import { set } from "firebase/database";

interface QuestionPickProps {
    socket: any;
}

const QuestionPick : React.FC<QuestionPickProps> = ({ socket }) =>{
    
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
    }
    
    return (
    <div className="MainSection">
        <h1>QuestionPick</h1>

        {
            questionList.map((question: any) => {
                return (
                    <div className="QuestionSection" key={question[0]}>
                        <p>{question[1]}</p>
                        <button onClick={() => PickQuestion(question[0])}>Pick</button>
                    </div>
                )
            })
        }
        
    </div>
    );
}

export default QuestionPick;