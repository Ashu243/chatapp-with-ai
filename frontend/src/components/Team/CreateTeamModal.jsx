import React, { useState } from "react";
import axiosClient from "../../config/axios";

const CreateTeamModal = ({open, setOpen, getTeams}) => {
    const [teamName, setTeamName] = useState("");
    
    if(!open) return null;

     const handleCreate = async() => {
        try {
            
        if (teamName.trim() === "") return;
        const res = await axiosClient.post('/api/team', {teamName}, {show: true})
        setTeamName("");
        setOpen(false);
        getTeams()
        } catch (error) {
            console.log(error)
        }
    };

    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50 px-4">
            <div className="w-full max-w-md bg-[#141414] p-8 rounded-2xl shadow-lg border border-[#222] relative">

                {/* Close button */}
                <button
                    onClick={() => setOpen(false)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white text-lg font-bold"
                >
                    ×
                </button>

                <h2 className="text-2xl font-semibold mb-6 text-center">
                    Create a New Team
                </h2>

                <div className="flex flex-col space-y-4">
                    <label className="text-sm text-gray-300">Team Name</label>

                    <input
                        type="text"
                        placeholder="Enter team name"
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
                        className="p-3 rounded-lg bg-[#1f1f1f] border border-[#333] 
                                   focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />

                    <button
                        onClick={handleCreate}
                        className="mt-4 bg-purple-600 hover:bg-purple-700 transition
                                   py-3 rounded-lg font-medium text-white"
                    >
                        Create Team
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateTeamModal;
