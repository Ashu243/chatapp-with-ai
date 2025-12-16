
import ApiError from "../utils/ApiError.js"
import asyncHandler from "../utils/asyncHandler.js"
import { generateAIResult } from "../services/gemini.services.js"
import ApiResponse from "../utils/ApiResponse.js";

const getResult = asyncHandler(async function (req, res) {
    const {prompt} = req.body
    if(!prompt) throw new ApiError(400, "prompt not found")

    const result = await generateAIResult(prompt)

    return res
    .status(200)
    .json(
        new ApiResponse(200, result, 'data generated successfully')
    )
})

export {getResult}