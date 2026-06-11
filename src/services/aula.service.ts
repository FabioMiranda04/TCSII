import { type IAula } from '../models/aula.model';
import { ApiService } from './api.service';

const RECURSO = 'aulas';

/**
 * AulaService — Gerencia operações CRUD de aulas via API (json-server).
 * Os dados são persistidos no db.json.
 */
export class AulaService extends ApiService {
  private url(caminho = '') {
    return ApiService.buildUrl(RECURSO, caminho);
  }

  async listar(): Promise<IAula[]> {
    const data = await this.request<IAula[]>(this.url());
    return data.map(a => ({ ...a, ID_Aula: String(a.ID_Aula || (a as any).id) }));
  }

  async buscarPorId(id: string): Promise<IAula> {
    const item = await this.request<IAula>(this.url(`/${id}`));
    return { ...item, ID_Aula: String(item.ID_Aula || (item as any).id) };
  }

  async listarPorModulo(idModulo: string): Promise<IAula[]> {
    const data = await this.request<IAula[]>(this.url(`?ID_Modulo=${idModulo}`));
    return data.map(a => ({ ...a, ID_Aula: String(a.ID_Aula || (a as any).id) }));
  }

  async criar(item: Omit<IAula, 'ID_Aula'>): Promise<IAula> {
    const data = await this.request<IAula>(this.url(), {
      method: 'POST',
      body: JSON.stringify(item),
    });
    return { ...data, ID_Aula: String(data.ID_Aula || (data as any).id) };
  }

  async atualizar(id: string, item: Partial<IAula>): Promise<IAula> {
    const data = await this.request<IAula>(this.url(`/${id}`), {
      method: 'PUT',
      body: JSON.stringify({ ...item, id }),
    });
    return { ...data, ID_Aula: String(data.ID_Aula || (data as any).id) };
  }

  async deletar(id: string): Promise<void> {
    await this.request<void>(this.url(`/${id}`), { method: 'DELETE' });
  }
}
