import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { UserProps } from "../interface";
import axios from "axios";

interface UserContextType {
    user: UserProps | undefined;
    // token: string | undefined;
    login: (userData: UserProps) => void;
    logout: () => void;
    loading: boolean;
}

const userContext = createContext<UserContextType | undefined>(undefined);

// const userContext = createContext<UserContextType | undefined>({
//     user: undefined,
//     login: (userData: UserProps) => {},
//     logout: () => {}
// });

const AuthContext = ({children}: {children: ReactNode}) => {
    const [user, setUser] = useState<UserProps | undefined>(undefined);
    // const [token, setToken] = useState<string | undefined>(undefined);
    const [loading, setLoading] = useState(true)


    useEffect(() => {
        const verifyUser = async () => {
            const token = localStorage.getItem("token")
            try {
                const response = await axios.get("http://localhost:3000/api/auth/verify", {
                    headers: {
                        "Authorization" : `Bearer ${token}` 
                    }
                })
                if (response.data.success) {
                    setUser(response.data.user)
                } else {
                    setUser(undefined)
                    setLoading(false)
                }
            } catch (error) {
                console.log(error)
                if(axios.isAxiosError(error) && error.response && !error.response.data.error) {
                    setUser(undefined)
                }
            } finally {
                setLoading(false)
            }
        }
        verifyUser();
    }, [])

    const login = (userData: any) => {
        setUser(userData);
    };

    const logout = () => {
        setUser(undefined);
        localStorage.removeItem("token");
    };

    const value = {
        user: user,
        login: login,
        logout: logout,
        loading: loading
    }

    return (
        <userContext.Provider value={value}>
            {children}
        </userContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(userContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthContext provider');
    }
    return context;
};

export default AuthContext;

// const {user} = useContext();