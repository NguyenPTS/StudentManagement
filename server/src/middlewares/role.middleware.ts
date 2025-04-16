import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "./auth.middleware";
import { Role } from "../models/user.model";

export const authorize = (roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden: Access denied" });
    }
    next();
  };
};

export const authorizeAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  if (req.user.role !== "admin") {
    res.status(403).json({ message: "Forbidden: Admin access only" });
    return;
  }

  next();
};

export const authorizeTeacher = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  if (req.user.role !== "teacher") {
    res.status(403).json({ message: "Forbidden: Teacher access only" });
    return;
  }

  next();
};

export const authorizeAdminOrTeacher = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  if (req.user.role !== "admin" && req.user.role !== "teacher") {
    res.status(403).json({ message: "Forbidden: Admin or Teacher access only" });
    return;
  }

  next();
};
