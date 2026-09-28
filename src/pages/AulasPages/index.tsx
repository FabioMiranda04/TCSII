import { useState, useEffect } from 'react';
import { type IAula, aulaSchema } from '../../models/aula.model';
import { type IModulo } from '../../models/modulo.model';
import { type ICurso } from '../../models/curso.model';
import { type IUsuario } from '../../models/usuario.model';
import { type IMatricula } from '../../models/matricula.model';
import { type IProgresso } from '../../models/progresso.model';
import { type ICertificado } from '../../models/certificado.model';
import { AulaService } from '../../services/aula.service';
import { ModuloService } from '../../services/modulo.service';
import { CursoService } from '../../services/curso.service';
import { UsuariosService } from '../../services/usuario.service';
import { MatriculaService } from '../../services/matricula.service';
import { ProgressoService } from '../../services/progresso.service';
import { CertificadoService } from '../../services/certificado.service';
import { z } from 'zod';

const aulaService = new AulaService();
const moduloService = new ModuloService();
const cursoService = new CursoService();
const usuarioService = new UsuariosService();
const matriculaService = new MatriculaService();
const progressoService = new ProgressoService();
const certificadoService = new CertificadoService();

export const AulasPages = () => {
  const [aulas, setAulas] = useState<IAula[]>([]);
  const [modulos, setModulos] = useState<IModulo[]>([]);
  const [cursos, setCursos] = useState<ICurso[]>([]);
  const [usuarios, setUsuarios] = useState<IUsuario[]>([]);
  const [matriculas, setMatriculas] = useState<IMatricula[]>([]);
  const [progressos, setProgressos] = useState<IProgresso[]>([]);
  const [certificados, setCertificados] = useState<ICertificado[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'player' | 'manager'>('player');
  
  // Simulated Logged-In User
  const [activeUserId, setActiveUserId] = useState<string>('1');
  // Selected course to watch
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  
  // Active playing lecture
  const [activeAula, setActiveAula] = useState<IAula | null>(null);
  
  // Edit states for management table
  const [editingId, setEditingId] = useState<string | null>(null);
  const [alert, setAlert] = useState<{ type: 'success' | 'danger' | 'info'; message: string } | null>(null);

  // Form states for inline editing
  const [formData, setFormData] = useState<Omit<IAula, 'ID_Aula'>>({
    ID_Modulo: '',
    Titulo: '',
    TipoConteudo: 'Vídeo',
    URL_Conteudo: '',
    DuracaoMinutos: 10,
    Ordem: 1
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    carregarDados();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const carregarDados = async () => {
    setLoading(true);
    try {
      const [aulasData, modulosData, cursosData, usersData, matriculasData, progressData, certsData] = await Promise.all([
        aulaService.listar(),
        moduloService.listar(),
        cursoService.listar(),
        usuarioService.listar(),
        matriculaService.listar(),
        progressoService.listar(),
        certificadoService.listar()
      ]);
      setAulas(aulasData);
      setModulos(modulosData);
      setCursos(cursosData);
      setUsuarios(usersData);
      setMatriculas(matriculasData);
      setProgressos(progressData);
      setCertificados(certsData);

      // Default course selection
      if (cursosData.length > 0) {
        setSelectedCourseId(cursosData[0].ID_Curso!);
      }
    } catch {
      triggerAlert('danger', 'Erro ao carregar dados de aulas.');
    } finally {
      setLoading(false);
    }
  };

  const triggerAlert = (type: 'success' | 'danger' | 'info', message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 5000);
  };

  const activeUser = usuarios.find(u => String(u.ID_Usuario) === String(activeUserId));

  // Verify enrollment and plan
  const userHasAccess = () => {
    if (!activeUser) return false;
    // Must have active plan
    if (!activeUser.ID_Plano || activeUser.ID_Plano.trim() === '') return false;
    // Must be matriculado in selected course
    return matriculas.some(m => String(m.ID_Curso) === String(selectedCourseId) && String(m.ID_Usuario) === String(activeUserId));
  };

  // Get modules of selected course
  const courseModulos = modulos.filter(m => String(m.ID_Curso) === String(selectedCourseId));
  
  // Get lectures of those modules, sorted by Modulo Ordem and Aula Ordem
  const courseAulas = aulas
    .filter(a => courseModulos.some(m => String(m.ID_Modulo) === String(a.ID_Modulo)))
    .sort((a, b) => {
      const modA = courseModulos.find(m => String(m.ID_Modulo) === String(a.ID_Modulo));
      const modB = courseModulos.find(m => String(m.ID_Modulo) === String(b.ID_Modulo));
      const modOrdemDiff = (modA?.Ordem || 0) - (modB?.Ordem || 0);
      if (modOrdemDiff !== 0) return modOrdemDiff;
      return a.Ordem - b.Ordem;
    });

  useEffect(() => {
    if (courseAulas.length > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveAula(courseAulas[0]);
    } else {
      setActiveAula(null);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCourseId, aulas, modulos]);

  // Check if lecture is watched
  const isWatched = (aulaId: string) => {
    return progressos.some(p => String(p.ID_Aula) === String(aulaId) && String(p.ID_Usuario) === String(activeUserId));
  };

  // Check if all course lectures are completed to auto-emit certificate
  const verificarEGerarCertificado = async (userId: string, courseId: string, currentProgress: IProgresso[]) => {
    // 1. Get all lectures in this course
    const modulosOfCourse = modulos.filter(m => String(m.ID_Curso) === String(courseId));
    const lecturesInCourse = aulas.filter(a => modulosOfCourse.some(m => String(m.ID_Modulo) === String(a.ID_Modulo)));
    
    if (lecturesInCourse.length === 0) return;

    // 2. Count how many are completed by this user
    const completedLectures = lecturesInCourse.filter(a => 
      currentProgress.some(p => String(p.ID_Aula) === String(a.ID_Aula) && String(p.ID_Usuario) === String(userId))
    );

    // 3. If 100% completed, check if certificate already exists
    if (completedLectures.length === lecturesInCourse.length) {
      const certExists = certificados.some(c => String(c.ID_Usuario) === String(userId) && String(c.ID_Curso) === String(courseId));
      if (!certExists) {
        try {
          const today = new Date();
          const formattedDate = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;
          // eslint-disable-next-line react-hooks/purity
          const hashHex = 'MC-CONF-' + Math.floor(1000 + Math.random() * 9000) + '-' + courseId;

          const newCert: Omit<ICertificado, 'ID_Certificado'> = {
            ID_Usuario: userId,
            ID_Curso: courseId,
            ID_Trilha: null,
            CodigoVerificacao: hashHex,
            DataEmissao: formattedDate
          };

          const created = await certificadoService.criar(newCert);
          setCertificados(prev => [...prev, created]);
          triggerAlert('info', `🏆 CURSO CONCLUÍDO! Seu certificado foi emitido automaticamente com o código: ${hashHex}`);
        } catch {
          console.error("Erro ao emitir certificado.");
        }
      }
    }
  };

  // Toggle watch status
  const handleToggleWatch = async (aulaId: string) => {
    const activeProgress = progressos.find(p => String(p.ID_Aula) === String(aulaId) && String(p.ID_Usuario) === String(activeUserId));
    try {
      if (activeProgress) {
        // Unwatch
        await progressoService.deletar(activeProgress.ID_Usuario, activeProgress.ID_Aula);
        const updatedProgress = progressos.filter(
          p => !(String(p.ID_Usuario) === String(activeProgress.ID_Usuario) && String(p.ID_Aula) === String(activeProgress.ID_Aula))
        );
        setProgressos(updatedProgress);
      } else {
        // Watch
        const newProgress: IProgresso = {
          ID_Usuario: activeUserId,
          ID_Aula: aulaId,
          DataConclusao: new Date().toISOString(),
          Status: 'Concluído'
        };
        const created = await progressoService.criar(newProgress);
        const updatedProgress = [...progressos, created];
        setProgressos(updatedProgress);
        
        // Check for 100% course completion
        await verificarEGerarCertificado(activeUserId, selectedCourseId, updatedProgress);
      }
    } catch (err) {
      triggerAlert('danger', err instanceof Error ? err.message : 'Erro ao atualizar progresso da aula.');
    }
  };

  // Inline table row CRUD
  const handleStartEdit = (aula: IAula) => {
    setEditingId(aula.ID_Aula || null);
    setFormData({
      ID_Modulo: aula.ID_Modulo,
      Titulo: aula.Titulo,
      TipoConteudo: aula.TipoConteudo,
      URL_Conteudo: aula.URL_Conteudo,
      DuracaoMinutos: aula.DuracaoMinutos,
      Ordem: aula.Ordem
    });
    setErrors({});
  };

  const handleStartCreate = () => {
    if (editingId === 'new') return;

    const defaultModulo = modulos.length > 0 ? modulos[0].ID_Modulo || 'm1' : 'm1';

    const newTemp: IAula = {
      ID_Aula: 'new',
      ID_Modulo: defaultModulo,
      Titulo: '',
      TipoConteudo: 'Vídeo',
      URL_Conteudo: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      DuracaoMinutos: 15,
      Ordem: aulas.length + 1
    };

    setAulas(prev => [newTemp, ...prev]);
    setEditingId('new');
    setFormData({
      ID_Modulo: newTemp.ID_Modulo,
      Titulo: newTemp.Titulo,
      TipoConteudo: newTemp.TipoConteudo,
      URL_Conteudo: newTemp.URL_Conteudo,
      DuracaoMinutos: newTemp.DuracaoMinutos,
      Ordem: newTemp.Ordem
    });
    setErrors({});
  };

  const handleCancel = () => {
    if (editingId === 'new') {
      setAulas(prev => prev.filter(a => a.ID_Aula !== 'new'));
    }
    setEditingId(null);
    setErrors({});
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'DuracaoMinutos' || name === 'Ordem' ? Number(value) : value
    }));
  };

  const handleSave = async (id: string) => {
    setErrors({});
    try {
      aulaSchema.parse(formData);

      if (id === 'new') {
        const created = await aulaService.criar(formData);
        setAulas(prev => prev.map(a => a.ID_Aula === 'new' ? created : a));
        triggerAlert('success', 'Aula criada com sucesso!');
      } else {
        const updated = await aulaService.atualizar(id, formData);
        setAulas(prev => prev.map(a => a.ID_Aula === id ? updated : a));
        triggerAlert('success', 'Aula atualizada com sucesso!');
      }
      setEditingId(null);
    } catch (err) {
      if (err instanceof z.ZodError) {
        const errMap: Record<string, string> = {};
        err.issues.forEach(issue => {
          if (issue.path[0]) {
            errMap[issue.path[0].toString()] = issue.message;
          }
        });
        setErrors(errMap);
      } else {
        triggerAlert('danger', 'Erro ao salvar aula.');
      }
    }
  };

  const handleDelete = async (id: string, titulo: string) => {
    if (window.confirm(`Deseja realmente remover a aula "${titulo}"?`)) {
      try {
        await aulaService.deletar(id);
        setAulas(prev => prev.filter(a => a.ID_Aula !== id));
        triggerAlert('success', 'Aula removida com sucesso!');
      } catch {
        triggerAlert('danger', 'Erro ao excluir aula.');
      }
    }
  };

  const courseSelectOptions = cursos.filter(c => {
    // List only courses enrolled if in player tab
    if (activeTab === 'player') {
      return matriculas.some(m => String(m.ID_Curso) === String(c.ID_Curso) && String(m.ID_Usuario) === String(activeUserId));
    }
    return true;
  });

  return (
    <div className="container-fluid py-4">
      {alert && (
        <div className={`alert alert-${alert.type} alert-dismissible fade show shadow position-fixed top-4 end-4 z-1100 rounded-3 border-0`} role="alert">
          <div className="d-flex align-items-center gap-2">
            <i className={`bi ${alert.type === 'success' ? 'bi-check-circle-fill' : alert.type === 'info' ? 'bi-trophy-fill' : 'bi-exclamation-triangle-fill'}`}></i>
            <span className="fw-bold">{alert.message}</span>
          </div>
          <button type="button" className="btn-close" onClick={() => setAlert(null)}></button>
        </div>
      )}

      {/* Header and User Switcher */}
      <div className="card border-0 shadow-sm rounded-4 bg-light mb-4">
        <div className="card-body p-3 d-flex flex-column flex-md-row align-items-center justify-content-between gap-3">
          <div className="d-flex align-items-center gap-2">
            <i className="bi bi-person-bounding-box text-primary fs-4"></i>
            <div>
              <div className="fw-bold text-slate-800">Simulador de Usuário Logado:</div>
              <span className="small text-muted">Mudando o perfil aqui afeta o progresso das aulas e o acesso.</span>
            </div>
          </div>
          <select 
            className="form-select rounded-pill w-auto border-primary" 
            value={activeUserId}
            onChange={(e) => setActiveUserId(e.target.value)}
          >
            {usuarios.map(u => (
              <option key={u.ID_Usuario} value={u.ID_Usuario}>
                {u.NomeCompleto} - Plano: {u.ID_Plano ? u.ID_Plano.toUpperCase() : 'Nenhum'}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-between gap-3 mb-4">
        <div className="d-flex flex-column gap-2">
          <h2 className="fw-extrabold text-slate-800 m-0">Aulas do Curso</h2>
          
          {/* Mode switch */}
          <div className="btn-group bg-white p-1 rounded-pill shadow-sm border mt-1">
            <button 
              className={`btn btn-sm rounded-pill px-3 ${activeTab === 'player' ? 'btn-primary' : 'btn-light border-0'}`}
              onClick={() => { setActiveTab('player'); handleCancel(); }}
            >
              <i className="bi bi-play-btn me-1"></i> Assistir
            </button>
            <button 
              className={`btn btn-sm rounded-pill px-3 ${activeTab === 'manager' ? 'btn-primary' : 'btn-light border-0'}`}
              onClick={() => setActiveTab('manager')}
            >
              <i className="bi bi-gear-fill me-1"></i> Gerenciar
            </button>
          </div>
        </div>

        {/* Selected Course Selector */}
        <div className="d-flex align-items-center gap-2 w-100 w-sm-auto">
          <label className="fw-bold text-slate-700 text-nowrap m-0">Visualizar Curso:</label>
          <select 
            className="form-select rounded-pill"
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            style={{ minWidth: '220px' }}
          >
            {courseSelectOptions.map(c => (
              <option key={c.ID_Curso} value={c.ID_Curso}>{c.Titulo}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
        </div>
      ) : activeTab === 'player' ? (
        /* Video Player Student View */
        !userHasAccess() ? (
          <div className="card border-0 shadow-sm rounded-4 p-5 text-center bg-white">
            <i className="bi bi-shield-lock-fill text-danger fs-1"></i>
            <h4 className="fw-bold text-slate-800 mt-3">Acesso Bloqueado</h4>
            <p className="text-muted max-w-400 mx-auto mt-2">
              Você não está matriculado neste curso ou seu usuário não possui um plano de assinatura ativo.
              Vá para a página de <strong>Cursos</strong> para se matricular ou <strong>Assinaturas</strong> para assinar um plano!
            </p>
          </div>
        ) : (
          <div className="row g-4">
            {/* Left Side: Video Player */}
            <div className="col-12 col-xl-8">
              {activeAula ? (
                <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4">
                  <div className="bg-dark text-white d-flex align-items-center justify-content-center position-relative" style={{ height: '400px', background: 'radial-gradient(circle, #334155 0%, #0f172a 100%)' }}>
                    <div className="text-center p-4 w-100 h-100 d-flex flex-column justify-content-center align-items-center">
                      <div className="d-inline-flex bg-primary bg-opacity-20 p-4 rounded-circle text-primary mb-3 animated-pulse">
                        <i className="bi bi-play-fill fs-1"></i>
                      </div>
                      <h4 className="fw-bold">{activeAula.Titulo}</h4>
                      <span className="badge bg-secondary-light text-slate-300 fs-7 mb-3">{activeAula.TipoConteudo}</span>
                      
                      <button 
                        className={`btn rounded-pill px-4 btn-sm ${isWatched(activeAula.ID_Aula!) ? 'btn-success' : 'btn-primary'}`}
                        onClick={() => handleToggleWatch(activeAula.ID_Aula!)}
                      >
                        <i className={`bi ${isWatched(activeAula.ID_Aula!) ? 'bi-check2-all' : 'bi-play-fill'} me-2`}></i>
                        {isWatched(activeAula.ID_Aula!) ? 'Concluída' : 'Marcar como Concluída'}
                      </button>
                    </div>
                  </div>
                  
                  <div className="card-body p-4">
                    <div className="d-flex align-items-center justify-content-between mb-2">
                      <span className="badge bg-secondary bg-opacity-10 text-slate-800 fw-bold">Aula {activeAula.Ordem}</span>
                      <span className="text-muted small font-monospace"><i className="bi bi-clock me-1"></i> {activeAula.DuracaoMinutos} Minutos</span>
                    </div>
                    <h4 className="fw-bold text-slate-800 mb-2">{activeAula.Titulo}</h4>
                    <p className="text-slate-600 m-0">
                      Material educacional correspondente à aula #{activeAula.Ordem} do módulo associado. Assista ao conteúdo e marque como concluída para progredir na emissão do seu certificado oficial.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="card border-0 shadow-sm rounded-4 p-5 text-center bg-white">
                  <i className="bi bi-play-circle text-slate-300 fs-1"></i>
                  <h5 className="fw-bold text-slate-600 mt-2">Nenhuma aula cadastrada para este curso</h5>
                </div>
              )}
            </div>

            {/* Right Side: Playlist Sidebar */}
            <div className="col-12 col-xl-4">
              <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                <div className="card-header bg-white border-0 py-3 px-4">
                  <h5 className="fw-bold text-slate-800 m-0">Playlist do Curso</h5>
                </div>
                
                <div className="list-group list-group-flush border-0" style={{ maxHeight: '520px', overflowY: 'auto' }}>
                  {courseAulas.map((aula) => {
                    const modulo = courseModulos.find(m => String(m.ID_Modulo) === String(aula.ID_Modulo));
                    const watched = isWatched(aula.ID_Aula!);

                    return (
                      <button
                        key={aula.ID_Aula}
                        onClick={() => setActiveAula(aula)}
                        className={`list-group-item list-group-item-action border-0 py-3 px-4 d-flex align-items-start gap-3 transition ${
                          activeAula?.ID_Aula === aula.ID_Aula ? 'bg-primary bg-opacity-10' : ''
                        }`}
                      >
                        <div className="mt-1" onClick={(e) => { e.stopPropagation(); handleToggleWatch(aula.ID_Aula!); }} title="Alternar status de conclusão">
                          {watched ? (
                            <i className="bi bi-check-circle-fill text-success fs-5 cursor-pointer"></i>
                          ) : (
                            <i className="bi bi-play-circle text-muted fs-5 cursor-pointer"></i>
                          )}
                        </div>
                        <div className="flex-grow-1 text-start">
                          <div className={`fw-bold small ${
                            activeAula?.ID_Aula === aula.ID_Aula ? 'text-primary' : 'text-slate-800'
                          }`}>
                            {aula.Titulo}
                          </div>
                          <div className="d-flex align-items-center justify-content-between mt-1">
                            <span className="text-muted small fs-7">{aula.DuracaoMinutos} min</span>
                            <span className="badge bg-secondary-light text-slate-500 fs-8">{modulo ? modulo.Titulo.substring(0, 15) : 'Módulo'}...</span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                  {courseAulas.length === 0 && (
                    <div className="text-center py-4 text-muted small">Sem aulas cadastradas.</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )
      ) : (
        /* Inline Admin CRUD Table Manager View */
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
          <div className="card-header bg-white border-0 py-3 px-4 d-flex align-items-center justify-content-between border-bottom">
            <h5 className="fw-bold text-slate-800 m-0">Registros de Aulas</h5>
            <button 
              className="btn btn-primary btn-sm rounded-pill px-3"
              onClick={handleStartCreate}
              disabled={editingId !== null}
            >
              <i className="bi bi-plus-lg me-1"></i> Nova Aula
            </button>
          </div>

          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light text-uppercase fs-7 fw-bold text-slate-500 border-0">
                  <tr>
                    <th className="py-3 px-4" style={{ width: '80px' }}>Ordem</th>
                    <th className="py-3">Título da Aula e URL</th>
                    <th className="py-3">Módulo</th>
                    <th className="py-3" style={{ width: '130px' }}>Duração (Min)</th>
                    <th className="py-3" style={{ width: '150px' }}>Tipo Conteúdo</th>
                    <th className="py-3 text-end px-4" style={{ width: '120px' }}>Ações</th>
                  </tr>
                </thead>
                <tbody className="border-0">
                  {aulas.map((aula) => {
                    const isEditing = editingId === aula.ID_Aula;
                    const aulaModulo = modulos.find(m => String(m.ID_Modulo) === String(aula.ID_Modulo));
                    return (
                      <tr key={aula.ID_Aula} className={isEditing ? 'table-warning bg-opacity-10' : ''}>
                        {/* ORDEM */}
                        <td className="py-3 px-4 text-center">
                          {isEditing ? (
                            <input 
                              type="number" 
                              name="Ordem"
                              value={formData.Ordem}
                              onChange={handleInputChange}
                              className="form-control form-control-sm rounded-3"
                            />
                          ) : (
                            <span className="fw-bold text-slate-400">#{aula.Ordem}</span>
                          )}
                        </td>

                        {/* TITULO */}
                        <td className="py-3">
                          {isEditing ? (
                            <div className="d-flex flex-column gap-1">
                              <input 
                                type="text" 
                                name="Titulo"
                                value={formData.Titulo}
                                placeholder="Título da Aula"
                                onChange={handleInputChange}
                                className={`form-control form-control-sm rounded-3 ${errors.Titulo ? 'is-invalid' : ''}`}
                              />
                              {errors.Titulo && <span className="text-danger fw-bold fs-7">{errors.Titulo}</span>}
                              
                              <input 
                                type="text" 
                                name="URL_Conteudo"
                                value={formData.URL_Conteudo}
                                placeholder="URL do Conteúdo"
                                onChange={handleInputChange}
                                className={`form-control form-control-sm rounded-3 mt-1 ${errors.URL_Conteudo ? 'is-invalid' : ''}`}
                              />
                            </div>
                          ) : (
                            <div>
                              <div className="fw-bold text-slate-800">{aula.Titulo}</div>
                              <span className="small text-muted font-monospace text-slate-400">URL: {aula.URL_Conteudo}</span>
                            </div>
                          )}
                        </td>

                        {/* MODULO */}
                        <td className="py-3">
                          {isEditing ? (
                            <select 
                              name="ID_Modulo"
                              value={formData.ID_Modulo}
                              onChange={handleInputChange}
                              className="form-select form-select-sm rounded-3"
                            >
                              {modulos.map(m => (
                                <option key={m.ID_Modulo} value={m.ID_Modulo}>{m.Titulo}</option>
                              ))}
                            </select>
                          ) : (
                            <span className="text-slate-600 fw-semibold">{aulaModulo ? aulaModulo.Titulo : 'Módulo'}</span>
                          )}
                        </td>

                        {/* DURACAO */}
                        <td className="py-3">
                          {isEditing ? (
                            <input 
                              type="number" 
                              name="DuracaoMinutos"
                              value={formData.DuracaoMinutos}
                              onChange={handleInputChange}
                              className="form-control form-control-sm rounded-3"
                            />
                          ) : (
                            <span className="text-slate-500 font-monospace">{aula.DuracaoMinutos} min</span>
                          )}
                        </td>

                        {/* TIPO CONTEUDO */}
                        <td className="py-3">
                          {isEditing ? (
                            <select 
                              name="TipoConteudo"
                              value={formData.TipoConteudo}
                              onChange={handleInputChange}
                              className="form-select form-select-sm rounded-3"
                            >
                              <option value="Vídeo">Vídeo</option>
                              <option value="Texto">Texto</option>
                              <option value="Quiz">Quiz</option>
                            </select>
                          ) : (
                            <span className="badge bg-secondary-light text-slate-600">{aula.TipoConteudo}</span>
                          )}
                        </td>

                        {/* ACTIONS */}
                        <td className="py-3 text-end px-4">
                          {isEditing ? (
                            <div className="d-flex justify-content-end gap-2">
                              <button 
                                className="btn btn-sm btn-success rounded-circle d-flex align-items-center justify-content-center"
                                onClick={() => handleSave(aula.ID_Aula!)}
                                style={{ width: '32px', height: '32px', padding: 0 }}
                                title="Salvar"
                              >
                                <i className="bi bi-check-lg text-white"></i>
                              </button>
                              <button 
                                className="btn btn-sm btn-secondary rounded-circle d-flex align-items-center justify-content-center"
                                onClick={handleCancel}
                                style={{ width: '32px', height: '32px', padding: 0 }}
                                title="Cancelar"
                              >
                                <i className="bi bi-x-lg text-white"></i>
                              </button>
                            </div>
                          ) : (
                            <div className="d-flex justify-content-end gap-1">
                              <button 
                                className="btn btn-icon text-muted p-1 hover-primary"
                                onClick={() => handleStartEdit(aula)}
                                title="Editar"
                              >
                                <i className="bi bi-pencil-fill"></i>
                              </button>
                              <button 
                                className="btn btn-icon text-danger p-1 hover-danger"
                                onClick={() => handleDelete(aula.ID_Aula!, aula.Titulo)}
                                title="Remover"
                              >
                                <i className="bi bi-trash-fill"></i>
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                  {aulas.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center py-4 text-muted small">Sem registros de aulas.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
