import { Router } from "express";
import { VerifyJWT } from "../middlewares/auth.middlewares.js";
import { getProjectMessages } from "../controllers/messages.controller.js";

const router = Router()


router.route('/:projectId').get(
    VerifyJWT,
    getProjectMessages
)

export default router