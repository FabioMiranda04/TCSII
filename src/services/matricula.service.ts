import { type IMatricula } from '../models/matricula.model';
import { ApiService } from './api.service';

const RECURSO = 'matriculas';

/**
 * MatriculaService — Gerencia operações CRUD de matrículas via API (json-server).
 * Os dados são persistidos no db.json.
 */
export class MatriculaService extends ApiService {
  private url(caminho = '') {
    return ApiService.buildUrl(RECURSO, caminho);
  }

  async listar(): Promise<IMatricula[]> {
    const data = await this.request<IMatricula[]>(this.url());
    return data.map(m => ({ ...m, ID_Matricula: String(m.ID_Matricula) }));
  }

  async buscarPorId(id: string): Promise<IMatricula> {
    const item = await this.request<IMatricula>(this.url(`/${id}`));
    return { ...item, ID_Matricula: String(item.ID_Matricula) };
  }

  async listarPorUsuario(idUsuario: string): Promise<IMatricula[]> {
    const data = await this.request<IMatricula[]>(this.url(`?ID_Usuario=${idUsuario}`));
    return data.map(m => ({ ...m, ID_Matricula: String(m.ID_Matricula) }));
  }

  async criar(item: Omit<IMatricula, 'ID_Matricula'>): Promise<IMatricula> {
    const data = await this.request<IMatricula>(this.url(), {
      method: 'POST',
      body: JSON.stringify(item),
    });
    return { ...data, ID_Matricula: String(data.ID_Matricula) };
  }

  async atualizar(id: string, item: Partial<IMatricula>): Promise<IMatricula> {
    const data = await this.request<IMatricula>(this.url(`/${id}`), {
      method: 'PUT',
      body: JSON.stringify(item),
    });
    return { ...data, ID_Matricula: String(data.ID_Matricula) };
  }

  async deletar(id: string): Promise<void> {
    await this.request<void>(this.url(`/${id}`), { method: 'DELETE' });
  }
}
