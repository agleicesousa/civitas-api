import { Request, Response } from 'express';
import { LoginService } from '../services/loginService';

export class LoginController {
  private loginService = new LoginService();

  async login(req: Request, res: Response): Promise<Response> {
    const { email, senha } = req.body;
    const erros = [];

    if (!email) {
      erros.push({ campo: 'email', message: 'E-mail é obrigatório' });
    }
    if (!senha) {
      erros.push({ campo: 'senha', message: 'Senha é obrigatória' });
    }
    if (erros.length > 0) {
      return res.status(400).json({ erros });
    }

    try {
      const { token, tipoConta } = await this.loginService.login(email, senha);
      return res.json({ token, tipoConta });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(401).json({
          message: error.message || 'Erro de autenticação.'
        });
      }

      // Caso o erro não seja uma instância de Error
      return res.status(500).json({
        message: 'Ocorreu um erro inesperado.'
      });
    }
  }
}
