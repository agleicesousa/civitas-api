import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

/**
 * Middleware de validação de email.
 * Verifica se o campo `email` é válido e normaliza o valor.
 * Retorna um erro de validação com status 400 se o email for inválido.
 *
 * @returns Middleware que valida o email e prossegue para o próximo middleware se for válido.
 */
export const validarEmail = [
  body('email')
    .isEmail()
    .withMessage('O e-mail deve ser válido')
    .normalizeEmail(),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];
