import { useState, useEffect } from 'react';
import { type ICertificado } from '../../models/certificado.model';
import { type ICurso } from '../../models/curso.model';
import { type IUsuario } from '../../models/usuario.model';
import { CertificadoService } from '../../services/certificado.service';
import { ApiService } from '../../services/api.service';
import { CursoService } from '../../services/curso.service';
import { UsuariosService } from '../../services/usuario.service';

const service = new CertificadoService();
const cursoService = new CursoService();
const usuarioService = new UsuariosService();

export const CertificadosPages = () => {
  const [certificados, setCertificados] = useState<ICertificado[]>([]);
  const [cursos, setCursos] = useState<ICurso[]>([]);
  const [usuarios, setUsuarios] = useState<IUsuario[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Simulated Logged-In User
  const [activeUserId, setActiveUserId] = useState<string>('1');

  // Verificação pública de certificado
  const [codigoBusca, setCodigoBusca] = useState('');
  const [verificando, setVerificando] = useState(false);
  const [resultadoVerificacao, setResultadoVerificacao] = useState<
    { ok: true; cert: ICertificado } | { ok: false; msg: string } | null
  >(null);

  const verificarCodigo = async (codigo: string) => {
    if (!codigo.trim()) return;
    setCodigoBusca(codigo);
    setVerificando(true);
    setResultadoVerificacao(null);
    try {
      const cert = await service.verificar(codigo);
      setResultadoVerificacao({ ok: true, cert });
    } catch (e) {
      setResultadoVerificacao({ ok: false, msg: e instanceof Error ? e.message : 'Certificado não encontrado.' });
    } finally {
      setVerificando(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    carregarDados();
  }, []);

  const carregarDados = async () => {
    setLoading(true);
    try {
      const [certsData, cursosData, usersData] = await Promise.all([
        service.listar(),
        cursoService.listar(),
        usuarioService.listar()
      ]);
      setCertificados(certsData);
      setCursos(cursosData);
      setUsuarios(usersData);
    } catch (e) {
      console.error('Erro ao carregar certificados.', e);
    } finally {
      setLoading(false);
    }
  };

  // Filter certificates for the active simulated user
  const userCertificados = certificados.filter(c => String(c.ID_Usuario) === String(activeUserId));

  return (
    <div className="container-fluid py-4">
      {/* Simulated User Selector */}
      <div className="card border-0 shadow-sm rounded-4 bg-light mb-4">
        <div className="card-body p-3 d-flex flex-column flex-md-row align-items-center justify-content-between gap-3">
          <div className="d-flex align-items-center gap-2">
            <i className="bi bi-person-bounding-box text-primary fs-4"></i>
            <div>
              <div className="fw-bold text-slate-800">Simulador de Usuário Logado:</div>
              <span className="small text-muted">Exibindo conquistas e certificados do perfil selecionado.</span>
            </div>
          </div>
          <select 
            className="form-select rounded-pill w-auto border-primary" 
            value={activeUserId}
            onChange={(e) => setActiveUserId(e.target.value)}
          >
            {usuarios.map(u => (
              <option key={u.ID_Usuario} value={u.ID_Usuario}>
                {u.NomeCompleto}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <span className="badge bg-secondary-light text-secondary fw-bold mb-1">CONQUISTAS & CERTIFICADOS</span>
          <h2 className="fw-extrabold text-slate-800 m-0">Meus Certificados</h2>
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-4 mb-4">
        <div className="card-body p-3">
          <form
            className="d-flex flex-column flex-md-row gap-2 align-items-md-center"
            onSubmit={(e) => { e.preventDefault(); verificarCodigo(codigoBusca); }}
          >
            <label htmlFor="codigo-verificacao" className="fw-bold text-slate-800 text-nowrap mb-0">
              <i className="bi bi-shield-check me-1"></i>Verificar certificado
            </label>
            <input
              id="codigo-verificacao"
              className="form-control rounded-3 font-monospace"
              placeholder="Código de verificação"
              value={codigoBusca}
              onChange={(e) => setCodigoBusca(e.target.value)}
            />
            <button type="submit" className="btn btn-primary rounded-3" disabled={verificando || !codigoBusca.trim()}>
              {verificando ? 'Verificando...' : 'Verificar'}
            </button>
          </form>
          {resultadoVerificacao && (resultadoVerificacao.ok ? (
            <div className="alert alert-success mt-3 mb-0 small">
              Certificado válido — curso: <strong>{cursos.find(c => String(c.ID_Curso) === String(resultadoVerificacao.cert.ID_Curso))?.Titulo ?? `#${resultadoVerificacao.cert.ID_Curso}`}</strong>
              {' '}| aluno: <strong>{usuarios.find(u => String(u.ID_Usuario) === String(resultadoVerificacao.cert.ID_Usuario))?.NomeCompleto ?? `#${resultadoVerificacao.cert.ID_Usuario}`}</strong>
              {' '}| emitido em {ApiService.formatarData(resultadoVerificacao.cert.DataEmissao)}
            </div>
          ) : (
            <div className="alert alert-danger mt-3 mb-0 small">Certificado inválido: {resultadoVerificacao.msg}</div>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
        </div>
      ) : (
        <div className="row g-4">
          {/* Certificate Card List */}
          {userCertificados.map((cert) => {
            const course = cursos.find(c => String(c.ID_Curso) === String(cert.ID_Curso));
            return (
              <div key={cert.ID_Certificado} className="col-12 col-md-6 col-lg-4">
                <div className="card border-0 shadow-sm rounded-4 overflow-hidden position-relative hover-up h-100 d-flex flex-column justify-content-between">
                  {/* Premium Certificate Border Decoration */}
                  <div style={{ height: '6px', background: 'linear-gradient(90deg, #7c3aed 0%, #2563eb 100%)' }}></div>

                  <div className="card-body p-4 flex-grow-1 d-flex flex-column justify-content-between">
                    <div>
                      <div className="d-flex align-items-start justify-content-between mb-3">
                        <div className="bg-primary bg-opacity-10 p-3 rounded-3 text-primary">
                          <i className="bi bi-patch-check-fill fs-3"></i>
                        </div>
                        <span className="badge bg-success bg-opacity-10 text-success fw-bold">
                          OFICIAL
                        </span>
                      </div>
                      
                      <h5 className="fw-bold text-slate-800 mb-2">{course ? course.Titulo : 'Curso Concluído'}</h5>
                      
                      <div className="text-muted small mb-3">
                        <div>Emitido em: <strong>{ApiService.formatarData(cert.DataEmissao)}</strong></div>
                        <div>Verificação: <span className="font-monospace text-slate-700">{cert.CodigoVerificacao}</span></div>
                      </div>
                    </div>

                    <div className="d-flex gap-2 mt-3">
                      <button className="btn btn-primary btn-sm rounded-3 d-flex align-items-center gap-2">
                        <i className="bi bi-file-earmark-pdf-fill"></i>
                        <span>Download PDF</span>
                      </button>
                      <button className="btn btn-outline-secondary btn-sm rounded-3" onClick={() => cert.CodigoVerificacao && verificarCodigo(cert.CodigoVerificacao)}>
                        Validar Código
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {userCertificados.length === 0 && (
            <div className="col-12">
              <div className="card border-0 shadow-sm p-5 text-center bg-white rounded-4">
                <i className="bi bi-award text-slate-300 fs-1"></i>
                <h5 className="fw-bold text-slate-600 mt-2">Nenhum certificado emitido</h5>
                <p className="small text-slate-500 max-w-400 mx-auto mt-1">
                  Certificados são gerados automaticamente quando você conclui 100% das aulas assistidas de um curso matriculado.
                </p>
              </div>
            </div>
          )}

          {/* Info card on certification rules */}
          <div className="col-12 col-md-6 col-lg-4">
            <div className="card h-100 border-0 border-dashed bg-light text-center p-4 d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '220px', border: '2px dashed #cbd5e1' }}>
              <i className="bi bi-info-circle fs-2 text-slate-400 mb-2"></i>
              <h6 className="fw-bold text-slate-600 m-0">Regra de Certificação</h6>
              <p className="small text-slate-500 max-w-280 mt-1">
                Conclua todas as aulas no player do módulo correspondente para que seu certificado seja gerado e listado aqui imediatamente.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
