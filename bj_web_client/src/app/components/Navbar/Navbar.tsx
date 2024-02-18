import styles from "./Navbar.module.css"


import Image from "next/image";
import { onAuthStateChangedHelper, signOutUser, signInWithGoogle } from "../firebase";
import { useState,  useEffect } from "react";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";

export default function Navbar(){

  const [user, setUser] = useState<null | User >(null)

  useState(() => {
    const unsubscribe = onAuthStateChangedHelper((user) => {
        setUser(user);
    })
    
    return () => unsubscribe()
  })


    return(
      <div className={styles.navbar}>
        <div>
          GAMES
        </div>
        
        {
        user  ?
            <button onClick={ signOutUser }>Sign out</button>

            :  
            <button onClick={ signInWithGoogle }>Sign in</button>
          }
     </div>

    )
}