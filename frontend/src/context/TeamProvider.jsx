import React, { useEffect } from 'react'
import { useState } from 'react'
import { createContext } from 'react'

export const TeamContext = createContext()
const TeamProvider = ({ children }) => {
  const [team, setTeam] = useState(null)



  // loads the team if there is any team 
  useEffect(() => {
    const storedTeam = localStorage.getItem("team")
    if (storedTeam) {
      setTeam(JSON.parse(storedTeam))
    }
  }, [])


  // sets the team in localstorage if there is a team and when team changes
  useEffect(() => {
    if (team) {
      localStorage.setItem("team", JSON.stringify(team))
    }
  }, [team])



  return (
    <TeamContext.Provider value={{ team, setTeam }} >
      {children}
    </TeamContext.Provider>
  )
}

export default TeamProvider
