import { toast } from "react-toastify";
import { io } from "socket.io-client";

let socketInstance;


const InitializeSocket = () => {
    if (socketInstance) return socketInstance;

    socketInstance = io(import.meta.env.VITE_API_URL, {
        transports: ["websocket"],
        withCredentials: true,
    });

    socketInstance.on("connect", () => {
        console.log("connected");
    });
    

    return socketInstance;
};

export const joinProjectRoom = (projectId) => {
    socketInstance?.emit("join-project", projectId);
};

export const leaveProjectRoom = (projectId) => {
    socketInstance?.emit("leave-project", projectId);
};

export const receive_message = (eventName, cb) => {
    socketInstance?.on(eventName, cb);
};

export const send_message = (eventName, data) => {
    socketInstance?.emit(eventName, data);
};

export const disconnectSocket = () => {
    socketInstance?.disconnect();
    socketInstance = null;
};


export default InitializeSocket