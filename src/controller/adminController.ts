import { Request, Response } from 'express';
import { AdminService } from '../services/adminService';
import ErrorHandler from '../errors/errorHandler';

export class AdminController {
  private adminService = new AdminService();

  async criarAdmin(req: Request, res: Response) {
    try {
      const adminLogadoId = req.user?.id;

      if (!adminLogadoId) {
        res.status(401).json({ message: 'Admin não autenticado.' });
        return;
      }

      const novoAdmin = await this.adminService.criarAdmin(
        req.body,
        adminLogadoId
      );
      res.status(201).json({
        message: 'Admin criado com sucesso.',
        data: novoAdmin
      });
    } catch (error) {
      res
        .status(error instanceof ErrorHandler ? error.statusCode : 500)
        .json({ message: error.message || 'Erro ao criar admin.' });
    }
  }

  async listarAdmins(req: Request, res: Response) {
    try {
      const adminLogadoId = req.user?.id;

      if (!adminLogadoId) {
        res.status(401).json({ message: 'Admin não autenticado.' });
        return;
      }

      const admins = await this.adminService.listarAdmins(adminLogadoId);
      res.status(200).json({
        message: 'Admins listados com sucesso.',
        data: admins
      });
    } catch (error) {
      res
        .status(error instanceof ErrorHandler ? error.statusCode : 500)
        .json({ message: error.message || 'Erro ao listar admins.' });
    }
  }

  async buscarAdminPorId(req: Request, res: Response) {
    try {
      const adminLogadoId = req.user?.id;

      if (!adminLogadoId) {
        res.status(401).json({ message: 'Admin não autenticado.' });
        return;
      }

      const id = parseInt(req.params.id, 10);
      const admin = await this.adminService.buscarAdminPorId(id, adminLogadoId);
      res.status(200).json({
        message: 'Admin encontrado com sucesso.',
        data: admin
      });
    } catch (error) {
      res
        .status(error instanceof ErrorHandler ? error.statusCode : 500)
        .json({ message: error.message || 'Erro ao buscar admin.' });
    }
  }

  async atualizarAdmin(req: Request, res: Response) {
    try {
      const adminLogadoId = req.user?.id;

      if (!adminLogadoId) {
        res.status(401).json({ message: 'Admin não autenticado.' });
        return;
      }

      const id = parseInt(req.params.id, 10);
      const adminAtualizado = await this.adminService.atualizarAdmin(
        id,
        req.body,
        adminLogadoId
      );
      res.status(200).json({
        message: 'Admin atualizado com sucesso.',
        data: adminAtualizado
      });
    } catch (error) {
      res
        .status(error instanceof ErrorHandler ? error.statusCode : 500)
        .json({ message: error.message || 'Erro ao atualizar admin.' });
    }
  }

  async deletarAdmin(req: Request, res: Response) {
    try {
      const adminLogadoId = req.user?.id;

      if (!adminLogadoId) {
        res.status(401).json({ message: 'Admin não autenticado.' });
        return;
      }

      const id = parseInt(req.params.id, 10);
      await this.adminService.deletarAdmin(id, adminLogadoId);
      res.status(204).json({ message: 'Admin excluído com sucesso.' });
    } catch (error) {
      res
        .status(error instanceof ErrorHandler ? error.statusCode : 500)
        .json({ message: error.message || 'Erro ao excluir admin.' });
    }
  }
}
