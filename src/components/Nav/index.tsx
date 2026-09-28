import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { tokenStorage } from '../../services/api.service';

export const Nav = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  // Horizontal Navigation Tabs configurations relative to /app
  const TABS = [
    { label: 'Trilhas', path: '/app/trilhas', icon: 'bi-compass' },
    { label: 'Categorias', path: '/app/categorias', icon: 'bi-tags' },
    { label: 'Cursos', path: '/app/cursos', icon: 'bi-journal-bookmark-fill' },
    { label: 'Módulos', path: '/app/modulos', icon: 'bi-columns-gap' },
    { label: 'Aulas', path: '/app/aulas', icon: 'bi-play-circle' },
    { label: 'Usuários', path: '/app/usuarios', icon: 'bi-people' },
    { label: 'Assinaturas', path: '/app/assinaturas', icon: 'bi-card-checklist' },
    { label: 'Certificados', path: '/app/certificados', icon: 'bi-patch-check' }
  ];

  return (
    <>
      {/* Header / Top Navbar */}
      <header className="main-header shadow-sm">
        <div className="header-left">
          <button 
            id="sidebar-toggle" 
            className="btn-icon" 
            onClick={toggleSidebar}
            aria-label="Abrir Menu"
          >
            <i className="fa-solid fa-bars"></i>
          </button>
        </div>
        
        <div className="header-center">
          <NavLink to="/app/trilhas" className="logo-container">
            <div className="logo-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div className="logo-text">
              <span className="logo-name">mega <strong>cursos</strong></span>
            </div>
          </NavLink>
        </div>

        <div className="header-right">
          {/* Symmetrical placeholder */}
        </div>
      </header>

      {/* Sub-navigation / Horizontal Menu Tabs */}
      <nav className="sub-navbar">
        <div className="tabs-container">
          {TABS.map((tab) => (
            <NavLink 
              key={tab.path}
              to={tab.path} 
              className={({ isActive }) => `nav-tab ${isActive ? 'active' : ''}`}
            >
              {tab.label}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Slide-out Sidebar Drawer */}
      <aside id="sidebar" className={`sidebar ${isSidebarOpen ? 'active' : ''}`}>
        <div className="sidebar-header">
          <NavLink to="/app/trilhas" className="logo-container" onClick={closeSidebar}>
            <div className="logo-icon purple">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div className="logo-text">
              <span className="logo-name">mega <strong>cursos</strong></span>
            </div>
          </NavLink>
          <button 
            id="sidebar-close" 
            className="btn-icon" 
            onClick={closeSidebar}
            aria-label="Fechar Menu"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        
        <nav className="sidebar-nav">
          <div className="sidebar-group">
            <ul>
              {TABS.map((tab) => (
                <li key={tab.path}>
                  <NavLink 
                    to={tab.path} 
                    onClick={closeSidebar}
                    className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                  >
                    <i className={`bi ${tab.icon}`}></i>
                    <span>{tab.label}</span>
                  </NavLink>
                </li>
              ))}
              
              <li className="mt-4 border-top pt-3">
                <NavLink 
                  to="/login"
                  onClick={() => { tokenStorage.clear(); closeSidebar(); }}
                  className="sidebar-link text-danger"
                  style={{ color: '#ef4444' }}
                >
                  <i className="bi bi-box-arrow-left text-danger"></i>
                  <span>Sair da Plataforma</span>
                </NavLink>
              </li>
            </ul>
          </div>
        </nav>
      </aside>

      {/* Overlay backdrop for sidebar */}
      <div 
        id="sidebar-overlay" 
        className={`sidebar-overlay ${isSidebarOpen ? 'active' : ''}`}
        onClick={closeSidebar}
      ></div>
    </>
  );
};
export default Nav;
