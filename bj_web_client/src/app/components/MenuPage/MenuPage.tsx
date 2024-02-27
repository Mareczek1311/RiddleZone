import { io } from "socket.io-client";
import "./MenuPage.css";

import React, { useState } from "react";

interface MenuPageProps {
  updateRoomID: (newValue: string) => void;
  socket: any;
  ConnectToRoom: (room_id: string, nickname: string) => void;
}

const MenuPage: React.FC<MenuPageProps> = ({
  updateRoomID,
  socket,
  ConnectToRoom,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [inputValue2, setInputValue2] = useState("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleInputChange2 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue2(event.target.value);
  }

  //przejiesc to wyzej

  return (
    <div className="MainSection">
      <h1>Main Page</h1>
      <div className="ManageSection">
        <div>
          <h2>Nickname</h2>
          <input
            type="text"
            placeholder="Enter your nickname"
            value={inputValue2}
            onChange={handleInputChange2}
          />
        </div>
    
        <div className="JoinRoomSection">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Enter room id"
          />

          <button onClick={() => ConnectToRoom(inputValue, inputValue2)}>Join Room</button>
        </div>

        <div className="CreateRoomSection">
          <button onClick={() => ConnectToRoom("", inputValue2)}> Create Room </button>
        </div>
      </div>
    </div>
  );
};

export default MenuPage;
