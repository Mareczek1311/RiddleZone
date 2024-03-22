
const disconnect = require("./socketFunctions/disconnect");
const create_quiz = require("./socketFunctions/create_quiz");
const GET_REQ_quizzies = require("./socketFunctions/GET_REQ_quizzies");
const PUT_REQ_CREATE_ROOM = require("./socketFunctions/PUT_REQ_CREATE_ROOM");
const PUT_REQ_JOIN_ROOM = require("./socketFunctions/PUT_REQ_JOIN_ROOM");
const GET_REQ_ROOM_INFO = require("./socketFunctions/GET_REQ_ROOM_INFO");
const PUT_REQ_SET_STATE = require("./socketFunctions/PUT_REQ_SET_STATE");
const GET_REQ_QUESTION = require("./socketFunctions/GET_REQ_QUESTION");
const PUT_REQ_START_GAME = require("./socketFunctions/PUT_REQ_START_GAME");
const PUT_REQ_SEND_ANSWER = require("./socketFunctions/PUT_REQ_SEND_ANSWER");
const PUT_REQ_CHECK_IF_ALL_ANSWERED = require("./socketFunctions/PUT_REQ_CHECK_IF_ALL_ANSWERED.js")

function socketOnFunction(socket, io) {
    console.log("===!CONNECTION!===");
    socket.connectedToRoom = false;
    PUT_REQ_CREATE_ROOM(socket, io);
    PUT_REQ_JOIN_ROOM(socket, io);
    PUT_REQ_SET_STATE(socket, io)
    GET_REQ_quizzies(socket, io);
    GET_REQ_QUESTION(socket, io);
    PUT_REQ_START_GAME(socket, io);
    PUT_REQ_SEND_ANSWER(socket, io);
    PUT_REQ_CHECK_IF_ALL_ANSWERED(socket, io);
    GET_REQ_ROOM_INFO(socket, io);
    disconnect(socket, io);
    create_quiz(socket, io);
}

module.exports = socketOnFunction;
