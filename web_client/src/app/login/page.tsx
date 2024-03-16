"use client";

import { UserAuth } from "../context/authContext";
import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import "./LoginPage.css"
import { motion } from "framer-motion";

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
        <div className="MainSection">
          <div className="ManageSection">
            <h1 >SIGN IN</h1>
            <div className="menuPage_button-wrapper">
            <div>
              <motion.button
                className="button"
                onClick={() => {
                  handleSignIn();
                }}
              >
                <h2
                  className="button-text"
                  style={{
                  }}
                >
                  SIGN IN WITH GOOGLE
                </h2>
              </motion.button>
            </div>
            </div>
            </div>
        </div>
     </div>
    );
}