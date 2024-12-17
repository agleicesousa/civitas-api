import { Request, Response } from 'express';
import { LoginService } from '../services/loginService';

/**
 * Controlador responsável por gerenciar as rotas de login,
 * recuperação e redefinição de senha.
 */
export class LoginController {
  private loginService = new LoginService();

  /**
   * Realiza o login do usuário verificando credenciais e retornando token.
   */
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
      return res.status(200).json({ token, tipoConta, primeiroLogin });
    } catch (error) {
      return res
        .status(401)
        .json({ message: error.message || 'Erro de autenticação.' });
    }
  }

  /**
   * Atualiza senha quando o usuário está no primeiro login.
   */
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
      return res.status(200).json(result);
    } catch (error) {
      return res
        .status(400)
        .json({ message: error.message || 'Erro ao atualizar senha.' });
    }
  }

  /**
   * Solicita recuperação de senha através do envio de e-mail.
   */
  async solicitarRecuperacao(req: Request, res: Response) {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'E-mail é obrigatório.' });
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

  /**
   * Redefine senha através do token de recuperação.
   */
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
