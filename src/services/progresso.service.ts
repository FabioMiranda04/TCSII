import { type IProgresso } from "../models/progresso.model";

const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:4000') + '/progresso_aulas';
const LOCAL_STORAGE_KEY = 'mega_cursos_progresso_db';

const SEED_PROGRESSO: IProgresso[] = [
  {
    id: "1",
    ID_Usuario: "1",
    ID_Aula: "a1",
    DataConclusao: "16/02/2026",
    Status: "Concluído"
  }
];

export class ProgressoService {
  private static getLocalStorageData(): IProgresso[] {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!data) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(SEED_PROGRESSO));
      return SEED_PROGRESSO;
    }
    try {
      return JSON.parse(data).map((p: any) => ({ ...p, id: String(p.id) }));
    } catch {
      return SEED_PROGRESSO;
    }
  }

  private static setLocalStorageData(items: IProgresso[]): void {
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

  async listar(): Promise<IProgresso[]> {
    try {
      const data = await this.request<IProgresso[]>('');
      return data.map(p => ({ ...p, id: String(p.id) }));
    } catch {
      return ProgressoService.getLocalStorageData();
    }
  }

  async listarPorUsuario(idUsuario: string): Promise<IProgresso[]> {
    try {
      // Let's filter client-side or server query
      const data = await this.request<IProgresso[]>(`?ID_Usuario=${idUsuario}`);
      return data.map(p => ({ ...p, id: String(p.id) }));
    } catch {
      const items = ProgressoService.getLocalStorageData();
      return items.filter(i => String(i.ID_Usuario) === String(idUsuario));
    }
  }

  async criar(item: Omit<IProgresso, 'id'>): Promise<IProgresso> {
    try {
      const data = await this.request<IProgresso>('', {
        method: 'POST',
        body: JSON.stringify(item)
      });
      return { ...data, id: String(data.id) };
    } catch {
      const items = ProgressoService.getLocalStorageData();
      const newId = (items.reduce((max, i) => Math.max(max, parseInt(i.id || '0')), 0) + 1).toString();
      const newItem: IProgresso = { ...item, id: newId };
      items.push(newItem);
      ProgressoService.setLocalStorageData(items);
      return newItem;
    }
  }

  async deletar(id: string): Promise<void> {
    try {
      await this.request<void>(`/${id}`, { method: 'DELETE' });
    } catch {
      const items = ProgressoService.getLocalStorageData();
      const filtered = items.filter(i => String(i.id) !== String(id));
      ProgressoService.setLocalStorageData(filtered);
    }
  }

  async deletarPorUsuarioEAula(idUsuario: string, idAula: string): Promise<void> {
    try {
      // Find the item first
      const items = await this.listar();
      const found = items.find(i => String(i.ID_Usuario) === String(idUsuario) && String(i.ID_Aula) === String(idAula));
      if (found && found.id) {
        await this.deletar(found.id);
      }
    } catch {
      const items = ProgressoService.getLocalStorageData();
      const filtered = items.filter(i => !(String(i.ID_Usuario) === String(idUsuario) && String(i.ID_Aula) === String(idAula)));
      ProgressoService.setLocalStorageData(filtered);
    }
  }
}
