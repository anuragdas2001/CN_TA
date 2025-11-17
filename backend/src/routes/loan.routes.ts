import { Router } from "express";
import { UserRole } from "../types/index";
import { LoanController } from "../controllers/loanController";
import { authorize, protect } from "../middleware/authHandler";

export const loanRouter = Router();
loanRouter.use(protect); // All loan routes require authentication

loanRouter.post('/apply', authorize(UserRole.CUSTOMER), LoanController.applyForLoan);
loanRouter.get('/my-applications', authorize(UserRole.CUSTOMER), LoanController.getMyApplications);
loanRouter.get('/:id/status', LoanController.getLoanStatus);