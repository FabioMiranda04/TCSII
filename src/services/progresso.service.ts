import { type IProgresso } from '../models/progresso.model';
import { ApiService } from './api.service';

const RECURSO = 'progresso-aulas';

/**
 * ProgressoService — progresso de aulas via API NestJS (/progresso-aulas).
 * Chave composta (ID_Usuario, ID_Aula); não há campo id.
 */
export class ProgressoService extends ApiService {
  private url(caminho = '') {
    return ApiService.buildUrl(RECURSO, caminho);
  }

  private static paraFront(p: IProgresso): IProgresso {
    return ApiService.idsParaString(p);
  }

  async listar(): Promise<IProgresso[]> {
    const data = await this.request<IProgresso[]>(this.url());
    return data.map(ProgressoService.paraFront);
  }

  async listarPorUsuario(idUsuario: string): Promise<IProgresso[]> {
    const data = await this.request<IProgresso[]>(this.url(`?ID_Usuario=${encodeURIComponent(idUsuario)}`));
    return data.map(ProgressoService.paraFront);
  }

  async buscar(idUsuario: string, idAula: string): Promise<IProgresso> {
    return ProgressoService.paraFront(await this.request<IProgresso>(this.url(`/${idUsuario}/${idAula}`)));
  }

  async criar(item: Omit<IProgresso, 'DataConclusao' | 'Status'> & Partial<Pick<IProgresso, 'DataConclusao' | 'Status'>>): Promise<IProgresso> {
    const body = {
      ...ApiService.idsParaNumero(item),
      DataConclusao: ApiService.paraIso(item.DataConclusao),
    };
    const data = await this.request<IProgresso>(this.url(), {
      method: 'POST',
      body: JSON.stringify(body),
    });
    return ProgressoService.paraFront(data);
  }

  async atualizar(idUsuario: string, idAula: string, item: Partial<Pick<IProgresso, 'DataConclusao' | 'Status'>>): Promise<IProgresso> {
    const body = { ...item, DataConclusao: ApiService.paraIso(item.DataConclusao) };
    const data = await this.request<IProgresso>(this.url(`/${idUsuario}/${idAula}`), {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
    return ProgressoService.paraFront(data);
  }

  async deletar(idUsuario: string, idAula: string): Promise<void> {
    await this.request<void>(this.url(`/${idUsuario}/${idAula}`), { method: 'DELETE' });
  }

  /** Alias mantido por compatibilidade. */
  async deletarPorUsuarioEAula(idUsuario: string, idAula: string): Promise<void> {
    await this.deletar(idUsuario, idAula);
  }
}
