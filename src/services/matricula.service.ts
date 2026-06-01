import { type IMatricula } from "../models/matricula.model";

const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:4000') + '/matriculas';
const LOCAL_STORAGE_KEY = 'mega_cursos_matriculas_db';

const SEED_MATRICULAS: IMatricula[] = [
  {
    ID_Matricula: "mat1",
    ID_Usuario: "1",
    ID_Curso: "101",
    DataMatricula: "15/02/2026",
    DataConclusao: null
  }
];

export class MatriculaService {
  private static getLocalStorageData(): IMatricula[] {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!data) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(SEED_MATRICULAS));
      return SEED_MATRICULAS;
    }
    try {
      return JSON.parse(data).map((m: any) => ({ ...m, ID_Matricula: String(m.ID_Matricula) }));
    } catch {
      return SEED_MATRICULAS;
    }
  }

  private static setLocalStorageData(items: IMatricula[]): void {
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

  async listar(): Promise<IMatricula[]> {
    try {
      const data = await this.request<IMatricula[]>('');
      return data.map(m => ({ ...m, ID_Matricula: String(m.ID_Matricula) }));
    } catch {
      return MatriculaService.getLocalStorageData();
    }
  }

  async buscarPorId(id: string): Promise<IMatricula> {
    try {
      const item = await this.request<IMatricula>(`/${id}`);
      return { ...item, ID_Matricula: String(item.ID_Matricula) };
    } catch {
      const items = MatriculaService.getLocalStorageData();
      const found = items.find(i => String(i.ID_Matricula) === String(id));
      if (!found) throw new Error('Matrícula não encontrada');
      return found;
    }
  }

  async criar(item: Omit<IMatricula, 'ID_Matricula'>): Promise<IMatricula> {
    try {
      const data = await this.request<IMatricula>('', {
        method: 'POST',
        body: JSON.stringify(item)
      });
      return { ...data, ID_Matricula: String(data.ID_Matricula) };
    } catch {
      const items = MatriculaService.getLocalStorageData();
      const newId = 'mat' + (items.reduce((max, i) => Math.max(max, parseInt(i.ID_Matricula?.replace('mat', '') || '0')), 0) + 1).toString();
      const newItem: IMatricula = { ...item, ID_Matricula: newId };
      items.push(newItem);
      MatriculaService.setLocalStorageData(items);
      return newItem;
    }
  }

  async atualizar(id: string, item: Partial<IMatricula>): Promise<IMatricula> {
    try {
      const data = await this.request<IMatricula>(`/${id}`, {
        method: 'PUT',
        body: JSON.stringify(item)
      });
      return { ...data, ID_Matricula: String(data.ID_Matricula) };
    } catch {
      const items = MatriculaService.getLocalStorageData();
      const idx = items.findIndex(i => String(i.ID_Matricula) === String(id));
      if (idx === -1) throw new Error('Matrícula não encontrada');
      const updated = { ...items[idx], ...item };
      items[idx] = updated;
      MatriculaService.setLocalStorageData(items);
      return updated;
    }
  }

  async deletar(id: string): Promise<void> {
    try {
      await this.request<void>(`/${id}`, { method: 'DELETE' });
    } catch {
      const items = MatriculaService.getLocalStorageData();
      const filtered = items.filter(i => String(i.ID_Matricula) !== String(id));
      MatriculaService.setLocalStorageData(filtered);
    }
  }
}
