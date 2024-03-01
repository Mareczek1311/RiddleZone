import "./Navbar.css"


import Image from "next/image";
import { onAuthStateChangedHelper, signOutUser, signInWithGoogle } from "../firebase";
import { useState,  useEffect } from "react";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";

interface NavBarProps {
  isOnMainPage: boolean;
}


const NavBar: React.FC<NavBarProps> = ({
  isOnMainPage
}) => {
    return(
      <div className="navbar" style={{ paddingBottom: isOnMainPage ? "auto" : "10vh" }}>
        <div className="navbar_container">
          <h1 className="navbar-title" style={{ position: isOnMainPage ? "inherit" : "absolute",  left: isOnMainPage ? 0 : "1vw",  top: isOnMainPage ? 0 : "0vw" }}>RIDDLES</h1>
        </div>
     </div>
    )
}

export default NavBar;