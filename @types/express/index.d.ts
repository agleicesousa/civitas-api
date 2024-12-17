import { Membros } from '../../entities/membrosEntities';

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
