import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CreateTeamModal from "./CreateTeamModal";
import axiosClient from "../../config/axios";
import { authContext } from "../../context/AuthProvider";
import InitializeSocket, { receive_message, send_message } from "../../config/socket";
import LoadingBar from "../common/LoadingBar";

const Team = () => {
    const navigate = useNavigate();
    const [teams, setTeams] = useState([]);
    const [open, setOpen] = useState(false)
    const { user } = useContext(authContext)
    const [loading, setLoading] = useState(true)


    async function getTeams() {
        try {
            setLoading(true)
            const res = await axiosClient.get('/api/team')
            setTeams(res.data.data)
            // console.log(res.data.data)
            setLoading(false)
        } catch (error) {
            console.log(error)
        }
    }


    useEffect(() => {
        if (!user) {
            return null
        } else {
            getTeams()
        }

    }, [user])


    const handleDelete = async (teamId) => {
        try {
            await axiosClient.delete(`/api/team/${teamId}`, { show: true })
            getTeams()
        } catch (error) {
            console.log(error)
        }
    }

    const userId = user?.user?._id || user?._id

    if (loading) {
        return <div className="min-h-[94vh] bg-[#0d0d0d] flex items-center justify-center" >
            <LoadingBar />
        </div>
    }
    return (
        <div className="min-h-[94vh] bg-[#0d0d0d] text-white p-6">

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
            {loading ? (
                <p className="text-gray-400 animate-pulse text-center mt-20">Loading teams...</p>
            ) :
                teams.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {teams.map((team) => (
                            <div
                                key={team._id}
                                className="bg-[#141414] border border-[#222] p-6 rounded-2xl "
                            >
                                <div
                                    onClick={() => navigate(`/team/${team._id}`)}
                                    className="cursor-pointer"
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

                                    {userId === team.ownerId._id && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation(); // IMPORTANT
                                                handleDelete(team._id);
                                            }}
                                            className="text-red-500 underline hover:text-red-700 text-sm mt-1"
                                        >
                                            Delete
                                        </button>
                                    )}
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


