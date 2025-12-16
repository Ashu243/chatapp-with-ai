import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import jwt from 'jsonwebtoken'
import asyncHandler from "../utils/asyncHandler.js";

 


export const VerifyJWT = asyncHandler(async function(req, res, next){
    try {
        
    const token = req.cookies?.accessToken
    
    if(!token) throw new ApiError(400, "unauthorized request!")

    let decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findOne({_id : decoded._id})
    if(!user) throw new ApiError(400, "invalid access token")

    req.user = user
    next()

    } catch (error) {
        throw new ApiError(401, error?.message || "invalid access token" )
    }
})