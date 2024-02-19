import styles from "./Navbar.module.css"


import Image from "next/image";
import { onAuthStateChangedHelper, signOutUser, signInWithGoogle } from "../firebase";
import { useState,  useEffect } from "react";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";

export default function Navbar(){




    return(
      <div className={styles.navbar}>
        <div>
          GAMES
        </div>
        

     </div>

    )
}