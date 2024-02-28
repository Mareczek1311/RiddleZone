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
  };

  //przejiesc to wyzej

  // jezeli jest join a room to jest room id do otawrcia etc.
  const [modalSet, setModalSet] = useState("");

  return (
    <div className="MainSection">
      <div className="ManageSection">
        <div className="rooms_container">
          {modalSet == "joinroom" && (
            <div className="input-wrapper">
              <h4 className="input-description">ROOM ID</h4>
              <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                placeholder="Enter room id"
              />
            </div>
          )}
          {modalSet == "createroom" && (
            <div className="input-wrapper">
              <h4 className="input-description">ROOM ID</h4>
              <input
                type="text"
                placeholder="Enter your nickname"
                value={inputValue2}
                onChange={handleInputChange2}
              />
            </div>
          )}
        </div>
        <div className="JoinRoomSection">
          <div className="menuPage_button-wrapper">

          <div
            onClick={() => {
              setModalSet("joinroom");
            }}
            >
            <button
              className="mainSectionButton"
              onClick={() => ConnectToRoom(inputValue, inputValue2)}
              >
              <h2 className="button-text">JOIN A ROOM</h2>
            </button>
          </div>
          <div
            onClick={() => {
              setModalSet("createroom");
            }}
            >
            <button
              className="mainSectionButton"
              onClick={() => ConnectToRoom("", inputValue2)}
              >
              <h2 className="button-text"> CREATE A ROOM </h2>
            </button>
          </div>
            </div>
          <div className="exit-wrapper">
            {modalSet !== "" && (
              <button
              className="exitButton"
              onClick={() => {
                setModalSet("");
              }}
              >
                <h2 className="button-text">EXIT</h2>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuPage;
