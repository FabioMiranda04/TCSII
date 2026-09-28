import { type IMatricula } from '../models/matricula.model';
import { ApiService } from './api.service';

const RECURSO = 'matriculas';

/**
 * MatriculaService — CRUD de matrículas na API NestJS (/matriculas).
 * IDs trafegam como number na API e string no front; datas em ISO.
 */
export class MatriculaService extends ApiService {
  private url(caminho = '') {
    return ApiService.buildUrl(RECURSO, caminho);
  }

  private static deApi(m: IMatricula): IMatricula {
    return ApiService.idsParaString(m);
  }

  /** Monta o corpo aceito pelo backend (só campos do DTO, IDs numéricos, datas ISO). */
  private static paraApi(item: Partial<IMatricula>) {
    const body: Record<string, unknown> = {};
    if (item.ID_Usuario !== undefined) body.ID_Usuario = item.ID_Usuario;
    if (item.ID_Curso !== undefined) body.ID_Curso = item.ID_Curso;
    if (item.DataMatricula) body.DataMatricula = ApiService.paraIso(item.DataMatricula);
    if (item.DataConclusao !== undefined) body.DataConclusao = ApiService.paraIso(item.DataConclusao) ?? null;
    return ApiService.idsParaNumero(body);
  }

  async listar(): Promise<IMatricula[]> {
    const data = await this.request<IMatricula[]>(this.url());
    return data.map(MatriculaService.deApi);
  }

  async buscarPorId(id: string): Promise<IMatricula> {
    return MatriculaService.deApi(await this.request<IMatricula>(this.url(`/${id}`)));
  }

  async listarPorUsuario(idUsuario: string): Promise<IMatricula[]> {
    const data = await this.request<IMatricula[]>(this.url(`?ID_Usuario=${encodeURIComponent(idUsuario)}`));
    return data.map(MatriculaService.deApi);
  }

  async criar(item: Omit<IMatricula, 'ID_Matricula'>): Promise<IMatricula> {
    const data = await this.request<IMatricula>(this.url(), {
      method: 'POST',
      body: JSON.stringify(MatriculaService.paraApi(item)),
    });
    return MatriculaService.deApi(data);
  }

  async atualizar(id: string, item: Partial<IMatricula>): Promise<IMatricula> {
    const data = await this.request<IMatricula>(this.url(`/${id}`), {
      method: 'PATCH',
      body: JSON.stringify(MatriculaService.paraApi(item)),
    });
    return MatriculaService.deApi(data);
  }

  async deletar(id: string): Promise<void> {
    await this.request<void>(this.url(`/${id}`), { method: 'DELETE' });
  }
}
