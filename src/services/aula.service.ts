import { type IAula } from "../models/aula.model";

const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:4000') + '/aulas';
const LOCAL_STORAGE_KEY = 'mega_cursos_aulas_db';

const SEED_AULAS: IAula[] = [
  { ID_Aula: 'a1', ID_Modulo: 'm1', Titulo: '01. Introdução ao Curso e Configurações', TipoConteudo: 'Vídeo', URL_Conteudo: 'https://www.youtube.com/embed/dQw4w9WgXcQ', DuracaoMinutos: 12, Ordem: 1 },
  { ID_Aula: 'a2', ID_Modulo: 'm1', Titulo: '02. O que é JSX?', TipoConteudo: 'Vídeo', URL_Conteudo: 'https://www.youtube.com/embed/dQw4w9WgXcQ', DuracaoMinutos: 18, Ordem: 2 },
  { ID_Aula: 'a3', ID_Modulo: 'm2', Titulo: '03. O Hook useState', TipoConteudo: 'Vídeo', URL_Conteudo: 'https://www.youtube.com/embed/dQw4w9WgXcQ', DuracaoMinutos: 25, Ordem: 1 },
  { ID_Aula: 'a4', ID_Modulo: 'm3', Titulo: '01. Configuração do compiler TS', TipoConteudo: 'Vídeo', URL_Conteudo: 'https://www.youtube.com/embed/dQw4w9WgXcQ', DuracaoMinutos: 15, Ordem: 1 },
  { ID_Aula: 'a5', ID_Modulo: 'm3', Titulo: '02. Tipagem de Variáveis e Funções', TipoConteudo: 'Vídeo', URL_Conteudo: 'https://www.youtube.com/embed/dQw4w9WgXcQ', DuracaoMinutos: 20, Ordem: 2 }
];

export class AulaService {
  private static getLocalStorageData(): IAula[] {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!data) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(SEED_AULAS));
      return SEED_AULAS;
    }
    try {
      return JSON.parse(data).map((a: any) => ({ ...a, ID_Aula: String(a.ID_Aula || a.id) }));
    } catch {
      return SEED_AULAS;
    }
  }

  private static setLocalStorageData(items: IAula[]): void {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const defaultHeaders = { 'Content-Type': 'application/json' };
    const config: RequestInit = {
      ...options,
      headers: { ...defaultHeaders, ...options.headers },
    };
    const response = await fetch(url, config);
    if (!response.ok) {
      throw new Error(`Erro API (${response.status})`);
    }
    if (response.status === 204) return {} as T;
    return await response.json();
  }

  async listar(): Promise<IAula[]> {
    try {
      const data = await this.request<IAula[]>('');
      return data.map(a => ({ ...a, ID_Aula: String(a.ID_Aula || (a as any).id) }));
    } catch {
      return AulaService.getLocalStorageData();
    }
  }

  async buscarPorId(id: string): Promise<IAula> {
    try {
      const item = await this.request<IAula>(`/${id}`);
      return { ...item, ID_Aula: String(item.ID_Aula || (item as any).id) };
    } catch {
      const items = AulaService.getLocalStorageData();
      const found = items.find(i => String(i.ID_Aula) === String(id));
      if (!found) throw new Error('Aula não encontrada');
      return found;
    }
  }

  async criar(item: Omit<IAula, 'ID_Aula'>): Promise<IAula> {
    try {
      const data = await this.request<IAula>('', {
        method: 'POST',
        body: JSON.stringify(item)
      });
      return { ...data, ID_Aula: String(data.ID_Aula || (data as any).id) };
    } catch {
      const items = AulaService.getLocalStorageData();
      const newId = 'a' + (items.reduce((max, i) => Math.max(max, parseInt(i.ID_Aula?.replace('a', '') || '0')), 0) + 1).toString();
      const newItem: IAula = { ...item, ID_Aula: newId };
      items.push(newItem);
      AulaService.setLocalStorageData(items);
      return newItem;
    }
  }

  async atualizar(id: string, item: Partial<IAula>): Promise<IAula> {
    try {
      const data = await this.request<IAula>(`/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ ...item, id })
      });
      return { ...data, ID_Aula: String(data.ID_Aula || (data as any).id) };
    } catch {
      const items = AulaService.getLocalStorageData();
      const idx = items.findIndex(i => String(i.ID_Aula) === String(id));
      if (idx === -1) throw new Error('Aula não encontrada');
      const updated = { ...items[idx], ...item };
      items[idx] = updated;
      AulaService.setLocalStorageData(items);
      return updated;
    }
  }

  async deletar(id: string): Promise<void> {
    try {
      await this.request<void>(`/${id}`, { method: 'DELETE' });
    } catch {
      const items = AulaService.getLocalStorageData();
      const filtered = items.filter(i => String(i.ID_Aula) !== String(id));
      AulaService.setLocalStorageData(filtered);
    }
  }
}
