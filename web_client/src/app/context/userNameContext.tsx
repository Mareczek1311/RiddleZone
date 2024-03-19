
import { createContext, useContext, useState, useEffect } from 'react';

const UserNameContext = createContext(null);
//we are typing in tsx so we nned types
export const UserNameContextProvider = ({ children } : any) => {
    const [userName, setUserName] = useState("" as string);

    function setUserNameFunction(name: string) {
        setUserName(name);
    }

    return <UserNameContext.Provider value = {{userName, setUserNameFunction}} >{children}</UserNameContext.Provider>;
}

export const userNameContext = () => {
    return useContext(UserNameContext);
}
