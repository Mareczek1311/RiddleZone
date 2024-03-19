
import { createContext, useContext, useState, useEffect } from 'react';
import { io } from "socket.io-client";

const socketContext = createContext(null);

export const SocketContextProvider = ({ children } : any) => {

    const [socket, setSocket] = useState(null);
    
    function connectToSocket() {
        if(socket != null) {
            return socket;
        }
        const newSocket = io("http://localhost:3001");
        setSocket(newSocket);
        return newSocket;
    }

    useEffect(() => {
        connectToSocket();
    }, []);

    useEffect(() => {
        // Na unmountu komponentu rozłączamy socket
        return () => {
          if (socket != null) {
            socket.disconnect();
          }
        };
      }, []);

    return <socketContext.Provider value={{socket, connectToSocket}}>{children}</socketContext.Provider>;
}

export const UserSocket = () => {
    return useContext(socketContext);
}
