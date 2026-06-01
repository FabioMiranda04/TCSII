import { type IPlano, type IAssinatura, type IPagamento } from "../models/assinatura.model";

const PLANOS_API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:4000') + '/planos';
const ASSINATURAS_API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:4000') + '/assinaturas';
const PAGAMENTOS_API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:4000') + '/pagamentos';

const SEED_PLANOS: IPlano[] = [
  { ID_Plano: 'p1', Nome: 'Plano Mensal', Descricao: 'Acesso básico por um mês.', Preco: 'R$ 49,90', DuracaoMeses: 1 },
  { ID_Plano: 'p2', Nome: 'Plano Anual PRO', Descricao: 'Acesso ilimitado e prioritário por 1 ano.', Preco: 'R$ 29,90', DuracaoMeses: 12 },
  { ID_Plano: 'p3', Nome: 'Plano Vitalício', Descricao: 'Acesso vitalício à plataforma.', Preco: 'R$ 599,00', DuracaoMeses: 999 }
];

const SEED_ASSINATURAS: IAssinatura[] = [
  { ID_Assinatura: 'as1', ID_Usuario: '1', ID_Plano: 'p2', DataInicio: '01/01/2026', DataFim: '01/01/2027' }
];

const SEED_PAGAMENTOS: IPagamento[] = [
  { ID_Pagamento: 'pag1', ID_Assinatura: 'as1', ValorPago: 'R$ 358,80', DataPagamento: '01/01/2026', MetodoPagamento: 'Cartão de Crédito', Id_Transacao_Gateway: 'tr_991823102', DataFim: '01/01/2027' }
];

export class AssinaturaService {
  
