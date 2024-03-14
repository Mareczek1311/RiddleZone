

const socketOnFunction = require("./socketOnFunction");

module.exports = function (io) {
  io.on("connection", (socket) => {
    socketOnFunction(socket, io);
  });
};
