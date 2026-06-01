import { type ICategoria } from "../models/categoria.model";

const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:4000') + '/categorias';
const LOCAL_STORAGE_KEY = 'mega_cursos_categorias_db';

const SEED_CATEGORIAS: ICategoria[] = [
  {
    ID_Categoria: "cat1",
    Nome: "Desenvolvimento Web",
    Descricao: "Aprenda a criar páginas interativas e aplicações web completas de ponta a ponta."
  },
  {
    ID_Categoria: "cat2",
    Nome: "Design & UI/UX",
    Descricao: "Conceitos de experiência de usuário, interfaces de usuário, Figma e wireframes."
  },
  {
    ID_Categoria: "cat3",
    Nome: "Mobile Development",
    Descricao: "Construção de aplicativos móveis nativos e híbridos para Android e iOS."
  }
];

export class CategoriaService {
  private static getLocalStorageData(): ICategoria[] {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!data) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(SEED_CATEGORIAS));
      return SEED_CATEGORIAS;
    }
    try {
      return JSON.parse(data).map((c: any) => ({ ...c, ID_Categoria: String(c.ID_Categoria) }));
    } catch {
      return SEED_CATEGORIAS;
    }
  }

  private static setLocalStorageData(items: ICategoria[]): void {
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

  async listar(): Promise<ICategoria[]> {
    try {
      const data = await this.request<ICategoria[]>('');
      return data.map(c => ({ ...c, ID_Categoria: String(c.ID_Categoria) }));
    } catch {
      return CategoriaService.getLocalStorageData();
    }
  }

  async buscarPorId(id: string): Promise<ICategoria> {
    try {
      const item = await this.request<ICategoria>(`/${id}`);
      return { ...item, ID_Categoria: String(item.ID_Categoria) };
    } catch {
      const items = CategoriaService.getLocalStorageData();
      const found = items.find(i => String(i.ID_Categoria) === String(id));
      if (!found) throw new Error('Categoria não encontrada');
      return found;
    }
  }

  async criar(item: Omit<ICategoria, 'ID_Categoria'>): Promise<ICategoria> {
    try {
      const data = await this.request<ICategoria>('', {
        method: 'POST',
        body: JSON.stringify(item)
      });
      return { ...data, ID_Categoria: String(data.ID_Categoria) };
    } catch {
      const items = CategoriaService.getLocalStorageData();
      const newId = 'cat' + (items.reduce((max, i) => Math.max(max, parseInt(i.ID_Categoria?.replace('cat', '') || '0')), 0) + 1).toString();
      const newItem: ICategoria = { ...item, ID_Categoria: newId };
      items.push(newItem);
      CategoriaService.setLocalStorageData(items);
      return newItem;
    }
  }

  async atualizar(id: string, item: Partial<ICategoria>): Promise<ICategoria> {
    try {
      const data = await this.request<ICategoria>(`/${id}`, {
        method: 'PUT',
        body: JSON.stringify(item)
      });
      return { ...data, ID_Categoria: String(data.ID_Categoria) };
    } catch {
      const items = CategoriaService.getLocalStorageData();
      const idx = items.findIndex(i => String(i.ID_Categoria) === String(id));
      if (idx === -1) throw new Error('Categoria não encontrada');
      const updated = { ...items[idx], ...item };
      items[idx] = updated;
      CategoriaService.setLocalStorageData(items);
      return updated;
    }
  }

  async deletar(id: string): Promise<void> {
    try {
      await this.request<void>(`/${id}`, { method: 'DELETE' });
    } catch {
      const items = CategoriaService.getLocalStorageData();
      const filtered = items.filter(i => String(i.ID_Categoria) !== String(id));
      CategoriaService.setLocalStorageData(filtered);
    }
  }
}
