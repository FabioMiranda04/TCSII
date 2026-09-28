import { useState, useEffect } from 'react';
import { type IPlano, type IAssinatura, type IPagamento } from '../../models/assinatura.model';
import { type IUsuario } from '../../models/usuario.model';
import { AssinaturaService } from '../../services/assinatura.service';
import { UsuariosService } from '../../services/usuario.service';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';

const moeda = (v: number) => Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const financeService = new AssinaturaService();
const usuarioService = new UsuariosService();

export const AssinaturasPages = () => {
  const [planos, setPlanos] = useState<IPlano[]>([]);
  const [usuarios, setUsuarios] = useState<IUsuario[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Simulated Logged-In User
  const [activeUserId, setActiveUserId] = useState<string>(AuthService.usuarioLogado()?.ID_Usuario ?? '');

  // Checkout modal state
  const [checkoutPlano, setCheckoutPlano] = useState<IPlano | null>(null);
  const [metodoPagamento, setMetodoPagamento] = useState<string>('Cartão de Crédito');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Active Subscription details
  const [userAssinatura, setUserAssinatura] = useState<IAssinatura | null>(null);
  const [userPagamento, setUserPagamento] = useState<IPagamento | null>(null);

  const [alert, setAlert] = useState<{ type: 'success' | 'danger'; message: string } | null>(null);
  const [agora] = useState<number>(() => Date.now());

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    carregarDados();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeUserId]);

  const carregarDados = async () => {
    setLoading(true);
    try {
      const [planosData, usersData] = await Promise.all([
        financeService.listarPlanos(),
        usuarioService.listar().catch(() => [] as IUsuario[])
      ]);
      setPlanos(planosData);
      setUsuarios(usersData);
      if (!activeUserId) { setUserAssinatura(null); setUserPagamento(null); return; }

      // Fetch active signature & payment details for simulated user
      const activeSig = await financeService.buscarAssinaturaPorUsuario(activeUserId);
      setUserAssinatura(activeSig);

      if (activeSig) {
        const pagamentos = await financeService.listarPagamentos(activeSig.ID_Assinatura);
        setUserPagamento(pagamentos[pagamentos.length - 1] || null);
      } else {
        setUserPagamento(null);
      }
    } catch (e) {
      triggerAlert('danger', e instanceof Error ? e.message : 'Erro ao carregar dados financeiros.');
    } finally {
      setLoading(false);
    }
  };

  const triggerAlert = (type: 'success' | 'danger', message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 4000);
  };

  const assinaturaVigente = userAssinatura && new Date(userAssinatura.DataFim).getTime() >= agora ? userAssinatura : null;
  const activePlan = planos.find(p => String(p.ID_Plano) === String(assinaturaVigente?.ID_Plano));

  // Start checkout simulation
  const handleStartCheckout = (plano: IPlano) => {
    setCheckoutPlano(plano);
  };

  // Complete payment checkout
  const handleConfirmPayment = async () => {
    if (!checkoutPlano || !activeUserId) return;
    setIsProcessing(true);

    try {
      const today = new Date();
      const dataInicio = today.toISOString();
      const dataFimDate = new Date(today);
      dataFimDate.setMonth(today.getMonth() + Number(checkoutPlano.DuracaoMeses));
      const dataFim = dataFimDate.toISOString();

      // 1. Create Assinatura record
      const newSig: Omit<IAssinatura, 'ID_Assinatura'> = {
        ID_Usuario: activeUserId,
        ID_Plano: checkoutPlano.ID_Plano!,
        DataInicio: dataInicio,
        DataFim: dataFim
      };
      const createdSig = await financeService.criarAssinatura(newSig);

      // 2. Create Pagamento record
      const gatewayTx = 'TXN-' + (crypto.randomUUID?.() ?? String(Date.now()) + Math.random().toString(16).slice(2)).replace(/-/g, '').slice(0, 12).toUpperCase();
      const newPag: Omit<IPagamento, 'ID_Pagamento'> = {
        ID_Assinatura: createdSig.ID_Assinatura!,
        ValorPago: checkoutPlano.Preco,
        DataPagamento: dataInicio,
        MetodoPagamento: metodoPagamento,
        Id_Transacao_Gateway: gatewayTx,
        DataFim: dataFim
      };
      await financeService.criarPagamento(newPag);

      triggerAlert('success', `Assinatura de ${checkoutPlano.Nome} ativa com sucesso! Acesso aos cursos liberado.`);
      setCheckoutPlano(null);
      
      // Reload UI data
      await carregarDados();
    } catch (e) {
      triggerAlert('danger', e instanceof Error ? e.message : 'Erro ao finalizar a simulação do pagamento.');
    } finally {
      setIsProcessing(false);
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

      {/* Simulated User Selector */}
      <div className="card border-0 shadow-sm rounded-4 bg-light mb-4">
        <div className="card-body p-3 d-flex flex-column flex-md-row align-items-center justify-content-between gap-3">
          <div className="d-flex align-items-center gap-2">
            <i className="bi bi-person-bounding-box text-primary fs-4"></i>
            <div>
              <div className="fw-bold text-slate-800">Simulador de Usuário Logado:</div>
              <span className="small text-muted">A assinatura e pagamentos realizados serão vinculados a este usuário.</span>
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
          <span className="badge bg-success-light text-success fw-bold mb-1">PLANOS & FINANÇAS</span>
          <h2 className="fw-extrabold text-slate-800 m-0">Minha Assinatura</h2>
        </div>
      </div>

      {/* User Current Subscription Status */}
      <div className="card border-0 shadow-sm rounded-4 mb-5 overflow-hidden">
        <div className="bg-light-blue p-4 d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3">
          <div className="d-flex align-items-center gap-3">
            <div className="bg-primary text-white p-3 rounded-circle d-flex align-items-center justify-content-center">
              <i className="bi bi-credit-card-fill fs-4"></i>
            </div>
            <div>
              <div className="small text-slate-500 fw-bold">SUA CONTA ATUAL</div>
              <h4 className="fw-bold text-slate-800 m-0">
                {activePlan ? `Membro ${activePlan.Nome}` : 'Nenhum Plano Ativo'}
              </h4>
              {userAssinatura && (
                <span className="text-muted small">
                  Assinatura #{userAssinatura.ID_Assinatura} • Período: {ApiService.formatarData(userAssinatura.DataInicio)} até {ApiService.formatarData(userAssinatura.DataFim)}
                </span>
              )}
            </div>
          </div>
          <div className="text-md-end">
            <span className={`badge rounded-pill px-3 py-2 fw-bold text-uppercase fs-7 ${activePlan ? 'bg-success' : 'bg-danger'}`}>
              {activePlan ? 'ATIVO' : 'INATIVO'}
            </span>
            {userPagamento && (
              <div className="small text-muted mt-2">
                Método: <strong>{userPagamento.MetodoPagamento}</strong> <br/>
                Tx Gateway: <span className="font-monospace">{userPagamento.Id_Transacao_Gateway}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Plans List */}
      <h4 className="fw-bold text-slate-800 mb-4 text-center">Nossos Planos Disponíveis</h4>
      
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
        </div>
      ) : (
        <div className="row g-4 justify-content-center">
          {planos.map((plano) => {
            const isCurrent = String(plano.ID_Plano) === String(activePlan?.ID_Plano);
            const popular = planos.length > 1 && plano === [...planos].sort((a, b) => b.Preco - a.Preco)[Math.floor(planos.length / 2)];
            
            return (
              <div key={plano.ID_Plano} className="col-12 col-md-6 col-lg-4">
                <div className={`card h-100 border-0 shadow-sm rounded-4 overflow-hidden position-relative hover-up ${
                  popular ? 'border-primary border-3' : ''
                }`}>
                  {popular && (
                    <span className="position-absolute top-0 end-0 bg-primary text-white px-3 py-1 fw-bold fs-7 rounded-bottom-start">
                      RECOMENDADO
                    </span>
                  )}
                  
                  <div className="p-4 text-center border-bottom bg-light">
                    <h5 className="fw-bold text-slate-800 text-uppercase mb-2 mt-2">{plano.Nome}</h5>
                    <h2 className="fw-extrabold text-slate-900 mb-1">{moeda(plano.Preco)}</h2>
                    <span className="text-muted small">Validade: {plano.DuracaoMeses} Meses</span>
                  </div>
                  
                  <div className="card-body p-4 d-flex flex-column justify-content-between">
                    <p className="text-slate-600 mb-4 text-center small">{plano.Descricao}</p>

                    <button 
                      className={`btn w-100 py-2 fw-bold rounded-pill ${
                        isCurrent ? 'btn-success' : 'btn-outline-primary'
                      }`}
                      onClick={() => handleStartCheckout(plano)}
                      disabled={isCurrent}
                    >
                      {isCurrent ? 'Plano Ativo' : 'Adquirir Plano'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Styled Checkout simulation Modal */}
      {checkoutPlano && (
        <div className="modal fade show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(15, 23, 42, 0.5)', backdropFilter: 'blur(2px)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div className="modal-header border-bottom py-3 px-4">
                <h5 className="modal-title fw-bold text-slate-800">
                  <i className="bi bi-wallet2 me-2 text-primary"></i>Simulador de Pagamento
                </h5>
                <button type="button" className="btn-close" onClick={() => setCheckoutPlano(null)}></button>
              </div>
              
              <div className="modal-body p-4">
                <div className="p-3 bg-light rounded-3 mb-3 border">
                  <div className="small text-muted">PLANO SELECIONADO</div>
                  <h5 className="fw-bold text-slate-800 m-0">{checkoutPlano.Nome}</h5>
                  <div className="fw-bold text-primary fs-4 mt-1">{moeda(checkoutPlano.Preco)}</div>
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-bold text-slate-600">Selecione o Método de Pagamento</label>
                  <select 
                    className="form-select rounded-3"
                    value={metodoPagamento}
                    onChange={(e) => setMetodoPagamento(e.target.value)}
                  >
                    <option value="Cartão de Crédito">Cartão de Crédito</option>
                    <option value="PIX">PIX</option>
                    <option value="Boleto Bancário">Boleto Bancário</option>
                  </select>
                </div>

                <div className="alert alert-info border-0 rounded-3 mb-0 small">
                  <i className="bi bi-info-circle-fill me-2"></i>
                  Esta é uma transação de simulação acadêmica. Nenhum valor monetário real será cobrado. Ao confirmar, o acesso aos cursos será imediatamente desbloqueado.
                </div>
              </div>

              <div className="modal-footer border-top py-3 px-4 d-flex gap-2">
                <button type="button" className="btn btn-outline-secondary rounded-3 px-4" onClick={() => setCheckoutPlano(null)} disabled={isProcessing}>
                  Cancelar
                </button>
                <button type="button" className="btn btn-primary rounded-3 px-4 d-flex align-items-center gap-2" onClick={handleConfirmPayment} disabled={isProcessing}>
                  {isProcessing && <span className="spinner-border spinner-border-sm" role="status"></span>}
                  <span>Confirmar Pagamento</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
