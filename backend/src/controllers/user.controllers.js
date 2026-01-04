import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asynchandler from "../utils/asyncHandler.js";
import redis from "../services/redis.services.js";
import { loginRateLimiter } from "../rateLimiters/loginRateLimiter.js";
import jwt from 'jsonwebtoken'


const generateAccessAndRefreshToken = async function (user) {
    try {
        const accessToken = await user.generateAccessToken()
        const refreshToken = await user.generateRefreshToken()

        // user.refreshToken = refreshToken
        // await user.save({ validateBeforeSave: false })

        await redis.set(`refresh:${user._id}`, refreshToken, "EX", 7 * 24 * 60 * 60);

        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(500, "something went Wrong while generating access token and refresh token")
    }
}

const Register = asynchandler(async function (req, res) {

    const { email, password, username } = req.body

    if (!email || !password || !username) {
        throw new ApiError(400, 'All fields are required')
    }

    const existUser = await User.findOne({
        $or: [{ email }, { username }]
    })
    if (existUser) throw new ApiError(400, 'User Already Exists!')



    const user = await User.create({
        username,
        email,
        password
    })

    const createdUser = await User.findById(user._id).select("-password")
    if (!createdUser) throw new ApiError(500, 'Something went Wrong while registering the user')


    return res.status(200).json(
        new ApiResponse(200, createdUser, 'User Registered Successfully!')
    )

})


const Login = asynchandler(async function (req, res) {
    const { email, password } = req.body
    if (!email || !password) throw new ApiError(400, 'All fields are required!')

    const key = `${email}:${req.ip}` // example -> john@example.com:192.168.1.10
    try {
        // rate limiting per user. --> key is email and ip. because if a hacker target one email and hit the rate limit then a legit user tries to login then it will not login
        await loginRateLimiter.consume(key)
    } catch (error) {
        throw new ApiError(429, 'Too many login attempts. Please try again later.')
    }


    const user = await User.findOne({ email })
    if (!user) throw new ApiError(404, 'user not found!')

    const isPasswordValid = await user.isPasswordCorrect(password)
    if (!isPasswordValid) throw new ApiError(401, 'invalid user credentials')

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user)



    const loggedInUser = await User.findById(user._id).select("-password")

    // if the login is success then delete the key otherwise the limit will not reset.
    await loginRateLimiter.delete(key)

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(200, { user: loggedInUser, accessToken, refreshToken }, "user loggedin successfully")
        )


})

const UserProfile = asynchandler(async function (req, res) {
    const user = await User.findOne({ _id: req.user._id }).select("-password")
    if (!user) throw new ApiError(404, "logged in user not found")

    return res.status(200).json(
        new ApiResponse(200, user, "Profile fetched successfully!")
    )


})

const getAllUsers = asynchandler(async function (req, res) {
    const allUsers = await User.find({
        _id: { $ne: req.user._id }
    }).select("-password")

    return res
        .status(200)
        .json(
            new ApiResponse(200, allUsers, 'all users fetched successfully')
        )
})


const SearchUser = asynchandler(async function (req, res) {
    const query = req.query.query

    const users = await User.find({
        email: { $regex: query, $options: 'i' }
    }).select("email _id")

    return res
        .status(200)
        .json(
            new ApiResponse(200, users, "users fetched successfully")
        )

})


const refreshAccessToken = asynchandler(async function (req, res) {
    // get the refresh token from cookie
    const incomingRefreshToken = req.cookies?.refreshToken
    if (!incomingRefreshToken) throw new ApiError(401, "unauthorized Request!")


    // verifying the refresh token 
    const decodedToken = jwt.verify(
        incomingRefreshToken,
        process.env.REFRESH_TOKEN_SECRET
    )

    if (!decodedToken) throw new ApiError(401, "invalid refresh token")

    // getting the user

    const user = await User.findById(decodedToken._id)
    if(!user) throw new ApiError(401, 'user not found')

    // getting token from redis
    const redisToken = await redis.get(`refresh:${decodedToken._id}`)
    if (!redisToken) throw new ApiError(401, "token expired on invalid")

    // checking if the redis token matches or not with the cookie token
    if (incomingRefreshToken !== redisToken) throw new ApiError(401, "Token mismatch, please login again")


    // generating both the token using enerateAccessAndRefreshToken function which also sets the refresh token in redis
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user)

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(200, {}, "refreshed access token successfully")
        )


})

const LogoutUser = asynchandler(async function (req, res) {

    await redis.del(`refresh:${req.user._id}`);


    const options = {
        secure: true,
        httpOnly: true
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new ApiResponse(200, {}, "user logout successfully!")
        )

})



export { Register, Login, UserProfile, LogoutUser, refreshAccessToken, getAllUsers, SearchUser }




