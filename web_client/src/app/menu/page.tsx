"use client";
import { useEffect } from "react";
import { UserAuth } from "../context/authContext"
import { redirect } from "next/navigation";
import Link from "next/link";

export default function Menu(){
    const { user, googleSignIn, logOut } = UserAuth();


    useEffect(() => {
        if(user == null){
            redirect("/login")
        }
    }, [user])

    return (
        <div>
            <button onClick={logOut}> LogOut</button>
            <Link href="/createQuestionSet">Create new Quiz</Link>
        </div>
    )
}