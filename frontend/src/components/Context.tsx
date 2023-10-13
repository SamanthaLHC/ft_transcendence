import React, { createContext, useContext, useState } from "react";

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
