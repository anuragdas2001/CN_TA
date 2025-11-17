import { Router } from "express";
import { CustomerController } from "../controllers/customerController";
import { protect, authorize } from "../middleware/authHandler";
import { UserRole } from "../types";

const router = Router();

router.use(protect);
// Support fetching current user's profile (no id) or by customer id
router.get(
  "/profile",
  authorize(UserRole.CUSTOMER),
  CustomerController.getProfile
);
router.get(
  "/profile/:id",
  authorize(UserRole.CUSTOMER),
  CustomerController.getProfile
);
router.get(
  "/userprofile/:id",
  authorize(UserRole.CUSTOMER),
  CustomerController.getUserProfile
); // For internal use
router.put(
  "/profile",
  authorize(UserRole.CUSTOMER),
  CustomerController.updateProfile
);

router.get("/:id", CustomerController.getCustomerById);

export default router;
