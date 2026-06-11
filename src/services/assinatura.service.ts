import { type IPlano, type IAssinatura, type IPagamento } from '../models/assinatura.model';
import { ApiService } from './api.service';

/**
 * AssinaturaService — Gerencia planos, assinaturas e pagamentos via API (json-server).
 * Os dados são persistidos no db.json.
 */
export class AssinaturaService extends ApiService {

  // --- PLANOS ---

  async listarPlanos(): Promise<IPlano[]> {
    const data = await this.request<IPlano[]>(ApiService.buildUrl('planos'));
    return data.map(p => ({ ...p, ID_Plano: String(p.ID_Plano || (p as any).id) }));
  }

  async buscarPlanoPorId(id: string): Promise<IPlano> {
    const data = await this.request<IPlano>(ApiService.buildUrl('planos', `/${id}`));
    return { ...data, ID_Plano: String(data.ID_Plano || (data as any).id) };
  }

  async criarPlano(item: Omit<IPlano, 'ID_Plano'>): Promise<IPlano> {
    const data = await this.request<IPlano>(ApiService.buildUrl('planos'), {
      method: 'POST',
      body: JSON.stringify(item),
    });
    return { ...data, ID_Plano: String(data.ID_Plano || (data as any).id) };
  }

  async atualizarPlano(id: string, item: Partial<IPlano>): Promise<IPlano> {
    const data = await this.request<IPlano>(ApiService.buildUrl('planos', `/${id}`), {
      method: 'PUT',
      body: JSON.stringify({ ...item, id }),
    });
    return { ...data, ID_Plano: String(data.ID_Plano || (data as any).id) };
  }

  async deletarPlano(id: string): Promise<void> {
    await this.request<void>(ApiService.buildUrl('planos', `/${id}`), { method: 'DELETE' });
  }

  // --- ASSINATURAS ---

  async listarAssinaturas(): Promise<IAssinatura[]> {
    const data = await this.request<IAssinatura[]>(ApiService.buildUrl('assinaturas'));
    return data.map(a => ({ ...a, ID_Assinatura: String(a.ID_Assinatura || (a as any).id) }));
  }

  async buscarAssinaturaPorUsuario(idUsuario: string): Promise<IAssinatura | null> {
    const data = await this.request<IAssinatura[]>(
      ApiService.buildUrl('assinaturas', `?ID_Usuario=${idUsuario}`)
    );
    if (data.length === 0) return null;
    return { ...data[0], ID_Assinatura: String(data[0].ID_Assinatura || (data[0] as any).id) };
  }

  async criarAssinatura(item: Omit<IAssinatura, 'ID_Assinatura'>): Promise<IAssinatura> {
    const data = await this.request<IAssinatura>(ApiService.buildUrl('assinaturas'), {
      method: 'POST',
      body: JSON.stringify(item),
    });
    return { ...data, ID_Assinatura: String(data.ID_Assinatura || (data as any).id) };
  }

  async atualizarAssinatura(id: string, item: Partial<IAssinatura>): Promise<IAssinatura> {
    const data = await this.request<IAssinatura>(ApiService.buildUrl('assinaturas', `/${id}`), {
      method: 'PUT',
      body: JSON.stringify({ ...item, id }),
    });
    return { ...data, ID_Assinatura: String(data.ID_Assinatura || (data as any).id) };
  }

  async deletarAssinatura(id: string): Promise<void> {
    await this.request<void>(ApiService.buildUrl('assinaturas', `/${id}`), { method: 'DELETE' });
  }

  // --- PAGAMENTOS ---

  async listarPagamentos(): Promise<IPagamento[]> {
    const data = await this.request<IPagamento[]>(ApiService.buildUrl('pagamentos'));
    return data.map(p => ({ ...p, ID_Pagamento: String(p.ID_Pagamento || (p as any).id) }));
  }

  async criarPagamento(item: Omit<IPagamento, 'ID_Pagamento'>): Promise<IPagamento> {
    const data = await this.request<IPagamento>(ApiService.buildUrl('pagamentos'), {
      method: 'POST',
      body: JSON.stringify(item),
    });
    return { ...data, ID_Pagamento: String(data.ID_Pagamento || (data as any).id) };
  }
}
