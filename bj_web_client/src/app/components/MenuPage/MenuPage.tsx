import { io } from "socket.io-client";
import "./MenuPage.css"

import React, { useState } from "react";

interface MenuPageProps {
  updateRoomID: (newValue: string) => void;
  socket: any;
}

const MenuPage: React.FC<MenuPageProps> = ( { updateRoomID, socket } ) => {

  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const ConnectToRoom = () => {

    socket = io("http://localhost:3001");

    socket.on("connect", () => {
      console.log("Connected to server");
    });

    socket.emit("connect_to_room", inputValue)
    socket.on("get_room_id", (room_id: string) => {
      console.log("Room ID: ", room_id);
      updateRoomID(room_id);
    })
  }

  return (
    <div className="MainSection">
        <h1>Main Page</h1>
        <div className="ManageSection">
          <div className="JoinRoomSection">
            <input type="text"
                  value = {inputValue}
                  onChange = {handleInputChange}
                  placeholder="Enter room id"
            />
            
          <button onClick={ConnectToRoom}>Join Room</button>
          
          </div>
          
          <div className="CreateRoomSection">

            <button onClick={ConnectToRoom}> Create Room </button>
          </div>
        </div>
    </div>
  );
}

export default MenuPage;