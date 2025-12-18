import { Message } from "../models/message.models.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";


const getProjectMessages = asyncHandler(async function (req, res) {
    const {projectId} = req.params
    if(!projectId) throw new ApiError(400, 'project Id is required')

    const messages = await Message
    .find({projectId})
    .sort({createdAt: 1})
    .populate("senderId", "email")

    return res
    .status(200)
    .json(
        new ApiResponse(200, messages, "messages fetched successfully")
    )
})

export {getProjectMessages}