import type { ReactNode } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { DashboardLayout } from './components/DashboardLayout';
import { AuthService } from './services/auth.service';

// Só entra no dashboard quem tem um token JWT válido
const RotaProtegida = ({ children }: { children: ReactNode }) =>
  AuthService.usuarioLogado() ? children : <Navigate to="/login" replace />;

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/app/*" element={<RotaProtegida><DashboardLayout /></RotaProtegida>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
