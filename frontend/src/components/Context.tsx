import React, { createContext, useContext, useState } from "react";
import {io, Socket} from "socket.io-client";
import DefaultEventsMap from "socket.io-client"

// Context for User info

interface UserData {
    name: string;
    photo: string;
}

interface UserContextType {
    userData: UserData;
    updateUserData: (name: string, photo: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [userData, setUserData] = useState<UserData>({
        name: "Default Name",
        photo: "",
    });

    const updateUserData = (name: string, photo: string) => {
        setUserData({ name, photo });
    };

    return (
        <UserContext.Provider value={{ userData, updateUserData }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = (): UserContextType => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
};

// Context for Chat socket

// interface ChatSocketType {
// 	socket: Socket
// }

export const socket = io('http://localhost:3000', {autoConnect: false});
export const ChatSocketContext = React.createContext<Socket>(socket);

export const ChatSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <ChatSocketContext.Provider value={socket}>
            {children}
        </ChatSocketContext.Provider>
    );
};

export const useChatSocket = (): Socket => {
    const context = useContext(ChatSocketContext);
    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
};

