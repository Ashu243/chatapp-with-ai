import { io } from "../../server.js";
import Team from "../models/Team.models.js";
import User from "../models/user.model.js";
import { initSocket } from "../socket/index.js";
import ApiError from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiResponse.js"
import asyncHandler from "../utils/asyncHandler.js"



const createTeam = asyncHandler(async function (req, res) {
    const {teamName} = req.body;
    if(!teamName) throw new ApiError(404, 'team name is required')

    const createdTeam = await Team.create({
        teamName,
        ownerId: req.user._id,
        members: [req.user._id]
    })

    return res
    .status(200)
    .json(
        new ApiResponse(200, createdTeam, 'Team created!')
    )
    
})



const getTeam = asyncHandler(async function(req, res){
    const loggedInUser = req.user._id
    if(!loggedInUser) throw new ApiError(404, 'unauthorized User')

    const getAllTeams = await Team.find({members: loggedInUser}).populate({
        path: "ownerId",
        select: "-password"
    })

    return res
    .status(200)
    .json(
        new ApiResponse(200, getAllTeams, 'Teams fetched successfully')
    )

})

const getTeamProjects = asyncHandler(async function (req, res) {
    const {teamId} = req.params
    if(!teamId) throw new ApiError(404, "team id not found")

    const projects = await Team.findById(teamId).populate("projects members")

    return res
    .status(200)
    .json(
        new ApiResponse(200, projects, "team projects fetched successfully")
    )
    
})

const addmember = asyncHandler(async function (req, res) {
    const {teamId, email} = req.body
    console.log(teamId, email)
    if(!email || !teamId) throw new ApiError(400, "team id or email not found")

    const user = await User.findOne({email})
    if(!user) throw new ApiError(404, "user not found")

    const team = await Team.findOneAndUpdate(
        {_id: teamId},
        {$addToSet: {members: user._id}},
        {new: true}
    )

    io.to(`user:${user._id}`).emit("notification", {
        type: "Team_Added",
        message: `you have been added to ${team.teamName}`
    })

    return res
    .status(200)
    .json(
        new ApiResponse(200, team, "member added successfully!")
    )
    
})


const deleteTeam = asyncHandler(async function (req, res) {
    const {teamId} = req.params
    if(!teamId) throw new ApiError(400, 'team Id is required')

    const team = await Team.findById(teamId)
    if(!team) throw new ApiError(404, 'team not found')

    if(!team.ownerId.equals(req.user._id)){
        throw new ApiError(403, 'only owner can delete a team')
    }

    await team.deleteOne()

    return res
    .status(200)
    .json(
        new ApiResponse(200, team, 'team deleted successfully')
    )
})



export {createTeam, getTeam, getTeamProjects, addmember, deleteTeam}