import * as bcrypt from 'bcrypt';

export function validarSenha(senha: string): boolean {
  const tem8Caracteres = senha.length >= 8;
  const temMaiuscula = /[A-Z]/.test(senha);
  const temCaractereEspecial = /[!@#$%^&*(),.?":{}|<>]/.test(senha);

  return tem8Caracteres && temMaiuscula && temCaractereEspecial;
}

export async function criptografarSenha(senhaPlana: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(senhaPlana, saltRounds);
}

export async function compararSenha(
  senhaPlana: string,
  senhaCriptografada: string
): Promise<boolean> {
  return bcrypt.compare(senhaPlana, senhaCriptografada);
}
