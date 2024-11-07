import { Request, Response } from 'express';
import { ResponsaveisService } from '../services/responsaveisService';

const responsaveisService = new ResponsaveisService();

export class ResponsaveisController {
  /**
   * Cria um novo responsável.
   *
   * @param req - Objeto de solicitação HTTP contendo os dados do responsável no corpo.
   * @param res - Objeto de resposta HTTP.
   * @returns Retorna o responsável criado ou uma mensagem de erro.
   */
  async criarResponsavel(req: Request, res: Response) {
    try {
      const dadosResponsavel = req.body;

      // Verifica se o CPF já existe antes de criar o responsável
      const cpfExistente = await responsaveisService.buscarResponsavelPorCpf(
        dadosResponsavel.cpf
      );
      if (cpfExistente) {
        return res.status(409).json({ error: 'CPF já cadastrado' });
      }

      const responsavelCriado =
        await responsaveisService.criarResponsavel(dadosResponsavel);
      return res.status(201).json(responsavelCriado);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao criar responsável' });
    }
  }

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
   * Atualiza um responsável pelo ID fornecido.
   *
   * @param req - Objeto de solicitação HTTP contendo o ID do responsável e os dados atualizados no corpo.
   * @param res - Objeto de resposta HTTP.
   * @returns Retorna o responsável atualizado ou uma mensagem de erro.
   */
  async atualizarResponsavel(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const dadosResponsavel = req.body;

      const idParsed = Number(id);
      if (isNaN(idParsed)) {
        return res.status(400).json({ error: 'ID inválido' });
      }

      const responsavelExistente =
        await responsaveisService.buscarResponsavelPorId(idParsed);
      if (!responsavelExistente) {
        return res.status(404).json({ error: 'Responsável não encontrado' });
      }

      // Verifica se o CPF foi alterado e se já pertence a outro responsável
      if (
        dadosResponsavel.cpf &&
        dadosResponsavel.cpf !== responsavelExistente.membro.cpf
      ) {
        const cpfExistente = await responsaveisService.buscarResponsavelPorCpf(
          dadosResponsavel.cpf
        );
        if (cpfExistente) {
          return res
            .status(409)
            .json({ error: 'CPF já cadastrado para outro responsável' });
        }
      }

      const responsavelAtualizado =
        await responsaveisService.atualizarResponsavel(
          idParsed,
          dadosResponsavel
        );
      return res.status(200).json(responsavelAtualizado);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao atualizar responsável' });
    }
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
