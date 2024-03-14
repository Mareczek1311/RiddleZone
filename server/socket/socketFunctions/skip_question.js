const db = require("../../db/firebase");

function skip_question(socket, io) {
  socket.on("skip_question", async (room_id) => {
    console.log("===SKIP_QUESTION===");

    const docRef = db.collection("rooms").doc(room_id);
    const doc = await docRef.get();

    const currQuestion = doc.data()["currQuestion"];
    const questionSet = doc.data()["questionSet"];

    const nextQuestion = currQuestion + 1;

    await docRef.update({
      currQuestion: nextQuestion,
    });

    const nextQuestionRef = db
      .collection("questions")
      .doc(questionSet)
      .collection("questions")
      .doc(nextQuestion.toString());
    const nextQuestionData = await nextQuestionRef.get();

    if (nextQuestionData.exists) {
      io.to(room_id).emit("send_question", [
        nextQuestionData.data()["name"],
        nextQuestionData.data()["a"],
        nextQuestionData.data()["b"],
        nextQuestionData.data()["c"],
        nextQuestionData.data()["d"],
      ]);
    } else {
      const rankingDoc = db
        .collection("rooms")
        .doc(room_id)
        .collection("players")
        .orderBy("score", "desc");
      const ranking = await rankingDoc.get().then((snapshot) => {
        const arr = [];
        snapshot.forEach((doc) => {
          arr.push([doc.data()["realID"], doc.data()["score"]]);
        });
        return arr;
      });

      io.to(room_id).emit("end_game");
      io.to(room_id).emit("send_ranking", ranking);
    }

    await docRef.update({
      answered: 0,
    });
  });
}

module.exports = skip_question;
