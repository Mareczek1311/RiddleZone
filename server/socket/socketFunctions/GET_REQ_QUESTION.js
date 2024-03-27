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
  const currentQuestion2 = doc.data().currentQuestion;

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

  //here we check if currentQuestion is still the same after 10 seconds
  //if it is then we emit PUT_RES_CHECK_IF_ALL_ANSWERED
  //else we do nothing because the currentQuestion has been updated

  const isTimeOutSet = await doc.data().isTimeOutSet;
  console.log("isTimeOutSet: ", isTimeOutSet)
  if (isTimeOutSet) {
    return;
  }

  setTimeout(async () => {
    const doc2 = await db.collection("rooms").doc(room_id).get();
    const iscurrentQuestion = doc2.data().currentQuestion;
    if (iscurrentQuestion !== currentQuestion2) {
      return;
    }

    const currentQuestion = (
      await db.collection("rooms").doc(room_id).get()
    ).data().currentQuestion;
    await db
      .collection("rooms")
      .doc(room_id)
      .update({
        currentQuestion: currentQuestion + 1,
      });

    //restart answered status
    const doc = db.collection("rooms").doc(room_id).collection("players");
    const snapshot = await doc.get();
    snapshot.forEach((doc) => {
      doc.ref.update({
        answered: false,
      });
    });

    await doc2.ref.update({
      isTimeOutSet: false,
    });

    console.log("SKIPPING QUESTION");
    io.to(room_id).emit("PUT_RES_CHECK_IF_ALL_ANSWERED", true);
  }, 10000);
};

function GET_REQ_QUESTION(socket, io) {
  socket.off("GET_REQ_QUESTION", (room_id) => fun(socket, room_id, io)).on("GET_REQ_QUESTION", (room_id) => fun(socket, room_id, io));
}

module.exports = GET_REQ_QUESTION;
