import { useState, useEffect } from 'react';
import { type ITrilha, trilhaSchema } from '../../models/trilha.model';
import { type ICategoria } from '../../models/categoria.model';
import { TrilhaService } from '../../services/trilha.service';
import { CategoriaService } from '../../services/categoria.service';
import { z } from 'zod';

const service = new TrilhaService();
const categoriaService = new CategoriaService();

// Gradiente padrão para o card temporário de criação (os demais vêm derivados do service)
const GRADIENTS = ['linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)'];

export const TrilhasPages = () => {
  const [trilhas, setTrilhas] = useState<ITrilha[]>([]);
  const [categorias, setCategorias] = useState<ICategoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [alert, setAlert] = useState<{ type: 'success' | 'danger'; message: string } | null>(null);
  
  // Form state for inline editing
  const [formData, setFormData] = useState<Omit<ITrilha, 'ID_Trilha'>>({
    Titulo: '',
    Descricao: '',
    ID_Categoria: '',
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
      const [trilhasData, catsData] = await Promise.all([
        service.listar(),
        categoriaService.listar()
      ]);
      setTrilhas(trilhasData);
      setCategorias(catsData);
    } catch {
      triggerAlert('danger', 'Erro ao carregar as trilhas.');
    } finally {
      setLoading(false);
    }
  };

  const triggerAlert = (type: 'success' | 'danger', message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 4000);
  };

  const handleStartEdit = (trilha: ITrilha) => {
    setEditingId(trilha.ID_Trilha || null);
    setFormData({
      Titulo: trilha.Titulo,
      Descricao: trilha.Descricao,
      ID_Categoria: trilha.ID_Categoria,
    });
    setErrors({});
  };

  const handleStartCreate = () => {
    if (editingId === 'new') return;
    
    const defaultCat = categorias.length > 0 ? categorias[0].ID_Categoria || '' : '';
    const newTemp: ITrilha = {
      ID_Trilha: 'new',
      Titulo: 'Nova Trilha',
      Descricao: 'Descrição breve sobre os conteúdos desta trilha.',
      ID_Categoria: defaultCat,
      cursosCount: 0,
      gradient: GRADIENTS[0],
      icon: 'bi-compass'
    };

    setTrilhas(prev => [...prev, newTemp]);
    setEditingId('new');
    setFormData({
      Titulo: newTemp.Titulo,
      Descricao: newTemp.Descricao,
      ID_Categoria: newTemp.ID_Categoria,
    });
    setErrors({});
  };

  const handleCancel = () => {
    if (editingId === 'new') {
      setTrilhas(prev => prev.filter(t => t.ID_Trilha !== 'new'));
    }
    setEditingId(null);
    setErrors({});
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async (id: string) => {
    setErrors({});
    try {
      trilhaSchema.parse(formData);
      
      if (id === 'new') {
        const created = await service.criar(formData);
        setTrilhas(prev => prev.map(t => t.ID_Trilha === 'new' ? created : t));
        triggerAlert('success', 'Trilha criada com sucesso!');
      } else {
        const atual = trilhas.find(t => t.ID_Trilha === id);
        const updated = await service.atualizar(id, { ...formData, cursosCount: atual?.cursosCount });
        setTrilhas(prev => prev.map(t => t.ID_Trilha === id ? updated : t));
        triggerAlert('success', 'Trilha atualizada com sucesso!');
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
        triggerAlert('danger', err instanceof Error ? err.message : 'Erro ao salvar os dados.');
      }
    }
  };

  const handleDelete = async (id: string, titulo: string) => {
    if (window.confirm(`Deseja realmente remover a trilha "${titulo}"?`)) {
      try {
        await service.deletar(id);
        setTrilhas(prev => prev.filter(t => t.ID_Trilha !== id));
        triggerAlert('success', 'Trilha removida com sucesso!');
      } catch (err) {
        triggerAlert('danger', err instanceof Error ? err.message : 'Erro ao remover trilha.');
      }
    }
  };

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
          <span className="badge bg-primary-light text-primary fw-bold mb-1">PROGRAMA DE ESTUDOS</span>
          <h2 className="fw-extrabold text-slate-800 m-0">Minhas Trilhas</h2>
        </div>
        <button 
          className="btn btn-primary d-flex align-items-center gap-2 shadow-sm rounded-3 py-2" 
          onClick={handleStartCreate}
          disabled={editingId !== null}
        >
          <i className="bi bi-plus-circle-fill"></i>
          <span>Nova Trilha</span>
        </button>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
        </div>
      ) : trilhas.length === 0 ? (
        <div className="text-center py-5 bg-white rounded-4 shadow-sm">
          <i className="bi bi-compass text-slate-300 fs-1"></i>
          <h5 className="fw-bold text-slate-600 mt-2">Nenhuma trilha cadastrada</h5>
          <button className="btn btn-outline-primary btn-sm mt-3" onClick={handleStartCreate}>Criar Primeira Trilha</button>
        </div>
      ) : (
        <div className="row g-4">
          {trilhas.map((trilha) => {
            const isEditing = editingId === trilha.ID_Trilha;
            const category = categorias.find(c => String(c.ID_Categoria) === String(trilha.ID_Categoria));
            
            return (
              <div key={trilha.ID_Trilha} className="col-12 col-md-6 col-xl-6">
                <div className="card h-100 border-0 shadow-sm hover-up overflow-hidden">
                  
                  {/* Top Color Section */}
                  <div 
                    className="p-4 text-white position-relative" 
                    style={{ background: trilha.gradient || GRADIENTS[0] }}
                  >
                    {!isEditing && (
                      <div className="position-absolute top-3 end-3 d-flex gap-2">
                        <button 
                          className="btn btn-sm btn-light bg-opacity-20 text-white border-0 hover-up" 
                          onClick={() => handleStartEdit(trilha)}
                          title="Editar"
                        >
                          <i className="bi bi-pencil-fill"></i>
                        </button>
                        <button 
                          className="btn btn-sm btn-light bg-opacity-20 text-white border-0 hover-up" 
                          onClick={() => handleDelete(trilha.ID_Trilha!, trilha.Titulo)}
                          title="Excluir"
                        >
                          <i className="bi bi-trash-fill text-danger"></i>
                        </button>
                      </div>
                    )}

                    {isEditing ? (
                      <div>
                        {/* Title input inline */}
                        <div className="mb-2">
                          <label className="form-label fs-7 fw-bold text-white-50 m-0">Título da Trilha</label>
                          <input 
                            type="text" 
                            name="Titulo"
                            value={formData.Titulo}
                            onChange={handleInputChange}
                            className={`form-control form-control-sm bg-white bg-opacity-10 text-white border-0 rounded-3 ${errors.Titulo ? 'is-invalid border border-danger' : ''}`}
                          />
                          {errors.Titulo && <span className="text-danger fw-bold fs-7">{errors.Titulo}</span>}
                        </div>

                      </div>
                    ) : (
                      <>
                        <div className="d-flex align-items-center justify-content-between mb-3">
                          <div className="bg-white bg-opacity-20 p-3 rounded-3 d-inline-flex">
                            <i className={`bi ${trilha.icon || 'bi-compass'} fs-4`}></i>
                          </div>
                        </div>
                        <h4 className="fw-bold mb-1">{trilha.Titulo}</h4>
                        <div className="d-flex align-items-center justify-content-between">
                          <p className="small text-white-50 m-0">{trilha.cursosCount ?? 0} cursos inclusos</p>
                          <span className="badge bg-white bg-opacity-20 text-white fs-9">{category ? category.Nome : 'Categoria'}</span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Body Content Section */}
                  <div className="card-body p-4 d-flex flex-column justify-content-between">
                    {isEditing ? (
                      <div className="d-flex flex-column gap-2">
                        <div>
                          <label className="form-label fs-7 fw-bold text-slate-500 m-0">Descrição da Trilha</label>
                          <textarea 
                            name="Descricao"
                            value={formData.Descricao}
                            onChange={handleInputChange}
                            rows={3}
                            className={`form-control bg-light border-0 rounded-3 ${errors.Descricao ? 'is-invalid border border-danger' : ''}`}
                          />
                          {errors.Descricao && <span className="text-danger fw-bold fs-7">{errors.Descricao}</span>}
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

                        <div className="d-flex justify-content-end gap-2 mt-3">
                          <button className="btn btn-outline-secondary btn-sm rounded-pill px-3" onClick={handleCancel}>
                            Cancelar
                          </button>
                          <button className="btn btn-primary btn-sm rounded-pill px-4" onClick={() => handleSave(trilha.ID_Trilha!)}>
                            Salvar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="text-slate-600 mb-4">{trilha.Descricao}</p>
                        <div>
                          <div className="d-flex justify-content-end mt-4">
                            <button className="btn btn-outline-primary btn-sm rounded-pill px-4" onClick={() => handleStartEdit(trilha)}>
                              Configurar Trilha
                            </button>
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
