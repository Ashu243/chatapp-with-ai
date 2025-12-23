import React, { useContext } from "react";
import { TeamContext } from "../../context/TeamProvider";

const TeamInfoBar = ({projectName}) => {

    const {team} = useContext(TeamContext)
    if (!team) return null;

    return (
        <div className="w-full h-[6vh] text-purple-100 bg-[#0d0d0f] border-b border-[#1a1a1d] px-4 py-3 flex items-center justify-between">

            {/* LEFT — TEAM NAME */}
            <div>
                <h2 className="text-lg font-semibold text-purple-300">{team.teamName}</h2>
                <p className="text-gray-400 text-xs">Team Overview</p>
            </div>

            <div>
                <h2 className="text-xl font-semibold text-purple-300">{projectName}</h2>
            </div>

            {/* RIGHT — MEMBERS & ACTION BUTTONS */}
            <div className="flex items-center space-x-4">

                {/* Members count + Avatars */}
                <div className="flex items-center space-x-2">
                    <span className="text-gray-400 text-sm">
                        Members: {team.members?.length || 0}
                    </span>

           
                </div>

            </div>
        </div>
    );
};

export default TeamInfoBar;
