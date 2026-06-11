import { type ICurso } from '../models/curso.model';
import { ApiService } from './api.service';

const RECURSO = 'cursos';

/**
 * CursoService — Gerencia operações CRUD de cursos via API (json-server).
 * Os dados são persistidos no db.json.
 */
export class CursoService extends ApiService {
  private url(caminho = '') {
    return ApiService.buildUrl(RECURSO, caminho);
  }

  async listar(): Promise<ICurso[]> {
    const data = await this.request<ICurso[]>(this.url());
    return data.map(c => ({ ...c, ID_Curso: String(c.ID_Curso || (c as any).id) }));
  }

  async buscarPorId(id: string): Promise<ICurso> {
    const item = await this.request<ICurso>(this.url(`/${id}`));
    return { ...item, ID_Curso: String(item.ID_Curso || (item as any).id) };
  }

  async criar(item: Omit<ICurso, 'ID_Curso'>): Promise<ICurso> {
    const data = await this.request<ICurso>(this.url(), {
      method: 'POST',
      body: JSON.stringify(item),
    });
    return { ...data, ID_Curso: String(data.ID_Curso || (data as any).id) };
  }

  async atualizar(id: string, item: Partial<ICurso>): Promise<ICurso> {
    const data = await this.request<ICurso>(this.url(`/${id}`), {
      method: 'PUT',
      body: JSON.stringify({ ...item, id }),
    });
    return { ...data, ID_Curso: String(data.ID_Curso || (data as any).id) };
  }

  async deletar(id: string): Promise<void> {
    await this.request<void>(this.url(`/${id}`), { method: 'DELETE' });
  }
}
