import { Message } from "../models/message.models.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";


const getProjectMessages = asyncHandler(async function (req, res) {
    const {projectId} = req.params
    const {cursor, limit=20} = req.query
    if(!projectId) throw new ApiError(400, 'project Id is required')

    const query = {
        projectId
    }

    // if the cursor is present then add cursor to query
    if(cursor){
        query.createdAt = {$lt: new Date(cursor)}
    }

    const messages = await Message
    .find(query)
    .sort({createdAt: -1})
    .limit(Number(limit))
    .populate("senderId", "email")

    return res
    .status(200)
    .json(
        new ApiResponse(200, messages.reverse(), "messages fetched successfully")
    )
})

export {getProjectMessages}