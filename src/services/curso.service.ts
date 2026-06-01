import { type ICurso } from "../models/curso.model";

const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:4000') + '/cursos';
const LOCAL_STORAGE_KEY = 'mega_cursos_cursos_db';

const SEED_CURSOS: ICurso[] = [
  {
    ID_Curso: '101',
    Titulo: 'React.js do Zero ao Avançado',
    Descricao: 'Aprenda hooks, state management, roteamento, consumo de APIs REST, context API e boas práticas no ecossistema React.',
    ID_Instrutor: '3',
    ID_Categoria: 'cat1',
    Nivel: 'Intermediário',
    DataPublicacao: '10/02/2026',
    TotalAulas: 3,
    TotalHoras: 24,
    Imagem: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&auto=format&fit=crop&q=60'
  },
  {
    ID_Curso: '102',
    Titulo: 'TypeScript para Desenvolvedores JS',
    Descricao: 'Entenda os conceitos de tipagem estática, interfaces, generics, decorators e como integrar TS no seu dia a dia React/Node.',
    ID_Instrutor: '3',
    ID_Categoria: 'cat1',
    Nivel: 'Intermediário',
    DataPublicacao: '15/02/2026',
    TotalAulas: 2,
    TotalHoras: 15,
    Imagem: 'https://images.unsplash.com/photo-1516116211223-5c359a36298a?w=600&auto=format&fit=crop&q=60'
  },
  {
    ID_Curso: '103',
    Titulo: 'Fundamentos de HTML5 e CSS3 Moderno',
    Descricao: 'A porta de entrada do desenvolvimento web. Aprenda semântica, Flexbox, CSS Grid, e layouts responsivos mobile-first.',
    ID_Instrutor: '1',
    ID_Categoria: 'cat1',
    Nivel: 'Iniciante',
    DataPublicacao: '18/01/2026',
    TotalAulas: 0,
    TotalHoras: 18,
    Imagem: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=600&auto=format&fit=crop&q=60'
  }
];

export class CursoService {
  private static getLocalStorageData(): ICurso[] {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!data) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(SEED_CURSOS));
      return SEED_CURSOS;
    }
    try {
      return JSON.parse(data).map((c: any) => ({ ...c, ID_Curso: String(c.ID_Curso || c.id) }));
    } catch {
      return SEED_CURSOS;
    }
  }

  private static setLocalStorageData(items: ICurso[]): void {
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

  async listar(): Promise<ICurso[]> {
    try {
      const data = await this.request<ICurso[]>('');
      return data.map(c => ({ ...c, ID_Curso: String(c.ID_Curso || (c as any).id) }));
    } catch {
      return CursoService.getLocalStorageData();
    }
  }

  async buscarPorId(id: string): Promise<ICurso> {
    try {
      const item = await this.request<ICurso>(`/${id}`);
      return { ...item, ID_Curso: String(item.ID_Curso || (item as any).id) };
    } catch {
      const items = CursoService.getLocalStorageData();
      const found = items.find(i => String(i.ID_Curso) === String(id));
      if (!found) throw new Error('Curso não encontrado');
      return found;
    }
  }

  async criar(item: Omit<ICurso, 'ID_Curso'>): Promise<ICurso> {
    try {
      const data = await this.request<ICurso>('', {
        method: 'POST',
        body: JSON.stringify(item)
      });
      return { ...data, ID_Curso: String(data.ID_Curso || (data as any).id) };
    } catch {
      const items = CursoService.getLocalStorageData();
      const newId = (items.reduce((max, i) => Math.max(max, parseInt(i.ID_Curso || '0')), 0) + 1).toString();
      const newItem: ICurso = { ...item, ID_Curso: newId };
      items.push(newItem);
      CursoService.setLocalStorageData(items);
      return newItem;
    }
  }

  async atualizar(id: string, item: Partial<ICurso>): Promise<ICurso> {
    try {
      const data = await this.request<ICurso>(`/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ ...item, id })
      });
      return { ...data, ID_Curso: String(data.ID_Curso || (data as any).id) };
    } catch {
      const items = CursoService.getLocalStorageData();
      const idx = items.findIndex(i => String(i.ID_Curso) === String(id));
      if (idx === -1) throw new Error('Curso não encontrado');
      const updated = { ...items[idx], ...item };
      items[idx] = updated;
      CursoService.setLocalStorageData(items);
      return updated;
    }
  }

  async deletar(id: string): Promise<void> {
    try {
      await this.request<void>(`/${id}`, { method: 'DELETE' });
    } catch {
      const items = CursoService.getLocalStorageData();
      const filtered = items.filter(i => String(i.ID_Curso) !== String(id));
      CursoService.setLocalStorageData(filtered);
    }
  }
}
