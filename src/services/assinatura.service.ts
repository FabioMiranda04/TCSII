import { type IPlano, type IAssinatura, type IPagamento } from '../models/assinatura.model';
import { ApiService } from './api.service';

/** Converte preço vindo do form ("R$ 49,90", "49.9" ou number) em number. */
const paraNumero = (v: unknown): number =>
  typeof v === 'number' ? v : Number(String(v ?? '').replace(/[^\d,.-]/g, '').replace(',', '.'));

/**
 * AssinaturaService — Gerencia planos, assinaturas e pagamentos via API NestJS.
 */
export class AssinaturaService extends ApiService {

  // --- PLANOS ---

  private static planoParaApi(item: Partial<IPlano>) {
    const { ID_Plano: _id, ...rest } = item;
    void _id;
    const out: Record<string, unknown> = { ...rest };
    if (rest.Preco !== undefined) out.Preco = paraNumero(rest.Preco);
    if (rest.DuracaoMeses !== undefined) out.DuracaoMeses = Number(rest.DuracaoMeses);
    return out;
  }

  async listarPlanos(): Promise<IPlano[]> {
    const data = await this.request<IPlano[]>(ApiService.buildUrl('planos'));
    return data.map(p => ApiService.idsParaString(p));
  }

  async buscarPlanoPorId(id: string): Promise<IPlano> {
    return ApiService.idsParaString(await this.request<IPlano>(ApiService.buildUrl('planos', `/${id}`)));
  }

  async criarPlano(item: Omit<IPlano, 'ID_Plano'>): Promise<IPlano> {
    const data = await this.request<IPlano>(ApiService.buildUrl('planos'), {
      method: 'POST',
      body: JSON.stringify(AssinaturaService.planoParaApi(item)),
    });
    return ApiService.idsParaString(data);
  }

  async atualizarPlano(id: string, item: Partial<IPlano>): Promise<IPlano> {
    const data = await this.request<IPlano>(ApiService.buildUrl('planos', `/${id}`), {
      method: 'PATCH',
      body: JSON.stringify(AssinaturaService.planoParaApi(item)),
    });
    return ApiService.idsParaString(data);
  }

  async deletarPlano(id: string): Promise<void> {
    await this.request<void>(ApiService.buildUrl('planos', `/${id}`), { method: 'DELETE' });
  }

  // --- ASSINATURAS ---

  private static assinaturaParaApi(item: Partial<IAssinatura>) {
    const { ID_Assinatura: _id, ...rest } = item;
    void _id;
    const out = ApiService.idsParaNumero(rest) as Record<string, unknown>;
    if (rest.DataInicio !== undefined) out.DataInicio = ApiService.paraIso(rest.DataInicio);
    if (rest.DataFim !== undefined) out.DataFim = ApiService.paraIso(rest.DataFim);
    return out;
  }

  async listarAssinaturas(): Promise<IAssinatura[]> {
    const data = await this.request<IAssinatura[]>(ApiService.buildUrl('assinaturas'));
    return data.map(a => ApiService.idsParaString(a));
  }

  /** Retorna a assinatura mais recente (maior DataFim) do usuário, ou null. */
  async buscarAssinaturaPorUsuario(idUsuario: string): Promise<IAssinatura | null> {
    const data = await this.request<IAssinatura[]>(
      ApiService.buildUrl('assinaturas', `?ID_Usuario=${encodeURIComponent(idUsuario)}`)
    );
    if (data.length === 0) return null;
    const ordenadas = [...data].sort((a, b) => new Date(b.DataFim).getTime() - new Date(a.DataFim).getTime());
    return ApiService.idsParaString(ordenadas[0]);
  }

  async criarAssinatura(item: Omit<IAssinatura, 'ID_Assinatura'>): Promise<IAssinatura> {
    const data = await this.request<IAssinatura>(ApiService.buildUrl('assinaturas'), {
      method: 'POST',
      body: JSON.stringify(AssinaturaService.assinaturaParaApi(item)),
    });
    return ApiService.idsParaString(data);
  }

  async atualizarAssinatura(id: string, item: Partial<IAssinatura>): Promise<IAssinatura> {
    const data = await this.request<IAssinatura>(ApiService.buildUrl('assinaturas', `/${id}`), {
      method: 'PATCH',
      body: JSON.stringify(AssinaturaService.assinaturaParaApi(item)),
    });
    return ApiService.idsParaString(data);
  }

  async deletarAssinatura(id: string): Promise<void> {
    await this.request<void>(ApiService.buildUrl('assinaturas', `/${id}`), { method: 'DELETE' });
  }

  // --- PAGAMENTOS ---

  async listarPagamentos(idAssinatura?: string): Promise<IPagamento[]> {
    const q = idAssinatura ? `?ID_Assinatura=${encodeURIComponent(idAssinatura)}` : '';
    const data = await this.request<IPagamento[]>(ApiService.buildUrl('pagamentos', q));
    return data.map(p => ApiService.idsParaString(p));
  }

  async criarPagamento(item: Omit<IPagamento, 'ID_Pagamento'>): Promise<IPagamento> {
    const body = {
      ID_Assinatura: Number(item.ID_Assinatura),
      ValorPago: paraNumero(item.ValorPago),
      DataPagamento: ApiService.paraIso(item.DataPagamento),
      MetodoPagamento: item.MetodoPagamento,
      Id_Transacao_Gateway: item.Id_Transacao_Gateway,
      DataFim: ApiService.paraIso(item.DataFim),
    };
    const data = await this.request<IPagamento>(ApiService.buildUrl('pagamentos'), {
      method: 'POST',
      body: JSON.stringify(body),
    });
    return ApiService.idsParaString(data);
  }
}
