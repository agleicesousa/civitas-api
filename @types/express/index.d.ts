import { Membros } from '../models/Membros';

declare global {
  namespace Express {
    export interface Request {
      user?: {
        id: number;
        email: string;
        tipoConta: string;
      };
    }
  }
}
