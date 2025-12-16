import Project from "../models/project.models.js";
import Team from "../models/Team.models.js";
import User from "../models/user.model.js";
import { createProject } from "../services/project.services.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const makeProject = asyncHandler(async (req, res) => {
    const { projectName } = req.body;
    const { teamId } = req.params


    if (!projectName) {
        throw new ApiError(400, "Project name is missing");
    }

    if (!teamId) {
        throw new ApiError(400, "Team ID is missing");
    }

    // 1. Find team
    const team = await Team.findById(teamId);
    if (!team) {
        throw new ApiError(404, "Team not found");
    }

    // 2. Create the project
    const newProject = await createProject(projectName, teamId, req.user._id);

    // 3. Add project to team
    team.projects.push(newProject._id);
    await team.save();

    return res.status(200).json(
        new ApiResponse(200, newProject, "Project created successfully")
    );
});

const deleteProject = asyncHandler(async function (req, res) {
    const { projectId, teamId } = req.params
    const team = await Team.findById(teamId)

    if (!projectId || !team) throw new ApiError(400, 'project Id and Team Id are required')


    if (!team.ownerId.equals(req.user._id)) {
        throw new ApiError(403, 'only team owner can delete a project')
    }

    const project = await Project.findOne({
        _id: projectId,
        teamId: teamId
    })

    if (!project) throw new ApiError(404, 'project not found in this team')

    await project.deleteOne()
    team.projects.pull(projectId)
    await team.save()

    return res
        .status(200)
        .json(
            new ApiResponse(200, project, 'project deleted successfully')
        )

})

const getProjects = asyncHandler(async function (req, res) {
    const { teamId } = req.params
    if (!teamId) throw new ApiError(404, 'team id is missing!')

    const allProjects = await Project.find({ teamId })

    return res
        .status(200)
        .json(
            new ApiResponse(200, allProjects, "projects fetched successfully")
        )
})

const getProjectById = asyncHandler(async function (req, res) {
    const { projectId } = req.params
    if (!projectId) throw new ApiError(404, 'project id not found')

    const project = await Project.findById(projectId)

    return res
        .status(200)
        .json(
            new ApiResponse(200, project, "project fetched successfully")
        )


})




export { makeProject, getProjects, getProjectById, deleteProject }