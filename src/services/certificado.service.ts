import { type ICertificado } from '../models/certificado.model';
import { ApiService } from './api.service';

const RECURSO = 'certificados';

/**
 * CertificadoService — CRUD de certificados na API NestJS (/certificados).
 * O backend gera CodigoVerificacao (UUID) quando omitido e define DataEmissao automaticamente.
 */
export class CertificadoService extends ApiService {
  private url(caminho = '') {
    return ApiService.buildUrl(RECURSO, caminho);
  }

  private static deApi(c: ICertificado): ICertificado {
    return ApiService.idsParaString(c);
  }

  /** Monta o corpo aceito pelo backend (DataEmissao é ignorada: é automática). */
  private static paraApi(item: Partial<ICertificado>) {
    const body: Record<string, unknown> = {};
    if (item.ID_Usuario !== undefined) body.ID_Usuario = item.ID_Usuario;
    if (item.ID_Curso !== undefined) body.ID_Curso = item.ID_Curso;
    if (item.ID_Trilha !== undefined) body.ID_Trilha = item.ID_Trilha || null;
    if (item.CodigoVerificacao) body.CodigoVerificacao = item.CodigoVerificacao;
    return ApiService.idsParaNumero(body);
  }

  async listar(): Promise<ICertificado[]> {
    const data = await this.request<ICertificado[]>(this.url());
    return data.map(CertificadoService.deApi);
  }

  async buscarPorId(id: string): Promise<ICertificado> {
    return CertificadoService.deApi(await this.request<ICertificado>(this.url(`/${id}`)));
  }

  async listarPorUsuario(idUsuario: string): Promise<ICertificado[]> {
    const data = await this.request<ICertificado[]>(this.url(`?ID_Usuario=${encodeURIComponent(idUsuario)}`));
    return data.map(CertificadoService.deApi);
  }

  /** Rota pública: valida um certificado pelo código de verificação. */
  async verificar(codigo: string): Promise<ICertificado> {
    const data = await this.request<ICertificado>(this.url(`/verificar/${encodeURIComponent(codigo.trim())}`));
    return CertificadoService.deApi(data);
  }

  async criar(item: Omit<ICertificado, 'ID_Certificado'>): Promise<ICertificado> {
    const data = await this.request<ICertificado>(this.url(), {
      method: 'POST',
      body: JSON.stringify(CertificadoService.paraApi(item)),
    });
    return CertificadoService.deApi(data);
  }

  async atualizar(id: string, item: Partial<ICertificado>): Promise<ICertificado> {
    const data = await this.request<ICertificado>(this.url(`/${id}`), {
      method: 'PATCH',
      body: JSON.stringify(CertificadoService.paraApi(item)),
    });
    return CertificadoService.deApi(data);
  }

  async deletar(id: string): Promise<void> {
    await this.request<void>(this.url(`/${id}`), { method: 'DELETE' });
  }
}
