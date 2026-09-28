import { useState, useEffect } from 'react';
import { type ICategoria, categoriaSchema } from '../../models/categoria.model';
import { CategoriaService } from '../../services/categoria.service';
import { z } from 'zod';

const service = new CategoriaService();

export const CategoriasPages = () => {
  const [categorias, setCategorias] = useState<ICategoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [alert, setAlert] = useState<{ type: 'success' | 'danger'; message: string } | null>(null);

  // Form state
  const [formData, setFormData] = useState<Omit<ICategoria, 'ID_Categoria'>>({
    Nome: '',
    Descricao: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    carregarCategorias();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const carregarCategorias = async () => {
    setLoading(true);
    try {
      const data = await service.listar();
      setCategorias(data);
    } catch (err) {
      triggerAlert('danger', err instanceof Error ? err.message : 'Erro ao carregar categorias.');
    } finally {
      setLoading(false);
    }
  };

  const triggerAlert = (type: 'success' | 'danger', message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 4000);
  };

  const handleStartEdit = (cat: ICategoria) => {
    setEditingId(cat.ID_Categoria || null);
    setFormData({
      Nome: cat.Nome,
      Descricao: cat.Descricao
    });
    setErrors({});
  };

  const handleStartCreate = () => {
    if (editingId === 'new') return;

    const newTemp: ICategoria = {
      ID_Categoria: 'new',
      Nome: '',
      Descricao: ''
    };

    setCategorias(prev => [newTemp, ...prev]);
    setEditingId('new');
    setFormData({
      Nome: '',
      Descricao: ''
    });
    setErrors({});
  };

  const handleCancel = () => {
    if (editingId === 'new') {
      setCategorias(prev => prev.filter(c => c.ID_Categoria !== 'new'));
    }
    setEditingId(null);
    setErrors({});
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (id: string) => {
    setErrors({});
    try {
      categoriaSchema.parse(formData);

      if (id === 'new') {
        const created = await service.criar(formData);
        setCategorias(prev => prev.map(c => c.ID_Categoria === 'new' ? created : c));
        triggerAlert('success', 'Categoria criada com sucesso!');
      } else {
        const updated = await service.atualizar(id, formData);
        setCategorias(prev => prev.map(c => c.ID_Categoria === id ? updated : c));
        triggerAlert('success', 'Categoria atualizada com sucesso!');
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
        triggerAlert('danger', err instanceof Error ? err.message : 'Erro ao salvar a categoria.');
      }
    }
  };

  const handleDelete = async (id: string, nome: string) => {
    if (window.confirm(`Deseja realmente remover a categoria "${nome}"?`)) {
      try {
        await service.deletar(id);
        setCategorias(prev => prev.filter(c => c.ID_Categoria !== id));
        triggerAlert('success', 'Categoria removida com sucesso!');
      } catch (err) {
        triggerAlert('danger', err instanceof Error ? err.message : 'Erro ao remover categoria.');
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
          <span className="badge bg-purple-light text-purple fw-bold mb-1">CURADORIA</span>
          <h2 className="fw-extrabold text-slate-800 m-0">Categorias de Cursos</h2>
        </div>
        <button 
          className="btn btn-primary d-flex align-items-center gap-2 shadow-sm rounded-3 py-2" 
          onClick={handleStartCreate}
          disabled={editingId !== null}
        >
          <i className="bi bi-plus-circle-fill"></i>
          <span>Nova Categoria</span>
        </button>
      </div>

      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Carregando...</span>
              </div>
            </div>
          ) : categorias.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-tags text-slate-300 fs-1"></i>
              <h6 className="fw-bold text-slate-600 mt-2">Nenhuma categoria cadastrada</h6>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light text-uppercase fs-7 fw-bold text-slate-500 border-0">
                  <tr>
                    <th className="py-3 px-4" style={{ width: '80px' }}>ID</th>
                    <th className="py-3" style={{ width: '250px' }}>Nome</th>
                    <th className="py-3">Descrição</th>
                    <th className="py-3 text-end px-4" style={{ width: '120px' }}>Ações</th>
                  </tr>
                </thead>
                <tbody className="border-0">
                  {categorias.map((cat) => {
                    const isEditing = editingId === cat.ID_Categoria;
                    return (
                      <tr key={cat.ID_Categoria} className={isEditing ? 'table-warning bg-opacity-10' : ''}>
                        {/* ID */}
                        <td className="py-3 px-4 font-monospace text-slate-400">
                          #{cat.ID_Categoria}
                        </td>

                        {/* NOME */}
                        <td className="py-3">
                          {isEditing ? (
                            <div>
                              <input 
                                type="text" 
                                name="Nome"
                                value={formData.Nome}
                                onChange={handleInputChange}
                                className={`form-control form-control-sm rounded-3 ${errors.Nome ? 'is-invalid' : ''}`}
                                placeholder="Nome da Categoria"
                              />
                              {errors.Nome && <span className="text-danger fw-bold fs-7">{errors.Nome}</span>}
                            </div>
                          ) : (
                            <span className="fw-bold text-slate-800">{cat.Nome}</span>
                          )}
                        </td>

                        {/* DESCRICAO */}
                        <td className="py-3">
                          {isEditing ? (
                            <div>
                              <textarea 
                                name="Descricao"
                                value={formData.Descricao}
                                onChange={handleInputChange}
                                className={`form-control form-control-sm rounded-3 ${errors.Descricao ? 'is-invalid' : ''}`}
                                placeholder="Descrição detalhada"
                                rows={2}
                              />
                              {errors.Descricao && <span className="text-danger fw-bold fs-7">{errors.Descricao}</span>}
                            </div>
                          ) : (
                            <span className="text-slate-600 small">{cat.Descricao}</span>
                          )}
                        </td>

                        {/* ACTIONS */}
                        <td className="py-3 text-end px-4">
                          {isEditing ? (
                            <div className="d-flex justify-content-end gap-2">
                              <button 
                                className="btn btn-sm btn-success rounded-circle d-flex align-items-center justify-content-center"
                                onClick={() => handleSave(cat.ID_Categoria!)}
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
                                onClick={() => handleStartEdit(cat)}
                                title="Editar"
                              >
                                <i className="bi bi-pencil-fill"></i>
                              </button>
                              <button 
                                className="btn btn-icon text-danger p-1 hover-danger"
                                onClick={() => handleDelete(cat.ID_Categoria!, cat.Nome)}
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
