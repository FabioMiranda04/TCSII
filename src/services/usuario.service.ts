import { type IUsuario } from '../models/usuario.model';
import { ApiService } from './api.service';

const RECURSO = 'usuarios';

/**
 * UsuariosService — CRUD de usuários na API NestJS (/usuarios).
 * IDs numéricos no backend são convertidos para string no front.
 * A resposta nunca traz SenhaHash; o backend gera DataCadastro e faz o hash da senha.
 */
export class UsuariosService extends ApiService {
  private url(caminho = '') {
    return ApiService.buildUrl(RECURSO, caminho);
  }

  /** Apenas os campos aceitos pelo DTO do backend; ignora SenhaHash vazio. */
  private static payload(u: Partial<IUsuario>) {
    const body: Record<string, unknown> = {};
    if (u.NomeCompleto !== undefined) body.NomeCompleto = u.NomeCompleto;
    if (u.Email !== undefined) body.Email = u.Email;
    if (u.SenhaHash) body.SenhaHash = u.SenhaHash;
    return body;
  }

  private static mapear(u: IUsuario): IUsuario {
    return ApiService.idsParaString(u);
  }

  /**
   * ID_Plano não existe no backend: é derivado da assinatura vigente (DataFim >= hoje),
   * para as páginas que liberam conteúdo por plano continuarem funcionando.
   */
  private async planosVigentes(): Promise<Map<string, string>> {
    type Ass = { ID_Usuario: number; ID_Plano: number; DataFim: string };
    const mapa = new Map<string, string>();
    try {
      const assinaturas = await this.request<Ass[]>(ApiService.buildUrl('assinaturas'));
      for (const a of assinaturas) {
        if (new Date(a.DataFim).getTime() >= Date.now()) mapa.set(String(a.ID_Usuario), String(a.ID_Plano));
      }
    } catch { /* sem assinaturas acessíveis: ninguém tem plano */ }
    return mapa;
  }

  async listar(): Promise<IUsuario[]> {
    const [data, planos] = await Promise.all([this.request<IUsuario[]>(this.url()), this.planosVigentes()]);
    return data.map(u => {
      const m = UsuariosService.mapear(u);
      return { ...m, ID_Plano: planos.get(m.ID_Usuario!) };
    });
  }

  async buscarPorId(id: string): Promise<IUsuario> {
    const [data, planos] = await Promise.all([this.request<IUsuario>(this.url(`/${id}`)), this.planosVigentes()]);
    const m = UsuariosService.mapear(data);
    return { ...m, ID_Plano: planos.get(m.ID_Usuario!) };
  }

  async criar(usuario: Omit<IUsuario, 'ID_Usuario'>): Promise<IUsuario> {
    const data = await this.request<IUsuario>(this.url(), {
      method: 'POST',
      body: JSON.stringify(UsuariosService.payload(usuario)),
    });
    return UsuariosService.mapear(data);
  }

  async atualizar(id: string, usuario: Partial<IUsuario>): Promise<IUsuario> {
    const data = await this.request<IUsuario>(this.url(`/${id}`), {
      method: 'PATCH',
      body: JSON.stringify(UsuariosService.payload(usuario)),
    });
    return UsuariosService.mapear(data);
  }

  async deletar(id: string): Promise<void> {
    await this.request<void>(this.url(`/${id}`), { method: 'DELETE' });
  }
}
