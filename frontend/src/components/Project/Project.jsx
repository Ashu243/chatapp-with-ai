import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosClient from "../../config/axios";
import LeftPane from "./LeftPane";
import RightPane from "./RightPane";
import InitializeSocket, { receive_message } from "../../config/socket";
import TeamInfoBar from "../Team/TeamInfoBar";

const Project = () => {
    const { projectId } = useParams();
    const [messages, setMessages] = useState([]);
    const [aiMessages, setAiMessages] = useState([]);
    const [project, setProject] = useState(null);
    const [aiTyping, setaiTyping] = useState(false)


    async function getProject() {
        try {
            const res = await axiosClient.get(`/api/projects/get/${projectId}`,);
            setProject(res.data.data);
            console.log(res.data.data)
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        InitializeSocket(projectId)

        receive_message('project-message', (data) => {
            if (data.sender._id === 'ai') {
                // console.log(JSON.parse(data.message))
                setAiMessages((prev) => [...prev, data])
                return
            }
            setMessages((prev) => [...prev, data])
        })

        receive_message('ai-typing', (status) => {
            setaiTyping(status)
        })

    }, [])


    // Fetch project
    useEffect(() => {

        getProject();
    }, [projectId]);




    return (
        <>
            <div className="h-screen bg-[#0d0d0d] text-white flex flex-col">
                <TeamInfoBar />
                {/* HEADER */}
                <div className="p-4 border-b border-[#222] bg-[#0f0f0f] flex items-center justify-between">
                    <h1 className="text-xl font-semibold">
                        {project ? project.projectName : "Loading..."}
                    </h1>

                    <span className="text-gray-400 text-sm">Project ID: {projectId}</span>
                </div>


                {/* TWO-PANE LAYOUT */}
                <div className="flex flex-1 h-full overflow-hidden">



                    {/* LEFT SIDE — CHAT SECTION */}
                    <LeftPane
                        messages={messages}
                        aiTyping={aiTyping}
                        addMessage={(msg) => setMessages((prev) => [...prev, msg])}
                        project={project} />

                    {/* RIGHT SIDE — AI CODE SECTION */}
                    <RightPane aiMessages={aiMessages}
                        aiTyping={aiTyping} />
                </div>


            </div>

        </>
    );
};

export default Project;
