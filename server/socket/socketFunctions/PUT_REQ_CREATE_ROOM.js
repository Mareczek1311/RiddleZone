const db = require("../../db/firebase");

function PUT_REQ_CREATE_ROOM(socket, io) {
  socket.on("PUT_REQ_CREATE_ROOM", async (data) => {
    console.log("===PUT_REQ_CREATE_ROOM===");
    console.log(data);

    //random number from 100000 to 999999
    var room_id = Math.floor(Math.random() * 900000) + 100000;
    room_id = room_id.toString();

    const roomRef = await db.collection("rooms").doc(room_id);
    await roomRef.get();
    await roomRef.set({
      isCreated: true,
      questionSetId: data.questionSetId,
    });

    socket.emit("PUT_RES_CREATE_ROOM", { room_id: room_id });
  });
}

module.exports = PUT_REQ_CREATE_ROOM;
