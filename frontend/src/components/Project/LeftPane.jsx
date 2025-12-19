import React, { useContext, useState, useRef, useEffect } from 'react'
import { send_message } from '../../config/socket'
import { authContext } from '../../context/AuthProvider'

const LeftPane = ({ aiTyping, addMessage, userMessages, getMessages }) => {
  const { user } = useContext(authContext)
  const [message, setMessage] = useState('')
  const endRef = useRef(null)
  const chatRef = useRef()
  const [scroll, setScroll] = useState(true)



  
  async function handleScroll() {
    if (!chatRef.current) return
    
    const prevHeight = chatRef.current.scrollHeight
    if (chatRef.current.scrollTop === 0) {
      setScroll(false)
      await getMessages()
      requestAnimationFrame(() => {
        chatRef.current.scrollTop =
        chatRef.current.scrollHeight - prevHeight
      })
      console.log(prevHeight, 'new height: ', chatRef.current.scrollHeight)
    }
    
  }
  
  function send() {
    if (!message.trim()) return
    
    setScroll(true)
    
    const SenderMessage = {
      content: message,
      senderId: user,
      
    }
    
    send_message('message', SenderMessage)
    addMessage(SenderMessage)
    setMessage('')
  }
  // auto-scroll on new messages
  useEffect(() => {
    if(scroll) {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
    
  }, [userMessages])
  
  const userId = user?._id || user?.user?._id
  
  return (
    <div className="w-1/3 border-r border-[#222] bg-[#0c0c0c] flex flex-col h-full justify-between">
      {/* Top Buttons */}
      <div className="p-4 border-b border-[#222] bg-[#0c0c0c] flex items-center justify-center">
        <h2>Chat Section</h2>
      </div>

      {/* CHAT MESSAGES (scrollable) */}
      <div ref={chatRef} onScroll={handleScroll} className="flex-1 overflow-y-auto p-4 space-y-4">
        {userMessages.map((msg, index) => {
          const isMe = msg.senderId._id === userId
          // const isAi = msg.sender._id === 'ai'
          return (
            <div key={index} className={`flex w-full ${isMe ? "justify-end" : "justify-start"}`}>
              <div className={`rounded-2xl px-4 py-3 max-w-[75%] ${isMe ? "bg-purple-600 text-white" : "bg-[#1f1f1f] text-gray-100"} shadow-md border border-white/5`}>
                <p className="text-xs opacity-60 mb-1">{isMe ? "You" : msg.senderId.email}</p>

                <p className="text-sm leading-relaxed">{msg.content}</p>

              </div>
            </div>
          )
        })}

        <div ref={endRef} />
      </div>

      {/* CHAT INPUT (fixed at bottom of LeftPane) */}
      <form onSubmit={(e) => { e.preventDefault(); send() }} className="p-4 border-t border-[#222] bg-[#0b0b0b]">
        <div className="flex gap-2">
          <input value={message} onChange={(e) => setMessage(e.target.value)} type="text" placeholder="Type a message..." className="flex-1 bg-[#111] px-4 py-3 rounded-xl border border-[#333] outline-none focus:border-purple-600" />
          <button type="submit" disabled={aiTyping} className="bg-purple-600 hover:bg-purple-700 px-5 py-3 rounded-xl font-medium">Send</button>
        </div>
      </form>
    </div>
  )
}

export default LeftPane
