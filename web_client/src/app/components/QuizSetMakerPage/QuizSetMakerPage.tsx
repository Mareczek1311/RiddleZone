import { set } from "firebase/database";
import { useState } from "react";
import "./QuizSetMakerPage.css";

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
            <h1>Quiz Set Maker</h1>
            <div>
                <h3>Quiz name:</h3>
                <input type="text" value={nameSetInputValue} onChange={(event) => setNameSetInputValue(event.target.value)} />

                <h3>Question {questionCounter}: </h3>        
                <input type="text" value={questionInputValue} onChange={(event) => setQuestionInputValue(event.target.value)} />
                
                <h1>answer a: </h1>
                <input type="text" value={answerAInputValue} onChange={(event) => setAnswerAInputValue(event.target.value)} />
                <h1>answer b: </h1>
                <input type="text" value={answerBInputValue} onChange={(event) => setAnswerBInputValue(event.target.value)} />
                <h1>answer c: </h1>
                <input type="text" value={answerCInputValue} onChange={(event) => setAnswerCInputValue(event.target.value)} />
                <h1>answer d: </h1>
                <input type="text" value={answerDInputValue} onChange={(event) => setAnswerDInputValue(event.target.value)} />

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
            <button>Add question</button>

            </div>

        </div>  
    );
}

export default QuizSetMakerPage;
