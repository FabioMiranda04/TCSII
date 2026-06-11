import { type IUsuario } from '../models/usuario.model';
import { ApiService } from './api.service';

const RECURSO = 'usuarios';

/**
 * UsuariosService — Gerencia operações CRUD de usuários via API (json-server).
 * Os dados são persistidos no db.json.
 */
export class UsuariosService extends ApiService {
  private url(caminho = '') {
    return ApiService.buildUrl(RECURSO, caminho);
  }

  async listar(): Promise<IUsuario[]> {
    const data = await this.request<IUsuario[]>(this.url());
    return data.map(u => ({ ...u, ID_Usuario: String(u.ID_Usuario || (u as any).id) }));
  }

  async buscarPorId(id: string): Promise<IUsuario> {
    const data = await this.request<IUsuario>(this.url(`/${id}`));
    return { ...data, ID_Usuario: String(data.ID_Usuario || (data as any).id) };
  }

  async criar(usuario: Omit<IUsuario, 'ID_Usuario'>): Promise<IUsuario> {
    const data = await this.request<IUsuario>(this.url(), {
      method: 'POST',
      body: JSON.stringify(usuario),
    });
    return { ...data, ID_Usuario: String(data.ID_Usuario || (data as any).id) };
  }

  async atualizar(id: string, usuario: Partial<IUsuario>): Promise<IUsuario> {
    const data = await this.request<IUsuario>(this.url(`/${id}`), {
      method: 'PUT',
      body: JSON.stringify({ ...usuario, id }),
    });
    return { ...data, ID_Usuario: String(data.ID_Usuario || (data as any).id) };
  }

  async deletar(id: string): Promise<void> {
    await this.request<void>(this.url(`/${id}`), { method: 'DELETE' });
  }
}
