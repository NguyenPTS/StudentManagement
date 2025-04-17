import { Role, Status } from "../models/user.model";

declare global {
  namespace Express {
    interface Request {
      user?: {
        _id: string;
        name: string;
        email: string;
        role: Role;
        status: Status;
      };
    }
  }
} 