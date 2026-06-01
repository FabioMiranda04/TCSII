import { useState, useEffect } from 'react';
import { type IUsuario, usuarioSchema } from '../../models/usuario.model';
import { type IPlano } from '../../models/assinatura.model';
import { UsuariosService } from '../../services/usuario.service';
import { AssinaturaService } from '../../services/assinatura.service';
import { z } from 'zod';

const service = new UsuariosService();
const financeService = new AssinaturaService();

export const UsuarioPages = () => {
  const [usuarios, setUsuarios] = useState<IUsuario[]>([]);
  const [planos, setPlanos] = useState<IPlano[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [alert, setAlert] = useState<{ type: 'success' | 'danger'; message: string } | null>(null);

  // Form data for inline row edit
  const [formData, setFormData] = useState<Omit<IUsuario, 'ID_Usuario'>>({
    NomeCompleto: '',
    Email: '',
    SenhaHash: '',
    DataCadastro: '',
    ID_Plano: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    setLoading(true);
    try {
      const [usersData, planosData] = await Promise.all([
        service.listar(),
        financeService.listarPlanos()
      ]);
      setUsuarios(usersData);
      setPlanos(planosData);
    } catch {
      triggerAlert('danger', 'Erro ao carregar os dados.');
    } finally {
      setLoading(false);
    }
  };

  const triggerAlert = (type: 'success' | 'danger', message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 4000);
  };

  const handleStartEdit = (user: IUsuario) => {
    setEditingId(user.ID_Usuario || null);
    setFormData({
      NomeCompleto: user.NomeCompleto,
      Email: user.Email,
      SenhaHash: user.SenhaHash || '',
      DataCadastro: user.DataCadastro,
      ID_Plano: user.ID_Plano || ''
    });
    setErrors({});
  };

  const handleStartCreate = () => {
    if (editingId === 'new') return;

    const today = new Date();
    const formattedDate = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;

    const newTemp: IUsuario = {
      ID_Usuario: 'new',
      NomeCompleto: '',
      Email: '',
      SenhaHash: '',
      DataCadastro: formattedDate,
      ID_Plano: ''
    };

    setUsuarios(prev => [newTemp, ...prev]);
    setEditingId('new');
    setFormData({
      NomeCompleto: newTemp.NomeCompleto,
      Email: newTemp.Email,
      SenhaHash: newTemp.SenhaHash,
      DataCadastro: newTemp.DataCadastro,
      ID_Plano: newTemp.ID_Plano
    });
    setErrors({});
  };

  const handleCancel = () => {
    if (editingId === 'new') {
      setUsuarios(prev => prev.filter(u => u.ID_Usuario !== 'new'));
    }
    setEditingId(null);
    setErrors({});
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (id: string) => {
    setErrors({});
    try {
      usuarioSchema.parse(formData);

      if (id === 'new') {
        const created = await service.criar(formData);
        setUsuarios(prev => prev.map(u => u.ID_Usuario === 'new' ? created : u));
        triggerAlert('success', 'Usuário criado com sucesso!');
      } else {
        const updated = await service.atualizar(id, formData);
        setUsuarios(prev => prev.map(u => u.ID_Usuario === id ? updated : u));
        triggerAlert('success', 'Usuário atualizado com sucesso!');
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
        triggerAlert('danger', 'Erro ao salvar o usuário.');
      }
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Tem certeza que deseja excluir o usuário "${name}"?`)) {
      try {
        await service.deletar(id);
        setUsuarios(prev => prev.filter(u => u.ID_Usuario !== id));
        triggerAlert('success', `Usuário "${name}" removido com sucesso.`);
      } catch {
        triggerAlert('danger', 'Falha ao remover o usuário.');
      }
    }
  };

  const filteredUsuarios = usuarios.filter(u => 
    u.NomeCompleto.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.Email.toLowerCase().includes(searchQuery.toLowerCase())
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

      <div className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-between gap-3 mb-4">
        <div>
          <span className="badge bg-primary-light text-primary fw-bold mb-1">GERENCIAMENTO</span>
          <h2 className="fw-extrabold text-slate-800 m-0">Lista de Usuários</h2>
        </div>
        <button 
          className="btn btn-primary d-flex align-items-center gap-2 shadow-sm rounded-3 py-2" 
          onClick={handleStartCreate}
          disabled={editingId !== null}
        >
          <i className="bi bi-person-plus-fill"></i>
          <span>Novo Usuário</span>
        </button>
      </div>

      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="card-header bg-white border-0 py-3 px-4 d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3 border-bottom">
          <h5 className="fw-bold text-slate-800 m-0">Registros</h5>
          <div className="search-box position-relative" style={{ width: '100%', maxWidth: '300px' }}>
            <span className="position-absolute top-50 translate-middle-y start-3 text-muted">
              <i className="bi bi-search"></i>
            </span>
            <input 
              type="text" 
              placeholder="Buscar por nome ou e-mail..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-control rounded-pill ps-5 bg-light border-0" 
            />
          </div>
        </div>

        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Carregando...</span>
              </div>
              <p className="text-muted mt-2 small">Carregando lista de usuários...</p>
            </div>
          ) : filteredUsuarios.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-people-fill text-slate-300 fs-1"></i>
              <h6 className="fw-bold text-slate-600 mt-2 mb-0">Nenhum usuário encontrado</h6>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light text-uppercase fs-7 fw-bold text-slate-500 border-0">
                  <tr>
                    <th className="py-3 px-4">Nome</th>
                    <th className="py-3">E-mail</th>
                    <th className="py-3">Senha (Hash)</th>
                    <th className="py-3">Data Cadastro</th>
                    <th className="py-3" style={{ width: '180px' }}>Qual Plano?</th>
                    <th className="py-3 text-end px-4" style={{ width: '120px' }}>Ações</th>
                  </tr>
                </thead>
                <tbody className="border-0">
                  {filteredUsuarios.map((user) => {
                    const isEditing = editingId === user.ID_Usuario;
                    const userPlan = planos.find(p => String(p.ID_Plano) === String(user.ID_Plano));
                    return (
                      <tr key={user.ID_Usuario} className={isEditing ? 'table-warning bg-opacity-10' : ''}>
                        {/* NOME / ID */}
                        <td className="py-3 px-4">
                          {isEditing ? (
                            <div className="d-flex flex-column">
                              <input 
                                type="text" 
                                name="NomeCompleto"
                                value={formData.NomeCompleto}
                                placeholder="Nome Completo"
                                onChange={handleInputChange}
                                className={`form-control form-control-sm rounded-3 ${errors.NomeCompleto ? 'is-invalid' : ''}`}
                              />
                              {errors.NomeCompleto && <span className="text-danger fw-bold fs-7">{errors.NomeCompleto}</span>}
                            </div>
                          ) : (
                            <div className="d-flex align-items-center gap-3">
                              <div className="bg-primary-light text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold text-uppercase" style={{ width: '40px', height: '40px', minWidth: '40px' }}>
                                {user.NomeCompleto ? user.NomeCompleto.substring(0, 2) : 'NU'}
                              </div>
                              <div>
                                <div className="fw-bold text-slate-800">{user.NomeCompleto || 'Novo Usuário'}</div>
                                <div className="small text-muted font-monospace fs-7">ID: {user.ID_Usuario}</div>
                              </div>
                            </div>
                          )}
                        </td>

                        {/* EMAIL */}
                        <td className="py-3">
                          {isEditing ? (
                            <div className="d-flex flex-column">
                              <input 
                                type="email" 
                                name="Email"
                                value={formData.Email}
                                placeholder="exemplo@domain.com"
                                onChange={handleInputChange}
                                className={`form-control form-control-sm rounded-3 ${errors.Email ? 'is-invalid' : ''}`}
                              />
                              {errors.Email && <span className="text-danger fw-bold fs-7">{errors.Email}</span>}
                            </div>
                          ) : (
                            <span className="font-semibold text-slate-600">{user.Email}</span>
                          )}
                        </td>

                        {/* SENHA */}
                        <td className="py-3">
                          {isEditing ? (
                            <div className="d-flex flex-column">
                              <input 
                                type="password" 
                                name="SenhaHash"
                                value={formData.SenhaHash}
                                placeholder="Mínimo 6 caracteres"
                                onChange={handleInputChange}
                                className={`form-control form-control-sm rounded-3 ${errors.SenhaHash ? 'is-invalid' : ''}`}
                              />
                              {errors.SenhaHash && <span className="text-danger fw-bold fs-7">{errors.SenhaHash}</span>}
                            </div>
                          ) : (
                            <span className="text-muted font-monospace">••••••</span>
                          )}
                        </td>

                        {/* DATA CADASTRO */}
                        <td className="py-3">
                          {isEditing ? (
                            <input 
                              type="text" 
                              name="DataCadastro"
                              value={formData.DataCadastro}
                              onChange={handleInputChange}
                              className={`form-control form-control-sm rounded-3 ${errors.DataCadastro ? 'is-invalid' : ''}`}
                            />
                          ) : (
                            <span className="text-slate-500 small">{user.DataCadastro}</span>
                          )}
                        </td>

                        {/* ID PLANO (QUAL PLANO) */}
                        <td className="py-3">
                          {isEditing ? (
                            <select 
                              name="ID_Plano"
                              value={formData.ID_Plano}
                              onChange={handleInputChange}
                              className="form-select form-select-sm rounded-3"
                            >
                              <option value="">Nenhum Plano</option>
                              {planos.map(p => (
                                <option key={p.ID_Plano} value={p.ID_Plano}>{p.Nome} ({p.Preco})</option>
                              ))}
                            </select>
                          ) : (
                            <span className={`badge rounded-pill fw-bold ${
                              userPlan ? 'bg-success bg-opacity-10 text-success' : 'bg-secondary bg-opacity-10 text-muted'
                            }`}>
                              {userPlan ? userPlan.Nome : 'Nenhum'}
                            </span>
                          )}
                        </td>

                        {/* ACTIONS */}
                        <td className="py-3 text-end px-4">
                          {isEditing ? (
                            <div className="d-flex justify-content-end gap-2">
                              <button 
                                className="btn btn-sm btn-success rounded-circle d-flex align-items-center justify-content-center"
                                onClick={() => handleSave(user.ID_Usuario!)}
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
                                onClick={() => handleStartEdit(user)}
                                title="Editar"
                              >
                                <i className="bi bi-pencil-fill"></i>
                              </button>
                              <button 
                                className="btn btn-icon text-danger p-1 hover-danger"
                                onClick={() => handleDelete(user.ID_Usuario!, user.NomeCompleto)}
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
