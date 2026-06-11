import { type ICategoria } from '../models/categoria.model';
import { ApiService } from './api.service';

const RECURSO = 'categorias';

/**
 * CategoriaService — Gerencia operações CRUD de categorias via API (json-server).
 * Os dados são persistidos no db.json.
 */
export class CategoriaService extends ApiService {
  private url(caminho = '') {
    return ApiService.buildUrl(RECURSO, caminho);
  }

  async listar(): Promise<ICategoria[]> {
    const data = await this.request<ICategoria[]>(this.url());
    return data.map(c => ({ ...c, ID_Categoria: String(c.ID_Categoria) }));
  }

  async buscarPorId(id: string): Promise<ICategoria> {
    const item = await this.request<ICategoria>(this.url(`/${id}`));
    return { ...item, ID_Categoria: String(item.ID_Categoria) };
  }

  async criar(item: Omit<ICategoria, 'ID_Categoria'>): Promise<ICategoria> {
    const data = await this.request<ICategoria>(this.url(), {
      method: 'POST',
      body: JSON.stringify(item),
    });
    return { ...data, ID_Categoria: String(data.ID_Categoria) };
  }

  async atualizar(id: string, item: Partial<ICategoria>): Promise<ICategoria> {
    const data = await this.request<ICategoria>(this.url(`/${id}`), {
      method: 'PUT',
      body: JSON.stringify(item),
    });
    return { ...data, ID_Categoria: String(data.ID_Categoria) };
  }

  async deletar(id: string): Promise<void> {
    await this.request<void>(this.url(`/${id}`), { method: 'DELETE' });
  }
}
