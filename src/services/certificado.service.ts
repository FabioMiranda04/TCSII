import { type ICertificado } from "../models/certificado.model";

const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:4000') + '/certificados';
const LOCAL_STORAGE_KEY = 'mega_cursos_certificados_db';

const SEED_CERTIFICADOS: ICertificado[] = [];

export class CertificadoService {
  private static getLocalStorageData(): ICertificado[] {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!data) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(SEED_CERTIFICADOS));
      return SEED_CERTIFICADOS;
    }
    try {
      return JSON.parse(data).map((c: any) => ({ ...c, ID_Certificado: String(c.ID_Certificado || c.id) }));
    } catch {
      return SEED_CERTIFICADOS;
    }
  }

  private static setLocalStorageData(items: ICertificado[]): void {
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

  async listar(): Promise<ICertificado[]> {
    try {
      const data = await this.request<ICertificado[]>('');
      return data.map(c => ({ ...c, ID_Certificado: String(c.ID_Certificado || (c as any).id) }));
    } catch {
      return CertificadoService.getLocalStorageData();
    }
  }

  async buscarPorId(id: string): Promise<ICertificado> {
    try {
      const item = await this.request<ICertificado>(`/${id}`);
      return { ...item, ID_Certificado: String(item.ID_Certificado || (item as any).id) };
    } catch {
      const items = CertificadoService.getLocalStorageData();
      const found = items.find(i => String(i.ID_Certificado) === String(id));
      if (!found) throw new Error('Certificado não encontrado');
      return found;
    }
  }

  async listarPorUsuario(idUsuario: string): Promise<ICertificado[]> {
    try {
      const data = await this.request<ICertificado[]>(`?ID_Usuario=${idUsuario}`);
      return data.map(c => ({ ...c, ID_Certificado: String(c.ID_Certificado || (c as any).id) }));
    } catch {
      const items = CertificadoService.getLocalStorageData();
      return items.filter(i => String(i.ID_Usuario) === String(idUsuario));
    }
  }

  async criar(item: Omit<ICertificado, 'ID_Certificado'>): Promise<ICertificado> {
    try {
      const data = await this.request<ICertificado>('', {
        method: 'POST',
        body: JSON.stringify(item)
      });
      return { ...data, ID_Certificado: String(data.ID_Certificado || (data as any).id) };
    } catch {
      const items = CertificadoService.getLocalStorageData();
      const newId = 'c' + (items.reduce((max, i) => Math.max(max, parseInt(i.ID_Certificado?.replace('c', '') || '0')), 0) + 1).toString();
      const newItem: ICertificado = { ...item, ID_Certificado: newId };
      items.push(newItem);
      CertificadoService.setLocalStorageData(items);
      return newItem;
    }
  }

  async atualizar(id: string, item: Partial<ICertificado>): Promise<ICertificado> {
    try {
      const data = await this.request<ICertificado>(`/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ ...item, id })
      });
      return { ...data, ID_Certificado: String(data.ID_Certificado || (data as any).id) };
    } catch {
      const items = CertificadoService.getLocalStorageData();
      const idx = items.findIndex(i => String(i.ID_Certificado) === String(id));
      if (idx === -1) throw new Error('Certificado não encontrado');
      const updated = { ...items[idx], ...item };
      items[idx] = updated;
      CertificadoService.setLocalStorageData(items);
      return updated;
    }
  }

  async deletar(id: string): Promise<void> {
    try {
      await this.request<void>(`/${id}`, { method: 'DELETE' });
    } catch {
      const items = CertificadoService.getLocalStorageData();
      const filtered = items.filter(i => String(i.ID_Certificado) !== String(id));
      CertificadoService.setLocalStorageData(filtered);
    }
  }
}
