import React from 'react'

const ToggleTeamBarButton = ({onClick}) => {
  return (
    <button
      onClick={onClick}
      className="
        md:hidden fixed top-15 right-4 z-30
        bg-purple-700 hover:bg-purple-800
        px-3 py-2 rounded-full text-white
        transition
      "
    >
      ☰
    </button>
  )
}

export default ToggleTeamBarButton
