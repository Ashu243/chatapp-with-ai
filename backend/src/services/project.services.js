import Project from "../models/project.models.js";
import ApiError from "../utils/ApiError.js";


export const createProject = async function(name, teamId, user){
    if(!name) throw new ApiError(400, "project name is missing!")
    
    const project = await Project.create({
        projectName: name,
        teamId,
        createdBy: user
    })

    return project
}