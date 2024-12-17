import * as bcrypt from 'bcrypt';

/**
 * Valida a força de uma senha com base em critérios específicos.
 *
 * A senha deve atender aos seguintes requisitos:
 * - Ter pelo menos 8 caracteres.
 * - Contemplar pelo menos uma letra maiúscula.
 * - Contemplar pelo menos um caractere especial.
 *
 * @param senha - A senha a ser validada.
 * @returns `true` se a senha atende todos os critérios, caso contrário `false`.
 */
export function validarSenha(senha: string): boolean {
  const tem8Caracteres = senha.length >= 8;
  const temMaiuscula = /[A-Z]/.test(senha);
  const temCaractereEspecial = /[!@#$%^&*(),.?":{}|<>]/.test(senha);

  return tem8Caracteres && temMaiuscula && temCaractereEspecial;
}

/**
 * Criptografa uma senha utilizando o algoritmo bcrypt.
 *
 * O número de iterações (rounds) padrão é 10, que fornece um equilíbrio entre segurança e desempenho.
 *
 * @param senhaPlana - A senha em formato simples a ser criptografada.
 * @returns A senha criptografada em formato hash.
 */
export async function criptografarSenha(senhaPlana: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(senhaPlana, saltRounds);
}

/**
 * Compara uma senha no formato simples com sua versão criptografada.
 *
 * Utiliza o bcrypt para verificar se a senha fornecida corresponde ao hash armazenado.
 *
 * @param senhaPlana - A senha em formato simples para comparação.
 * @param senhaCriptografada - O hash de senha armazenado no banco de dados.
 * @returns `true` se as senhas coincidirem, caso contrário `false`.
 */
export async function compararSenha(
  senhaPlana: string,
  senhaCriptografada: string
): Promise<boolean> {
  return bcrypt.compare(senhaPlana, senhaCriptografada);
}
