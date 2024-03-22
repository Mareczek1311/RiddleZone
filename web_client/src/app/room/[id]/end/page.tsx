"use client";

import "./EndPage.css"
import {UserSocket} from "../../../context/socketContext"
import { useEffect, useState } from "react";
import { roomContext } from "../../../context/roomContext";

const EndPage = () => {

    const { room_id, SetRoomID } = roomContext();
    const {socket, connectToSocket} = UserSocket();
    const [isLoading, setIsLoading] = useState(true);
    const [users, setUsers] = useState({});

    useEffect(() => {
        if(isLoading){
            socket.emit("GET_REQ_ROOM_INFO", room_id)
            socket.on("GET_RES_ROOM_INFO", (data: any) => {
                setUsers(data.users);
                console.log("users: ", data.users);
            })
            
            setIsLoading(false);
        }

    }, [isLoading])

    return (
        <div className="MainSectionLobby">
            <div className="ManageSectionLobby">

            <h1>GAME IS ENDED</h1>

            <div>
                <h2>Ranking</h2>
            </div>

            <div>
                <h2>Players</h2>
                <ol>
                    {Object.keys(users).map((user: any) => {
                        return <li>{users[user].username} - {users[user].score}</li>
                    })}
                </ol>

            </div>
        </div>
    </div>
    )
}

export default EndPage;