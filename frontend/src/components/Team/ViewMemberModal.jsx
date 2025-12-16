import React from 'react'

const ViewMemberModal = ({open, onClose, team}) => {
    if(!open) return null
  return (
     <div className="fixed inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm z-50">
                    <div className="bg-[#1a1a1a] w-full max-w-md p-6 rounded-xl border border-[#333]">

                        {/* Modal Header */}
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">Members</h2>
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-white text-2xl"
                            >
                                ×
                            </button>
                        </div>

                        {/* Collaborators List */}
                        <div className="space-y-3 max-h-72 overflow-y-auto">
                            {team?.members?.length > 0 ? (
                                team.members.map((user) => (
                                    <div
                                        key={user._id}
                                        className="p-3 bg-[#111] rounded-lg border border-[#333] flex items-center gap-3"
                                    >
                                        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-purple-600/20 text-purple-400 font-semibold">
                                            {user.username?.charAt(0).toUpperCase()}
                                        </div>

                                        <div>
                                            <p className="text-white font-medium">{user.username}</p>
                                            <p className="text-gray-400 text-sm">{user.email}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-400 text-center">No Members yet</p>
                            )}
                        </div>
                    </div>
                </div>
  )
}

export default ViewMemberModal
