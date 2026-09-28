import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthService } from '../../services/auth.service';
import { UsuariosService } from '../../services/usuario.service';

const auth = new AuthService();
const usuarios = new UsuariosService();

export const LoginPage = () => {
  const navigate = useNavigate();
  const [modoCadastro, setModoCadastro] = useState(false);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [verSenha, setVerSenha] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErro(null);
    setEnviando(true);
    const emailLimpo = email.trim().toLowerCase();
    try {
      if (modoCadastro) {
        await usuarios.criar({ NomeCompleto: nome, Email: emailLimpo, SenhaHash: senha, DataCadastro: new Date().toISOString() });
      }
      await auth.login(emailLimpo, senha);
      navigate('/app');
    } catch (err) {
      setErro(err instanceof Error ? err.message : 'Falha ao entrar.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="container d-flex align-items-center justify-content-center min-vh-100">
      <div className="card shadow-sm" style={{ maxWidth: 420, width: '100%' }}>
        <div className="card-body p-4">
          <h1 className="h4 mb-1">{modoCadastro ? 'Criar conta' : 'Entrar'}</h1>
          <p className="text-muted small mb-4">Plataforma de Cursos</p>

          {erro && <div className="alert alert-danger py-2">{erro}</div>}

          <form onSubmit={handleSubmit}>
            {modoCadastro && (
              <div className="mb-3">
                <label className="form-label" htmlFor="nome">Nome completo</label>
                <input id="nome" className="form-control" value={nome} onChange={e => setNome(e.target.value)} required minLength={3} />
              </div>
            )}
            <div className="mb-3">
              <label className="form-label" htmlFor="email">E-mail</label>
              <input id="email" type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div className="mb-4">
              <label className="form-label" htmlFor="senha">Senha</label>
              <div className="input-group">
                <input id="senha" type={verSenha ? 'text' : 'password'} autoComplete={modoCadastro ? 'new-password' : 'current-password'} className="form-control" value={senha} onChange={e => setSenha(e.target.value)} required minLength={6} />
                <button type="button" className="btn btn-outline-secondary" onClick={() => setVerSenha(!verSenha)} aria-label="Mostrar senha">
                  <i className={'bi ' + (verSenha ? 'bi-eye-slash' : 'bi-eye')}></i>
                </button>
              </div>
            </div>
            <button className="btn btn-primary w-100" disabled={enviando}>
              {enviando ? 'Aguarde...' : modoCadastro ? 'Cadastrar e entrar' : 'Entrar'}
            </button>
          </form>

          <div className="text-center mt-3 small">
            <button type="button" className="btn btn-link btn-sm" onClick={() => { setModoCadastro(!modoCadastro); setErro(null); }}>
              {modoCadastro ? 'Já tenho conta' : 'Não tem conta? Cadastre-se'}
            </button>
            <div><Link to="/">Voltar ao início</Link></div>
          </div>
        </div>
      </div>
    </div>
  );
};
