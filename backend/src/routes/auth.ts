// Third party imports
import { Router } from "express";

// User imports
import { signup, verify, verifyResend, validateToken, validateEmail } from "../controllers/authController";

const router: Router = Router();

router.post("/signup", signup);

router.get("/verify/token/validate", validateToken, verify);
router.get("/verify/token/resend", validateToken, verifyResend);
router.post("/verify/email/resend", validateEmail, verifyResend);

export default router;
