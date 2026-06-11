import { type IModulo } from '../models/modulo.model';
import { ApiService } from './api.service';

const RECURSO = 'modulos';

/**
 * ModuloService — Gerencia operações CRUD de módulos via API (json-server).
 * Os dados são persistidos no db.json.
 */
export class ModuloService extends ApiService {
  private url(caminho = '') {
    return ApiService.buildUrl(RECURSO, caminho);
  }

  async listar(): Promise<IModulo[]> {
    const data = await this.request<IModulo[]>(this.url());
    return data.map(m => ({ ...m, ID_Modulo: String(m.ID_Modulo || (m as any).id) }));
  }

  async buscarPorId(id: string): Promise<IModulo> {
    const item = await this.request<IModulo>(this.url(`/${id}`));
    return { ...item, ID_Modulo: String(item.ID_Modulo || (item as any).id) };
  }

  async listarPorCurso(idCurso: string): Promise<IModulo[]> {
    const data = await this.request<IModulo[]>(this.url(`?ID_Curso=${idCurso}&_sort=Ordem`));
    return data.map(m => ({ ...m, ID_Modulo: String(m.ID_Modulo || (m as any).id) }));
  }

  async criar(item: Omit<IModulo, 'ID_Modulo'>): Promise<IModulo> {
    const data = await this.request<IModulo>(this.url(), {
      method: 'POST',
      body: JSON.stringify(item),
    });
    return { ...data, ID_Modulo: String(data.ID_Modulo || (data as any).id) };
  }

  async atualizar(id: string, item: Partial<IModulo>): Promise<IModulo> {
    const data = await this.request<IModulo>(this.url(`/${id}`), {
      method: 'PUT',
      body: JSON.stringify({ ...item, id }),
    });
    return { ...data, ID_Modulo: String(data.ID_Modulo || (data as any).id) };
  }

  async deletar(id: string): Promise<void> {
    await this.request<void>(this.url(`/${id}`), { method: 'DELETE' });
  }
}
