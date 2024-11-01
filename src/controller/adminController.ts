import { Request, Response } from 'express';
import { AdminService } from '../services/adminService';

export class AdminController {
  private adminService = new AdminService();

  /**
   * Lista todos os administradores.
   * @param req - Objeto da requisição HTTP.
   * @param res - Objeto da resposta HTTP.
   * @returns Uma lista de administradores em formato JSON.
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
   * Busca um administrador específico pelo ID.
   * @param req - Objeto da requisição HTTP, contendo o ID do administrador nos parâmetros.
   * @param res - Objeto da resposta HTTP.
   * @returns O administrador correspondente ao ID ou uma mensagem de erro se não encontrado.
   */
  async buscarAdminPorId(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const idNumber = Number(id);

    if (isNaN(idNumber)) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    try {
      const admin = await this.adminService.buscarAdminPorId(Number(id));
      if (admin) {
        return res.json(admin);
      }
      return res.status(404).json({ error: 'Administrador não encontrado.' });
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar administrador.' });
    }
  }

  /**
   * Cria um novo administrador.
   * @param req - Objeto da requisição HTTP, contendo as informações do administrador no corpo.
   * @param res - Objeto da resposta HTTP.
   * @returns O novo administrador criado em formato JSON.
   */
  async criarAdmin(req: Request, res: Response): Promise<Response> {
    const { email, senha, membroId } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'O campo email é obrigatório.' });
    }

    try {
      const novoAdmin = await this.adminService.criarAdmin(
        email,
        senha,
        Number(membroId)
      );

      return res.status(201).json(novoAdmin);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  /**
   * Atualiza um administrador existente.
   * @param req - Objeto da requisição HTTP, contendo o ID do administrador nos parâmetros e os dados atualizados no corpo.
   * @param res - Objeto da resposta HTTP.
   * @returns O administrador atualizado ou uma mensagem de erro se não encontrado.
   */
  async atualizarAdmin(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const { apelido, email, senha, membroId } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'O campo email é obrigatório.' });
    }

    try {
      const adminAtualizado = await this.adminService.atualizarAdmin(
        Number(id),
        email,
        senha,
        Number(membroId)
      );
      if (adminAtualizado) {
        return res.json(adminAtualizado);
      }
      return res.status(404).json({ error: 'Administrador não encontrado.' });
    } catch (error) {
      return res
        .status(500)
        .json({ error: 'Erro ao atualizar administrador.' });
    }
  }

  /**
   * Exclui um administrador existente.
   * @param req - Objeto da requisição HTTP, contendo o ID do administrador nos parâmetros.
   * @param res - Objeto da resposta HTTP.
   * @returns Uma resposta sem conteúdo (204) se o administrador for excluído com sucesso ou uma mensagem de erro.
   */
  async deletarAdmin(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    const adminAutenticadoId = req.user?.id;
    try {
      if (Number(id) === adminAutenticadoId) {
        return res
          .status(403)
          .json({ error: 'Você não pode excluir sua própria conta.' });
      }

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
   * @param req - Objeto da requisição HTTP, contendo o email e senha do administrador no corpo.
   * @param res - Objeto da resposta HTTP.
   * @returns O token JWT gerado em formato JSON ou uma mensagem de erro.
   */
  async login(req: Request, res: Response): Promise<Response> {
    const { email, senha } = req.body;

    const erros = [];

    // Valida se o email foi fornecido
    if (!email) {
      erros.push({ campo: 'email', erro: 'E-mail é obrigatório' });
    }

    // Valida se a senha foi fornecida
    if (!senha) {
      erros.push({ campo: 'senha', erro: 'Senha é obrigatória' });
    }

    // Se houver erros de validação, retorna com código 400
    if (erros.length > 0) {
      return res.status(400).json({ erros });
    }

    try {
      // Tenta realizar o login após a validação dos campos
      const { token } = await this.adminService.login(email, senha);
      return res.json({ token });
    } catch (error) {
      // Se as credenciais forem inválidas, retorna um erro de autenticação
      return res
        .status(401)
        .json({ error: 'Seu e-mail ou senha estão incorretos.' });
    }
  }
}
