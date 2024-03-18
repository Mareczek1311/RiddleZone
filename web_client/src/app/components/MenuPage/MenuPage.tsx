"use client";

import { io } from "socket.io-client";
import "./MenuPage.css";
import { motion } from "framer-motion";

import React, { useState } from "react";
import { set } from "firebase/database";

import { redirect } from "next/navigation";
import Link from "next/link";

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
  //inputValue - roomid
  //inputValue2 - nickname
  const [inputValue, setInputValue] = useState("");
  const [inputValue2, setInputValue2] = useState("");
  const [isClicked, setIsClicked] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleInputChange2 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue2(event.target.value);
  };

  //przejiesc to wyzej

  async function buttonHandler() {
    if (isClicked) {
      return;
    }

    if (modalSet == "joinroom" && isClicked == false) {
      setIsClicked(true);
      await updateRoomID(inputValue);
      ConnectToRoom(inputValue, inputValue2);
    }
  }

  // jezeli jest join a room to jest room id do otawrcia etc.
  const [modalSet, setModalSet] = useState("");

  return (
    <div className="MainSection">
      <div className="ManageSection">
        <div className="rooms_container">
          {modalSet == "joinroom" && (
            <>
              <div className="input-wrapper">
                <h4 className="input-description">NICKNAME</h4>
                <input
                  type="text"
                  value={inputValue2}
                  onChange={handleInputChange2}
                  placeholder="Enter nickname"
                />
              </div>
              <div className="input-wrapper">
                <h4 className="input-description">ROOM ID</h4>
                <input
                  type="text"
                  value={inputValue}
                  onChange={handleInputChange}
                  placeholder="Enter room id"
                />
              </div>
            </>
          )}
        </div>
        <div className="JoinRoomSection">
          <div className="menuPage_button-wrapper">
            <div
              onClick={() => {
                setModalSet("joinroom");
              }}
            >
              <motion.button
                className="button"
                onClick={() => {
                  buttonHandler();
                }}
              >
                <h2
                  className="button-text"
                  style={{
                    letterSpacing: modalSet == "joinroom" ? "6px" : undefined,
                  }}
                >
                  JOIN A ROOM
                </h2>
              </motion.button>
            </div>
            <div className="menuPage_button-wrapper">
            <div>
              <motion.button className="button">
                <Link href="/login">
                  <motion.h2 className="button-text"> CREATE A ROOM </motion.h2>
                </Link>
              </motion.button>
            </div>
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
