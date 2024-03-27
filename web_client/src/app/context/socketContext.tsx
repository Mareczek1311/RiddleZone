
import { createContext, useContext, useState, useEffect } from 'react';
import { io } from "socket.io-client";

const socketContext = createContext(null);

export const SocketContextProvider = ({ children } : any) => {

    const [socket, setSocket] = useState(null);

    useEffect(() => {
      if(socket == null){
      console.log("Connecting to socket");
      var sockett = io("http://localhost:3001");

        setSocket(sockett);
      return () => {
        sockett.disconnect();
      };
    }
  
  }, []);

    return <socketContext.Provider value={{socket}}>{children}</socketContext.Provider>;
}

export const UserSocket = () => {
    return useContext(socketContext);
}
