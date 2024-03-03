// kontrola bledow!!!!!

const db = require("./firebase");
const admin = require("firebase-admin");

const e = require("express");
const express = require("express");
const { createServer } = require("node:http");

const { join } = require("node:path");

const { Server } = require("socket.io");
const { send } = require("node:process");

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

async function addPlayerToRoomFirebase(room_id, player_id, real_player_id) {
  const playersCollectionRef = await db
    .collection("rooms")
    .doc(room_id)
    .collection("players");
  var isEmpty = true;
  await playersCollectionRef
    .get()
    .then((snapshot) => {
      if (!snapshot.empty) {
        isEmpty = false;
      }
    })
    .catch((error) => {
      console.error("Wystąpił błąd podczas pobierania dokumentów: ", error);
    });

  const docRef = await db
    .collection("rooms")
    .doc(room_id)
    .collection("players")
    .doc(player_id);


  console.log("isEmpty: ", isEmpty);

  if (isEmpty) {
    docRef
      .set({
        isAdmin: true,
        isReady: false,
        realID: real_player_id,
        score: 0,
      })
      .then(() => console.log("Field added successfully"))
      .catch((error) => console.error("ERROR: Error adding field: ", error));
  } else {
    docRef
      .set({
        isAdmin: false,
        isReady: false,
        realID: real_player_id,
        score: 0,
      })
      .then(() => console.log("Field added successfully"))
      .catch((error) => console.error("ERROR: Error adding field: ", error));
  }
}

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

