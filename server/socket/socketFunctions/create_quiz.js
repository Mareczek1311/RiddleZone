const db = require("../../db/firebase");
function create_quiz(socket, io) {
    socket.on("create_quiz", async (data) => {
        console.log("===CREATE_QUIZ===");
        console.log("data", data);
      });
}

module.exports = create_quiz;
