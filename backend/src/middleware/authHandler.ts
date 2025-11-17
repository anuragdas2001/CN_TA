import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models";
import { AuthRequest, JWTPayload, UserRole } from "../types";

// Protect routes - verify JWT token
export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  let token: string | undefined;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as JWTPayload;

      // Get user from token
      const user = await User.findById(decoded.userId).select("-passwordHash");

      if (!user) {
        res.status(401).json({ message: "User not found" });
        return;
      }

      req.user = user;
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: "Not authorized, token failed" });
      return;
    }
  }

  if (!token) {
    res.status(401).json({ message: "Not authorized, no token" });
    return;
  }
};

// Restrict to specific roles
export const authorize = (...roles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    // Normalize to strings before comparing to avoid enum/value mismatches
    const allowed = roles.map((r) => String(r));
    const current = String(req.user?.role);

    if (!req.user || !allowed.includes(current)) {
      // Log for debugging purposes
      // eslint-disable-next-line no-console
      console.debug("authorize check failed", { allowed, current });
      res.status(403).json({
        message: `User role '${req.user?.role}' is not authorized to access this route`,
      });
      return;
    }
    next();
  };
};