  // Generic Request Helper
  private async request<T>(url: string, options: RequestInit = {}): Promise<T> {
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

  // --- PLANOS ---
  private static getLocalStoragePlanos(): IPlano[] {
    const data = localStorage.getItem('mega_planos_db');
    if (!data) {
      localStorage.setItem('mega_planos_db', JSON.stringify(SEED_PLANOS));
      return SEED_PLANOS;
    }
    try {
      return JSON.parse(data).map((p: any) => ({ ...p, ID_Plano: String(p.ID_Plano || p.id) }));
    } catch {
      return SEED_PLANOS;
    }
  }

  private static setLocalStoragePlanos(items: IPlano[]): void {
    localStorage.setItem('mega_planos_db', JSON.stringify(items));
  }

  async listarPlanos(): Promise<IPlano[]> {
    try {
      const data = await this.request<IPlano[]>(PLANOS_API_URL);
      return data.map(p => ({ ...p, ID_Plano: String(p.ID_Plano || (p as any).id) }));
    } catch {
      return AssinaturaService.getLocalStoragePlanos();
    }
  }

  async criarPlano(item: Omit<IPlano, 'ID_Plano'>): Promise<IPlano> {
    try {
      const data = await this.request<IPlano>(PLANOS_API_URL, {
        method: 'POST',
        body: JSON.stringify(item)
      });
      return { ...data, ID_Plano: String(data.ID_Plano || (data as any).id) };
    } catch {
      const items = AssinaturaService.getLocalStoragePlanos();
      const newId = 'p' + (items.reduce((max, i) => Math.max(max, parseInt(i.ID_Plano?.replace('p', '') || '0')), 0) + 1).toString();
      const newItem: IPlano = { ...item, ID_Plano: newId };
      items.push(newItem);
      AssinaturaService.setLocalStoragePlanos(items);
      return newItem;
    }
  }

  async atualizarPlano(id: string, item: Partial<IPlano>): Promise<IPlano> {
    try {
      const data = await this.request<IPlano>(`${PLANOS_API_URL}/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ ...item, id })
      });
      return { ...data, ID_Plano: String(data.ID_Plano || (data as any).id) };
    } catch {
      const items = AssinaturaService.getLocalStoragePlanos();
      const idx = items.findIndex(i => String(i.ID_Plano) === String(id));
      if (idx === -1) throw new Error('Plano não encontrado');
      const updated = { ...items[idx], ...item };
      items[idx] = updated;
      AssinaturaService.setLocalStoragePlanos(items);
      return updated;
    }
  }

  async deletarPlano(id: string): Promise<void> {
    try {
      await this.request<void>(`${PLANOS_API_URL}/${id}`, { method: 'DELETE' });
    } catch {
      const items = AssinaturaService.getLocalStoragePlanos();
      const filtered = items.filter(i => String(i.ID_Plano) !== String(id));
      AssinaturaService.setLocalStoragePlanos(filtered);
    }
  }

  // --- ASSINATURAS ---
  private static getLocalStorageAssinaturas(): IAssinatura[] {
    const data = localStorage.getItem('mega_assinaturas_db');
    if (!data) {
      localStorage.setItem('mega_assinaturas_db', JSON.stringify(SEED_ASSINATURAS));
      return SEED_ASSINATURAS;
    }
    try {
      return JSON.parse(data).map((a: any) => ({ ...a, ID_Assinatura: String(a.ID_Assinatura || a.id) }));
    } catch {
      return SEED_ASSINATURAS;
    }
  }

  private static setLocalStorageAssinaturas(items: IAssinatura[]): void {
    localStorage.setItem('mega_assinaturas_db', JSON.stringify(items));
  }

  async listarAssinaturas(): Promise<IAssinatura[]> {
    try {
      const data = await this.request<IAssinatura[]>(ASSINATURAS_API_URL);
      return data.map(a => ({ ...a, ID_Assinatura: String(a.ID_Assinatura || (a as any).id) }));
    } catch {
      return AssinaturaService.getLocalStorageAssinaturas();
    }
  }

  async buscarAssinaturaPorUsuario(idUsuario: string): Promise<IAssinatura | null> {
    try {
      const data = await this.request<IAssinatura[]>(`${ASSINATURAS_API_URL}?ID_Usuario=${idUsuario}`);
      if (data.length === 0) return null;
      return { ...data[0], ID_Assinatura: String(data[0].ID_Assinatura || (data[0] as any).id) };
    } catch {
      const items = AssinaturaService.getLocalStorageAssinaturas();
      const found = items.find(i => String(i.ID_Usuario) === String(idUsuario));
      return found || null;
    }
  }

  async criarAssinatura(item: Omit<IAssinatura, 'ID_Assinatura'>): Promise<IAssinatura> {
    try {
      const data = await this.request<IAssinatura>(ASSINATURAS_API_URL, {
        method: 'POST',
        body: JSON.stringify(item)
      });
      return { ...data, ID_Assinatura: String(data.ID_Assinatura || (data as any).id) };
    } catch {
      const items = AssinaturaService.getLocalStorageAssinaturas();
      const newId = 'as' + (items.reduce((max, i) => Math.max(max, parseInt(i.ID_Assinatura?.replace('as', '') || '0')), 0) + 1).toString();
      const newItem: IAssinatura = { ...item, ID_Assinatura: newId };
      items.push(newItem);
      AssinaturaService.setLocalStorageAssinaturas(items);
      return newItem;
    }
  }

  // --- PAGAMENTOS ---
  private static getLocalStoragePagamentos(): IPagamento[] {
    const data = localStorage.getItem('mega_pagamentos_db');
    if (!data) {
      localStorage.setItem('mega_pagamentos_db', JSON.stringify(SEED_PAGAMENTOS));
      return SEED_PAGAMENTOS;
    }
    try {
      return JSON.parse(data).map((p: any) => ({ ...p, ID_Pagamento: String(p.ID_Pagamento || p.id) }));
    } catch {
      return SEED_PAGAMENTOS;
    }
  }

  private static setLocalStoragePagamentos(items: IPagamento[]): void {
    localStorage.setItem('mega_pagamentos_db', JSON.stringify(items));
  }

  async listarPagamentos(): Promise<IPagamento[]> {
    try {
      const data = await this.request<IPagamento[]>(PAGAMENTOS_API_URL);
      return data.map(p => ({ ...p, ID_Pagamento: String(p.ID_Pagamento || (p as any).id) }));
    } catch {
      return AssinaturaService.getLocalStoragePagamentos();
    }
  }

  async criarPagamento(item: Omit<IPagamento, 'ID_Pagamento'>): Promise<IPagamento> {
    try {
      const data = await this.request<IPagamento>(PAGAMENTOS_API_URL, {
        method: 'POST',
        body: JSON.stringify(item)
      });
      return { ...data, ID_Pagamento: String(data.ID_Pagamento || (data as any).id) };
    } catch {
      const items = AssinaturaService.getLocalStoragePagamentos();
      const newId = 'pag' + (items.reduce((max, i) => Math.max(max, parseInt(i.ID_Pagamento?.replace('pag', '') || '0')), 0) + 1).toString();
      const newItem: IPagamento = { ...item, ID_Pagamento: newId };
      items.push(newItem);
      AssinaturaService.setLocalStoragePagamentos(items);
      return newItem;
    }
  }
}
