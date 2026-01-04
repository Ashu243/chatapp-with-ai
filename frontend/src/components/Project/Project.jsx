import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosClient from "../../config/axios";
import LeftPane from "./LeftPane";
import InitializeSocket, { joinProjectRoom, leaveProjectRoom, receive_message, send_message } from "../../config/socket";
import TeamInfoBar from "../Team/TeamInfoBar";
import TeamSocketProvider from "../../context/TeamSocketProvider";
import ToggleTeamBarButton from "../Team/ToggleTeamBarButton";
import LoadingBar from "../common/LoadingBar";
import { toast } from "react-toastify";

const Project = () => {
    const { projectId } = useParams();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(false)
    const [aiTyping, setaiTyping] = useState(false)
    const [cursor, setCursor] = useState()
    const [hasMoreMessage, setHasMoreMessage] = useState(true)
    const [messages, setMessages] = useState([])

    const [isTeamBarOpen, setIsTeamBarOpen] = useState(false)

    // console.log(isOnline)
    



    async function getProject() {
        try {
            setLoading(true)
            const res = await axiosClient.get(`/api/projects/get/${projectId}`,);
            setProject(res.data.data);
            // console.log(res.data.data)
            setLoading(false)
        } catch (error) {
            console.log(error);
            setLoading(false)
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
            setMessages((prev) => {
                const updated = [...data, ...prev]
                // console.log("Project messages after API:", updated)
                return updated
            })

            setCursor(data[0].createdAt)


        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        InitializeSocket()
        joinProjectRoom(projectId)

        receive_message('project-message', (data) => {
            setMessages((prev) => [...prev, data])
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


 if (loading) {
  return (
    <div className="h-[94vh] w-full flex items-center justify-center bg-[#0d0d0d] text-white">
        <LoadingBar />
    </div>
  );
}

if (!project) {
  return (
    <div className="h-[94vh] w-full flex items-center justify-center bg-[#0d0d0d] text-gray-400">
      Project not found
    </div>
  );
}

    return (

        <TeamSocketProvider teamId={project.teamId} >
            <ToggleTeamBarButton onClick={() => setIsTeamBarOpen(true)} />
            <div className="flex">
                <TeamInfoBar isOpen={isTeamBarOpen} onClose={() => setIsTeamBarOpen(false)} projectName={project ? project.projectName : 'loading...'} />
                <div className="h-[94vh] w-full md:w-3/4 bg-[#0d0d0d] text-white flex flex-col">


                    {/* TWO-PANE LAYOUT */}
                    <div className="flex flex-1 h-full overflow-hidden">


                        {/* LEFT SIDE — CHAT SECTION */}
                        <LeftPane
                            // userMessages={UserMessages}
                            messages={messages}
                            aiTyping={aiTyping}
                            getMessages={getMessages}
                            addMessage={(msg) => setMessages((prev) => [...prev, msg])}
                            project={project} />

                    </div>


                </div>

            </div>
        </TeamSocketProvider>
    );
};

export default Project;