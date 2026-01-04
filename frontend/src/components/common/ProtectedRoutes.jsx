import { useEffect } from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { useContext } from 'react'
import { authContext } from '../../context/AuthProvider'
import LoadingBar from './LoadingBar';

const ProtectedRoutes = () => {
    const { user, loading } = useContext(authContext);

    if (loading) return <div className='bg-[#0c0c0c] min-h-screen w-full flex items-center justify-center' >
        <LoadingBar />
    </div>

    return user ? <Outlet /> : <Navigate to="/login" />;
};


export default ProtectedRoutes
