import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import axiosClient from '../../../config/axios'
import { Link, useNavigate } from 'react-router-dom'

const Register = () => {
    const navigate = useNavigate()
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    async function handleSubmit(e) {
        try {
        e.preventDefault()
        const res = await axiosClient.post('/api/users/register', {username, email, password})
        console.log(res.data)
        navigate('/team')
        } catch (error) {
            console.log(error.response.data.message || "something went wrong")
        }
    }


    return (
        <div className="min-h-[94vh] flex items-center justify-center bg-[#0c0c0c] p-4">
            <div className="w-full max-w-md bg-[#151414] rounded-2xl shadow-xl p-8 space-y-6">
                <h2 className="text-3xl font-semibold text-center text-white">Create Account</h2>
                <p className="text-center text-gray-400 text-sm">Join us and get started!</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex flex-col space-y-1">
                        <label className="text-sm font-medium text-gray-300">Username</label>
                        <input
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            type="text"
                            placeholder="John123"
                            className="px-4 py-2 rounded-lg border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                    </div>

                    <div className="flex flex-col space-y-1">
                        <label className="text-sm font-medium text-gray-300">Email</label>
                        <input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            placeholder="you@example.com"
                            className="px-4 py-2 rounded-lg border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                    </div>

                    <div className="flex flex-col space-y-1">
                        <label className="text-sm font-medium text-gray-300">Password</label>
                        <input
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                            className="px-4 py-2 rounded-lg border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-purple-600 text-white py-2 rounded-lg font-medium hover:bg-purple-700 transition-all"
                    >
                        Register
                    </button>
                </form>

                <p className="text-center text-sm text-gray-400">
                    Already have an account? <Link to="/login" className="text-purple-400 font-medium">Login</Link>
                </p>
            </div>
        </div>
    )
}

export default Register
