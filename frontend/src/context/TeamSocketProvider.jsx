import { createContext, useEffect, useState } from "react"
import InitializeSocket, { send_message, receive_message } from "../config/socket"

export const TeamSocketContext = createContext()

const TeamSocketProvider = ({ teamId, children }) => {
  const [onlineUsers, setOnlineUsers] = useState([])

  useEffect(() => {
    if (!teamId) return

    InitializeSocket()

    // join team room
    send_message("join-team", teamId)

    // mark user online
    send_message("online-users")

    // listen for online users
    receive_message("online-users", (users) => {
      setOnlineUsers(users)
    })

    return () => {
      send_message("leave-team", teamId)
    }
  }, [teamId])

  return (
    <TeamSocketContext.Provider value={{ onlineUsers }}>
      {children}
    </TeamSocketContext.Provider>
  )
}

export default TeamSocketProvider
