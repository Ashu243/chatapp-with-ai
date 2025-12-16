import { io } from "socket.io-client";


let socketInstance;

const InitializeSocket = (projectId) => {
     socketInstance = io(import.meta.env.VITE_API_URL, {
        transports: ["websocket"], // optional but recommended
        withCredentials: true,
        query: {projectId}
    });


    socketInstance.on('connect', () => {
        console.log('connected', socketInstance.id)
    })

    return socketInstance;
}

export const receive_message = (eventName, cb)=>{
    socketInstance.on(eventName, cb)
}

export const send_message = (eventName, data)=>{
    socketInstance.emit(eventName, data)
}


export default InitializeSocket;
