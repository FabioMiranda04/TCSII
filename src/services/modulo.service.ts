import { type IModulo } from "../models/modulo.model";

const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:4000') + '/modulos';
const LOCAL_STORAGE_KEY = 'mega_cursos_modulos_db';

const SEED_MODULOS: IModulo[] = [
  { ID_Modulo: 'm1', ID_Curso: '101', Titulo: 'Introdução ao React & JSX', Ordem: 1 },
  { ID_Modulo: 'm2', ID_Curso: '101', Titulo: 'Estado & Hooks', Ordem: 2 },
  { ID_Modulo: 'm3', ID_Curso: '102', Titulo: 'Tipagem Estática Básica', Ordem: 1 }
];

export class ModuloService {
  private static getLocalStorageData(): IModulo[] {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!data) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(SEED_MODULOS));
      return SEED_MODULOS;
    }
    try {
      return JSON.parse(data).map((m: any) => ({ ...m, ID_Modulo: String(m.ID_Modulo || m.id) }));
    } catch {
      return SEED_MODULOS;
    }
  }

  private static setLocalStorageData(items: IModulo[]): void {
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

  async listar(): Promise<IModulo[]> {
    try {
      const data = await this.request<IModulo[]>('');
      return data.map(m => ({ ...m, ID_Modulo: String(m.ID_Modulo || (m as any).id) }));
    } catch {
      return ModuloService.getLocalStorageData();
    }
  }

  async buscarPorId(id: string): Promise<IModulo> {
    try {
      const item = await this.request<IModulo>(`/${id}`);
      return { ...item, ID_Modulo: String(item.ID_Modulo || (item as any).id) };
    } catch {
      const items = ModuloService.getLocalStorageData();
      const found = items.find(i => String(i.ID_Modulo) === String(id));
      if (!found) throw new Error('Módulo não encontrado');
      return found;
    }
  }

  async criar(item: Omit<IModulo, 'ID_Modulo'>): Promise<IModulo> {
    try {
      const data = await this.request<IModulo>('', {
        method: 'POST',
        body: JSON.stringify(item)
      });
      return { ...data, ID_Modulo: String(data.ID_Modulo || (data as any).id) };
    } catch {
      const items = ModuloService.getLocalStorageData();
      const newId = 'm' + (items.reduce((max, i) => Math.max(max, parseInt(i.ID_Modulo?.replace('m', '') || '0')), 0) + 1).toString();
      const newItem: IModulo = { ...item, ID_Modulo: newId };
      items.push(newItem);
      ModuloService.setLocalStorageData(items);
      return newItem;
    }
  }

  async atualizar(id: string, item: Partial<IModulo>): Promise<IModulo> {
    try {
      const data = await this.request<IModulo>(`/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ ...item, id })
      });
      return { ...data, ID_Modulo: String(data.ID_Modulo || (data as any).id) };
    } catch {
      const items = ModuloService.getLocalStorageData();
      const idx = items.findIndex(i => String(i.ID_Modulo) === String(id));
      if (idx === -1) throw new Error('Módulo não encontrado');
      const updated = { ...items[idx], ...item };
      items[idx] = updated;
      ModuloService.setLocalStorageData(items);
      return updated;
    }
  }

  async deletar(id: string): Promise<void> {
    try {
      await this.request<void>(`/${id}`, { method: 'DELETE' });
    } catch {
      const items = ModuloService.getLocalStorageData();
      const filtered = items.filter(i => String(i.ID_Modulo) !== String(id));
      ModuloService.setLocalStorageData(filtered);
    }
  }
}
