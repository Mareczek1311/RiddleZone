async function removePlayerFromRoomFirebase(room_id, player_id) {
  const docRef = db
    .collection("rooms")
    .doc(room_id)
    .collection("players")
    .doc(player_id);
  const isAdmin = await docRef
    .get()
    .then((doc) => {
      if (doc.exists) {
        console.log("Document data:", doc.data());
        return doc.data()["isAdmin"];
      } else {
        console.log("No such document!");
        return false;
      }
    })
    .catch((error) => {
      console.error("ERROR: Error getting document:", error);
    });

  await docRef
    .delete()
    .then(() => {
      console.log("Field deleted successfully");
    })
    .catch((error) => {
      console.error("ERROR: Error removing field: ", error);
    });

  return isAdmin;
}

async function getRoomPlayers(room_id) {
  console.log("===GET_ROOM_PLAYERS===");
  const arr = {};
  const docRef = db.collection("rooms").doc(room_id).collection("players");
  await docRef.get().then((snapshot) => {
    snapshot.forEach((doc) => {
      arr[doc.id] = doc.data();
    });
  });

  return arr;
}

async function deleteRoom(room_id) {
  const docRef = db.collection("rooms").doc(room_id);
  await docRef
    .delete()
    .then(() => {
      console.log("Room deleted successfully");
    })
    .catch((error) => {
      console.error("ERROR: Error removing room: ", error);
    });
}
const db = require("../../db/firebase");


function disconnect(socket, io) {
  socket.on("disconnect", async (reason) => {
    console.log("===PLAYER DISCONNECTED===");

    if (!socket.connectedToRoom) {
      return;
    }

    console.log("ROOM ID: ", socket.room_id);
    console.log("Socket ID: ", socket.id);

    const isAdmin = await removePlayerFromRoomFirebase(
      socket.room_id,
      socket.id
    );

    console.log("ADMIN: ", isAdmin);

    if (isAdmin) {
      console.log("ADMIN DISCONNECTED");
      const arr2 = await getRoomPlayers(socket.room_id);

      const keys = Object.keys(arr2);
      console.log("keys: ", keys);

      if (keys.length > 0) {
        const nextAdmin = keys[0];
        console.log("NEXT ADMIN: ", nextAdmin);

        const docRef = db
          .collection("rooms")
          .doc(socket.room_id)
          .collection("players")
          .doc(nextAdmin);
        await docRef.update({
          isAdmin: true,
        });
        socket
          .to(nextAdmin)
          .emit("send_player_data", [
            true,
            arr2[nextAdmin]["isReady"],
            arr2[nextAdmin]["realID"],
            arr2[nextAdmin]["score"],
          ]);
      }
    }

    const arr = await getRoomPlayers(socket.room_id);
    const numberOfKeys = Object.keys(arr).length;

    if (numberOfKeys == 0) {
      deleteRoom(socket.room_id);
      return;
    } else {
      const room = io.sockets.adapter.rooms.get(socket.room_id);

      if (room == undefined) {
        deleteRoom(socket.room_id);
        return;
      }

      const playerList = Array.from(room);

      io.to(socket.room_id).emit("send_player_list", playerList);
      console.log("PLAYER LIST: ", playerList);
    }
  });
}

module.exports = disconnect;
