// Third party imports
import { Router } from "express";
import { deleteExtraUsers, protect } from "../controllers/adminController";

const router: Router = Router();

router.delete("/extraUsers", protect, deleteExtraUsers);

export default router;
