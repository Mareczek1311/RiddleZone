const db = require("../../db/firebase");

function PUT_REQ_CHECK_IF_ALL_ANSWERED(socket, io) {
  socket.on("PUT_REQ_CHECK_IF_ALL_ANSWERED", async (room_id) => {
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
        setTimeout(() => {
            io.to(room_id).emit("PUT_RES_CHECK_IF_ALL_ANSWERED", allAnswered);
        }, 3000);
    }

  });
}

module.exports = PUT_REQ_CHECK_IF_ALL_ANSWERED;
