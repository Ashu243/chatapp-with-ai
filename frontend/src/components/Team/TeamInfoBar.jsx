import React, { useContext } from "react"
import { TeamContext } from "../../context/TeamProvider"
import { TeamSocketContext } from "../../context/TeamSocketProvider"
import { authContext } from "../../context/AuthProvider"

const TeamInfoBar = ({ projectName, isOpen, onClose }) => {
  const { team } = useContext(TeamContext)
  const { onlineUsers } = useContext(TeamSocketContext)
  const { user } = useContext(authContext)

  if (!team) return null

  return (
    <>
      {/* BACKDROP (mobile only) */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
        />
      )}

      {/* SIDEBAR */}
      <div
        className={`
          fixed md:static top-0 left-0 z-50
          w-72 md:w-1/4 h-screen md:h-[94vh]
          bg-[#0d0d0f] border-r border-[#2f2f32]
          flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        {/* HEADER */}
        <div className="px-4 py-4 border-b border-[#2f2f32] flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold text-purple-300 truncate">
              {team.teamName}
            </h2>
            <p className="text-xs text-gray-400 mt-1">Team Workspace</p>
          </div>

          {/* Close button (mobile only) */}
          <button
            onClick={onClose}
            className="md:hidden text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* PROJECT INFO */}
        {projectName && (
          <div className="px-4 py-3 border-b border-[#2f2f32]">
            <p className="text-xs uppercase text-gray-500 tracking-wide">
              Current Project
            </p>
            <h3 className="text-sm font-medium text-purple-300 mt-1 truncate">
              {projectName}
            </h3>
          </div>
        )}

        {/* MEMBERS */}
        <div className="flex-1 overflow-y-auto px-4 py-3">
          <p className="text-xs uppercase text-gray-500 tracking-wide mb-3">
            Members ({team.members?.length})
          </p>

          <div className="space-y-2">
            {team.members?.map((member) => {
              const isOnline = onlineUsers.includes(member._id)
              const isMe = user._id === member._id

              return (
                <div
                  key={member._id}
                  className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-[#17171a]"
                >
                  {/* Avatar */}
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white">
                      {member.email[0].toUpperCase()}
                    </div>

                    {/* Online status */}
                    <span
                      className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-[#0d0d0f]
                        ${isOnline ? "bg-green-500" : "bg-gray-500"}`}
                    />
                  </div>

                  <p className="text-sm text-gray-200 truncate">
                    {member.email}
                    {isMe && (
                      <span className="text-purple-300 ml-1">(You)</span>
                    )}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}

export default TeamInfoBar
