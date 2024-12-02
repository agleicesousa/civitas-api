import { Request, Response, NextFunction } from "express";
import { AlunoService } from "../services/alunoService";

export class AlunoController {
  private alunoService = new AlunoService();

  async criarAluno(req: Request, res: Response, next: NextFunction) {
    try {
      const adminLogadoId = req.user?.id || null;

      const novoAluno = await this.alunoService.criarAluno(
        req.body,
        adminLogadoId
      );

      res.status(201).json(novoAluno);
    } catch (error) {
      next(error);
    }
  }
}
