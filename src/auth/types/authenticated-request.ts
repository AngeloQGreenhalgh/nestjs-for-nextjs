import { User } from '../../user/entities/user.entity';
import type { Request } from 'express';
export interface AuthenticatedRequest extends Request {
  user: User;
}
