const db = require("../../db/firebase");

function GET_REQ_QUESTION(socket, io) {
    socket.on("GET_REQ_QUESTION", async (room_id) => {
        console.log("===GET_REQ_QUESTION===");

        const docQuestionSetId = await db.collection("rooms").doc(room_id).get()

        const questionSetId = docQuestionSetId.data().questionSetId
        const currentQuestion = docQuestionSetId.data().currentQuestion

        const docRef = await db.collection("questions").doc(questionSetId).collection("questions").doc(currentQuestion.toString()).get();

        const arr = [docRef.data()["a"], docRef.data()["b"], docRef.data()["c"], docRef.data()["d"]]

        const data = {
            questions: arr,
            name: docRef.data()["name"]
        }

        socket.emit("GET_RES_QUESTION", data);
    });
}

module.exports = GET_REQ_QUESTION;
