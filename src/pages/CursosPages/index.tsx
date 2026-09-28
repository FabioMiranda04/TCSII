import { useState, useEffect } from 'react';
import { type ICurso, cursoSchema } from '../../models/curso.model';
import { type ICategoria } from '../../models/categoria.model';
import { type IUsuario } from '../../models/usuario.model';
import { type IMatricula } from '../../models/matricula.model';
import { CursoService } from '../../services/curso.service';
import { CategoriaService } from '../../services/categoria.service';
import { UsuariosService } from '../../services/usuario.service';
import { MatriculaService } from '../../services/matricula.service';
import { z } from 'zod';

const service = new CursoService();
const categoriaService = new CategoriaService();
const usuarioService = new UsuariosService();
const matriculaService = new MatriculaService();

const NIVEIS = ['Iniciante', 'Intermediário', 'Avançado'] as const;

export const CursosPages = () => {
  const [cursos, setCursos] = useState<ICurso[]>([]);
  const [categorias, setCategorias] = useState<ICategoria[]>([]);
  const [usuarios, setUsuarios] = useState<IUsuario[]>([]);
  const [matriculas, setMatriculas] = useState<IMatricula[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Simulated Active User state for testing matriculas and plans easily
  const [activeUserId, setActiveUserId] = useState<string>('1');
  const [activeTab, setActiveTab] = useState<'all' | 'my'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [alert, setAlert] = useState<{ type: 'success' | 'danger'; message: string } | null>(null);

  // Edit states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<ICurso, 'ID_Curso'>>({
    Titulo: '',
    Descricao: '',
    ID_Instrutor: '',
    ID_Categoria: '',
    Nivel: 'Iniciante',
    DataPublicacao: '',
    TotalAulas: 0,
    TotalHoras: 0,
    Imagem: ''
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
      const [cursosData, catsData, usersData, matriculasData] = await Promise.all([
        service.listar(),
        categoriaService.listar(),
        usuarioService.listar(),
        matriculaService.listar()
      ]);
      setCursos(cursosData);
      setCategorias(catsData);
      setUsuarios(usersData);
      setMatriculas(matriculasData);
    } catch {
      triggerAlert('danger', 'Erro ao carregar catálogo de cursos.');
    } finally {
      setLoading(false);
    }
  };

  const triggerAlert = (type: 'success' | 'danger', message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 4000);
  };

  const activeUser = usuarios.find(u => String(u.ID_Usuario) === String(activeUserId));

  // Check enrollment
  const isEnrolled = (courseId: string) => {
    return matriculas.some(m => String(m.ID_Curso) === String(courseId) && String(m.ID_Usuario) === String(activeUserId));
  };

  // Perform Enrollment
  const handleEnroll = async (courseId: string) => {
    if (!activeUser) {
      triggerAlert('danger', 'Usuário não selecionado.');
      return;
    }
    // Check if user has active plan
    if (!activeUser.ID_Plano || activeUser.ID_Plano.trim() === '') {
      triggerAlert('danger', 'Matrícula bloqueada: Você deve assinar um Plano de Assinatura primeiro!');
      return;
    }

    try {
      const today = new Date();
      const formattedDate = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;

      const newMatricula: Omit<IMatricula, 'ID_Matricula'> = {
        ID_Usuario: activeUserId,
        ID_Curso: courseId,
        DataMatricula: formattedDate,
        DataConclusao: null
      };

      const created = await matriculaService.criar(newMatricula);
      setMatriculas(prev => [...prev, created]);
      triggerAlert('success', 'Matrícula realizada com sucesso! Curso liberado.');
    } catch {
      triggerAlert('danger', 'Erro ao realizar matrícula.');
    }
  };

  const handleUnenroll = async (courseId: string) => {
    const mat = matriculas.find(m => String(m.ID_Curso) === String(courseId) && String(m.ID_Usuario) === String(activeUserId));
    if (!mat) return;
    try {
      await matriculaService.deletar(mat.ID_Matricula!);
      setMatriculas(prev => prev.filter(m => m.ID_Matricula !== mat.ID_Matricula));
      triggerAlert('success', 'Inscrição cancelada com sucesso.');
    } catch {
      triggerAlert('danger', 'Erro ao cancelar inscrição.');
    }
  };

  const handleStartEdit = (curso: ICurso) => {
    setEditingId(curso.ID_Curso || null);
    setFormData({
      Titulo: curso.Titulo,
      Descricao: curso.Descricao,
      ID_Instrutor: curso.ID_Instrutor,
      ID_Categoria: curso.ID_Categoria,
      Nivel: curso.Nivel,
      DataPublicacao: curso.DataPublicacao,
      TotalAulas: curso.TotalAulas,
      TotalHoras: curso.TotalHoras,
      Imagem: curso.Imagem
    });
    setErrors({});
  };

  const handleStartCreate = () => {
    if (editingId === 'new') return;

    const defaultInstrutor = usuarios.length > 0 ? usuarios[0].ID_Usuario || '' : '';
    const defaultCategoria = categorias.length > 0 ? categorias[0].ID_Categoria || '' : '';
    const today = new Date();
    const formattedDate = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;

    const newTemp: ICurso = {
      ID_Curso: 'new',
      Titulo: '',
      Descricao: '',
      ID_Instrutor: defaultInstrutor,
      ID_Categoria: defaultCategoria,
      Nivel: 'Iniciante',
      DataPublicacao: formattedDate,
      TotalAulas: 10,
      TotalHoras: 20,
      Imagem: 'https://images.unsplash.com/photo-1516116211223-5c359a36298a?w=600&auto=format&fit=crop&q=60'
    };

    setCursos(prev => [newTemp, ...prev]);
    setEditingId('new');
    setFormData({
      Titulo: newTemp.Titulo,
      Descricao: newTemp.Descricao,
      ID_Instrutor: newTemp.ID_Instrutor,
      ID_Categoria: newTemp.ID_Categoria,
      Nivel: newTemp.Nivel,
      DataPublicacao: newTemp.DataPublicacao,
      TotalAulas: newTemp.TotalAulas,
      TotalHoras: newTemp.TotalHoras,
      Imagem: newTemp.Imagem
    });
    setErrors({});
  };

  const handleCancel = () => {
    if (editingId === 'new') {
      setCursos(prev => prev.filter(c => c.ID_Curso !== 'new'));
    }
    setEditingId(null);
    setErrors({});
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'TotalAulas' || name === 'TotalHoras' ? Number(value) : value
    }));
  };

  const handleSave = async (id: string) => {
    setErrors({});
    try {
      cursoSchema.parse(formData);

      if (id === 'new') {
        const created = await service.criar(formData);
        setCursos(prev => prev.map(c => c.ID_Curso === 'new' ? created : c));
        triggerAlert('success', 'Curso cadastrado com sucesso!');
      } else {
        const updated = await service.atualizar(id, formData);
        setCursos(prev => prev.map(c => c.ID_Curso === id ? updated : c));
        triggerAlert('success', 'Curso atualizado com sucesso!');
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
        triggerAlert('danger', 'Erro ao salvar curso.');
      }
    }
  };

  const handleDelete = async (id: string, titulo: string) => {
    if (window.confirm(`Deseja realmente remover o curso "${titulo}"?`)) {
      try {
        await service.deletar(id);
        setCursos(prev => prev.filter(c => c.ID_Curso !== id));
        triggerAlert('success', 'Curso removido com sucesso!');
      } catch {
        triggerAlert('danger', 'Erro ao remover curso.');
      }
    }
  };

  // Filter courses by tab (All vs Enrolled)
  const tabFiltered = cursos.filter(c => {
    if (activeTab === 'my') {
      return isEnrolled(c.ID_Curso!);
    }
    return true;
  });

  const filteredCursos = tabFiltered.filter(c =>
    c.Titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.Descricao.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container-fluid py-4">
      {alert && (
        <div className={`alert alert-${alert.type} alert-dismissible fade show shadow position-fixed top-4 end-4 z-1100 rounded-3 border-0`} role="alert">
          <div className="d-flex align-items-center gap-2">
            <i className={`bi ${alert.type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'}`}></i>
            <span>{alert.message}</span>
          </div>
          <button type="button" className="btn-close" onClick={() => setAlert(null)}></button>
        </div>
      )}

      {/* Header and Simulated User Switcher */}
      <div className="card border-0 shadow-sm rounded-4 bg-light mb-4">
        <div className="card-body p-3 d-flex flex-column flex-md-row align-items-center justify-content-between gap-3">
          <div className="d-flex align-items-center gap-2">
            <i className="bi bi-person-bounding-box text-primary fs-4"></i>
            <div>
              <div className="fw-bold text-slate-800">Simulador de Usuário Logado:</div>
              <span className="small text-muted">Mude de perfil para testar matrículas bloqueadas por plano.</span>
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

      {/* Course Catalogue Header */}
      <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3 mb-4">
        <div className="d-flex flex-column gap-2">
          <h2 className="fw-extrabold text-slate-800 m-0">Catálogo de Cursos</h2>
          
          {/* Tab Filter */}
          <div className="btn-group bg-white p-1 rounded-pill shadow-sm border mt-1 align-self-start">
            <button 
              className={`btn btn-sm rounded-pill px-3 ${activeTab === 'all' ? 'btn-primary' : 'btn-light border-0'}`}
              onClick={() => setActiveTab('all')}
            >
              Todos os Cursos
            </button>
            <button 
              className={`btn btn-sm rounded-pill px-3 ${activeTab === 'my' ? 'btn-primary' : 'btn-light border-0'}`}
              onClick={() => setActiveTab('my')}
            >
              Meus Cursos matriculados
            </button>
          </div>
        </div>

        <div className="d-flex align-items-center gap-2 w-100 w-md-auto justify-content-end">
          <input 
            type="text" 
            placeholder="Buscar por título..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-control rounded-pill px-3" 
            style={{ width: '200px' }} 
          />
          <button 
            className="btn btn-primary d-flex align-items-center gap-2 shadow-sm rounded-3 py-2 text-nowrap"
            onClick={handleStartCreate}
            disabled={editingId !== null}
          >
            <i className="bi bi-plus-circle-fill"></i>
            <span>Criar Curso</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
        </div>
      ) : filteredCursos.length === 0 ? (
        <div className="text-center py-5 bg-white rounded-4 shadow-sm">
          <i className="bi bi-journal-bookmark text-slate-300 fs-1"></i>
          <h5 className="fw-bold text-slate-600 mt-2">Nenhum curso disponível nesta lista</h5>
        </div>
      ) : (
        <div className="row g-4">
          {filteredCursos.map((curso) => {
            const isEditing = editingId === curso.ID_Curso;
            const courseCategory = categorias.find(c => String(c.ID_Categoria) === String(curso.ID_Categoria));
            const courseInstructor = usuarios.find(u => String(u.ID_Usuario) === String(curso.ID_Instrutor));
            const enrolled = isEnrolled(curso.ID_Curso!);

            return (
              <div key={curso.ID_Curso} className="col-12 col-sm-6 col-lg-4 col-xl-3">
                <div className="card h-100 border-0 shadow-sm hover-up overflow-hidden d-flex flex-column">
                  
                  {/* Image Header */}
                  <div className="position-relative" style={{ height: '160px' }}>
                    {isEditing ? (
                      <div className="w-100 h-100 bg-slate-800 p-2 d-flex flex-column justify-content-center">
                        <label className="text-white small fw-bold mb-1">URL da Imagem</label>
                        <input 
                          type="text" 
                          name="Imagem"
                          value={formData.Imagem}
                          onChange={handleInputChange}
                          className={`form-control form-control-sm ${errors.Imagem ? 'is-invalid' : ''}`}
                          placeholder="https://..."
                        />
                      </div>
                    ) : (
                      <>
                        <img 
                          src={curso.Imagem} 
                          alt={curso.Titulo} 
                          className="w-100 h-100 object-fit-cover"
                        />
                        <span className="position-absolute top-3 end-3 badge bg-danger fw-bold text-uppercase fs-8">
                          {curso.Nivel}
                        </span>

                        <div className="position-absolute top-3 start-3 d-flex gap-2">
                          <button 
                            className="btn btn-sm btn-dark bg-opacity-70 text-white border-0 rounded-circle"
                            onClick={() => handleStartEdit(curso)}
                            title="Editar"
                            style={{ width: '32px', height: '32px', padding: 0 }}
                          >
                            <i className="bi bi-pencil-fill fs-7"></i>
                          </button>
                          <button 
                            className="btn btn-sm btn-dark bg-opacity-70 text-white border-0 rounded-circle"
                            onClick={() => handleDelete(curso.ID_Curso!, curso.Titulo)}
                            title="Excluir"
                            style={{ width: '32px', height: '32px', padding: 0 }}
                          >
                            <i className="bi bi-trash-fill text-danger fs-7"></i>
                          </button>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Card Body */}
                  <div className="card-body p-4 d-flex flex-column justify-content-between flex-grow-1">
                    {isEditing ? (
                      <div className="d-flex flex-column gap-2 flex-grow-1">
                        <div>
                          <label className="form-label fs-7 fw-bold text-slate-500 m-0">Título</label>
                          <input 
                            type="text" 
                            name="Titulo"
                            value={formData.Titulo}
                            onChange={handleInputChange}
                            className={`form-control form-control-sm bg-light border-0 rounded-3 ${errors.Titulo ? 'is-invalid' : ''}`}
                          />
                          {errors.Titulo && <span className="text-danger fw-bold fs-7">{errors.Titulo}</span>}
                        </div>

                        <div>
                          <label className="form-label fs-7 fw-bold text-slate-500 m-0">Nível</label>
                          <select 
                            name="Nivel"
                            value={formData.Nivel}
                            onChange={handleInputChange}
                            className="form-select form-select-sm bg-light border-0 rounded-3"
                          >
                            {NIVEIS.map(n => (
                              <option key={n} value={n}>{n}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="form-label fs-7 fw-bold text-slate-500 m-0">Categoria</label>
                          <select 
                            name="ID_Categoria"
                            value={formData.ID_Categoria}
                            onChange={handleInputChange}
                            className="form-select form-select-sm bg-light border-0 rounded-3"
                          >
                            {categorias.map(cat => (
                              <option key={cat.ID_Categoria} value={cat.ID_Categoria}>{cat.Nome}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="form-label fs-7 fw-bold text-slate-500 m-0">Descrição</label>
                          <textarea 
                            name="Descricao"
                            value={formData.Descricao}
                            onChange={handleInputChange}
                            rows={2}
                            className={`form-control form-control-sm bg-light border-0 rounded-3 ${errors.Descricao ? 'is-invalid' : ''}`}
                          />
                          {errors.Descricao && <span className="text-danger fw-bold fs-7">{errors.Descricao}</span>}
                        </div>

                        <div className="row g-2">
                          <div className="col-6">
                            <label className="form-label fs-7 fw-bold text-slate-500 m-0">Aulas</label>
                            <input 
                              type="number" 
                              name="TotalAulas"
                              value={formData.TotalAulas}
                              onChange={handleInputChange}
                              className={`form-control form-control-sm bg-light border-0 rounded-3 ${errors.TotalAulas ? 'is-invalid' : ''}`}
                            />
                          </div>
                          <div className="col-6">
                            <label className="form-label fs-7 fw-bold text-slate-500 m-0">Horas</label>
                            <input 
                              type="number" 
                              name="TotalHoras"
                              value={formData.TotalHoras}
                              onChange={handleInputChange}
                              className={`form-control form-control-sm bg-light border-0 rounded-3 ${errors.TotalHoras ? 'is-invalid' : ''}`}
                            />
                          </div>
                        </div>

                        <div>
                          <label className="form-label fs-7 fw-bold text-slate-500 m-0">Instrutor</label>
                          <select 
                            name="ID_Instrutor"
                            value={formData.ID_Instrutor}
                            onChange={handleInputChange}
                            className="form-select form-select-sm bg-light border-0 rounded-3"
                          >
                            {usuarios.map(u => (
                              <option key={u.ID_Usuario} value={u.ID_Usuario}>{u.NomeCompleto}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="form-label fs-7 fw-bold text-slate-500 m-0">Data de Publicação</label>
                          <input 
                            type="text" 
                            name="DataPublicacao"
                            value={formData.DataPublicacao}
                            onChange={handleInputChange}
                            className={`form-control form-control-sm bg-light border-0 rounded-3 ${errors.DataPublicacao ? 'is-invalid' : ''}`}
                          />
                        </div>

                        <div className="d-flex justify-content-end gap-2 mt-3 pt-2 border-top">
                          <button className="btn btn-outline-secondary btn-sm rounded-pill px-3" onClick={handleCancel}>
                            Cancelar
                          </button>
                          <button className="btn btn-primary btn-sm rounded-pill px-4" onClick={() => handleSave(curso.ID_Curso!)}>
                            Salvar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex-grow-1">
                          <div className="d-flex align-items-center justify-content-between mb-1">
                            <span className="small text-muted font-monospace">#{curso.ID_Curso}</span>
                            <span className="badge bg-secondary bg-opacity-10 text-slate-600 fs-9">{courseCategory ? courseCategory.Nome : 'Categoria'}</span>
                          </div>
                          <h5 className="fw-bold mb-2 text-slate-800 line-clamp-2">{curso.Titulo}</h5>
                          <p className="small text-slate-500 mb-3 line-clamp-3">{curso.Descricao}</p>
                        </div>
                        
                        <div>
                          <div className="border-top pt-3 d-flex align-items-center justify-content-between text-muted small">
                            <span className="d-flex align-items-center gap-1">
                              <i className="bi bi-person-fill"></i> {courseInstructor ? courseInstructor.NomeCompleto : 'Prof'}
                            </span>
                            <span className="d-flex align-items-center gap-2">
                              <span><i className="bi bi-play-circle-fill"></i> {curso.TotalAulas} aulas</span>
                              <span>•</span>
                              <span>{curso.TotalHoras}h</span>
                            </span>
                          </div>

                          <div className="d-grid mt-3">
                            {enrolled ? (
                              <button 
                                className="btn btn-sm btn-subscribed rounded-3 py-2 fw-bold w-100"
                                onClick={() => handleUnenroll(curso.ID_Curso!)}
                              >
                                <span className="text-default">
                                  <i className="bi bi-check-circle-fill me-1"></i> Inscrito
                                </span>
                                <span className="text-hovered">
                                  <i className="bi bi-x-circle-fill me-1"></i> Desinscrever-se
                                </span>
                              </button>
                            ) : (
                              <button 
                                className="btn btn-primary btn-sm rounded-3 py-2 fw-bold" 
                                onClick={() => handleEnroll(curso.ID_Curso!)}
                              >
                                <i className="bi bi-plus-circle me-1"></i> Matricular-se
                              </button>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
