const db = require("../../db/firebase");

const fun = async (socket, room_id, io) => 
  {
    console.log("===PUT_REQ_CHECK_IF_ALL_ANSWERED===");

    const docRef = db.collection("rooms").doc(room_id).collection("players");
    const snapshot = await docRef.get();

    let allAnswered = true;
    snapshot.forEach((doc) => {
      const data = doc.data();
      if (!data.isAdmin && !data.answered) {
        allAnswered = false;
      }
    });

    if (allAnswered) {
        const currentQuestion = (await db.collection("rooms").doc(room_id).get()).data().currentQuestion;
        await db.collection("rooms").doc(room_id).update({
            currentQuestion: currentQuestion + 1
        });

        //restart answered status
        const doc = db.collection("rooms").doc(room_id).collection("players");
        const snapshot = await doc.get();
        snapshot.forEach((doc) => {
            doc.ref.update({
                answered: false
            });
        });


        //wait for 3 seconds
      io.timeout(3000).to(room_id).emit("PUT_RES_CHECK_IF_ALL_ANSWERED", allAnswered);
    }

  }

function PUT_REQ_CHECK_IF_ALL_ANSWERED(socket, io) {
  socket.off("PUT_REQ_CHECK_IF_ALL_ANSWERED", (room_id) => fun(socket, room_id, io)).on("PUT_REQ_CHECK_IF_ALL_ANSWERED", (room_id) => fun(socket, room_id, io));
}

module.exports = PUT_REQ_CHECK_IF_ALL_ANSWERED;
