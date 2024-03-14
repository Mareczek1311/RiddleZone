const db = require("../../db/firebase");

function send_answer(socket, answer) {
  socket.on("send_answer", async (data) => {
    //we should check if all players send answers then we can send next question
    console.log("===SEND_ANSWER===");
    console.log("ANSWER: ", data.answer);
    console.log("ROOM ID: ", data.room_id);
    const docRefRoomPlayer = db
      .collection("rooms")
      .doc(data.room_id)
      .collection("players")
      .doc(socket.id);
    const docRefRoomQuestionsSet = db.collection("rooms").doc(data.room_id);
    const docRoomQuestionsSet = await docRefRoomQuestionsSet.get();

    const questionSet = docRoomQuestionsSet.data()["questionSet"];
    const currQuestion = docRoomQuestionsSet.data()["currQuestion"];

    const questionRef = db
      .collection("questions")
      .doc(questionSet)
      .collection("questions")
      .doc(currQuestion.toString());
    const question = await questionRef.get();

    const correctAnswer = question.data()["answer"];

    await docRefRoomQuestionsSet.update({
      answered: admin.firestore.FieldValue.increment(1),
    });

    if (data.answer == correctAnswer) {
      socket.emit("correct_answer", correctAnswer);

      await docRefRoomPlayer.update({
        score: admin.firestore.FieldValue.increment(1),
      });
    } else {
      socket.emit("wrong_answer", correctAnswer);
    }

    const RoomData = await docRefRoomQuestionsSet.get();

    console.log("ANSWERED: ", RoomData.data()["answered"]);
    console.log("MAX PLAYERS: ", RoomData.data()["maxPlayers"]);

    if (RoomData.data()["answered"] >= RoomData.data()["maxPlayers"]) {
      const nextQuestion = currQuestion + 1;

      await docRefRoomQuestionsSet.update({
        currQuestion: nextQuestion,
      });

      const nextQuestionRef = db
        .collection("questions")
        .doc(questionSet)
        .collection("questions")
        .doc(nextQuestion.toString());
      const nextQuestionData = await nextQuestionRef.get();

      if (nextQuestionData.exists) {
        io.to(data.room_id).emit("send_question", [
          nextQuestionData.data()["name"],
          nextQuestionData.data()["a"],
          nextQuestionData.data()["b"],
          nextQuestionData.data()["c"],
          nextQuestionData.data()["d"],
        ]);
      } else {
        const rankingDoc = db
          .collection("rooms")
          .doc(data.room_id)
          .collection("players")
          .orderBy("score", "desc");
        const ranking = await rankingDoc.get().then((snapshot) => {
          const arr = [];
          snapshot.forEach((doc) => {
            arr.push([doc.data()["realID"], doc.data()["score"]]);
          });
          return arr;
        });

        setTimeout(() => {
          io.to(data.room_id).emit("end_game");
          io.to(data.room_id).emit("send_ranking", ranking);
        }, 3000);
      }

      //update answered to 0
      await docRefRoomQuestionsSet.update({
        answered: 0,
      });
    } else {
      socket.emit("wait_for_players");
    }
  });
}

module.exports = send_answer;
