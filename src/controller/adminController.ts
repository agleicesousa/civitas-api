import { Request, Response } from 'express';
import { AdminService } from '../services/adminService';

export class AdminController {
  private adminService = new AdminService();

  /**
   * Lista todos os administradores registrados no sistema.
   * 
   * @param req - A requisição HTTP.
   * @param res - A resposta HTTP.
   * @returns A lista de administradores.
   * @throws 500 - Erro ao tentar listar administradores.
   */
  async listarAdmins(req: Request, res: Response): Promise<Response> {
    try {
      const admins = await this.adminService.listarAdmins();
      return res.json(admins);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao listar administradores.' });
    }
  }

  /**
   * Busca um administrador pelo ID.
   * 
   * @param req - A requisição HTTP.
   * @param res - A resposta HTTP.
   * @returns O administrador encontrado ou um erro se não encontrado.
   * @throws 400 - Se o ID fornecido for inválido.
   * @throws 500 - Erro ao tentar buscar o administrador.
   */
  async buscarAdminPorId(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const idNumber = Number(id);

    if (isNaN(idNumber)) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    try {
      const admin = await this.adminService.obterAdminPorId(idNumber);
      if (admin) {
        return res.json(admin);
      }
      return res.status(404).json({ error: 'Administrador não encontrado.' });
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar administrador.' });
    }
  }

  /**
   * Cria um novo administrador no sistema.
   * 
   * @param req - A requisição HTTP com os dados do novo administrador no corpo.
   * @param res - A resposta HTTP.
   * @returns O administrador criado.
   * @throws 400 - Se os dados necessários não forem fornecidos corretamente.
   * @throws 500 - Erro ao tentar criar o administrador.
   */
  async criarAdmin(req: Request, res: Response): Promise<Response> {
    const { email, senha, nomeCompleto, tipoConta } = req.body;

    // Validação dos dados
    const erros = [];
    if (!email) erros.push({ campo: 'email', erro: 'E-mail é obrigatório' });
    if (!senha) erros.push({ campo: 'senha', erro: 'Senha é obrigatória' });
    if (!nomeCompleto)
      erros.push({ campo: 'nomeCompleto', erro: 'Nome completo é obrigatório' });
    if (!tipoConta)
      erros.push({ campo: 'tipoConta', erro: 'Tipo de conta é obrigatório' });

    if (erros.length > 0) {
      return res.status(400).json({ erros });
    }

    try {
      const membroData = {
        email,
        senha,
        nomeCompleto,
        tipoConta: tipoConta,
      };
      const novoAdmin = await this.adminService.criarAdmin(membroData);
      return res.status(201).json(novoAdmin);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  /**
   * Atualiza os dados de um administrador existente.
   * 
   * @param req - A requisição HTTP com o ID do administrador nos parâmetros e os novos dados no corpo.
   * @param res - A resposta HTTP.
   * @returns O administrador atualizado.
   * @throws 404 - Se o administrador não for encontrado.
   * @throws 500 - Erro ao tentar atualizar o administrador.
   */
  async atualizarAdmin(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const { email, senha, nomeCompleto, tipoConta } = req.body;

    try {
      const adminAtualizado = await this.adminService.atualizarAdmin(id, {
        email,
        senha,
        nomeCompleto,
        tipoConta,
      });

      if (adminAtualizado) {
        return res.json(adminAtualizado);
      }

      return res.status(404).json({ error: 'Administrador não encontrado.' });
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao atualizar administrador.' });
    }
  }

  /**
   * Deleta um administrador do sistema.
   * 
   * @param req - A requisição HTTP com o ID do administrador a ser deletado nos parâmetros.
   * @param res - A resposta HTTP.
   * @returns Resposta vazia se deletado com sucesso.
   * @throws 403 - Se o administrador tentar excluir sua própria conta.
   * @throws 404 - Se o administrador não for encontrado.
   * @throws 500 - Erro ao tentar deletar o administrador.
   */
  async deletarAdmin(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const adminAutenticadoId = req.user?.id;

    if (Number(id) === adminAutenticadoId) {
      return res
        .status(403)
        .json({ error: 'Você não pode excluir sua própria conta.' });
    }

    try {
      const resultado = await this.adminService.deletarAdmin(Number(id));
      if (resultado.affected) {
        return res.status(204).send();
      }
      return res.status(404).json({ error: 'Administrador não encontrado.' });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  /**
   * Realiza o login de um administrador e retorna um token JWT.
   * 
   * @param req - A requisição HTTP com o e-mail e senha no corpo.
   * @param res - A resposta HTTP com o token JWT gerado.
   * @returns O token JWT.
   * @throws 400 - Se o e-mail ou senha não forem fornecidos.
   * @throws 401 - Se o e-mail ou senha estiverem incorretos.
   */
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
      return res.status(401).json({ error: 'Seu e-mail ou senha estão incorretos.' });
    }
  }
}