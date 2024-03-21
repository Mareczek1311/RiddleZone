import { createContext, useContext, useState, useEffect } from 'react';

const RoomContext = createContext(null);
//we are typing in tsx so we nned types
export const RoomContextProvider = ({ children } : any) => {
    const [room_id, SetID] = useState("" as string);

    function SetRoomID(room_id: string) {
        SetID(room_id);
    }

    return <RoomContext.Provider value = {{room_id, SetRoomID}} >{children}</RoomContext.Provider>;
}

export const roomContext = () => {
    return useContext(RoomContext);
}
