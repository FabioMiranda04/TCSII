/**
 * ApiService — Classe base genérica para comunicação com a API NestJS (backend/).
 * Todos os services de domínio devem herdar desta classe.
 *
 * A URL base da API é configurada via variável de ambiente VITE_API_URL no arquivo .env.
 * Exemplo: VITE_API_URL=http://localhost:3000
 *
 * Contrato com o backend:
 * - IDs chegam como number; o front trabalha com string -> use ApiService.idsParaString / Number(id).
 * - Datas vão em ISO (use ApiService.paraIso) e chegam em ISO (use ApiService.formatarData para exibir).
 * - Atualizações usam PATCH (o backend não tem PUT).
 * - Rotas protegidas recebem o token JWT automaticamente (salvo no login).
 */

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const TOKEN_KEY = 'access_token';

export const tokenStorage = {
  get: () => { try { return localStorage.getItem(TOKEN_KEY); } catch { return null; } },
  set: (t: string) => { try { localStorage.setItem(TOKEN_KEY, t); } catch { /* ignore */ } },
  clear: () => { try { localStorage.removeItem(TOKEN_KEY); } catch { /* ignore */ } },
};

export abstract class ApiService {
  /**
   * Realiza uma requisição HTTP para a API.
   * @param url - URL completa do endpoint
   * @param options - Opções da requisição (method, body, headers, etc.)
   * @returns Promise com o corpo da resposta parseado como JSON
   */
  protected async request<T>(url: string, options: RequestInit = {}): Promise<T> {
    const token = tokenStorage.get();
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    };

    const response = await fetch(url, config);

    if (response.status === 401 && token) {
      // Token expirado/inválido: força novo login
      tokenStorage.clear();
      window.location.assign('/login');
    }

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      const msg = Array.isArray(body?.message) ? body.message.join(', ') : body?.message;
      throw new Error(msg || `Erro na API: ${response.status} ${response.statusText}`);
    }

    const text = await response.text();
    return (text ? JSON.parse(text) : {}) as T;
  }

  /**
   * Constrói a URL completa para um recurso da API.
   * @param recurso - Nome do recurso (ex: 'cursos', 'usuarios')
   * @param caminho - Caminho adicional opcional (ex: '/101' ou '?ID_Curso=101')
   */
  protected static buildUrl(recurso: string, caminho = ''): string {
    return `${BASE_URL}/${recurso}${caminho}`;
  }

  /** Converte todos os campos ID_* (e id) numéricos de um objeto para string. */
  static idsParaString<T>(obj: T): T {
    const out: Record<string, unknown> = { ...(obj as Record<string, unknown>) };
    for (const k of Object.keys(out)) {
      if ((k.startsWith('ID_') || k === 'id') && typeof out[k] === 'number') out[k] = String(out[k]);
    }
    return out as T;
  }

  /** Converte campos ID_* string para number antes de enviar à API (vazio -> null). */
  static idsParaNumero<T>(obj: T): T {
    const out: Record<string, unknown> = { ...(obj as Record<string, unknown>) };
    for (const k of Object.keys(out)) {
      if (k.startsWith('ID_') && typeof out[k] === 'string') out[k] = out[k] === '' ? null : Number(out[k]);
    }
    return out as T;
  }

  /** Aceita "dd/mm/aaaa", "aaaa-mm-dd" ou ISO e devolve ISO (ou undefined se vazio). */
  static paraIso(data?: string | null): string | undefined {
    if (!data) return undefined;
    const br = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(data);
    if (br) return `${br[3]}-${br[2]}-${br[1]}`;
    return data;
  }

  /** Formata ISO para "dd/mm/aaaa" para exibição. */
  static formatarData(iso?: string | null): string {
    if (!iso) return '';
    const d = new Date(iso);
    return isNaN(d.getTime()) ? iso : d.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
  }
}
