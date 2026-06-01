import { Link } from 'react-router-dom';

export const LandingPage = () => {
  return (
    <div className="min-vh-100 d-flex flex-column bg-slate-900 text-white" style={{ background: 'radial-gradient(circle at top right, #1e1b4b 0%, #0f172a 100%)' }}>
      
      {/* Top Landing Header */}
      <header className="container d-flex align-items-center justify-content-between py-4">
        <div className="d-flex align-items-center gap-2">
          <div className="logo-icon text-purple" style={{ color: '#7c3aed', width: '32px', height: '32px' }}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <span className="fs-4 fw-extrabold text-white">mega <strong style={{ color: '#7c3aed' }}>cursos</strong></span>
        </div>
        <div>
          <Link to="/app/trilhas" className="btn btn-outline-light rounded-pill px-4 btn-sm">
            Entrar
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container my-auto py-5">
        <div className="row align-items-center g-5">
          <div className="col-12 col-lg-6 text-center text-lg-start">
            <span className="badge rounded-pill bg-purple-light text-purple fw-bold mb-3 px-3 py-2" style={{ color: '#a78bfa', backgroundColor: 'rgba(124, 58, 237, 0.15)' }}>
              🚀 PLATAFORMA DE ENSINO TECH
            </span>
            
            <h1 className="display-4 fw-extrabold mb-4 lh-sm">
              Desbloqueie seu <span style={{ background: 'linear-gradient(90deg, #a78bfa 0%, #3b82f6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>potencial tech</span> hoje.
            </h1>
            
            <p className="lead text-slate-400 mb-5" style={{ color: '#94a3b8' }}>
              Aprenda programação web, mobile, UI/UX design e backend com cursos práticos, trilhas de aprendizagem estruturadas e suporte de professores atuantes no mercado.
            </p>
            
            <div className="d-flex flex-column flex-sm-row justify-content-center justify-content-lg-start gap-3">
              <Link to="/app/trilhas" className="btn btn-primary btn-lg rounded-pill px-5 shadow-lg py-3 fw-bold d-flex align-items-center justify-content-center gap-2 hover-up" style={{ backgroundColor: '#2563eb', borderColor: '#2563eb' }}>
                <span>Acessar a Plataforma</span>
                <i className="bi bi-arrow-right-short fs-4"></i>
              </Link>
              <a href="#features" className="btn btn-outline-light btn-lg rounded-pill px-4 py-3 fw-bold">
                Saiba Mais
              </a>
            </div>
          </div>

          {/* Right Showcase Card */}
          <div className="col-12 col-lg-6">
            <div className="card border-0 rounded-4 overflow-hidden shadow-lg p-3 bg-white bg-opacity-5" style={{ backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div className="p-4 rounded-4" style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)' }}>
                <h3 className="fw-bold mb-2">Mega Cursos PRO</h3>
                <p className="small text-white-50">O ecossistema completo para acelerar sua carreira em tecnologia.</p>
                
                <div className="d-flex flex-column gap-3 mt-4">
                  <div className="d-flex align-items-center gap-3 bg-white bg-opacity-10 p-3 rounded-3">
                    <i className="bi bi-compass fs-4"></i>
                    <div>
                      <div className="fw-bold small">Trilhas de Estudo</div>
                      <span className="fs-7 text-white-50">Sequência lógica de aprendizado.</span>
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-3 bg-white bg-opacity-10 p-3 rounded-3">
                    <i className="bi bi-people fs-4"></i>
                    <div>
                      <div className="fw-bold small">Painel de Usuários</div>
                      <span className="fs-7 text-white-50">Gerencie perfis e acessos ativos.</span>
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-3 bg-white bg-opacity-10 p-3 rounded-3">
                    <i className="bi bi-award fs-4"></i>
                    <div>
                      <div className="fw-bold small">Certificados Válidos</div>
                      <span className="fs-7 text-white-50">Comprove suas habilidades conquistadas.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section id="features" className="container py-5 border-top border-secondary border-opacity-20 text-center">
        <h4 className="fw-bold mb-4">Tudo o que você precisa em um só lugar</h4>
        <div className="row g-4 justify-content-center">
          <div className="col-12 col-md-4">
            <div className="p-4 rounded-4 bg-white bg-opacity-5 h-100" style={{ border: '1px solid rgba(255,255,255,0.05)' }}>
              <i className="bi bi-lightning-fill text-warning fs-3 mb-2 d-block"></i>
              <h6 className="fw-bold">Aprenda Rápido</h6>
              <p className="small text-muted mb-0" style={{ color: '#94a3b8' }}>Aulas curtas e diretas ao ponto, com foco em prática e criação de portfolios reais.</p>
            </div>
          </div>
          <div className="col-12 col-md-4">
            <div className="p-4 rounded-4 bg-white bg-opacity-5 h-100" style={{ border: '1px solid rgba(255,255,255,0.05)' }}>
              <i className="bi bi-shield-check text-success fs-3 mb-2 d-block"></i>
              <h6 className="fw-bold">Qualidade Certificada</h6>
              <p className="small text-muted mb-0" style={{ color: '#94a3b8' }}>Cursos elaborados por profissionais renomados com anos de vivência no mercado.</p>
            </div>
          </div>
          <div className="col-12 col-md-4">
            <div className="p-4 rounded-4 bg-white bg-opacity-5 h-100" style={{ border: '1px solid rgba(255,255,255,0.05)' }}>
              <i className="bi bi-infinity text-info fs-3 mb-2 d-block"></i>
              <h6 className="fw-bold">Acesso Contínuo</h6>
              <p className="small text-muted mb-0" style={{ color: '#94a3b8' }}>Estude no seu ritmo, quando quiser e de onde estiver com nossa plataforma responsiva.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container text-center py-4 border-top border-secondary border-opacity-10 text-muted small mt-auto" style={{ color: '#64748b' }}>
        &copy; {new Date().getFullYear()} Mega Cursos. Todos os direitos reservados.
      </footer>
    </div>
  );
};
