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






server.listen(port, function () {
    console.log(`server is listening on port ${port}`)
})