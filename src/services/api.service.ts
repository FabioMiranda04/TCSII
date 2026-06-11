/**
 * ApiService — Classe base genérica para comunicação com a API (json-server).
 * Todos os services de domínio devem herdar desta classe.
 *
 * A URL base da API é configurada via variável de ambiente VITE_API_URL no arquivo .env.
 * Exemplo: VITE_API_URL=http://localhost:4000
 */

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export abstract class ApiService {
  /**
   * Realiza uma requisição HTTP para a API.
   * @param url - URL completa do endpoint
   * @param options - Opções da requisição (method, body, headers, etc.)
   * @returns Promise com o corpo da resposta parseado como JSON
   */
  protected async request<T>(url: string, options: RequestInit = {}): Promise<T> {
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    const response = await fetch(url, config);

    if (!response.ok) {
      throw new Error(`Erro na API: ${response.status} ${response.statusText} — ${url}`);
    }

    // HTTP 204 No Content: retorna objeto vazio
    if (response.status === 204) {
      return {} as T;
    }

    return response.json() as Promise<T>;
  }

  /**
   * Constrói a URL completa para um recurso da API.
   * @param recurso - Nome do recurso (ex: 'cursos', 'usuarios')
   * @param caminho - Caminho adicional opcional (ex: '/101' ou '?ID_Curso=101')
   */
  protected static buildUrl(recurso: string, caminho = ''): string {
    return `${BASE_URL}/${recurso}${caminho}`;
  }
}
