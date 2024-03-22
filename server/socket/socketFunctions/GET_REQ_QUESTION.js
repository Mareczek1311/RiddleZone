const db = require("../../db/firebase");

function GET_REQ_QUESTION(socket, io) {
  socket.on("GET_REQ_QUESTION", async (room_id) => {
    console.log("===GET_REQ_QUESTION===");

    const docQuestionSetId = await db.collection("rooms").doc(room_id).get();

    const questionSetId = docQuestionSetId.data().questionSetId;

    const currentQuestion = docQuestionSetId.data().currentQuestion;

    //check if currentQuestion exist

    const docRef = await db
      .collection("questions")
      .doc(questionSetId)
      .collection("questions")
      .doc(currentQuestion.toString())
      .get();

    if (!docRef.exists) {
      const doc = await db.collection("rooms").doc(room_id).get();

      const room = doc.data();

      //error here room.set is not a function
      const docref = db
      .collection("rooms")
      .doc(room_id)

      await docref.update({
          isEnded: true,
      });


      io.to(room_id).emit("GET_RES_QUESTION", {
        questions: [],
        name: "",
        isEnded: true
      });

      return;
    }

    const arr = [
      docRef.data()["a"],
      docRef.data()["b"],
      docRef.data()["c"],
      docRef.data()["d"],
    ];
    console.log("arr: ", arr);
    const data = {
      questions: arr,
      name: docRef.data()["name"],
      isEnded: false
    };

    socket.emit("GET_RES_QUESTION", data);
  });
}

module.exports = GET_REQ_QUESTION;
