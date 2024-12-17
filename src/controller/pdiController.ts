import { Request, Response } from 'express';
import { TipoConta } from '../entities/baseEntity';
import ErrorHandler from '../errors/errorHandler';
import { PdiService } from '../services/pdiService';

/**
 * Controlador para manipulação das operações relacionadas ao PDI (Plano de Desenvolvimento Individual).
 */
export class PdiController {
  private pdiService = new PdiService();

  /**
   * Cria um novo PDI.
   * @param req Request contendo os valores do PDI e comentários.
   * @param res Response com o status da operação e o PDI criado.
   */
  async criarPdi(req: Request, res: Response) {
    try {
      const { pdiValues, comments } = req.body;
      const alunoId = Number(req.params.id);
      const professorId = req.user?.id;
      const pdi = await this.pdiService.criarPDI(
        { pdiValues },
        comments,
        alunoId,
        professorId
      );

      return res.status(201).json({
        message: 'PDI cadastrado com sucesso',
        data: pdi
      });
    } catch (error) {
      if (error instanceof ErrorHandler) {
        return res.status(error.statusCode).json({
          message: error.message
        });
      }
      return res.status(500).json({
        message:
          'Não foi possível carregar as informações. Erro interno do servidor.'
      });
    }
  }

  /**
   * Obtém os detalhes de um PDI específico.
   * @param req Request contendo o ID do PDI na URL.
   * @param res Response com os detalhes do PDI.
   */
  async obterDetalhesPDI(req: Request, res: Response): Promise<Response> {
    try {
      const idPDI = Number(req.params.id);
      if (isNaN(idPDI)) {
        return res
          .status(400)
          .json({ message: 'O ID do PDI deve ser um número válido' });
      }

      const detalhes = await this.pdiService.detalhesPDI(idPDI);
      return res.status(200).json(detalhes);
    } catch (error) {
      if (error instanceof ErrorHandler) {
        return res.status(error.statusCode).json({
          message: error.message
        });
      }
      return res.status(500).json({
        message:
          'Não foi possível carregar as informações. Erro interno do servidor.'
      });
    }
  }

  /**
   * Lista todos os PDIs de um aluno.
   * @param req Request contendo o ID do aluno e tipo da conta.
   * @param res Response com a lista de PDIs do aluno.
   */
  async listarPDIsDoAluno(req: Request, res: Response): Promise<Response> {
    try {
      const tipoConta = req.user.tipoConta as TipoConta;
      const alunoId = Number(req.params.id);

      const pdis = await this.pdiService.pdisDoAluno(alunoId, tipoConta);

      return res.status(200).json(pdis);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erro ao listar PDIs' });
    }
  }

  /**
   * Deleta um PDI específico.
   * @param req Request contendo o ID do PDI a ser deletado.
   * @param res Response com o status da operação.
   */
  async deletarPDI(req: Request, res: Response): Promise<Response> {
    try {
      const pdiId = Number(req.params.id);
      await this.pdiService.deletearPdi(pdiId);

      return res.status(200).json({
        message: 'PDI removido com sucesso'
      });
    } catch (error) {
      console.error('Erro ao remover PDI:', error.message);

      return res.status(400).json({
        message: 'Erro ao remover PDI',
        error: error.message
      });
    }
  }

  /**
   * Obtém o resumo do relacionamento entre professor e aluno.
   * @param req Request contendo os IDs do aluno e professor.
   * @param res Response com o resumo das informações.
   */
  async obterResumoProfessorAluno(
    req: Request,
    res: Response
  ): Promise<Response> {
    try {
      const alunoId = Number(req.params.id);
      const professorId = Number(req.user.id);

      if (isNaN(alunoId) || isNaN(professorId)) {
        return res.status(400).json({
          message: 'Os IDs do aluno ou professor devem ser números válidos'
        });
      }

      const dados = await this.pdiService.resumoProfessorAluno(
        alunoId,
        professorId
      );

      return res.status(200).json({
        message: 'Dados obtidos com sucesso.',
        ...dados
      });
    } catch (error) {
      if (error instanceof ErrorHandler) {
        return res.status(error.statusCode).json({
          message: error.message
        });
      }
      return res.status(500).json({
        message:
          'Não foi possível carregar as informações. Erro interno do servidor.'
      });
    }
  }
}
