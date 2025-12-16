import React from 'react'
import { useEffect } from 'react'
import axiosClient from '../config/axios'
import { useState } from 'react'

const Profile = () => {
    const [user, setUser] = useState('')

    useEffect(() => {
        async function getProfile() {
            try {
                const res = await axiosClient.get('/api/users/profile')
                console.log(res.data.data)
                setUser(res.data.data)
            }

            catch (error) {
                console.log(error)
            }
        }
        getProfile()
    }, [])


    return (
        <div>
            hey {user.username}!
        </div>
    )
}

export default Profile
