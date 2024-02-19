import "./MainPage.css"

import React, { useState } from "react";

export function MainPage() {

  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };


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
            <button>Join Room</button>
          </div>
          <div className="CreateRoomSection">

            <button> Create Room </button>
          </div>
        </div>
    </div>
  );
}