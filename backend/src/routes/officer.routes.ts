import { Router } from "express";
import { UserRole } from "../types/index";
import { OfficerController } from "../controllers/officerController";
import { authorize, protect } from "../middleware/authHandler";

export const officerRouter = Router();

officerRouter.use(protect);
officerRouter.use(authorize(UserRole.OFFICER));

// Profile of CURRENT logged-in officer
officerRouter.get('/profile', OfficerController.getProfile);

// Update profile (branch etc.)
officerRouter.put('/profile', OfficerController.updateProfile);

// Get officer details by USER ID (for admin or viewing)
officerRouter.get('/userprofile/:id', OfficerController.getUserProfile);

// Loans
officerRouter.get('/loans/pending', OfficerController.getPendingLoans);
officerRouter.get('/loans', OfficerController.getAllLoans);

// Review loan
officerRouter.post('/loans/:id/review', OfficerController.reviewLoan);
