import { type ITrilha } from "../models/trilha.model";

const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:4000') + '/trilhas';
const LOCAL_STORAGE_KEY = 'mega_cursos_trilhas_db';

const SEED_TRILHAS: ITrilha[] = [
  {
    ID_Trilha: '1',
    Titulo: 'Desenvolvedor Frontend Fullstack',
    Descricao: 'Domine HTML, CSS, JavaScript, React, TypeScript e as principais ferramentas do mercado.',
    ID_Categoria: 'cat1'
  }
];

export class TrilhaService {
  private static getLocalStorageData(): ITrilha[] {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!data) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(SEED_TRILHAS));
      return SEED_TRILHAS;
    }
    try {
      return JSON.parse(data).map((t: any) => ({ ...t, ID_Trilha: String(t.ID_Trilha || t.id) }));
    } catch {
      return SEED_TRILHAS;
    }
  }

  private static setLocalStorageData(trilhas: ITrilha[]): void {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(trilhas));
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

  async listar(): Promise<ITrilha[]> {
    try {
      const data = await this.request<ITrilha[]>('');
      return data.map(t => ({ ...t, ID_Trilha: String(t.ID_Trilha || (t as any).id) }));
    } catch {
      return TrilhaService.getLocalStorageData();
    }
  }

  async buscarPorId(id: string): Promise<ITrilha> {
    try {
      const item = await this.request<ITrilha>(`/${id}`);
      return { ...item, ID_Trilha: String(item.ID_Trilha || (item as any).id) };
    } catch {
      const items = TrilhaService.getLocalStorageData();
      const found = items.find(i => String(i.ID_Trilha) === String(id));
      if (!found) throw new Error('Trilha não encontrada');
      return found;
    }
  }

  async criar(item: Omit<ITrilha, 'ID_Trilha'>): Promise<ITrilha> {
    try {
      const data = await this.request<ITrilha>('', {
        method: 'POST',
        body: JSON.stringify(item)
      });
      return { ...data, ID_Trilha: String(data.ID_Trilha || (data as any).id) };
    } catch {
      const items = TrilhaService.getLocalStorageData();
      const newId = (items.reduce((max, i) => Math.max(max, parseInt(i.ID_Trilha || '0')), 0) + 1).toString();
      const newItem: ITrilha = { ...item, ID_Trilha: newId };
      items.push(newItem);
      TrilhaService.setLocalStorageData(items);
      return newItem;
    }
  }

  async atualizar(id: string, item: Partial<ITrilha>): Promise<ITrilha> {
    try {
      const data = await this.request<ITrilha>(`/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ ...item, id })
      });
      return { ...data, ID_Trilha: String(data.ID_Trilha || (data as any).id) };
    } catch {
      const items = TrilhaService.getLocalStorageData();
      const idx = items.findIndex(i => String(i.ID_Trilha) === String(id));
      if (idx === -1) throw new Error('Trilha não encontrada');
      const updated = { ...items[idx], ...item };
      items[idx] = updated;
      TrilhaService.setLocalStorageData(items);
      return updated;
    }
  }

  async deletar(id: string): Promise<void> {
    try {
      await this.request<void>(`/${id}`, { method: 'DELETE' });
    } catch {
      const items = TrilhaService.getLocalStorageData();
      const filtered = items.filter(i => String(i.ID_Trilha) !== String(id));
      TrilhaService.setLocalStorageData(filtered);
    }
  }
}
