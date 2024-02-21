import { io } from "socket.io-client";
import "./MenuPage.css";

import React, { useState } from "react";

interface MenuPageProps {
  updateRoomID: (newValue: string) => void;
  socket: any;
  ConnectToRoom: (room_id: string) => void;
}

const MenuPage: React.FC<MenuPageProps> = ({
  updateRoomID,
  socket,
  ConnectToRoom,
}) => {
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };
  //przejiesc to wyzej

  return (
    <div className="MainSection">
      <h1>Main Page</h1>
      <div className="ManageSection">
        <div className="JoinRoomSection">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Enter room id"
          />

          <button onClick={() => ConnectToRoom(inputValue)}>Join Room</button>
        </div>

        <div className="CreateRoomSection">
          <button onClick={() => ConnectToRoom("")}> Create Room </button>
        </div>
      </div>
    </div>
  );
};

export default MenuPage;
