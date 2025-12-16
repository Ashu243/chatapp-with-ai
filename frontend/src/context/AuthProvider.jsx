import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { createContext } from 'react'
import axiosClient from '../config/axios'

export const authContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // <= important

    useEffect(() => {
        async function getUser() {
            try {
                const res = await axiosClient.get("/api/users/profile");
                setUser(res.data.data);
            } catch (error) {
                setUser(null);
            } finally {
                setLoading(false); // <= MOST IMPORTANT LINE
            }
        }
        getUser();
    }, []);

    return (
        <authContext.Provider value={{ user, loading, setUser }}>
            {children}
        </authContext.Provider>
    );
};

export default AuthProvider;
