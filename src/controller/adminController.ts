import { Request, Response } from 'express';
import { AdminService } from '../services/adminService';
import ErrorHandler from '../errors/errorHandler';

/**
 * AdminController é responsável por gerenciar todas as operações relacionadas a administradores no sistema.
 * Ele atua como intermediário entre as rotas e a lógica de negócios (services).
 *
 * @category Controllers
 */
export class AdminController {
  private adminService = new AdminService();

  /**
   * Cadastra um novo administrador no sistema.
   *
   * @async
   * @param req - Objeto Request contendo dados para criar um administrador.
   * @param res - Objeto Response para enviar a resposta ao cliente.
   * @throws {ErrorHandler.unauthorized} Caso o usuário autenticado não seja válido.
   * @throws {ErrorHandler} Caso ocorra algum erro ao realizar a operação.
   */
  async criarAdmin(req: Request, res: Response) {
    try {
      const adminLogadoId = req.user?.id;

      if (!adminLogadoId) {
        throw ErrorHandler.unauthorized('Admin não autenticado.');
      }

      const novoAdmin = await this.adminService.criarAdmin(
        req.body,
        adminLogadoId
      );

      res.status(201).json(novoAdmin);
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        message: 'Erro ao cadastrar Administrador',
        error: error.message
      });
    }
  }

  /**
   * Lista todos os administradores que foram criados pelo administrador autenticado no sistema.
   *
   * @async
   * @param req - Objeto Request contendo a autenticação do administrador.
   * @param res - Objeto Response para enviar a resposta ao cliente.
   * @throws {ErrorHandler.unauthorized} Caso o usuário autenticado não seja válido.
   */
  async listarAdmins(req: Request, res: Response) {
    try {
      const adminLogadoId = req.user?.id;

      if (!adminLogadoId) {
        throw ErrorHandler.unauthorized('Admin não autenticado.');
      }

      const admins = await this.adminService.listarAdmins(adminLogadoId);
      res.json(admins);
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        message: 'Erro ao listar Administradores',
        error: error.message
      });
    }
  }

  /**
   * Busca por um administrador específico pelo seu ID.
   *
   * @async
   * @param req - Objeto Request contendo o ID do administrador a ser buscado.
   * @param res - Objeto Response para enviar a resposta ao cliente.
   * @throws {ErrorHandler.unauthorized} Caso o usuário autenticado não seja válido.
   * @throws {ErrorHandler.notFound} Caso o administrador não seja encontrado.
   */
  async buscarAdminPorId(req: Request, res: Response) {
    try {
      const adminLogadoId = req.user?.id;

      if (!adminLogadoId) {
        throw ErrorHandler.unauthorized('Admin não autenticado.');
      }

      const id = parseInt(req.params.id, 10);
      const admin = await this.adminService.buscarAdminPorId(id, adminLogadoId);
      res.json(admin);
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        message: 'Erro ao buscar Administrador',
        error: error.message
      });
    }
  }

  /**
   * Atualiza informações de um administrador no sistema.
   *
   * @async
   * @param req - Objeto Request contendo os dados para atualização.
   * @param res - Objeto Response para enviar a resposta ao cliente.
   * @throws {ErrorHandler.unauthorized} Caso o usuário autenticado não seja válido.
   * @throws {ErrorHandler.notFound} Caso o administrador não seja encontrado.
   */
  async atualizarAdmin(req: Request, res: Response) {
    try {
      const adminLogadoId = req.user?.id;

      if (!adminLogadoId) {
        throw ErrorHandler.unauthorized('Admin não autenticado.');
      }

      const id = parseInt(req.params.id, 10);
      const adminAtualizado = await this.adminService.atualizarAdmin(
        id,
        req.body,
        adminLogadoId
      );

      res.json(adminAtualizado);
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        message: 'Erro ao atualizar Administrador',
        error: error.message
      });
    }
  }

  /**
   * Exclui um administrador do sistema.
   *
   * @async
   * @param req - Objeto Request contendo o ID do administrador a ser excluído.
   * @param res - Objeto Response para enviar a resposta ao cliente.
   * @throws {ErrorHandler.unauthorized} Caso o usuário autenticado não seja válido.
   * @throws {ErrorHandler.notFound} Caso o administrador não seja encontrado.
   */
  async deletarAdmin(req: Request, res: Response) {
    try {
      const adminLogadoId = req.user?.id;

      if (!adminLogadoId) {
        throw ErrorHandler.unauthorized('Admin não autenticado.');
      }

      const id = parseInt(req.params.id, 10);
      await this.adminService.deletarAdmin(id, adminLogadoId);
      res.status(200).send({ message: 'Admin excluído com sucesso.' });
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        message: 'Erro ao deletar Administrador',
        error: error.message
      });
    }
  }
}
