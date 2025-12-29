import express, { Router } from "express";
import { getAllUsers, Login, LogoutUser, refreshAccessToken, Register, SearchUser, UserProfile } from "../controllers/user.controllers.js";
import { VerifyJWT } from "../middlewares/auth.middlewares.js";


const router = Router()

router.route('/register').post(Register)
router.route('/login').post(Login)

// secured routes

router.route('/profile').get(
    VerifyJWT,
    UserProfile
)
router.route('/allusers').get(
    VerifyJWT,
    getAllUsers
)

router.route('/logout').post(
    VerifyJWT,
    LogoutUser
)
router.route('/search').get(
    VerifyJWT,
    SearchUser
)

router.route('/refresh-token').post(
    refreshAccessToken
)


export default router