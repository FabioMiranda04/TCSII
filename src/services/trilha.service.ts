import { type ITrilha } from '../models/trilha.model';
import { type ITrilhaCurso } from '../models/trilhaCurso.model';
import { ApiService } from './api.service';

const RECURSO = 'trilhas';
const RECURSO_TC = 'trilhas-cursos';

const GRADIENTS = [
  'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
  'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
  'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
  'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
  'linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)',
  'linear-gradient(135deg, #111827 0%, #1f2937 100%)',
];
const ICONS = ['bi-compass', 'bi-window-sidebar', 'bi-hdd-network', 'bi-palette', 'bi-phone', 'bi-journal-bookmark-fill', 'bi-star-fill'];

/**
 * TrilhaService — CRUD de trilhas na API NestJS (/trilhas) e associação
 * trilha/curso (/trilhas-cursos, chave composta ID_Trilha + ID_Curso).
 * O backend persiste apenas Titulo, Descricao e ID_Categoria; os campos
 * visuais (gradient, icon, cursosCount) são derivados no front.
 */
export class TrilhaService extends ApiService {
  private url(caminho = '') {
    return ApiService.buildUrl(RECURSO, caminho);
  }

  private urlTc(caminho = '') {
    return ApiService.buildUrl(RECURSO_TC, caminho);
  }

  /** Converte a resposta da API para o model do front, derivando campos visuais. */
  private mapear(t: ITrilha, cursosCount?: number): ITrilha {
    const base = ApiService.idsParaString(t);
    const n = Number(base.ID_Trilha) || 0;
    return {
      ID_Trilha: base.ID_Trilha,
      Titulo: base.Titulo,
      Descricao: base.Descricao ?? '',
      ID_Categoria: base.ID_Categoria,
      cursosCount,
      gradient: GRADIENTS[n % GRADIENTS.length],
      icon: ICONS[n % ICONS.length],
    };
  }

  /** Apenas os campos aceitos pelo backend. */
  private payload(item: Partial<ITrilha>) {
    const body: Record<string, unknown> = {};
    if (item.Titulo !== undefined) body.Titulo = item.Titulo;
    if (item.Descricao !== undefined) body.Descricao = item.Descricao;
    if (item.ID_Categoria !== undefined) body.ID_Categoria = Number(item.ID_Categoria);
    return JSON.stringify(body);
  }

  async listar(idCategoria?: string): Promise<ITrilha[]> {
    const q = idCategoria ? `?ID_Categoria=${encodeURIComponent(idCategoria)}` : '';
    const [data, assoc] = await Promise.all([
      this.request<ITrilha[]>(this.url(q)),
      this.listarCursos().catch(() => [] as ITrilhaCurso[]),
    ]);
    const counts = new Map<string, number>();
    assoc.forEach(a => counts.set(a.ID_Trilha, (counts.get(a.ID_Trilha) ?? 0) + 1));
    return data.map(t => this.mapear(t, counts.get(String(t.ID_Trilha)) ?? 0));
  }

  async buscarPorId(id: string): Promise<ITrilha> {
    const [item, cursos] = await Promise.all([
      this.request<ITrilha>(this.url(`/${id}`)),
      this.listarCursos(id).catch(() => [] as ITrilhaCurso[]),
    ]);
    return this.mapear(item, cursos.length);
  }

  async criar(item: Omit<ITrilha, 'ID_Trilha'>): Promise<ITrilha> {
    const data = await this.request<ITrilha>(this.url(), { method: 'POST', body: this.payload(item) });
    return this.mapear(data, 0);
  }

  async atualizar(id: string, item: Partial<ITrilha>): Promise<ITrilha> {
    const data = await this.request<ITrilha>(this.url(`/${id}`), { method: 'PATCH', body: this.payload(item) });
    return this.mapear(data, item.cursosCount);
  }

  async deletar(id: string): Promise<void> {
    await this.request<void>(this.url(`/${id}`), { method: 'DELETE' });
  }

  // ---- Trilhas x Cursos ----

  /** Lista associações (de uma trilha, se informada), ordenadas por Ordem. */
  async listarCursos(idTrilha?: string): Promise<ITrilhaCurso[]> {
    const q = idTrilha ? `?ID_Trilha=${encodeURIComponent(idTrilha)}` : '';
    const data = await this.request<ITrilhaCurso[]>(this.urlTc(q));
    return data.map(a => {
      const s = ApiService.idsParaString(a);
      return { ID_Trilha: s.ID_Trilha, ID_Curso: s.ID_Curso, Ordem: s.Ordem };
    });
  }

  async adicionarCurso(idTrilha: string, idCurso: string, ordem: number): Promise<ITrilhaCurso> {
    const data = await this.request<ITrilhaCurso>(this.urlTc(), {
      method: 'POST',
      body: JSON.stringify({ ID_Trilha: Number(idTrilha), ID_Curso: Number(idCurso), Ordem: ordem }),
    });
    return ApiService.idsParaString(data);
  }

  async atualizarOrdemCurso(idTrilha: string, idCurso: string, ordem: number): Promise<ITrilhaCurso> {
    const data = await this.request<ITrilhaCurso>(this.urlTc(`/${idTrilha}/${idCurso}`), {
      method: 'PATCH',
      body: JSON.stringify({ Ordem: ordem }),
    });
    return ApiService.idsParaString(data);
  }

  async removerCurso(idTrilha: string, idCurso: string): Promise<void> {
    await this.request<void>(this.urlTc(`/${idTrilha}/${idCurso}`), { method: 'DELETE' });
  }
}
