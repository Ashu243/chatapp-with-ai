import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CreateTeamModal from "./CreateTeamModal";
import axiosClient from "../../config/axios";
import { authContext } from "../../context/AuthProvider";

const Team = () => {
    const navigate = useNavigate();
    const [teams, setTeams] = useState([]);
    const [open, setOpen] = useState(false)
    const {user} = useContext(authContext)

    async function getTeams() {
        try {
            console.log(user)
            const res = await axiosClient.get('/api/team')
            setTeams(res.data.data)
            console.log(res.data.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getTeams()
    }, [])

    const handleDelete = async(teamId)=>{
        try {
        await axiosClient.delete(`api/team/${teamId}`)
        getTeams()
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="min-h-screen bg-[#0d0d0d] text-white p-6">

            {/* Heading */}
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-semibold">Your Teams</h1>
                <button
                    onClick={() => setOpen(true)}
                    className="bg-purple-600 hover:bg-purple-700 transition px-6 py-3 rounded-xl font-medium"
                >
                    + Create New Team
                </button>
            </div>

            <CreateTeamModal open={open} getTeams={getTeams} setOpen={setOpen} />

            {/* Teams Grid */}
            {teams.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {teams.map((team) => (
                        <div
                            key={team._id}
                            className="bg-[#141414] border border-[#222] p-6 rounded-2xl cursor-pointer
                                       hover:border-purple-600 hover:bg-[#191919] transition"
                        >
                            <div
                                onClick={() => navigate(`/team/${team._id}`)}
                            >
                                <h2 className="text-xl font-semibold">{team.teamName}</h2>

                                <p className="text-gray-400 text-sm mt-2">
                                    Members: {team.members.length}
                                </p>
                            </div>

                            <div className="flex justify-between items-center">
                                <p className="text-gray-500 text-xs mt-1">
                                    Owner: {team.ownerId.email}
                                </p>
                                {(user._id === team.ownerId._id)? <button onClick={()=> handleDelete(team._id)} className="text-red-500 underline cursor-pointer hover:text-red-700 text-sm mt-1">
                                    Delete
                                </button>: null}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-300 text-center mt-20">You have no teams yet.</p>
            )}
        </div>
    );
};

export default Team;
