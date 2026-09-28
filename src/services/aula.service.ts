import { type IAula } from '../models/aula.model';
import { ApiService } from './api.service';

const RECURSO = 'aulas';

/** AulaService — CRUD de aulas via API NestJS (/aulas). */
export class AulaService extends ApiService {
  private url(caminho = '') {
    return ApiService.buildUrl(RECURSO, caminho);
  }

  private static paraFront(a: IAula): IAula {
    return ApiService.idsParaString(a);
  }

  private static paraApi(item: Partial<IAula>): Record<string, unknown> {
    const { ID_Aula: _id, ...resto } = item;
    void _id;
    const out: Record<string, unknown> = ApiService.idsParaNumero(resto);
    if (out.DuracaoMinutos !== undefined) out.DuracaoMinutos = Number(out.DuracaoMinutos);
    if (out.Ordem !== undefined) out.Ordem = Number(out.Ordem);
    return out;
  }

  async listar(): Promise<IAula[]> {
    const data = await this.request<IAula[]>(this.url());
    return data.map(AulaService.paraFront);
  }

  async buscarPorId(id: string): Promise<IAula> {
    return AulaService.paraFront(await this.request<IAula>(this.url(`/${id}`)));
  }

  async listarPorModulo(idModulo: string): Promise<IAula[]> {
    const data = await this.request<IAula[]>(this.url(`?ID_Modulo=${encodeURIComponent(idModulo)}`));
    return data.map(AulaService.paraFront);
  }

  async criar(item: Omit<IAula, 'ID_Aula'>): Promise<IAula> {
    const data = await this.request<IAula>(this.url(), {
      method: 'POST',
      body: JSON.stringify(AulaService.paraApi(item)),
    });
    return AulaService.paraFront(data);
  }

  async atualizar(id: string, item: Partial<IAula>): Promise<IAula> {
    const data = await this.request<IAula>(this.url(`/${id}`), {
      method: 'PATCH',
      body: JSON.stringify(AulaService.paraApi(item)),
    });
    return AulaService.paraFront(data);
  }

  async deletar(id: string): Promise<void> {
    await this.request<void>(this.url(`/${id}`), { method: 'DELETE' });
  }
}
