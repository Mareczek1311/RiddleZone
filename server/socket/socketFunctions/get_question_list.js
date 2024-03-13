const db = require("../../db/firebase");


function get_question_list(socket, io) {
  socket.on("get_question_list", async (room_id) => {
    const docRef = db.collection("questions");
    const arr = [];
    await docRef.get().then((snapshot) => {
      snapshot.forEach((doc) => {
        arr.push([doc.id, doc.data()["name"]]);
      });
    });

    socket.emit("send_question_list", arr);
  });
}

module.exports = get_question_list;
