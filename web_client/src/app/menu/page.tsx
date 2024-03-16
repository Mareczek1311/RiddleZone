"use client";
import { useEffect } from "react";
import { UserAuth } from "../context/authContext";
import { redirect } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Menu() {
  const { user, googleSignIn, logOut } = UserAuth();

  useEffect(() => {
    if (user == null) {
      redirect("/login");
    }
  }, [user]);

  return (
    <div className="MainSection">
      <div className="ManageSection">
        <h1>Menu</h1>
       
        <motion.button className="button">
          <Link href="/createQuestionSet">
            <motion.h2 className="button-text"> CREATE NEW QUIZ </motion.h2>
          </Link>
        </motion.button>
        <motion.button onClick={logOut} className="button">
            <motion.h2 className="button-text"> LOGOUT </motion.h2>
        </motion.button>
      </div>
    </div>
  );
}
