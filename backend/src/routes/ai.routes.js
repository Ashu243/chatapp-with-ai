import { Router } from "express";
import { getResult } from "../controllers/ai.controller.js";


const router = Router()


router.route('/').get(
    getResult
)

export default router