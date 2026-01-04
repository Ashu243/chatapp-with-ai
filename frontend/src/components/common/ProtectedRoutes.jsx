import { useEffect } from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { useContext } from 'react'
import { authContext } from '../../context/AuthProvider'

const ProtectedRoutes = () => {
    const { user, loading } = useContext(authContext);

    if (loading) return <p>Loading...</p>;

    return user ? <Outlet /> : <Navigate to="/login" />;
};


export default ProtectedRoutes
