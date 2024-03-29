const db = require("../../db/firebase");

function GET_REQ_ROOM_INFO(socket, io) {
    socket.on("GET_REQ_ROOM_INFO", async (room_id) => {
        console.log("===GET_REQ_ROOM_INFO===");
        const users = {};
        const docRef = db.collection("rooms").doc(room_id).collection("players").get();

        await docRef.then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                users[doc.id] = doc.data();
            });
        })

        const docRef2 = await db.collection("rooms").doc(room_id).get()
        const docRefQuestions = await db.collection("questions").doc(docRef2.data().questionSetId).get()

        const data = {
            questionSetName: docRefQuestions.data().name,
            users: users,
        }

        io.to(room_id).emit("GET_RES_ROOM_INFO", data);
        
    });
}

module.exports = GET_REQ_ROOM_INFO;
