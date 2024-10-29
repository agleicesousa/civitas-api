import { Membros } from '../../entities/membrosEntities';

declare global {
  namespace Express {
    export interface Request {
      user?: {
        id: number;
        numeroMatricula: string;
        tipoConta: string;
        permissions: string[];
      };
    }
  }
}
