const db = require("../../db/firebase");


function get_question(socket, io) {
  socket.on("get_question", async (room_id) => {
    const docRef = db.collection("rooms").doc(room_id);
    const doc = await docRef.get();

    const currQuestion = doc.data()["currQuestion"];
    const questionSet = doc.data()["questionSet"];

    const questionRef = db
      .collection("questions")
      .doc(questionSet)
      .collection("questions")
      .doc(currQuestion.toString());

    var question = await questionRef.get();

    if (question == undefined) {
      socket.emit("error_send_question", "Question not found");
      return;
    }

    var questionData = undefined;
    try {
      questionData = [
        question.data()["name"],
        question.data()["a"],
        question.data()["b"],
        question.data()["c"],
        question.data()["d"],
      ];
    } catch (err) {
      console.log("ERROR: ", err);
      socket.emit("error_send_question", "Question not found");
    }
    if (questionData == undefined) {
      socket.emit("error_send_question", "Question not found");
      return;
    }

    console.log("SENDING QUESTION: ", questionData);

    io.to(room_id).emit("send_question", questionData);
  });
}

module.exports = get_question;
