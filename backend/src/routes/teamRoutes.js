import { Router } from "express";
import { VerifyJWT } from "../middlewares/auth.middlewares.js";
import { addmember, createTeam, deleteTeam, getTeam, getTeamProjects } from "../controllers/team.controller.js";

const router = Router()

router.route('/').post(
    VerifyJWT,
    createTeam
)

router.route('/').get(
    VerifyJWT,
    getTeam
)

router.route('/:teamId').get(
    VerifyJWT,
    getTeamProjects
)

router.route('/add-member').put(
    VerifyJWT,
    addmember
)
router.route('/:teamId').delete(
    VerifyJWT,
    deleteTeam
)

export default router