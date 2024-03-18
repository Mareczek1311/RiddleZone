const db = require("../../db/firebase");

function GET_REQ_quizzies(socket, io) {
    socket.on("GET_REQ_quizzies", async (user_id) => {
        console.log("===GET_REQ_quizzies===");

        const arr = [];
        const docRef = db.collection("questions");
        await docRef.get().then((snapshot) => {
            snapshot.forEach((doc) => {
                if(doc.data().user_id === user_id){
                    arr.push(doc.data());
                }
            });
        });
        console.log("ARR: ",arr);
        console.log("SENDING QUIZZIES TO CLIENT...");
        socket.emit("GET_RES_quizzies", arr);
    });
}

module.exports = GET_REQ_quizzies;
