import { type ICategoria } from '../models/categoria.model';
import { ApiService } from './api.service';

const RECURSO = 'categorias';

/**
 * CategoriaService — CRUD de categorias via API NestJS (/categorias).
 * O backend usa ID_Categoria numérico; o front trabalha com string.
 */
export class CategoriaService extends ApiService {
  private url(caminho = '') {
    return ApiService.buildUrl(RECURSO, caminho);
  }

  private static normalizar(c: ICategoria): ICategoria {
    const out = ApiService.idsParaString(c);
    return { ID_Categoria: out.ID_Categoria, Nome: out.Nome, Descricao: out.Descricao ?? '' };
  }

  private static payload(item: Partial<ICategoria>) {
    const body: Partial<Pick<ICategoria, 'Nome' | 'Descricao'>> = {};
    if (item.Nome !== undefined) body.Nome = item.Nome;
    if (item.Descricao !== undefined) body.Descricao = item.Descricao;
    return JSON.stringify(body);
  }

  async listar(): Promise<ICategoria[]> {
    const data = await this.request<ICategoria[]>(this.url());
    return data.map(CategoriaService.normalizar);
  }

  async buscarPorId(id: string): Promise<ICategoria> {
    return CategoriaService.normalizar(await this.request<ICategoria>(this.url(`/${id}`)));
  }

  async criar(item: Omit<ICategoria, 'ID_Categoria'>): Promise<ICategoria> {
    const data = await this.request<ICategoria>(this.url(), { method: 'POST', body: CategoriaService.payload(item) });
    return CategoriaService.normalizar(data);
  }

  async atualizar(id: string, item: Partial<ICategoria>): Promise<ICategoria> {
    const data = await this.request<ICategoria>(this.url(`/${id}`), { method: 'PATCH', body: CategoriaService.payload(item) });
    return CategoriaService.normalizar(data);
  }

  async deletar(id: string): Promise<void> {
    await this.request<void>(this.url(`/${id}`), { method: 'DELETE' });
  }
}
