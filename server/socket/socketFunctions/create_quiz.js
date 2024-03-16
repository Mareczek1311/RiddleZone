const db = require("../../db/firebase");

/*
    const data = {
      name: nameSetInputValue,
      questions: questionList,
      user_id: user.id,
    };
*/

function create_quiz(socket, io) {
    socket.on("create_quiz", async (data) => {
        console.log("===CREATE_QUIZ===");
        console.log(data);
        const quiz_id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

        const quizRef = db.collection("questions").doc(quiz_id);
        await quizRef.set({
            name: data.name,
            questionsCount: data.questions.length,
            user_id: data.user_id,
        });

        for(let i =0; i<data.questions.length; i++){
            const questionRef = db.collection("questions").doc(quiz_id).collection("questions").doc((i+1).toString());
            await questionRef.set({
                a: data.questions[i].answerA,
                b: data.questions[i].answerB,
                c: data.questions[i].answerC,
                d: data.questions[i].answerD,
                answer: data.questions[i].correctAnswer,
                name: data.questions[i].question,
            });
        }
      });
}

module.exports = create_quiz;
