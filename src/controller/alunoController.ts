import { Request, Response, NextFunction } from "express";
import { AlunoService } from "../services/alunoService";
import { getPaginacao } from "../utils/paginacaoUtils";

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

  async listarAlunos(req: Request, res: Response, next: NextFunction) {
    const { page, perPage } = getPaginacao(req);
    const searchTerm = req.query.searchTerm || "";
    const adminLogadoId = req.user?.id || null;

    try {
      const { data, total } = await this.alunoService.listarAlunos(
        +page,
        +perPage,
        searchTerm as string,
        adminLogadoId
      );

      res.status(200).json({
        page: +page,
        perPage: +perPage,
        total,
        data,
      });
    } catch (error) {
      next(error);
    }
  }
}
