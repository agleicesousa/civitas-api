import * as crypto from 'crypto';

const algorithm = process.env.ALGORITHM;
const secretKey = Buffer.from(process.env.SECRET_KEY, 'hex');

if (!process.env.SECRET_KEY) {
  throw new Error('A variável de ambiente SECRET_KEY não está definida!');
}

if (secretKey.length !== 32) {
  throw new Error('A chave secreta deve ter exatamente 32 bytes.');
}

const ivLength = 16;
const iv = crypto.randomBytes(ivLength);

/**
 * Criptografa um texto usando o algoritmo de cifra especificado.
 *
 * @param {string} text - Texto a ser criptografado.
 * @returns {string} Texto criptografado em formato hexadecimal, contendo o IV e o texto criptografado separados por ":".
 *
 * @throws {Error} Se a variável de ambiente SECRET_KEY não estiver definida ou não tiver 32 bytes.
 *
 * @example
 * const encrypted = encrypt('Mensagem secreta');
 * console.log(encrypted); // Retorna o texto criptografado com IV incluído.
 */
export function encrypt(text: string): string {
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
  const encrypted = Buffer.concat([
    cipher.update(text, 'utf8'),
    cipher.final()
  ]);
  return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
}

/**
 * Descriptografa um texto criptografado usando o algoritmo de cifra especificado.
 *
 * @param {string} encryptedText - Texto criptografado a ser descriptografado. Deve conter o IV e o texto criptografado separados por ":".
 * @returns {string} Texto original antes da criptografia.
 *
 * @throws {Error} Se o formato do texto criptografado estiver incorreto ou o texto não puder ser descriptografado.
 *
 * @example
 * const decrypted = decrypt('iv:encryptedText');
 * console.log(decrypted); // Retorna a mensagem original antes da criptografia.
 */
export function decrypt(encryptedText: string): string {
  const [ivHex, encryptedHex] = encryptedText.split(':');
  const decipher = crypto.createDecipheriv(
    algorithm,
    secretKey,
    Buffer.from(ivHex, 'hex')
  );
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(encryptedHex, 'hex')),
    decipher.final()
  ]);
  return decrypted.toString('utf8');
}
