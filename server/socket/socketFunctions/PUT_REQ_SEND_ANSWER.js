const db = require("../../db/firebase");

function PUT_REQ_SEND_ANSWER(socket, io) {
  socket.on("PUT_REQ_SEND_ANSWER", async (data) => {
    console.log("===PUT_REQ_SEND_ANSWER===");

    const docRefRoom = await db.collection("rooms").doc(data.room_id) 
    const docRefPlayer = await docRefRoom.collection("players").doc(socket.id);
    
    const questionSetId = await docRefRoom.get().then((doc) => {
      return doc.data().questionSetId;
    })

    const docData = await docRefRoom.get()
    const currentQuestion = await docData.get("currentQuestion")
    console.log("questionSetId: ", questionSetId)
    console.log("currentQuestion: ", currentQuestion)

    const correctAnswer = await db.collection("questions").doc(questionSetId).collection("questions").doc(currentQuestion.toString()).get().then((doc) => {
      return doc.data().answer;
    })
    
    if(data.answer == correctAnswer){
      //increment score by 1
      const score = await docRefPlayer.get().then((doc) => {
        return doc.data().score;
      })
      await docRefPlayer.update({
        score: score + 1,
        answered: true
      })
    }
    else{
      await docRefPlayer.update({
        answered: true
      })
    }

    socket.emit("PUT_RES_SEND_ANSWER", { correctAnswer: correctAnswer });
  });
}

module.exports = PUT_REQ_SEND_ANSWER;
