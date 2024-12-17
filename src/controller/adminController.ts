import { Request, Response } from 'express';
import { AdminService } from '../services/adminService';
import ErrorHandler from '../errors/errorHandler';

export class AdminController {
  private adminService = new AdminService();

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
