import React, { useContext } from "react"
import { TeamContext } from "../../context/TeamProvider"

const TeamInfoBar = ({ projectName }) => {
  const { team } = useContext(TeamContext)
//   console.log(projectName)

  if (!team) return null

  return (
    <div className="w-1/4 h-[94vh] bg-[#0d0d0f] border-r border-[#2f2f32] flex flex-col">

      {/* TEAM HEADER */}
      <div className="px-4 py-4 border-b border-[#2f2f32]">
        <h2 className="text-lg font-semibold text-purple-300 truncate">
          {team.teamName}
        </h2>
        <p className="text-xs text-gray-400 mt-1">Team Workspace</p>
      </div>

      {/* PROJECT INFO */}
      {projectName? <div className="px-4 py-3 border-b border-[#2f2f32]">
        <p className="text-xs uppercase text-gray-500 tracking-wide">
          Current Project
        </p>
        <h3 className="text-sm font-medium text-purple-300 mt-1 truncate">
          {projectName}
        </h3>
      </div>: null}

      {/* MEMBERS SECTION */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        <p className="text-xs uppercase text-gray-500 tracking-wide mb-3">
          Members ({team.members?.length})
        </p>

        <div className="space-y-2">
          {team.members?.map((member, index) => {
            const initial = member.email?.[0]?.toUpperCase()

            return (
              <div
                key={index}
                className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-[#17171a] transition"
              >
                {/* Avatar */}
                <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-sm font-semibold text-white">
                  {initial}
                </div>

                {/* Email */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-200 truncate">
                    {member.email}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* FOOTER / ACTIONS (optional, future ready) */}
      {/* <div className="px-4 py-3 border-t border-[#2f2f32]">
        <button className="w-full bg-purple-600 hover:bg-purple-700 text-white text-sm py-2 rounded-lg transition">
          Invite Member
        </button>
      </div> */}
    </div>
  )
}

export default TeamInfoBar
