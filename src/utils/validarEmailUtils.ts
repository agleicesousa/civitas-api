import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

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
