import React, { useContext, useState, useRef, useEffect } from 'react'
import InitializeSocket, { receive_message, send_message } from '../../config/socket'
import { authContext } from '../../context/AuthProvider'
import Markdown from "markdown-to-jsx";

const LeftPane = ({ aiTyping, addMessage, messages, getMessages }) => {
  const { user } = useContext(authContext)
  const [message, setMessage] = useState('')
  const endRef = useRef(null)
  const chatRef = useRef()
  const [scroll, setScroll] = useState(true)
  const [typingIndicator, setTypingIndicator] = useState(null)

  const username = user?.user?.email || user?.email
  const name = username.split('@')

  let typingTimeout;
  const handleInput = () => {
    send_message('typing', { user: name[0] })

    clearTimeout(typingTimeout)

    typingTimeout = setTimeout(() => {
      send_message("stop-typing", { user: name[0] })
    }, 1000)
  }

  // console.log('leftpane messages: ',messages)
  // // useEffect(()=>{
  // // },[messages])

  useEffect(() => {
    InitializeSocket()
    receive_message('typing', ({ user }) => {
      const message = `${user} is typing`
      setTypingIndicator(message)
    })
    receive_message('stop-typing', (user) => {
      setTypingIndicator(null)
    })

  }, [])


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
    if (scroll) {
      endRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

  }, [messages])

  const userId = user?._id || user?.user?._id


  if (messages.length === 0) {
    return null
  }

  return (
    <div className="w-full border-r border-[#222] bg-[#0c0c0c] flex flex-col h-full justify-between">
      {/* Top Buttons */}
      <div className="p-4 border-b border-[#222] bg-[#0c0c0c] flex items-center justify-center">
        <h2>Chat Section</h2>
      </div>

      {/* CHAT MESSAGES (scrollable) */}
      <div ref={chatRef} onScroll={handleScroll} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => {
          if (msg.senderType === "ai") {
            return (
              <div key={index} className="flex justify-start">
                <div className="bg-[#111] border border-[#333] rounded-xl px-4 py-3 max-w-[75%]">
                  <p className="text-xs opacity-60 mb-1">AI</p>
                  <Markdown 
                            options={{
                                overrides: {
                                    h1: {
                                        props: { className: "text-xl font-semibold mb-3 text-white" },
                                    },
                                    h2: {
                                        props: { className: "text-lg font-semibold mb-2 text-white" },
                                    },
                                    p: {
                                        props: { className: "text-sm leading-relaxed mb-3 text-gray-300" },
                                    },
                                    ul: {
                                        props: { className: "list-disc ml-5 mb-3 text-gray-300" },
                                    },
                                    li: {
                                        props: { className: "mb-1" },
                                    },
                                    pre: {
                                        props: {
                                            className:
                                                "bg-[#0b0b0b] border border-[#222] rounded-xl p-4 overflow-x-auto my-4",
                                        },
                                    },
                                    code: {
                                        props: {
                                            className:
                                                "text-purple-400 text-sm font-mono whitespace-pre-wrap break-words",
                                        },
                                    },
                                },
                            }}
                        >
                            {msg.content}
                        </Markdown>
                </div>
              </div>
            )
          }

          // USER MESSAGE
          const isMe = msg.senderId?._id === userId

          return (
            <div key={index} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
              <div className={`rounded-xl px-4 py-3 max-w-[75%] ${isMe ? "bg-purple-600" : "bg-[#1f1f1f]"
                }`}>
                <p className="text-xs opacity-60 mb-1">
                  {isMe ? "You" : msg.senderId?.email}
                </p>
                <p className="text-sm">{msg.content}</p>
              </div>
            </div>
          )
        })}
        {aiTyping && (
                        <div className="text-xs text-gray-400 italic px-4 mb-2">
                            AI is typing<span className="animate-pulse">...</span>
                        </div>
        )}
        {typingIndicator && (
          <div className="text-xs text-gray-400 italic px-4 mb-2">
            {typingIndicator} <span className="animate-pulse">...</span>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* CHAT INPUT (fixed at bottom of LeftPane) */}
      <form onSubmit={(e) => { e.preventDefault(); send() }} className="p-4 border-t border-[#222] bg-[#0b0b0b]">
        <div className="flex gap-2">
          <input value={message} onInput={handleInput} onChange={(e) => setMessage(e.target.value)} type="text" placeholder="Type a message..." className="flex-1 bg-[#111] px-4 py-3 rounded-xl border border-[#333] outline-none focus:border-purple-600" />
          <button type="submit" disabled={aiTyping} className="bg-purple-600 hover:bg-purple-700 px-5 py-3 rounded-xl font-medium">Send</button>
        </div>
      </form>
    </div>
  )
}

export default LeftPane
