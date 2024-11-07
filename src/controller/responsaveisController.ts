import { Request, Response } from 'express';
import { ResponsaveisService } from '../services/responsaveisService';

const responsaveisService = new ResponsaveisService();

export class ResponsaveisController {
  /**
   * Lista todos os responsáveis cadastrados.
   *
   * @param req - Objeto de solicitação HTTP.
   * @param res - Objeto de resposta HTTP.
   * @returns Retorna a lista de responsáveis no formato JSON.
   */
  async listarResponsaveis(req: Request, res: Response) {
    try {
      const responsaveis = await responsaveisService.listarResponsaveis();
      return res.status(200).json(responsaveis);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao listar responsáveis' });
    }
  }

  /**
   * Busca um responsável pelo ID fornecido.
   *
   * @param req - Objeto de solicitação HTTP com o ID do responsável nos parâmetros.
   * @param res - Objeto de resposta HTTP.
   * @returns Retorna o responsável encontrado ou uma mensagem de erro.
   */
  async buscarResponsavelPorId(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // Verifica se o ID é um número válido
      const idParsed = Number(id);
      if (isNaN(idParsed)) {
        return res.status(400).json({ error: 'ID inválido' });
      }

      const responsavel =
        await responsaveisService.buscarResponsavelPorId(idParsed);

      if (!responsavel) {
        return res.status(404).json({ error: 'Responsável não encontrado' });
      }

      return res.status(200).json(responsavel);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar responsável' });
    }
  }

  /**
   * Busca um responsável pelo CPF fornecido.
   *
   * @param req - Objeto de solicitação HTTP com o CPF do responsável nos parâmetros.
   * @param res - Objeto de resposta HTTP.
   * @returns Retorna o responsável encontrado ou uma mensagem de erro.
   */
  async buscarResponsavelPorCpf(req: Request, res: Response) {
    try {
      const { cpf } = req.params;

      // Validação do CPF, garantindo que tenha 11 dígitos numéricos
      if (!cpf || cpf.length !== 11 || !/^\d{11}$/.test(cpf)) {
        return res.status(400).json({ error: 'CPF inválido' });
      }

      const responsavel =
        await responsaveisService.buscarResponsavelPorCpf(cpf);

      if (!responsavel) {
        return res
          .status(404)
          .json({ error: 'Responsável com o CPF fornecido não encontrado' });
      }

      return res.status(200).json(responsavel);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar responsável' });
    }
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
