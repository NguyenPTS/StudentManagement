import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Role } from "../models/user.model";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: Role;
  };
}

export const authenticateJWT = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  console.log('Authenticating request...');
  console.log('Request headers:', req.headers);
  
  const token = req.headers.authorization?.split(" ")[1];
  console.log('Extracted token:', token ? 'exists' : 'not found');
  
  if (!token) {
    console.log('No token provided');
    res.status(401).json({ message: "Unauthorized: No token provided" });
    return;
  }

  try {
    console.log('Verifying token...');
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as AuthenticatedRequest["user"];
    console.log('Token verified, decoded user:', decoded);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Token verification failed:', error);
    if (error instanceof jwt.TokenExpiredError) {
      console.log('Token expired');
      res.status(401).json({ message: "Token expired" });
      return;
    }
    console.log('Invalid token');
    res.status(403).json({ message: "Forbidden: Invalid token" });
  }
};

export const authorizeRole = (roles: Role[]) => {
  return (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): void => {
    console.log('Authorizing role...');
    console.log('User from request:', req.user);
    console.log('Required roles:', roles);
    
    if (!req.user) {
      console.log('No user found in request');
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    if (!roles.includes(req.user.role)) {
      console.log('User role not authorized:', req.user.role);
      res.status(403).json({ message: "Forbidden: Insufficient permissions" });
      return;
    }

    console.log('Role authorization successful');
    next();
  };
};
