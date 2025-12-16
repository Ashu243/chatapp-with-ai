import "dotenv/config";

import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import app from './app.js'
import { initSocket } from "./src/socket/index.js";

const port = process.env.PORT || 3000


// Create HTTP server
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",  // your frontend
        methods: ["GET", "POST"]
    }
});

initSocket(io)

// io.use(async (socket, next) => {
//     try {
//         const rawCookies = socket.request.headers.cookie;

//         if (!rawCookies) {
//             return next(new Error("No cookies sent"));
//         }

//         const cookies = cookie.parse(rawCookies);
//         const token = cookies.accessToken;

//         if (!token) throw new ApiError(404, 'unauthorized User!')

//         const projectId = socket.handshake.query.projectId
//         if (!projectId) throw new ApiError(404, 'project id not found!')

//         socket.project = await Project.findById(projectId)

//         // verify token
//         const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
//         if (!decoded) throw new ApiError(400, 'invalid token!')

//         socket.userId = decoded._id
//         next()

//     } catch (error) {
//         throw new ApiError(400, 'invalid token')
//     }

// })







server.listen(port, function () {
    console.log(`server is listening on port ${port}`)
})