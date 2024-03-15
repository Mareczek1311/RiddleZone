
import { createContext, useContext, useState, useEffect } from 'react';
import { io } from "socket.io-client";

const socketContext = createContext(null);

export const SocketContextProvider = ({ children } : any) => {

    const [socket, setSocket] = useState(null);
    
    function connectToSocket(newSocket : any) {
        setSocket(newSocket);
    }

    useEffect(() => {
        const newSocket = io("http://localhost:3001");
        setSocket(newSocket);
    }
    , []);

    return <socketContext.Provider value={{socket, connectToSocket}}>{children}</socketContext.Provider>;
}

export const UserSocket = () => {
    return useContext(socketContext);
}
