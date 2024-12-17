import { Request, Response } from 'express';
import { MembrosService } from '../services/membrosService';
import ErrorHandler from '../errors/errorHandler';

/**
 * Controlador responsável por gerenciar as operações de membros através das rotas da API.
 * Inclui ações como criar, listar, buscar, atualizar e deletar membros.
 */
export class MembrosController {
  private membrosService = new MembrosService();

  /**
   * Cria um novo membro no sistema.
   * Verifica se o administrador está autenticado antes de prosseguir.
   *
   * @param req - Objeto Request da requisição.
   * @param res - Objeto Response para enviar a resposta.
   * @returns Status 201 com detalhes do novo membro criado ou erro caso haja falha.
   */
  async criarMembro(req: Request, res: Response) {
    try {
      const adminCriadorId = req.user?.id;
      if (!adminCriadorId) {
        return res.status(401).json({ error: 'Admin não logado.' });
      }

      const novoMembro = await this.membrosService.criarMembro({
        ...req.body,
        adminCriadorId
      });

      res.status(201).json({
        message: 'Membro criado com sucesso.',
        data: novoMembro
      });
    } catch (error) {
      const statusCode = error instanceof ErrorHandler ? error.statusCode : 500;
      res
        .status(statusCode)
        .json({ message: error.message || 'Erro ao criar membro.' });
    }
  }

  /**
   * Lista todos os membros associados ao administrador autenticado.
   *
   * @param req - Objeto Request da requisição.
   * @param res - Objeto Response para enviar a resposta.
   * @returns Lista de membros ou erro caso falhe.
   */
  async listarMembros(req: Request, res: Response) {
    try {
      const adminCriadorId = req.user?.id;
      if (!adminCriadorId) {
        return res.status(401).json({ error: 'Admin não logado.' });
      }

      const membros = await this.membrosService.listarMembros(adminCriadorId);

      res.json({
        message: 'Membros listados com sucesso.',
        data: membros
      });
    } catch (error) {
      const statusCode = error instanceof ErrorHandler ? error.statusCode : 500;
      res
        .status(statusCode)
        .json({ message: error.message || 'Erro ao buscar membros.' });
    }
  }

  /**
   * Busca um membro pelo seu ID.
   * Verifica se o administrador tem permissão para acessar os dados do membro.
   *
   * @param req - Objeto Request da requisição.
   * @param res - Objeto Response para enviar a resposta.
   * @returns Detalhes do membro encontrado ou erro caso não seja encontrado.
   */
  async buscarMembroPorId(req: Request, res: Response) {
    try {
      const adminCriadorId = req.user?.id;

      if (!adminCriadorId) {
        return res.status(400).json({ error: 'Admin não autenticado.' });
      }

      const id = req.params.id;
      const membro = await this.membrosService.buscarMembroPorId(
        adminCriadorId,
        id
      );

      res.json({
        message: 'Membro encontrado com sucesso.',
        data: membro
      });
    } catch (error) {
      const statusCode = error instanceof ErrorHandler ? error.statusCode : 500;
      res
        .status(statusCode)
        .json({ message: error.message || 'Erro ao buscar membro.' });
    }
  }

  /**
   * Atualiza as informações de um membro específico.
   * Verifica se o administrador autenticado tem permissão para atualizar.
   *
   * @param req - Objeto Request da requisição.
   * @param res - Objeto Response para enviar a resposta.
   * @returns Detalhes do membro atualizado ou erro caso falhe.
   */
  async atualizarMembro(req: Request, res: Response) {
    try {
      const adminCriadorId = req.user?.id;

      if (!adminCriadorId) {
        return res.status(400).json({ error: 'Admin não autenticado.' });
      }

      const id = req.params.id;
      const membroAtualizado = await this.membrosService.atualizarMembro(
        adminCriadorId,
        id,
        req.body
      );

      res.json({
        message: 'Membro atualizado com sucesso.',
        data: membroAtualizado
      });
    } catch (error) {
      const statusCode = error instanceof ErrorHandler ? error.statusCode : 500;
      res
        .status(statusCode)
        .json({ message: error.message || 'Erro ao atualizar membro.' });
    }
  }

  /**
   * Deleta um membro específico no sistema.
   * Garante que o administrador tem permissão para realizar a exclusão.
   *
   * @param req - Objeto Request da requisição.
   * @param res - Objeto Response para enviar a resposta.
   * @returns Status 204 (No Content) em caso de sucesso ou erro caso ocorra falha.
   */
  async deletarMembro(req: Request, res: Response) {
    try {
      const adminCriadorId = req.user?.id;

      if (!adminCriadorId) {
        return res.status(400).json({ error: 'Admin não autenticado.' });
      }

      const id = req.params.id;
      await this.membrosService.deletarMembro(adminCriadorId, id);

      res.status(204).json({ message: 'Membro deletado com sucesso.' });
    } catch (error) {
      const statusCode = error instanceof ErrorHandler ? error.statusCode : 500;
      res
        .status(statusCode)
        .json({ message: error.message || 'Erro ao deletar membro.' });
    }
  }
}
