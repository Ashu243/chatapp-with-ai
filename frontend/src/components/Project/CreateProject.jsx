import React, { useState, useEffect, useContext, useCallback } from "react";
import axiosClient from "../../config/axios";
import { useNavigate, useParams } from "react-router-dom";
import TeamInfoBar from "../Team/TeamInfoBar";
import { TeamContext } from "../../context/TeamProvider";
import AddMemberModal from "../Team/AddMemberModal";
import ViewMemberModal from "../Team/ViewMemberModal";
import { authContext } from "../../context/AuthProvider";

const CreateProject = () => {
  const { team, setTeam } = useContext(TeamContext);
  const {user} = useContext(authContext)
  const { teamId } = useParams();

  const [projectName, setProjectName] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [projects, setProjects] = useState([]);

  const [collabOpen, setCollabOpen] = useState(false);
  const [addCollabOpen, setAddCollabOpen] = useState(false);

  const [emailToAdd, setEmailToAdd] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const navigate = useNavigate();

  const userId = user?.user?._id || user?._id

  // Fetch all projects
  async function getProjects() {
    try {
      const res = await axiosClient.get(`/api/team/${teamId}`);
      setProjects(res.data.data.projects || []);
      setTeam(res.data.data);
    } catch (error) {
      console.log(error);
    }
  }

  const handleDelete = async (projectId)=>{
    try {
    const res = await axiosClient.delete(`/api/projects/team/${teamId}/project/${projectId}`, {show: true})
    getProjects()
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getProjects();
  }, []);

  const handleProject = (id) => {
    navigate(`/project/${id}`);
  };

  // Create project
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosClient.post(`/api/projects/${teamId}`, { projectName }, {show: true});
      setProjectName("");
      setModalOpen(false);
      getProjects();
    } catch (error) {
      console.log(error.response?.data?.message || error);
    }
  };

  const AddCollabButton = async () => {
    try {
      console.log(teamId)
      await axiosClient.put("/api/team/add-member", {
        teamId,
        email: emailToAdd,
      },
    {show: true});

      setEmailToAdd("");
      setSuggestions([]);
      setAddCollabOpen(false);
      getProjects();
    } catch (error) {
      console.log(error);
    }
  };

  // Debounce function
  const debounce = (func, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };

  const debouncedSearch = useCallback(
    debounce(async (value) => {
      const res = await axiosClient.get(`/api/users/search?query=${value}`);
      setSuggestions(res.data.data);
    }, 700),
    []
  );

  const handleAddCollabChange = (e) => {
    const value = e.target.value;
    setEmailToAdd(value);

    if (!value) return setSuggestions([]);

    debouncedSearch(value);
  };

  return (
    <div className="flex">

      <TeamInfoBar />
      <div className="min-h-[94vh] w-3/4 bg-[#0d0d0d] text-white px-6 py-10 flex flex-col items-center">
        
        {/* Header */}
        <div className="w-full max-w-3xl flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Your Projects</h1>

          <div className="space-x-3 flex">
            <button
              onClick={() => setAddCollabOpen(true)}
              className="px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 transition"
            >
              Add Member
            </button>

            <button
              onClick={() => setCollabOpen(true)}
              className="px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 transition"
            >
              View Members
            </button>

            <button
              onClick={() => setModalOpen(true)}
              className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 transition shadow-lg"
            >
              + Create Project
            </button>
          </div>
        </div>

        {/* Projects List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-3xl">
          {projects.length === 0 ? (
            <p className="text-gray-400">No projects yet. Create one!</p>
          ) : (
            [...projects].reverse().map((project) => (
              <div
                key={project._id}
                className="p-5 bg-[#1a1a1a] border border-[#333] rounded-xl hover:shadow-purple-700/20 transition"
              >
                <h2 
                onClick={() => handleProject(project._id)}
                className="text-lg font-semibold cursor-pointer hover:underline">{project.projectName}</h2>

                <div className="flex justify-between items-center">
                  <p className="text-gray-400 text-sm mt-1">
                  Created on {new Date(project.createdAt).toLocaleDateString()}
                </p>
                {(userId === team.ownerId)? <button onClick={()=> handleDelete(project._id)} className="text-red-500 underline cursor-pointer hover:text-red-700 text-sm mt-1">
                  Delete
                </button>: null}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Create Project Modal */}
        {modalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">
            <div className="w-full max-w-md bg-[#1a1a1a] p-8 rounded-2xl border border-[#333] shadow-xl">

              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Create New Project</h2>
                <button
                  onClick={() => setModalOpen(false)}
                  className="text-gray-400 hover:text-white text-xl"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <input
                  type="text"
                  placeholder="Enter project name"
                  className="w-full px-4 py-3 rounded-xl bg-[#111] border border-[#333] text-white focus:ring-2 focus:ring-purple-500"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                />

                <button
                  type="submit"
                  className="w-full py-3 bg-purple-600 hover:bg-purple-700 rounded-xl transition"
                >
                  Create Project
                </button>
              </form>

            </div>
          </div>
        )}

        {/* MEMBER MODALS */}
        <ViewMemberModal open={collabOpen} onClose={() => setCollabOpen(false)} team={team} />

        <AddMemberModal
          open={addCollabOpen}
          onClose={() => setAddCollabOpen(false)}
          suggestions={suggestions}
          setSuggestions={setSuggestions}
          handleAddCollabChange={handleAddCollabChange}
          setEmailToAdd={setEmailToAdd}
          emailToAdd={emailToAdd}
          AddCollabButton={AddCollabButton}
        />
      </div>
    </div>
  );
};

export default CreateProject;
