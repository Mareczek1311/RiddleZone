import styles from  './LoginPage.module.css';
import React, { useState } from 'react';
import { onAuthStateChangedHelper, signInWithGoogle, signOutUser } from '../firebase';
import { User } from 'firebase/auth';


interface ChildProps{
    updateUser: (newValue: User | null) => void;
}

const LoginPage: React.FC<ChildProps> = ( { updateUser } ) => {

    useState(() => {
      const unsubscribe = onAuthStateChangedHelper((user) => {
          updateUser(user);
              
      })
      
      return () => unsubscribe()
    })

    return (
        <div>
            <button onClick={ () => {} }>Play as a guess(not implemented)</button>
            <button onClick={ signInWithGoogle }>Sign in</button>
        </div>
    )
}

export default LoginPage;