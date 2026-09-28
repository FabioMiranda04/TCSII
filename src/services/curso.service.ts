import { type ICurso } from '../models/curso.model';
import { ApiService } from './api.service';

const RECURSO = 'cursos';

/**
 * CursoService — CRUD de cursos via API NestJS (backend/).
 * IDs são string no front e number no backend; DataPublicacao é exposta como "dd/mm/aaaa".
 */
export class CursoService extends ApiService {
  private url(caminho = '') {
    return ApiService.buildUrl(RECURSO, caminho);
  }

  private static deApi(c: ICurso): ICurso {
    const out = ApiService.idsParaString(c);
    return { ...out, Descricao: out.Descricao ?? '', Imagem: out.Imagem ?? '', DataPublicacao: ApiService.formatarData(out.DataPublicacao) };
  }

  private static paraApi(item: Partial<ICurso>): Record<string, unknown> {
    const { ID_Curso: _id, ...resto } = item;
    void _id;
    const body: Record<string, unknown> = ApiService.idsParaNumero(resto);
    if ('DataPublicacao' in item) body.DataPublicacao = ApiService.paraIso(item.DataPublicacao);
    if (body.Imagem === '') delete body.Imagem;
    if (body.TotalAulas !== undefined) body.TotalAulas = Number(body.TotalAulas);
    if (body.TotalHoras !== undefined) body.TotalHoras = Number(body.TotalHoras);
    return body;
  }

  async listar(idCategoria?: string): Promise<ICurso[]> {
    const q = idCategoria ? `?ID_Categoria=${encodeURIComponent(idCategoria)}` : '';
    const data = await this.request<ICurso[]>(this.url(q));
    return data.map(CursoService.deApi);
  }

  async listarPorCategoria(idCategoria: string): Promise<ICurso[]> {
    return this.listar(idCategoria);
  }

  async buscarPorId(id: string): Promise<ICurso> {
    return CursoService.deApi(await this.request<ICurso>(this.url(`/${id}`)));
  }

  async criar(item: Omit<ICurso, 'ID_Curso'>): Promise<ICurso> {
    const data = await this.request<ICurso>(this.url(), {
      method: 'POST',
      body: JSON.stringify(CursoService.paraApi(item)),
    });
    return CursoService.deApi(data);
  }

  async atualizar(id: string, item: Partial<ICurso>): Promise<ICurso> {
    const data = await this.request<ICurso>(this.url(`/${id}`), {
      method: 'PATCH',
      body: JSON.stringify(CursoService.paraApi(item)),
    });
    return CursoService.deApi(data);
  }

  async deletar(id: string): Promise<void> {
    await this.request<void>(this.url(`/${id}`), { method: 'DELETE' });
  }
}