async function updatePlayerReady(room_id, player_id, value) {
  const docRef = db
    .collection("rooms")
    .doc(room_id)
    .collection("players")
    .doc(player_id);
  const doc = await docRef.get();

  if (!doc.exists) {
    console.log("ERROR: No such document!");
    return;
  }

  await docRef.update({
    isReady: value,
  });
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

function countReady(arr) {
  console.log("===COUNT_READY===");

  let counter = 0;

  for (const [key, value] of Object.entries(arr)) {
    if (value["isReady"] == true) {
      counter++;
    }
  }

  console.log("COUNTER: ", counter);

  return counter;
}

io.on("connection", (socket) => {
  console.log("===!CONNECTION!===");
  socket.connectedToRoom = false;

  socket.on("connect_to_room", async (data) => {
    console.log("===CONNECT_TO_ROOM===");
    
    socket.connectedToRoom = true;

    if (data.room_id == "") {
      data.room_id = "room" + Math.floor(Math.random() * 1000);
    }

    socket.join(data.room_id);
    socket.room_id = data.room_id;
    console.log("ROOM ID: ", data.room_id);

    const res =  await addPlayerToRoomFirebase(data.room_id, socket.id, data.nickname);

    io.to(data.room_id).emit("get_room_id", data.room_id);
  });

  socket.on("restart_game", async (room_id) => {
    console.log("===RESTART_GAME===");

    const docRef = db.collection("rooms").doc(room_id);

    docRef
      .update({
        currQuestion: 1,
        answered: 0,
        questionSet: "",
      })
      .then(() => {
        console.log("Field added successfully");
      })
      .catch((error) => {
        console.error("ERROR: Error adding field: ", error);
      });

    const docRef2 = db.collection("rooms").doc(room_id).collection("players");
    await docRef2.get().then((snapshot) => {
      snapshot.forEach((doc) => {
        docRef2.doc(doc.id).update({
          score: 0,
          isReady: false,
        });
      });
    });

    io.to(room_id).emit("restart_game");
  });

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

  socket.on("get_question", async (room_id) => {
    const docRef = db.collection("rooms").doc(room_id);
    const doc = await docRef.get();

    const currQuestion = doc.data()["currQuestion"];
    const questionSet = doc.data()["questionSet"];

    const questionRef = db
      .collection("questions")
      .doc(questionSet)
      .collection("questions")
      .doc(currQuestion.toString());

    const question = await questionRef.get();

    if(question == undefined){
      socket.emit("error_send_question", "Question not found");
      return;
    }
    
    const questionData = [
      question.data()["name"],
      question.data()["a"],
      question.data()["b"],
      question.data()["c"],
      question.data()["d"],
    ];

    console.log("SENDING QUESTION: ", questionData);

    io.to(room_id).emit("send_question", questionData);
  });

  socket.on("send_answer", async (data) => {
    //we should check if all players send answers then we can send next question
    console.log("===SEND_ANSWER===");
    console.log("ANSWER: ", data.answer);
    console.log("ROOM ID: ", data.room_id);
    const docRefRoomPlayer = db
      .collection("rooms")
      .doc(data.room_id)
      .collection("players")
      .doc(socket.id);
    const docRefRoomQuestionsSet = db.collection("rooms").doc(data.room_id);
    const docRoomQuestionsSet = await docRefRoomQuestionsSet.get();

    const questionSet = docRoomQuestionsSet.data()["questionSet"];
    const currQuestion = docRoomQuestionsSet.data()["currQuestion"];

    const questionRef = db
      .collection("questions")
      .doc(questionSet)
      .collection("questions")
      .doc(currQuestion.toString());
    const question = await questionRef.get();

    const correctAnswer = question.data()["answer"];

    await docRefRoomQuestionsSet.update({
      answered: admin.firestore.FieldValue.increment(1),
    });

    if (data.answer == correctAnswer) {
      socket.emit("correct_answer", correctAnswer);

      await docRefRoomPlayer.update({
        score: admin.firestore.FieldValue.increment(1),
      });
    }
    else{
      socket.emit("wrong_answer", correctAnswer);
    }

    //wait 3 seconds
    await setTimeout(() => {
      console.log("3 seconds passed");
    }, 3000);

    const RoomData = await docRefRoomQuestionsSet.get();

    console.log("ANSWERED: ", RoomData.data()["answered"]);
    console.log("MAX PLAYERS: ", RoomData.data()["maxPlayers"]);

    if (RoomData.data()["answered"] >= RoomData.data()["maxPlayers"]) {
      const nextQuestion = currQuestion + 1;

      await docRefRoomQuestionsSet.update({
        currQuestion: nextQuestion,
      });

      const nextQuestionRef = db
        .collection("questions")
        .doc(questionSet)
        .collection("questions")
        .doc(nextQuestion.toString());
      const nextQuestionData = await nextQuestionRef.get();

      if (nextQuestionData.exists) {
        io.to(data.room_id).emit("send_question", [
          nextQuestionData.data()["name"],
          nextQuestionData.data()["a"],
          nextQuestionData.data()["b"],
          nextQuestionData.data()["c"],
          nextQuestionData.data()["d"],
        ]);
      } else {
        const rankingDoc = db
          .collection("rooms")
          .doc(data.room_id)
          .collection("players")
          .orderBy("score", "desc");
        const ranking = await rankingDoc.get().then((snapshot) => {
          const arr = [];
          snapshot.forEach((doc) => {
            arr.push([doc.data()["realID"], doc.data()["score"]]);
          });
          return arr;
        });

        io.to(data.room_id).emit("end_game");
        io.to(data.room_id).emit("send_ranking", ranking);
      }

      //update answered to 0
      await docRefRoomQuestionsSet.update({
        answered: 0,
      });
    } else {
      socket.emit("wait_for_players");
    }
  });

  socket.on("get_player_data", async (room_id) => {
    const docRef = db
      .collection("rooms")
      .doc(room_id)
      .collection("players")
      .doc(socket.id);
    const doc = await docRef.get();

    const data = doc.data();

    console.log("===GET_PLAYER_DATA===");
    console.log("DATA: ", data);

    if(data == undefined){
      socket.emit("error_send_player_data", "Player not found");
      return;
    }


    socket.emit("send_player_data", [
      data.isAdmin,
      data.isReady,
      data.realID,
      data.score,
    ]);
  });

  socket.on("get_player_list", (room_id) => {
    console.log("===GET_PLAYER_LIST===");

    const docRef = db.collection("rooms").doc(room_id).collection("players");

    docRef.get().then((snapshot) => {
      const arr = [];
      snapshot.forEach((doc) => {
        arr.push(doc.data()["realID"]);
      });
      io.to(room_id).emit("send_player_list", arr);
    });
  });

  socket.on("set_state", async (data) => {
    console.log("===SET_STATE===");

    console.log("STATE FROM: ", data.ready);
    await updatePlayerReady(data.room_id, socket.id, data.ready);
    console.log("STATE TO: ", data.ready);

    console.log("counting ready players...");
    const arr = await getRoomPlayers(data.room_id);

    const counter = await countReady(arr);

    console.log("SENDING READY COUNTER?");
    io.to(data.room_id).emit("update_ready", counter);
  });

  socket.on("start_game", async (room_id) => {
    console.log("===START_GAME===");
    io.to(room_id).emit("start_game");
  });

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
});

app.get("/", async (req, res) => {
  console.log("GET /");
});

server.listen(3002, () => {
  console.log("server running at http://localhost:3001");
});
