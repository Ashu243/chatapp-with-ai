import { Router } from "express";
import { VerifyJWT } from "../middlewares/auth.middlewares.js";
import { deleteProject, getProjectById, getProjects, makeProject } from "../controllers/project.controller.js";



const router = Router()

router.route('/:teamId').post(
    VerifyJWT,
    makeProject
)

router.route('/:teamId').get(
    VerifyJWT,
    getProjects
)

router.route('/get/:projectId').get(
    VerifyJWT,
    getProjectById
)

router.route('/team/:teamId/project/:projectId').delete(
    VerifyJWT,
    deleteProject
)

// router.route('/add-collab').put(
//     VerifyJWT,
//     addUser
// )

export default router
