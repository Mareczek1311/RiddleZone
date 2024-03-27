const db = require("../../db/firebase");

const fun = async (socket, room_id, io) => {
  console.log("===GET_REQ_QUESTION===222");

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

  const doc = await db.collection("rooms").doc(room_id).get();

  //error here room.set is not a function
  const docref = db.collection("rooms").doc(room_id);

  if (!docRef.exists) {
    await docref.update({
      isEnded: true,
    });

    io.to(room_id).emit("GET_RES_QUESTION", {
      questions: [],
      name: "",
      isEnded: true,
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
    isEnded: false,
  };

  socket.emit("GET_RES_QUESTION", data);

};

function GET_REQ_QUESTION(socket, io) {
  socket.off("GET_REQ_QUESTION", (room_id) => fun(socket, room_id, io)).on("GET_REQ_QUESTION", (room_id) => fun(socket, room_id, io));
}

module.exports = GET_REQ_QUESTION;
