import { useState, useEffect } from 'react';
import { type IModulo, moduloSchema } from '../../models/modulo.model';
import { ModuloService } from '../../services/modulo.service';
import { CursoService } from '../../services/curso.service';
import { type ICurso } from '../../models/curso.model';
import { z } from 'zod';

const service = new ModuloService();
const cursoService = new CursoService();

export const ModulosPages = () => {
  const [modulos, setModulos] = useState<IModulo[]>([]);
  const [cursos, setCursos] = useState<ICurso[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedCursoFilter, setSelectedCursoFilter] = useState('all');
  const [alert, setAlert] = useState<{ type: 'success' | 'danger'; message: string } | null>(null);

  // Inline row form state
  const [formData, setFormData] = useState<Omit<IModulo, 'ID_Modulo'>>({
    ID_Curso: '',
    Titulo: '',
    Ordem: 1
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    setLoading(true);
    try {
      const [modulosData, cursosData] = await Promise.all([
        service.listar(),
        cursoService.listar()
      ]);
      setModulos(modulosData);
      setCursos(cursosData);
    } catch {
      triggerAlert('danger', 'Erro ao carregar dados dos módulos.');
    } finally {
      setLoading(false);
    }
  };

  const triggerAlert = (type: 'success' | 'danger', message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 4000);
  };

  const handleStartEdit = (modulo: IModulo) => {
    setEditingId(modulo.ID_Modulo || null);
    setFormData({
      ID_Curso: modulo.ID_Curso,
      Titulo: modulo.Titulo,
      Ordem: modulo.Ordem
    });
    setErrors({});
  };

  const handleStartCreate = () => {
    if (editingId === 'new') return;

    const defaultCurso = cursos.length > 0 ? cursos[0].ID_Curso || '101' : '101';

    const newTemp: IModulo = {
      ID_Modulo: 'new',
      ID_Curso: defaultCurso,
      Titulo: '',
      Ordem: modulos.length + 1
    };

    setModulos(prev => [newTemp, ...prev]);
    setEditingId('new');
    setFormData({
      ID_Curso: newTemp.ID_Curso,
      Titulo: newTemp.Titulo,
      Ordem: newTemp.Ordem
    });
    setErrors({});
  };

  const handleCancel = () => {
    if (editingId === 'new') {
      setModulos(prev => prev.filter(m => m.ID_Modulo !== 'new'));
    }
    setEditingId(null);
    setErrors({});
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'Ordem' ? Number(value) : value
    }));
  };

  const handleSave = async (id: string) => {
    setErrors({});
    try {
      moduloSchema.parse(formData);

      if (id === 'new') {
        const created = await service.criar(formData);
        setModulos(prev => prev.map(m => m.ID_Modulo === 'new' ? created : m));
        triggerAlert('success', 'Módulo criado com sucesso!');
      } else {
        const updated = await service.atualizar(id, formData);
        setModulos(prev => prev.map(m => m.ID_Modulo === id ? updated : m));
        triggerAlert('success', 'Módulo atualizado com sucesso!');
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
        triggerAlert('danger', 'Erro ao salvar o módulo.');
      }
    }
  };

  const handleDelete = async (id: string, nome: string) => {
    if (window.confirm(`Deseja realmente excluir o módulo "${nome}"?`)) {
      try {
        await service.deletar(id);
        setModulos(prev => prev.filter(m => m.ID_Modulo !== id));
        triggerAlert('success', 'Módulo removido com sucesso!');
      } catch {
        triggerAlert('danger', 'Erro ao remover módulo.');
      }
    }
  };

  const filteredModulos = modulos.filter(m => {
    if (selectedCursoFilter === 'all') return true;
    return String(m.ID_Curso) === String(selectedCursoFilter);
  });

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

      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <span className="badge bg-warning-light text-warning fw-bold mb-1">CONSTRUTOR DE MÓDULOS</span>
          <h2 className="fw-extrabold text-slate-800 m-0">Módulos Cadastrados</h2>
        </div>
        <button 
          className="btn btn-primary d-flex align-items-center gap-2 shadow-sm rounded-3 py-2" 
          onClick={handleStartCreate}
          disabled={editingId !== null}
        >
          <i className="bi bi-plus-circle-fill"></i>
          <span>Novo Módulo</span>
        </button>
      </div>

      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="card-header bg-white border-0 py-3 px-4 d-flex align-items-center justify-content-between border-bottom">
          <h5 className="fw-bold text-slate-800 m-0">Filtro por Curso</h5>
          <select 
            className="form-select rounded-3 w-auto" 
            value={selectedCursoFilter}
            onChange={(e) => setSelectedCursoFilter(e.target.value)}
          >
            <option value="all">Todos os Cursos</option>
            {cursos.map(c => (
              <option key={c.ID_Curso} value={c.ID_Curso}>{c.Titulo}</option>
            ))}
          </select>
        </div>
        
        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Carregando...</span>
              </div>
            </div>
          ) : filteredModulos.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-columns-gap text-slate-300 fs-1"></i>
              <h6 className="fw-bold text-slate-600 mt-2">Nenhum módulo encontrado</h6>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light text-uppercase fs-7 fw-bold text-slate-500 border-0">
                  <tr>
                    <th className="py-3 px-4" style={{ width: '100px' }}>Ordem</th>
                    <th className="py-3">Módulo</th>
                    <th className="py-3" style={{ width: '250px' }}>Curso Associado</th>
                    <th className="py-3 text-end px-4" style={{ width: '120px' }}>Ações</th>
                  </tr>
                </thead>
                <tbody className="border-0">
                  {filteredModulos.map((modulo) => {
                    const isEditing = editingId === modulo.ID_Modulo;
                    const course = cursos.find(c => String(c.ID_Curso) === String(modulo.ID_Curso));
                    return (
                      <tr key={modulo.ID_Modulo} className={isEditing ? 'table-warning bg-opacity-10' : ''}>
                        {/* ORDEM */}
                        <td className="py-3 px-4">
                          {isEditing ? (
                            <input 
                              type="number" 
                              name="Ordem"
                              value={formData.Ordem}
                              onChange={handleInputChange}
                              className={`form-control form-control-sm rounded-3 ${errors.Ordem ? 'is-invalid border-danger' : ''}`}
                              style={{ width: '70px' }}
                            />
                          ) : (
                            <span className="fw-bold text-slate-400">#{modulo.Ordem}</span>
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
                                placeholder="Nome do módulo"
                                onChange={handleInputChange}
                                className={`form-control form-control-sm rounded-3 ${errors.Titulo ? 'is-invalid' : ''}`}
                              />
                              {errors.Titulo && <span className="text-danger fw-bold fs-7">{errors.Titulo}</span>}
                            </div>
                          ) : (
                            <div>
                              <div className="fw-bold text-slate-800">{modulo.Titulo}</div>
                            </div>
                          )}
                        </td>

                        {/* CURSO ASSOCIADO */}
                        <td className="py-3">
                          {isEditing ? (
                            <select 
                              name="ID_Curso"
                              value={formData.ID_Curso}
                              onChange={handleInputChange}
                              className="form-select form-select-sm rounded-3"
                            >
                              {cursos.map(c => (
                                <option key={c.ID_Curso} value={c.ID_Curso}>{c.Titulo}</option>
                              ))}
                            </select>
                          ) : (
                            <span className="text-slate-600 fw-semibold">{course ? course.Titulo : 'Curso não encontrado'}</span>
                          )}
                        </td>

                        {/* ACTIONS */}
                        <td className="py-3 text-end px-4">
                          {isEditing ? (
                            <div className="d-flex justify-content-end gap-2">
                              <button 
                                className="btn btn-sm btn-success rounded-circle d-flex align-items-center justify-content-center"
                                onClick={() => handleSave(modulo.ID_Modulo!)}
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
                                onClick={() => handleStartEdit(modulo)}
                                title="Editar"
                              >
                                <i className="bi bi-pencil-fill"></i>
                              </button>
                              <button 
                                className="btn btn-icon text-danger p-1 hover-danger"
                                onClick={() => handleDelete(modulo.ID_Modulo!, modulo.Titulo)}
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
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
