import { Route, Routes, Navigate } from "react-router-dom";
import { TrilhasPages } from "../pages/TrilhasPages";
import { CursosPages } from "../pages/CursosPages";
import { CategoriasPages } from "../pages/CategoriasPages";
import { ModulosPages } from "../pages/ModulosPages";
import { AulasPages } from "../pages/AulasPages";
import { UsuarioPages } from "../pages/UsuarioPages";
import { AssinaturasPages } from "../pages/AssinaturasPages";
import { CertificadosPages } from "../pages/CertificadosPages";

export const AppRouter = () => {
  return (
    <Routes>
      {/* Relative child routes under /app */}
      <Route path="/" element={<Navigate to="trilhas" replace />} />
      <Route path="trilhas" element={<TrilhasPages />} />
      <Route path="cursos" element={<CursosPages />} />
      <Route path="categorias" element={<CategoriasPages />} />
      <Route path="modulos" element={<ModulosPages />} />
      <Route path="aulas" element={<AulasPages />} />
      <Route path="usuarios" element={<UsuarioPages />} />
      <Route path="assinaturas" element={<AssinaturasPages />} />
      <Route path="certificados" element={<CertificadosPages />} />
      
      {/* Fallback child route redirects to trilhas */}
      <Route path="*" element={<Navigate to="trilhas" replace />} />
    </Routes>
  );
};
