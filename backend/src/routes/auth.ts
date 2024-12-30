// Third party imports
import { Router } from "express";

// User imports
import { signup, verify, verifyToken } from "../controllers/authController";

const router: Router = Router();

router.post("/", signup);

router.get("/verify/:route(validate|resend)/:token", verifyToken);
router.get("/verify/validate/:token", verify);
router.get("/verify/resend/:token", verify);
router.post("/verify/resend/email", verify);

export default router;
