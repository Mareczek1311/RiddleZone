const db = require("../../db/firebase");

function PUT_REQ_CHECK_IF_ALL_ANSWERED(socket, io) {
  socket.on("PUT_REQ_CHECK_IF_ALL_ANSWERED", async (data) => {
    console.log("===PUT_REQ_CHECK_IF_ALL_ANSWERED===");

  });
}

module.exports = PUT_REQ_CHECK_IF_ALL_ANSWERED;
