import { type IProgresso } from '../models/progresso.model';
import { ApiService } from './api.service';

const RECURSO = 'progresso_aulas';

/**
 * ProgressoService — Gerencia o progresso de aulas dos usuários via API (json-server).
 * Os dados são persistidos no db.json.
 */
export class ProgressoService extends ApiService {
  private url(caminho = '') {
    return ApiService.buildUrl(RECURSO, caminho);
  }

  async listar(): Promise<IProgresso[]> {
    const data = await this.request<IProgresso[]>(this.url());
    return data.map(p => ({ ...p, id: String(p.id) }));
  }

  async listarPorUsuario(idUsuario: string): Promise<IProgresso[]> {
    const data = await this.request<IProgresso[]>(this.url(`?ID_Usuario=${idUsuario}`));
    return data.map(p => ({ ...p, id: String(p.id) }));
  }

  async criar(item: Omit<IProgresso, 'id'>): Promise<IProgresso> {
    const data = await this.request<IProgresso>(this.url(), {
      method: 'POST',
      body: JSON.stringify(item),
    });
    return { ...data, id: String(data.id) };
  }

  async deletar(id: string): Promise<void> {
    await this.request<void>(this.url(`/${id}`), { method: 'DELETE' });
  }

  async deletarPorUsuarioEAula(idUsuario: string, idAula: string): Promise<void> {
    const items = await this.listar();
    const found = items.find(
      i => String(i.ID_Usuario) === String(idUsuario) && String(i.ID_Aula) === String(idAula)
    );
    if (found && found.id) {
      await this.deletar(found.id);
    }
  }
}
