"use client";

import { set } from "firebase/database";
import { use, useEffect, useState } from "react";
import "./QuizSetMakerPage.css";
import { motion } from "framer-motion";
import { redirect } from "next/navigation";
import { UserAuth } from "../context/authContext";

interface QuizSetMakerPageProps {
  socket: any;
}

const QuizSetMakerPage: React.FC<QuizSetMakerPageProps> = ({
  socket,
}) => {

  const { user, googleSignIn, logOut } = UserAuth();

  const [nameSetInputValue, setNameSetInputValue] = useState("");
  const [questionInputValue, setQuestionInputValue] = useState("");
  const [answerAInputValue, setAnswerAInputValue] = useState("");
  const [answerBInputValue, setAnswerBInputValue] = useState("");
  const [answerCInputValue, setAnswerCInputValue] = useState("");
  const [answerDInputValue, setAnswerDInputValue] = useState("");

  const [questionCounter, setQuestionCounter] = useState(1);
  const [questionIndex, setQuestionIndex] = useState(0);

  const [questionList, setQuestionList] = useState([
    {
      question: "",
      answerA: "",
      answerB: "",
      answerC: "",
      answerD: "",
      correctAnswer: "",
    },
  ] as any[]);

  function DeleteQuestion() {
    if (questionCounter === 1) {
      return;
    }
    questionList.splice(questionIndex, 1);
    setQuestionList([...questionList]);
    setQuestionCounter(questionCounter - 1);
    setQuestionIndex(questionIndex - 1);
  }

  function switchQuestion(direction: number) {
    if (direction == -1) {
      if (questionCounter <= 1) {
        return;
      }
      setQuestionCounter(questionCounter - 1);
      setQuestionIndex(questionIndex - 1);
    }
    if (direction == 1) {
      setQuestionCounter(questionCounter + 1);
      if (questionCounter === questionList.length) {
        const question = {
          question: "",
          answerA: "",
          answerB: "",
          answerC: "",
          answerD: "",
          correctAnswer: "",
        };
        setQuestionList([...questionList, question]);
        console.log("created");
      }
      setQuestionIndex(questionIndex + 1);
    }
  }

  const [data, setData] = useState("");

  const options = ["a", "b", "c", "d"];
  const onOptionChangeHandler = (event: any) => {
    setData(event.target.value);
    console.log("User Selected Value - ", event.target.value);
  };

  useEffect(() => {
    var currQuestion = questionList[questionIndex];
    currQuestion.question = questionInputValue;
    currQuestion.answerA = answerAInputValue;
    currQuestion.answerB = answerBInputValue;
    currQuestion.answerC = answerCInputValue;
    currQuestion.answerD = answerDInputValue;
    currQuestion.correctAnswer = data;

    questionList[questionIndex] = currQuestion;
    setQuestionList([...questionList]);
  }, [
    questionInputValue,
    answerAInputValue,
    answerBInputValue,
    answerCInputValue,
    answerDInputValue,
    data,
  ]);

  useEffect(() => {
    setAnswerAInputValue(questionList[questionIndex].answerA);
    setAnswerBInputValue(questionList[questionIndex].answerB);
    setAnswerCInputValue(questionList[questionIndex].answerC);
    setAnswerDInputValue(questionList[questionIndex].answerD);
    setQuestionInputValue(questionList[questionIndex].question);
    setData(questionList[questionIndex].correctAnswer);
  }, [questionIndex]);
  
  
  useEffect(() => {
    if(user == null){
      redirect("/login")
    }
  }
  , [user])

  return (
    <div>
        {user ?
    <div className="MainSection">

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
    
                <button
                  className="button"
                  onClick={() => {
                    switchQuestion(-1);
                  }}
                >
                  <motion.h2 className="button-text" style={{}}>
                    {" "}
                    {"<"}{" "}
                  </motion.h2>
                </button>
    
                <h3></h3>
    
                <h4 className="input-description">Question {questionCounter}: </h4>
                <input
                  type="text"
                  value={questionInputValue}
                  onChange={(event) => setQuestionInputValue(event.target.value)}
                  placeholder="Enter question"
                />
    
                <h4 className="input-description">Answer A:</h4>
                <input
                  type="text"
                  value={answerAInputValue}
                  onChange={(event) => setAnswerAInputValue(event.target.value)}
                  placeholder="Enter answer A"
                />
    
                <h4 className="input-description">Answer B:</h4>
                <input
                  type="text"
                  value={answerBInputValue}
                  onChange={(event) => setAnswerBInputValue(event.target.value)}
                  placeholder="Enter answer B"
                />
    
                <h4 className="input-description">Answer C:</h4>
                <input
                  type="text"
                  value={answerCInputValue}
                  onChange={(event) => setAnswerCInputValue(event.target.value)}
                  placeholder="Enter answer C"
                />
    
                <h4 className="input-description">Answer D:</h4>
                <input
                  type="text"
                  value={answerDInputValue}
                  onChange={(event) => setAnswerDInputValue(event.target.value)}
                  placeholder="Enter answer D"
                />
    
                <div className="input-wrapper">
                  <select onChange={onOptionChangeHandler}>
                    <option>Choose correct answer:</option>
                    {options.map((option, index) => {
                      return <option key={index}>{option}</option>;
                    })}
                  </select>
                </div>
    
                <div className="JUSTFKNGWORK">
                  <button
                    className="button"
                    onClick={() => {
                      switchQuestion(1);
                    }}
                  >
                    <motion.h2 className="button-text" style={{}}>
                      {" "}
                      {">"}{" "}
                    </motion.h2>
                  </button>
                  <button
                    className="button"
                    onClick={() => {
                      DeleteQuestion();
                    }}
                  >
                    <motion.h2 className="button-text" style={{}}>
                      {" "}
                      Delete Question{" "}
                    </motion.h2>
                  </button>
                </div>
              </div>
            </div>
            <div className="Preview">
              <h1>Preview</h1>
              {questionList.map((question, index) => {
                return (
                  <div key={index}>
                    <h4>
                      Question {index + 1}: {question.question}
                    </h4>
                    <h4>Answer A: {question.answerA}</h4>
                    <h4>Answer B: {question.answerB}</h4>
                    <h4>Answer C: {question.answerC}</h4>
                    <h4>Answer D: {question.answerD}</h4>
                    <h4>Correct Answer: {question.correctAnswer}</h4>
                  </div>
                );
              })}
            </div>
          </div>
    </div>

    :null
        }
  
    </div>
  );
  
};

export default QuizSetMakerPage;
