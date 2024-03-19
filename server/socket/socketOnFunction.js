
const connect_to_room = require("./socketFunctions/connect_to_room");
const skip_question = require("./socketFunctions/skip_question");
const restart_game = require("./socketFunctions/restart_game");
const get_question_list = require("./socketFunctions/get_question_list");
const pick_question_set = require("./socketFunctions/pick_question_set");
const get_question = require("./socketFunctions/get_question");
const send_answer = require("./socketFunctions/send_answer");
const get_player_data = require("./socketFunctions/get_player_data");
const get_player_list = require("./socketFunctions/get_player_list");
const set_state = require("./socketFunctions/set_state");
const start_game = require("./socketFunctions/start_game");
const disconnect = require("./socketFunctions/disconnect");
const create_quiz = require("./socketFunctions/create_quiz");
const GET_REQ_quizzies = require("./socketFunctions/GET_REQ_quizzies");
const PUT_REQ_CREATE_ROOM = require("./socketFunctions/PUT_REQ_CREATE_ROOM");
const PUT_REQ_JOIN_ROOM = require("./socketFunctions/PUT_REQ_JOIN_ROOM");
function socketOnFunction(socket, io) {
    console.log("===!CONNECTION!===");
    socket.connectedToRoom = false;

    PUT_REQ_CREATE_ROOM(socket, io);
    PUT_REQ_JOIN_ROOM(socket, io);
    
    //connect_to_room(socket, io);
    skip_question(socket, io);
    restart_game(socket, io);
    get_question_list(socket, io);
    pick_question_set(socket, io);
    get_question(socket, io);
    send_answer(socket, io);
    get_player_data(socket, io);
    //get_player_list(socket, io);
    set_state(socket, io);
    start_game(socket, io);
    disconnect(socket, io);
    create_quiz(socket, io);
    GET_REQ_quizzies(socket, io);
}

module.exports = socketOnFunction;
