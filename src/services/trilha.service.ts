import { type ITrilha } from '../models/trilha.model';
import { ApiService } from './api.service';

const RECURSO = 'trilhas';

/**
 * TrilhaService — Gerencia operações CRUD de trilhas via API (json-server).
 * Os dados são persistidos no db.json.
 */
export class TrilhaService extends ApiService {
  private url(caminho = '') {
    return ApiService.buildUrl(RECURSO, caminho);
  }

  async listar(): Promise<ITrilha[]> {
    const data = await this.request<ITrilha[]>(this.url());
    return data.map(t => ({ ...t, ID_Trilha: String(t.ID_Trilha || (t as any).id) }));
  }

  async buscarPorId(id: string): Promise<ITrilha> {
    const item = await this.request<ITrilha>(this.url(`/${id}`));
    return { ...item, ID_Trilha: String(item.ID_Trilha || (item as any).id) };
  }

  async criar(item: Omit<ITrilha, 'ID_Trilha'>): Promise<ITrilha> {
    const data = await this.request<ITrilha>(this.url(), {
      method: 'POST',
      body: JSON.stringify(item),
    });
    return { ...data, ID_Trilha: String(data.ID_Trilha || (data as any).id) };
  }

  async atualizar(id: string, item: Partial<ITrilha>): Promise<ITrilha> {
    const data = await this.request<ITrilha>(this.url(`/${id}`), {
      method: 'PUT',
      body: JSON.stringify({ ...item, id }),
    });
    return { ...data, ID_Trilha: String(data.ID_Trilha || (data as any).id) };
  }

  async deletar(id: string): Promise<void> {
    await this.request<void>(this.url(`/${id}`), { method: 'DELETE' });
  }
}
