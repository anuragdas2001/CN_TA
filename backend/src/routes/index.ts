import { Router } from "express";
import { authRouter } from "./auth.routes";
import { loanRouter } from "./loan.routes";
import { officerRouter } from "./officer.routes";
import customerRouter from "./customer.routes";

const router = Router();

router.use("/auth", authRouter);
router.use("/loans", loanRouter);
router.use("/officer", officerRouter);
router.use("/customer", customerRouter);
export default router;
