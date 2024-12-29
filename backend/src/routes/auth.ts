// Third party imports
import { Router } from "express";

// User imports
import { signup } from "../controllers/authController";

const router: Router = Router();

router.post("/", signup);

export default router;
