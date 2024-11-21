import { Professor } from '../entities/professoresEntities';
import { Membros } from '../entities/membrosEntities';
import { Turma } from '../entities/turmasEntities';
import { Admin } from '../entities/adminEntities';
import { AppError } from '../utils/appError';
import { TipoConta } from '../entities/baseEntity';

export class ProfessorService {
  /**
   * Cria um novo professor e associa a ele múltiplas turmas.
   * 
   * @param nomeMembro - Nome do membro.
   * @param cpf - CPF do membro.
   * @param dataNascimento - Data de nascimento do membro.
   * @param numeroMatricula - Número de matrícula do professor.
   * @param turmasApelido - Apelido das turmas associadas ao professor.
   * @param adminId - ID do administrador que está criando o professor.
   * @param turmaIds - IDs das turmas que serão associadas ao professor.
   * @returns O professor criado com as turmas associadas.
   * 
   * @throws AppError - Se ocorrer um erro ao criar o professor.
   */
  async criarProfessor(
    nomeMembro: string,
    cpf: string,
    dataNascimento: Date,
    numeroMatricula: string,
    turmasApelido: string,
    adminId: number,
    turmaIds: number[]
  ): Promise < Professor > {
    const membro = new Membros();
    membro.nome = nomeMembro;
    membro.cpf = cpf;
    membro.dataNascimento = dataNascimento;
    membro.tipoConta = TipoConta.PROFESSOR;

    // Criação do membro
    await membro.save();

    // Busca as turmas com base nos IDs
    const turmas = await Turma.findByIds(turmaIds);

    // Verifica se todas as turmas foram encontradas
    if (turmas.length !== turmaIds.length) {
      throw new AppError('Algumas turmas não foram encontradas', 404);
    }

    const professor = new Professor();
    professor.membro = membro;
    professor.turmas = turmas;
    professor.turmasApelido = turmasApelido;
    professor.admin = { id: adminId } as Admin;

    await professor.save();

    return professor;
  }

  /**
   * Lista todos os professores de um admin específico.
   * 
   * @param adminId - ID do administrador para filtrar os professores.
   * @returns Lista de professores do admin.
   */
  async listarProfessores(adminId: number): Promise < Professor[] > {
    return Professor.find({ where: { admin: { id: adminId } }, relations: ['membro', 'admin', 'turmas'] });
  }

  /**
   * Busca um professor pelo ID, verificando se o admin é o mesmo que o criou.
   * 
   * @param professorId - ID do professor a ser buscado.
   * @param adminId - ID do admin que está buscando o professor.
   * @returns O professor encontrado.
   * 
   * @throws AppError - Se o professor não for encontrado ou se o admin não for o responsável por ele.
   */
  async buscarProfessorPorId(professorId: number, adminId: number): Promise < Professor > {
    const professor = await Professor.findOne({ where: { id: professorId }, relations: ['admin', 'turmas'] });

    if (!professor) {
      throw new AppError('Professor não encontrado', 404);
    }

    if (professor.admin.id !== adminId) {
      throw new AppError('Você não tem permissão para acessar esse professor', 403);
    }

    return professor;
  }

  /**
   * Edita um professor, atualizando as turmas associadas ao professor.
   * 
   * @param professorId - ID do professor a ser editado.
   * @param adminId - ID do admin que está editando o professor.
   * @param turmasApelido - Apelido das turmas a ser atualizado.
   * @param membroId - ID do membro a ser atualizado.
   * @param turmaIds - IDs das turmas a serem associadas ao professor.
   * @returns O professor atualizado.
   * 
   * @throws AppError - Se o professor não for encontrado ou se o admin não for o responsável por ele.
   */
  async editarProfessor(
    professorId: number,
    adminId: number,
    turmasApelido: string,
    membroId: number,
    turmaIds: number[]
  ): Promise < Professor > {
    const professor = await Professor.findOne({ where: { id: professorId }, relations: ['admin', 'membro', 'turmas'] });

    if (!professor) {
      throw new AppError('Professor não encontrado', 404);
    }

    if (professor.admin.id !== adminId) {
      throw new AppError('Você não tem permissão para editar esse professor', 403);
    }

    // Atualiza o apelido das turmas e o membro
    professor.turmasApelido = turmasApelido;
    professor.membro.id = membroId;

    // Atualiza as turmas associadas ao professor
    const turmas = await Turma.findByIds(turmaIds);

    // Verifica se todas as turmas foram encontradas
    if (turmas.length !== turmaIds.length) {
      throw new AppError('Algumas turmas não foram encontradas', 404);
    }

    professor.turmas = turmas;

    await professor.save();

    return professor;
  }

  /**
   * Deleta um professor, apenas se o admin for o mesmo que o criou.
   * 
   * @param professorId - ID do professor a ser deletado.
   * @param adminId - ID do admin que está deletando o professor.
   * @throws AppError - Se o professor não for encontrado ou se o admin não for o responsável por ele.
   */
  async deletarProfessor(professorId: number, adminId: number): Promise < void > {
    const professor = await Professor.findOne({ where: { id: professorId }, relations: ['admin'] });

    if (!professor) {
      throw new AppError('Professor não encontrado', 404);
    }

    if (professor.admin.id !== adminId) {
      throw new AppError('Você não tem permissão para deletar esse professor', 403);
    }

    await professor.remove();
  }
}