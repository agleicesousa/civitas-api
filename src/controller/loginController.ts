import { Request, Response } from 'express';
import { LoginService } from '../services/loginService';

export class LoginController {
  private loginService = new LoginService();

  async login(req: Request, res: Response): Promise<Response> {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res
        .status(400)
        .json({ message: 'E-mail e senha são obrigatórios.' });
    }

    try {
      const { token, tipoConta, primeiroLogin } = await this.loginService.login(
        email,
        senha
      );
      return res.json({ token, tipoConta, primeiroLogin });
    } catch (error) {
      return res
        .status(401)
        .json({ message: error.message || 'Erro de autenticação.' });
    }
  }

  async atualizarSenhaPrimeiroLogin(
    req: Request,
    res: Response
  ): Promise<Response> {
    const userId = req.user?.id;
    const { novaSenha } = req.body;

    if (!novaSenha) {
      return res.status(400).json({ message: 'Nova senha é obrigatória.' });
    }

    try {
      const result = await this.loginService.atualizarSenhaPrimeiroLogin(
        userId,
        novaSenha
      );
      return res.json(result);
    } catch (error) {
      return res
        .status(400)
        .json({ message: error.message || 'Erro ao atualizar senha.' });
    }
  }
}
