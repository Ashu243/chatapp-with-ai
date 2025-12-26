import { Message } from "../models/message.models.js";
import { aiRateLimiter } from "../rateLimiters/aiRateLimiters.js";
import { generateAIResult } from "../services/gemini.services.js";
import { socketAuth } from "./middleware.js";

export const initSocket = async (io) => {

    io.use(socketAuth)
    const onlineUsers = new Map()// store key value pairs
    const aiLocks = new Set() //only stores unique values 


    io.on("connection", (socket) => {
        console.log("User connected:", socket.id);
        let projectRoomId;

        let userId = socket.userId
        let teamRoomId;

        socket.on('join-team', (teamId)=>{
            teamRoomId = teamId
            socket.join(teamRoomId)
        })

        socket.on('leave-team', (teamId)=>{
            socket.leave(teamId)
        })


        socket.on('join-project', (projectId) => {
            projectRoomId = projectId
            socket.join(projectRoomId)
            // console.log(projectRoomId)
        })

        socket.on("leave-project", (projectId) => {
            socket.leave(projectId)
        })

        socket.on('online-users', () => {
            onlineUsers.set(userId, socket.id)

            io.to(teamRoomId).emit('online-users', Array.from(onlineUsers.keys()))

        })


        // join personal room
        socket.join(`user:${socket.userId}`)

        socket.on('typing', (user) => {
            socket.to(projectRoomId).emit('typing', user)
        })

        socket.on('stop-typing', (user) => {
            socket.to(projectRoomId).emit('stop-typing', user)
        })

        //
        socket.on('message', async (data) => {
            // check if the message is for ai or not
            const isAiMessage = data.content.toLowerCase().includes('@ai')

            // storing user message in db
            const userMessage = await Message.create({
                senderId: socket.userId,
                projectId: projectRoomId,
                content: data.content,
                senderType: 'user'
            })

            // sends the message to everyone expect the one who typed the message
            socket.broadcast.to(projectRoomId).emit('project-message', {
                _id: userMessage._id,
                content: userMessage.content,
                senderId: {
                    _id: socket.userId,
                    email: data.senderId.email
                },
                senderType: "user",
                createdAt: userMessage.createdAt
            })
            if (isAiMessage) {
                const prompt = data.content.replace('@ai', '')



                // if there is already projectRoomId in set then don't call the ai to generate response
                if (aiLocks.has(projectRoomId)) {
                    return
                }

                // adds room Id to set (aiLocks) 
                aiLocks.add(projectRoomId)

                // tell the users that ai is typing something
                io.to(projectRoomId).emit('ai-typing', true)
                try {
                    // console.log('ai is generating')
                    // using rate limiting so the user cannot spam or overuse the ai
                    // we are converting into string because the userid is object id not a string
                    await aiRateLimiter.consume(socket.userId.toString())


                    const result = await generateAIResult({ prompt, projectRoomId })

                    // if the ai result is error then send the error to the client but don't save it in db
                    if (!result?.success || !result?.content) {
                        io.to(projectRoomId).emit('project-message', {
                            content: result.error,
                            senderId: {
                                _id: 'ai',
                                email: 'AI'
                            },
                            senderType: "ai",
                        })
                        return
                    }

                    // storing the ai message in db
                    const aiMessage = await Message.create({
                        projectId: projectRoomId,
                        senderType: 'ai',
                        content: result.content
                    })

                    // sending the ai message
                    io.to(projectRoomId).emit('project-message', {
                        _id: aiMessage._id,
                        content: aiMessage.content,
                        senderId: {
                            _id: 'ai',
                            email: 'AI'
                        },
                        senderType: "ai",
                        createdAt: aiMessage.createdAt
                    })

                } catch (error) {
                    if (error.msBeforeNext) {
                        io.to(projectRoomId).emit('project-message', {
                            content: 'AI is cooling down. Please wait a bit...',
                            senderType: 'ai',
                            senderId: {
                                _id: 'ai',
                                email: 'AI'
                            }
                        })
                    }
                    else {
                        console.log(error)
                    }
                } finally {
                    aiLocks.delete(projectRoomId)
                    io.to(projectRoomId).emit('ai-typing', false)
                }

            }

        })

        // Disconnect
        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
            let disconnectedUser;

            for (let [userId, socketId] of onlineUsers.entries()) {
                // checking if the socketId saved in onlineUsers map is equals to socket.id
                if (socketId == socket.id) {
                    // if yes then we got the user who has disconnected
                    disconnectedUser = userId
                    // removing the user that has disconnected
                    onlineUsers.delete(userId)
                    break
                }
            }

            if (disconnectedUser) {
                io.emit('online-users', Array.from(onlineUsers.keys()))
            }

            socket.leave(projectRoomId)
        });
    });

}