import { type ICertificado } from '../models/certificado.model';
import { ApiService } from './api.service';

const RECURSO = 'certificados';

/**
 * CertificadoService — Gerencia operações CRUD de certificados via API (json-server).
 * Os dados são persistidos no db.json.
 */
export class CertificadoService extends ApiService {
  private url(caminho = '') {
    return ApiService.buildUrl(RECURSO, caminho);
  }

  async listar(): Promise<ICertificado[]> {
    const data = await this.request<ICertificado[]>(this.url());
    return data.map(c => ({ ...c, ID_Certificado: String(c.ID_Certificado || (c as any).id) }));
  }

  async buscarPorId(id: string): Promise<ICertificado> {
    const item = await this.request<ICertificado>(this.url(`/${id}`));
    return { ...item, ID_Certificado: String(item.ID_Certificado || (item as any).id) };
  }

  async listarPorUsuario(idUsuario: string): Promise<ICertificado[]> {
    const data = await this.request<ICertificado[]>(this.url(`?ID_Usuario=${idUsuario}`));
    return data.map(c => ({ ...c, ID_Certificado: String(c.ID_Certificado || (c as any).id) }));
  }

  async criar(item: Omit<ICertificado, 'ID_Certificado'>): Promise<ICertificado> {
    const data = await this.request<ICertificado>(this.url(), {
      method: 'POST',
      body: JSON.stringify(item),
    });
    return { ...data, ID_Certificado: String(data.ID_Certificado || (data as any).id) };
  }

  async atualizar(id: string, item: Partial<ICertificado>): Promise<ICertificado> {
    const data = await this.request<ICertificado>(this.url(`/${id}`), {
      method: 'PUT',
      body: JSON.stringify({ ...item, id }),
    });
    return { ...data, ID_Certificado: String(data.ID_Certificado || (data as any).id) };
  }

  async deletar(id: string): Promise<void> {
    await this.request<void>(this.url(`/${id}`), { method: 'DELETE' });
  }
}
