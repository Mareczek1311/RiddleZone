import "./Navbar.css"


import Image from "next/image";
import { useState,  useEffect } from "react";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";



const NavBar = ({
}) => {
    return(
      <div className="navbar" >
        <div className="navbar_container">
          <h1 className="navbar-title">RIDDLES</h1>
        </div>
     </div>
    )
}

export default NavBar;