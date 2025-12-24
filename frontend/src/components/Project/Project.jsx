import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosClient from "../../config/axios";
import LeftPane from "./LeftPane";
import RightPane from "./RightPane";
import InitializeSocket, { disconnectSocket, joinProjectRoom, leaveProjectRoom, receive_message } from "../../config/socket";
import TeamInfoBar from "../Team/TeamInfoBar";

const Project = () => {
    const { projectId } = useParams();
    const [UserMessages, setUserMessages] = useState([]);
    const [AiMessages, setAiMessages] = useState([]);
    const [project, setProject] = useState(null);
    const [aiTyping, setaiTyping] = useState(false)
    const [cursor, setCursor] = useState()
    const [hasMoreMessage, setHasMoreMessage] = useState(true)
    const [messages, setMessages] = useState([])


    async function getProject() {
        try {
            const res = await axiosClient.get(`/api/projects/get/${projectId}`,);
            setProject(res.data.data);
            console.log(res.data.data)
        } catch (error) {
            console.log(error);
        }
    }

    async function getMessages() {
        try {

            if (!hasMoreMessage) return
            const res = await axiosClient.get(`/api/messages/${projectId}?cursor=${cursor || ''}`)
            const data = res.data.data

            if (data.length === 0) {
                setHasMoreMessage(false)
                return
            }
            setMessages((prev) => [...data, ...prev])

            console.log('messages', data)

            //    setUserMessages(data.filter((m)=> m.senderType === 'user'))
            //    setAiMessages(data.filter((m)=> m.senderType === 'ai'))

            setCursor(data[0].createdAt)


        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        InitializeSocket()
        joinProjectRoom(projectId)

        receive_message('project-message', (data) => {
            if (data.senderId._id === 'ai') {
                // console.log(JSON.parse(data.message))
                setAiMessages((prev) => [...prev, data])
                return
            }
            setUserMessages((prev) => [...prev, data])
        })

        receive_message('ai-typing', (status) => {
            setaiTyping(status)
        })
        return () => {
            leaveProjectRoom(projectId)
        };

    }, [projectId])


    // Fetch project
    useEffect(() => {
        getProject();
        getMessages()
    }, [projectId]);

    // let UserMessages;
    // let AiMessages;
    useEffect(() => {
         setUserMessages(messages.filter((m)=> m.senderType === 'user'))
         setAiMessages(messages.filter((m)=> m.senderType === 'ai'))
    }, [messages])

    return (
        <>
            <div className="h-[94vh] bg-[#0d0d0d] text-white flex flex-col">
                <TeamInfoBar projectName={project? project.projectName: 'loading...'} />


                {/* TWO-PANE LAYOUT */}
                <div className="flex flex-1 h-full overflow-hidden">



                    {/* LEFT SIDE — CHAT SECTION */}
                    <LeftPane
                        userMessages={UserMessages}
                        aiTyping={aiTyping}
                        getMessages={getMessages}
                        addMessage={(msg) => setUserMessages((prev) => [...prev, msg])}
                        project={project} />

                    {/* RIGHT SIDE — AI CODE SECTION */}
                    <RightPane aiMessages={AiMessages}
                        aiTyping={aiTyping} />
                </div>


            </div>

        </>
    );
};

export default Project;