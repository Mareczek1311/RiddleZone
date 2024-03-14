const db = require("../../db/firebase");

function pick_question_set(socket, io) {
  socket.on("pick_questionSet", async (data) => {
    const docRef = db.collection("rooms").doc(data[0]);
    const playerCount = await docRef
      .collection("players")
      .get()
      .then((snapshot) => {
        return snapshot.size;
      });
    const docRef2 = db
      .collection("questions")
      .doc(data[1])
      .collection("questions");
    const docRef2Size = await docRef2.get().then((snapshot) => {
      return snapshot.size;
    });

    await docRef
      .set(
        {
          questionSet: data[1],
          currQuestion: 1,
          answered: 0,
          maxPlayers: playerCount,
          maxQuestions: docRef2Size,
        },
        { merge: true }
      )
      .then(() => {
        console.log("Field added successfully");
      })
      .catch((error) => {
        console.error("ERROR: Error adding field: ", error);
      });

    io.to(data[0]).emit("send_questionSet");
  });
}

module.exports = pick_question_set;
