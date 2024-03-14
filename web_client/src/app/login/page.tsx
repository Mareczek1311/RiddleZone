"use client";

import { UserAuth } from "../context/authContext";
import { useEffect, useState } from "react";
import { redirect } from "next/navigation";

export default function LoginPage() {

    const { user, googleSignIn, logOut } = UserAuth();
    const [loading, setLoading] = useState(true);
    const handleSignIn = async () => {
        try {
          await googleSignIn();
        } catch (error) {
          console.log(error);
        }
      };
    
      const handleSignOut = async () => {
        try {
          await logOut();
        } catch (error) {
          console.log(error);
        }
      };
    
      useEffect(() => {
        const checkAuthentication = async () => {
          await new Promise((resolve) => setTimeout(resolve, 50));
          setLoading(false);
        };
        checkAuthentication();
        console.log(user)
        if (user != null) {
          redirect("/menu")
        }
      }, [user]);

    return (
      <div>
        <div>
            <h1>Sing In Page</h1>
            <button onClick={handleSignIn}>
                Sign In with Google
            </button>
        </div>
     </div>
    );
}