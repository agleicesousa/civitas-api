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

  async solicitarRecuperacao(req: Request, res: Response) {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email é obrigatório.' });
    }

    try {
      const result = await this.loginService.solicitarRecuperacao(email);
      return res.status(200).json(result);
    } catch (error) {
      return res
        .status(error.statusCode || 500)
        .json({ message: error.message || 'Erro ao solicitar recuperação.' });
    }
  }

  async resetarSenha(req: Request, res: Response) {
    const { token, novaSenha } = req.body;

    try {
      const result = await this.loginService.resetarSenha(token, novaSenha);
      return res.status(200).json(result);
    } catch (error) {
      return res
        .status(error.statusCode || 500)
        .json({ message: error.message || 'Erro ao redefinir senha.' });
    }
  }
}
