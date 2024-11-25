import { Request, Response, NextFunction } from 'express';
import { AdminService } from '../services/adminService';

export class AdminController {
  private adminService = new AdminService();
  
  async criarAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    const { email } = req.body;

    await this.adminService.verificarEmailDuplicado(email);

    const novoAdmin = await this.adminService.criarAdmin(req.body);
    res.status(201).json(novoAdmin);
  } catch (error) {
    next(error);
  }
}

  async listarAdmins(req: Request, res: Response, next: NextFunction) {
    try {
      const admins = await this.adminService.listarAdmins();
      res.json(admins);
    } catch (error) {
      next(error);
    }
  }

  async buscarAdminPorId(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id, 10);
      const admin = await this.adminService.buscarAdminPorId(id);
      res.json(admin);
    } catch (error) {
      next(error);
    }
  }

  async atualizarAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id, 10);

      if (req.body.email) {
        await this.adminService.verificarEmailDuplicado(req.body.email);
      }

      const adminAtualizado = await this.adminService.atualizarAdmin(
        id,
        req.body
      );
      res.json(adminAtualizado);
    } catch (error) {
      next(error);
    }
  }

  async deletarAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id, 10);

      await this.adminService.deletarAdmin(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
