import { type IModulo } from '../models/modulo.model';
import { ApiService } from './api.service';

const RECURSO = 'modulos';

/**
 * ModuloService — CRUD de módulos via API NestJS (/modulos).
 * O backend já devolve os módulos ordenados por Ordem.
 */
export class ModuloService extends ApiService {
  private url(caminho = '') {
    return ApiService.buildUrl(RECURSO, caminho);
  }

  private static normalizar(m: IModulo): IModulo {
    const { ID_Modulo, ID_Curso, Titulo, Ordem } = ApiService.idsParaString(m);
    return { ID_Modulo, ID_Curso, Titulo, Ordem: Number(Ordem) };
  }

  private static paraApi(item: Partial<IModulo>) {
    const body: Record<string, unknown> = {};
    if (item.ID_Curso !== undefined) body.ID_Curso = Number(item.ID_Curso);
    if (item.Titulo !== undefined) body.Titulo = item.Titulo;
    if (item.Ordem !== undefined) body.Ordem = Number(item.Ordem);
    return body;
  }

  async listar(): Promise<IModulo[]> {
    const data = await this.request<IModulo[]>(this.url());
    return data.map(ModuloService.normalizar);
  }

  async buscarPorId(id: string): Promise<IModulo> {
    return ModuloService.normalizar(await this.request<IModulo>(this.url(`/${id}`)));
  }

  async listarPorCurso(idCurso: string): Promise<IModulo[]> {
    const data = await this.request<IModulo[]>(this.url(`?ID_Curso=${encodeURIComponent(idCurso)}`));
    return data.map(ModuloService.normalizar);
  }

  async criar(item: Omit<IModulo, 'ID_Modulo'>): Promise<IModulo> {
    const data = await this.request<IModulo>(this.url(), {
      method: 'POST',
      body: JSON.stringify(ModuloService.paraApi(item)),
    });
    return ModuloService.normalizar(data);
  }

  async atualizar(id: string, item: Partial<IModulo>): Promise<IModulo> {
    const data = await this.request<IModulo>(this.url(`/${id}`), {
      method: 'PATCH',
      body: JSON.stringify(ModuloService.paraApi(item)),
    });
    return ModuloService.normalizar(data);
  }

  async deletar(id: string): Promise<void> {
    await this.request<void>(this.url(`/${id}`), { method: 'DELETE' });
  }
}
