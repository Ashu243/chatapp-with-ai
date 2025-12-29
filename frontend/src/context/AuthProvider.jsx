import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { createContext } from 'react'
import axiosClient from '../config/axios'
import InitializeSocket, { disconnectSocket, receive_message } from '../config/socket'
import { toast } from 'react-toastify'

export const authContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // <= important



    useEffect(() => {
        async function getUser() {
            try {
                await axiosClient.post('/api/users/refresh-token')
                const res = await axiosClient.get("/api/users/profile", { skip: true });
                setUser(res.data.data);
            } catch (error) {
                setUser(null);
            } finally {
                setLoading(false); // <= MOST IMPORTANT LINE
            }
        }
        getUser();
    }, []);




    useEffect(() => {
        if (!user) return

        InitializeSocket()

        receive_message("notification", ({ message }) => {
            toast.info(message)
        })

        return () => {
            disconnectSocket()
        };

    }, [user])




    return (
        <authContext.Provider value={{ user, loading, setUser }}>
            {children}
        </authContext.Provider>
    );
};

export default AuthProvider;
