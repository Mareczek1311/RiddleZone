import { set } from "firebase/database";
import { useState } from "react";
import "./QuizSetMakerPage.css";
import { motion } from "framer-motion";

interface QuizSetMakerPageProps {
    socket : any;
}

const QuizSetMakerPage: React.FC<QuizSetMakerPageProps> = ({ socket }) => {
    
    const [nameSetInputValue, setNameSetInputValue] = useState("");
    const [questionInputValue, setQuestionInputValue] = useState("");
    const [answerAInputValue, setAnswerAInputValue] = useState("");
    const [answerBInputValue, setAnswerBInputValue] = useState("");
    const [answerCInputValue, setAnswerCInputValue] = useState("");
    const [answerDInputValue, setAnswerDInputValue] = useState("");


    const [questionCounter, setQuestionCounter] = useState(1);

    const [questionList, setQuestionList] = useState([] as any[]);

    function ResetValues() {
        setQuestionInputValue("");
        setAnswerAInputValue("");
        setAnswerBInputValue("");
        setAnswerCInputValue("");
        setAnswerDInputValue("");
        setData("");
    }

    function addQuestion() {
        
        if(data === "") {
            alert("Please select correct answer");
            return;
        }
        if(answerAInputValue === "" || answerBInputValue === "" || answerCInputValue === "" || answerDInputValue === "") {
            alert("Please fill all answers");
            return;
        }
        if(questionInputValue === "") {
            alert("Please fill question");
            return;
        }

        setQuestionCounter(questionCounter + 1);
        
        const question = {
            question: questionInputValue,
            answers: [
                answerAInputValue,
                answerBInputValue,
                answerCInputValue,
                answerDInputValue
            ],
            correctAnswer: data
        }
        setQuestionList([...questionList, question]);

        ResetValues();
    }



    const [data, setData] = useState("");
 
    const options = [
        "a",
        "b",
        "c",
        "d",
    ];
    const onOptionChangeHandler = (event: any) => {
        setData(event.target.value);
        console.log(
            "User Selected Value - ",
            event.target.value
        );
    };

    return (
        <div>
        <div className="ManageSection">
            <h1>Quiz Set Maker</h1>
            <div>
              <h4 className="input-description">QUIZ NAME</h4>
              <input
                type="text"
                value={nameSetInputValue}
                onChange={(event) => setNameSetInputValue(event.target.value)}
                placeholder="Enter quiz name"
              />
        
                <button className="button" onClick={() => {buttonHandler()}}>
                <motion.h2
                  className="button-text"
                  style={{
                  }}
                >
                  {" "}
                  {"<"}{" "}
                </motion.h2>
              </button>


                <h3></h3>     

                <h4 className="input-description">Question {questionCounter}: </h4>
                <input
                    type="text"
                    value={nameSetInputValue}
                    onChange={(event) => setQuestionInputValue(event.target.value)}
                    placeholder="Enter question"
                />


                <h4 className="input-description">Answer A:</h4>
                <input
                    type="text"
                    value={nameSetInputValue}
                    onChange={(event) => setAnswerAInputValue(event.target.value)}
                    placeholder="Enter answer A"
                />

                <h4 className="input-description">Answer B:</h4>
                <input
                    type="text"
                    value={nameSetInputValue}
                    onChange={(event) => setAnswerBInputValue(event.target.value)}
                    placeholder="Enter answer B"
                />

                <h4 className="input-description">Answer C:</h4>
                <input
                    type="text"
                    value={nameSetInputValue}
                    onChange={(event) => setAnswerCInputValue(event.target.value)}
                    placeholder="Enter answer C"
                />

                <h4 className="input-description">Answer D:</h4>
                <input
                    type="text"
                    value={nameSetInputValue}
                    onChange={(event) => setAnswerDInputValue(event.target.value)}
                    placeholder="Enter answer D"
                />

            <div className="input-wrapper">
                <select onChange={onOptionChangeHandler}>
                <option>Choose correct answer:</option>
                {options.map((option, index) => {
                    return (
                        <option key={index}>
                            {option}
                        </option>
                    );
                })}
            </select>
            </div>


             <button className="button" onClick={() => {buttonHandler()}}>
                <motion.h2
                  className="button-text"
                  style={{
                  }}
                >
                  {" "}
                  {">"}{" "}
                </motion.h2>
              </button>
            
            
            </div>

        </div>  
        </div>
    );
}

export default QuizSetMakerPage;
