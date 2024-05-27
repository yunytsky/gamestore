import { createContext, useState } from "react";

export const AuthContext = createContext();
  
export const AuthContextProvider = ({children}) => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    )
}