"use client";

import "./MenuPage.css";
import { motion } from "framer-motion";

import React, { useEffect, useState } from "react";

import { redirect } from "next/navigation";
import Link from "next/link";
import { userNameContext } from "@/app/context/userNameContext";

const MenuPage = () => {
  //inputValue - roomid
  //inputValue2 - nickname
  const [inputValue, setInputValue] = useState("");
  const [inputValue2, setInputValue2] = useState("");
  const [isClicked, setIsClicked] = useState(false);
  const [redirected, setRedirected] = useState(false);

  const { userName, setUserNameFunction } = userNameContext();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleInputChange2 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue2(event.target.value);
  };

  //przejiesc to wyzej

   function buttonHandler() {
    if (isClicked) {
      return;
    }

    if (modalSet == "joinroom" && isClicked == false) {
      setIsClicked(true);

      if (inputValue2 == "") {
        setInputValue2("PLAYER" + Math.floor(Math.random() * 1000))
      }
      setUserNameFunction(inputValue2);
      setRedirected(true);
    }
  }

  useEffect(() => {
    if (redirected) {
      redirect(`/room/${inputValue}`);
    }
  }
  , [redirected]);

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
