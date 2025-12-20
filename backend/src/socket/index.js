import { Message } from "../models/message.models.js";
import { aiRateLimiter } from "../rateLimiters/aiRateLimiters.js";
import { generateAIResult } from "../services/gemini.services.js";
import { socketAuth } from "./middleware.js";

export const initSocket = async (io) => {

    io.use(socketAuth)

    const aiLocks = new Set() //only stores unique values 


    io.on("connection", (socket) => {
        console.log("User connected:", socket.id);
        let roomId = socket.project._id.toString()
        console.log(roomId)

        socket.join(roomId)

        //
        socket.on('message', async (data) => {
            // check if the message is for ai or not
            const isAiMessage = data.content.toLowerCase().includes('@ai')

            // storing user message in db
            const userMessage = await Message.create({
                senderId: socket.userId,
                projectId: roomId,
                content: data.content,
                senderType: 'user'
            })

            // sends the message to everyone expect the one who typed the message
            socket.broadcast.to(roomId).emit('project-message', {
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



                // if there is already roomid in set then don't call the ai to generate response
                if (aiLocks.has(roomId)) {
                    return
                }

                // adds room Id to set (aiLocks) 
                aiLocks.add(roomId)

                try {
                    // console.log('ai is generating')
                    // using rate limiting so the user cannot spam or overuse the ai
                    // we are converting into string because the userid is object id not a string
                    await aiRateLimiter.consume(socket.userId.toString())


                    // tell the users that ai is typing something
                    io.to(roomId).emit('ai-typing', true)
                    const result = await generateAIResult(prompt)

                    // if the ai result is error then send the error to the client but don't save it in db
                    if (!result?.success || !result?.content) {
                        io.to(roomId).emit('project-message', {
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
                        projectId: roomId,
                        senderType: 'ai',
                        content: result.content
                    })

                    // sending the ai message
                    io.to(roomId).emit('project-message', {
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
                        io.to(roomId).emit('project-message', {
                            message: 'AI is cooling down. Please wait a bit...',
                            sender: {
                                _id: 'ai',
                                email: 'AI'
                            }

                        })
                    }
                    else {
                        console.log(error)
                    }
                } finally {
                    aiLocks.delete(roomId)
                }

                // stop typing
                io.to(roomId).emit('ai-typing', false)
            }

        })

        // Disconnect
        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
            socket.leave(roomId)
        });
    });

}