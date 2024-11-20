import { Request, Response } from 'express';
import { LoginService } from '../services/loginService';

export class loginController {
  private loginService = new LoginService();

  async login(req: Request, res: Response): Promise < Response > {
    const { email, senha } = req.body;
    const erros = [];

    // Valida campos obrigatórios
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
      // Realiza o login e retorna o token e o tipo de conta
      const { token, tipoConta } = await this.loginService.login(email, senha);
      return res.json({ token, tipoConta });
    } catch (error) {
      return res.status(401).json({
        message: error.message || 'Seu e-mail ou senha estão incorretos.'
      });
    }
  }
}