import React, { createContext, useState } from "react";

const AuthContext = createContext({});
function AuthContextProvider({ children }) {
    const [auth, setAuth] = useState({});

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    );
}

export { AuthContextProvider, AuthContext };
