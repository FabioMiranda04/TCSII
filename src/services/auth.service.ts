import { ApiService, tokenStorage } from './api.service';

/** Payload do JWT emitido pelo backend: { sub: ID_Usuario, email } */
export interface IUsuarioLogado { ID_Usuario: string; Email: string; }

export class AuthService extends ApiService {
  async login(email: string, password: string): Promise<void> {
    const { access_token } = await this.request<{ access_token: string }>(
      ApiService.buildUrl('auth', '/login'),
      { method: 'POST', body: JSON.stringify({ email, password }) },
    );
    tokenStorage.set(access_token);
  }

  logout() {
    tokenStorage.clear();
  }

  /** Decodifica o token salvo; null se ausente ou expirado. */
  static usuarioLogado(): IUsuarioLogado | null {
    const token = tokenStorage.get();
    if (!token) return null;
    try {
      const p = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
      if (p.exp * 1000 < Date.now()) return null;
      return { ID_Usuario: String(p.sub), Email: p.email };
    } catch {
      return null;
    }
  }
}
