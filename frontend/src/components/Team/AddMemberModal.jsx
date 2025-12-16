import React from 'react'

const AddMemberModal = ({emailToAdd, open ,onClose, suggestions, handleAddCollabChange, setEmailToAdd, setSuggestions, AddCollabButton}) => {
    if(!open) return null
  return (
     <div className="fixed inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm z-50">
                    <div className="bg-[#1a1a1a] w-full max-w-md p-6 rounded-xl border border-[#333]">

                        {/* HEADER */}
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">Add Member</h2>
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-white text-2xl"
                            >
                                ×
                            </button>
                        </div>

                        {/* AUTOCOMPLETE INPUT */}
                        <div className="space-y-4 relative">
                            <input
                                type="text"
                                placeholder="Enter collaborator email"
                                className="w-full px-4 py-3 rounded-xl bg-[#111] text-white border border-[#333] outline-none focus:border-purple-600 transition"
                                value={emailToAdd}
                                onChange={handleAddCollabChange}
                            />

                            {/* Suggestions Dropdown */}
                            {suggestions.length > 0 && (
                                <div className="absolute w-full bg-[#111] border border-[#333] rounded-xl max-h-40 overflow-y-auto z-20 mt-1">
                                    {suggestions.map((user) => (
                                        <div
                                            key={user._id}
                                            onClick={() => {
                                                setEmailToAdd(user.email);
                                                setSuggestions([]);
                                            }}
                                            className="px-4 py-2 hover:bg-[#222] cursor-pointer"
                                        >
                                            {user.email}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* ADD BUTTON */}
                            <button
                                onClick={AddCollabButton}
                                className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-medium transition"
                            >
                                Add Member
                            </button>
                        </div>
                    </div>
                </div>
  )
}

export default AddMemberModal
