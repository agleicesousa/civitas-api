import { Request, Response } from 'express';
import { ResponsaveisService } from '../services/responsaveisService';

const responsaveisService = new ResponsaveisService();

export class ResponsaveisController {
  /**
   * Lista todos os responsáveis cadastrados.
   * @param {Request} req - O objeto de requisição HTTP.
   * @param {Response} res - O objeto de resposta HTTP.
   * @returns {Promise<Response>} Uma resposta com a lista de responsáveis.
   */
  async listarResponsaveis(req: Request, res: Response) {
    const responsaveis = await responsaveisService.listarResponsaveis();
    return res.json(responsaveis);
  }

  /**
   * Busca um responsável específico pelo seu ID.
   * @param {Request} req - O objeto de requisição HTTP.
   * @param {Response} res - O objeto de resposta HTTP.
   * @returns {Promise<Response>} Uma resposta com os dados do responsável ou `null` se não encontrado.
   */
  async buscarResponsavelPorId(req: Request, res: Response) {
    const { id } = req.params;
    const responsavel = await responsaveisService.buscarResponsavelPorId(id);
    return res.json(responsavel);
  }

  /**
   * Cria um novo responsável no sistema.
   * @param {Request} req - O objeto de requisição HTTP contendo os dados do responsável.
   * @param {Response} res - O objeto de resposta HTTP.
   * @returns {Promise<Response>} Uma resposta com o responsável recém-criado.
   */
  async criarResponsavel(req: Request, res: Response) {
    const dadosResponsavel = req.body;
    const responsavelCriado =
      await responsaveisService.criarResponsavel(dadosResponsavel);
    return res.json(responsavelCriado);
  }

  /**
   * Atualiza um responsável existente no sistema.
   * @param {Request} req - O objeto de requisição HTTP contendo o ID do responsável e os dados a serem atualizados.
   * @param {Response} res - O objeto de resposta HTTP.
   * @returns {Promise<Response>} Uma resposta com os dados do responsável atualizado ou `null` se não encontrado.
   */
  async atualizarResponsavel(req: Request, res: Response) {
    const { id } = req.params;
    const dadosResponsavel = req.body;
    const responsavelAtualizado =
      await responsaveisService.atualizarResponsavel(id, dadosResponsavel);
    return res.json(responsavelAtualizado);
  }

  /**
   * Deleta um responsável do sistema.
   * @param {Request} req - O objeto de requisição HTTP contendo o ID do responsável a ser deletado.
   * @param {Response} res - O objeto de resposta HTTP.
   * @returns {Promise<Response>} Uma resposta com uma mensagem de sucesso e o resultado da operação.
   */
  async deletarResponsavel(req: Request, res: Response) {
    const { id } = req.params;
    const resultado = await responsaveisService.deletarResponsavel(id);
    return res.json({ message: 'Responsável deletado com sucesso', resultado });
  }
}
