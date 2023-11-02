import React, { createContext, useContext, useState } from "react";
import {io, Socket} from "socket.io-client";


// Context for User info_____________________________________________

interface UserData {
    id: string;
    name: string;
    photo: string;
}

interface UserContextType {
    userData: UserData;
    updateUserData: (id: string, name: string, photo: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [userData, setUserData] = useState<UserData>({
        id: '',
        name: "Default Name",
        photo: "",
    });

    const updateUserData = (id: string, name: string, photo: string) => {
        setUserData({ id, name, photo });
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

interface Channel {
	id: number;
	name: string;
	privacy: string;
}

interface ChatSocketType {
	socket: Socket;
	channel: Channel;
}

export const socket = io('http://localhost:3000/chat', {autoConnect: false});
export const ChatSocketContext = React.createContext<ChatSocketType>({socket: socket, channel: {id: -1, name: "", privacy: ""}});

export const ChatSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [chatSocketData] = useState<ChatSocketType>({
		socket: socket,
		channel: {id: -1, name: "", privacy: ""},
	})
    return (
        <ChatSocketContext.Provider value={chatSocketData}>
            {children}
        </ChatSocketContext.Provider>
    );
};

export const useChatSocket = (): ChatSocketType => {
    const context = useContext(ChatSocketContext);
    if (!context) {
        throw new Error("useChatSocket must be used within a UserProvider");
    }
    return context;
};
