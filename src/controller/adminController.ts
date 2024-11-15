import { Request, Response } from 'express';
import { AdminService } from '../services/adminService';

export class AdminController {
  private adminService = new AdminService();

  async listarAdmins(req: Request, res: Response): Promise<Response> {
    try {
      const admins = await this.adminService.listarAdmins();
      return res.json(admins);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao listar administradores.' });
    }
  }

  async buscarAdminPorId(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const idNumber = Number(id);

    if (isNaN(idNumber)) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    try {
      const admin = await this.adminService.obterAdminPorId(idNumber);
      return res.json(admin);
    } catch (error) {
      return res.status(404).json({ error: error.message || 'Administrador não encontrado.' });
    }
  }

  async criarAdmin(req: Request, res: Response): Promise<Response> {
    const { email, senha, nomeCompleto, tipoConta } = req.body;

    try {
      const novoAdmin = await this.adminService.criarAdmin({
        email,
        senha,
        nomeCompleto,
        tipoConta,
      });
      return res.status(201).json(novoAdmin);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  async atualizarAdmin(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const novoMembroData = req.body;

    try {
      const adminAtualizado = await this.adminService.atualizarAdmin(
        Number(id),
        novoMembroData
      );
      return res.json(adminAtualizado);
    } catch (error) {
      return res.status(404).json({ error: error.message || 'Erro ao atualizar administrador.' });
    }
  }

  async deletarAdmin(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const adminAutenticadoId = req.user?.id;

    try {
      if (Number(id) === adminAutenticadoId) {
        return res
          .status(403)
          .json({ error: 'Você não pode excluir sua própria conta.' });
      }

      await this.adminService.deletaAdmin(Number(id));
      return res.status(204).send();
    } catch (error) {
      return res.status(404).json({ error: error.message || 'Administrador não encontrado.' });
    }
  }

  async login(req: Request, res: Response): Promise<Response> {
    const { email, senha } = req.body;
    const erros = [];

    if (!email) {
      erros.push({ campo: 'email', erro: 'E-mail é obrigatório' });
    }
    if (!senha) {
      erros.push({ campo: 'senha', erro: 'Senha é obrigatória' });
    }
    if (erros.length > 0) {
      return res.status(400).json({ erros });
    }

    try {
      const { token } = await this.adminService.login(email, senha);
      return res.json({ token });
    } catch (error) {
      return res.status(401).json({ error: error.message || 'Seu e-mail ou senha estão incorretos.' });
    }
  }
}import { Request, Response } from 'express';
import { AdminService } from '../services/adminService';

export class AdminController {
  private adminService = new AdminService();

  async listarAdmins(req: Request, res: Response): Promise<Response> {
    try {
      const admins = await this.adminService.listarAdmins();
      return res.json(admins);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao listar administradores.' });
    }
  }

  async buscarAdminPorId(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const idNumber = Number(id);

    if (isNaN(idNumber)) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    try {
      const admin = await this.adminService.obterAdminPorId(idNumber);
      return res.json(admin);
    } catch (error) {
      return res.status(404).json({ error: error.message || 'Administrador não encontrado.' });
    }
  }

  async criarAdmin(req: Request, res: Response): Promise<Response> {
    const { email, senha, nomeCompleto, tipoConta } = req.body;

    try {
      const novoAdmin = await this.adminService.criarAdmin({
        email,
        senha,
        nomeCompleto,
        tipoConta,
      });
      return res.status(201).json(novoAdmin);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  async atualizarAdmin(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const novoMembroData = req.body;

    try {
      const adminAtualizado = await this.adminService.atualizarAdmin(
        Number(id),
        novoMembroData
      );
      return res.json(adminAtualizado);
    } catch (error) {
      return res.status(404).json({ error: error.message || 'Erro ao atualizar administrador.' });
    }
  }

  async deletarAdmin(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const adminAutenticadoId = req.user?.id;

    try {
      if (Number(id) === adminAutenticadoId) {
        return res
          .status(403)
          .json({ error: 'Você não pode excluir sua própria conta.' });
      }

      await this.adminService.deletaAdmin(Number(id));
      return res.status(204).send();
    } catch (error) {
      return res.status(404).json({ error: error.message || 'Administrador não encontrado.' });
    }
  }

  async login(req: Request, res: Response): Promise<Response> {
    const { email, senha } = req.body;
    const erros = [];

    if (!email) {
      erros.push({ campo: 'email', erro: 'E-mail é obrigatório' });
    }
    if (!senha) {
      erros.push({ campo: 'senha', erro: 'Senha é obrigatória' });
    }
    if (erros.length > 0) {
      return res.status(400).json({ erros });
    }

    try {
      const { token } = await this.adminService.login(email, senha);
      return res.json({ token });
    } catch (error) {
      return res.status(401).json({ error: error.message || 'Seu e-mail ou senha estão incorretos.' });
    }
  }
}
