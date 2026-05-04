import React, { useContext, useEffect, useMemo, useState } from 'react';
import { BrowserRouter, Link, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import AuthContext from './AuthContext';
import Layout from './Layout';
import DatosPage from './pages/DatosPage';
import IndicadoresPage from './pages/IndicadoresPage';
import ReportesPage from './pages/ReportesPage';
import UsuariosPage from './pages/UsuariosPage';

const AUTH_STORAGE_KEY = 'grupo-cordillera-auth';

const VALID_CREDENTIALS = {
  'ejecutivo@cordillera.cl': { password: '1234', role: 'EJECUTIVO' },
  'analista@cordillera.cl': { password: '1234', role: 'ANALISTA' },
  'admin@cordillera.cl': { password: '1234', role: 'ADMINISTRADOR' },
};

const loginFeatures = [
  'Monitorea integraciones y estados críticos en tiempo real',
  'Consulta indicadores, datos y reportes en una sola experiencia',
  'Gestiona usuarios y auditoria con una vista unificada',
];

function normalizeRole(role) {
  const value = String(role ?? '').trim().toLowerCase();

  if (value === 'admin' || value === 'administrador') {
    return 'ADMINISTRADOR';
  }

  if (value === 'ejecutivo') {
    return 'EJECUTIVO';
  }

  if (value === 'analista') {
    return 'ANALISTA';
  }

  return String(role ?? '').trim().toUpperCase();
}

function normalizeStoredAuth(value) {
  if (!value || typeof value !== 'object' || !value.isAuthenticated) {
    return null;
  }

  const user = value.user;
  if (!user || typeof user !== 'object' || typeof user.email !== 'string') {
    return null;
  }

  const email = user.email.trim().toLowerCase();
  if (!email) {
    return null;
  }

  return {
    isAuthenticated: true,
    user: {
      email,
      role: normalizeRole(user.role ?? VALID_CREDENTIALS[email]?.role ?? 'EJECUTIVO'),
    },
  };
}

function readStoredAuth() {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const storedValue = window.localStorage.getItem(AUTH_STORAGE_KEY);
    return storedValue ? normalizeStoredAuth(JSON.parse(storedValue)) : null;
  } catch {
    return null;
  }
}

function AuthProvider({ children }) {
  const [authState, setAuthState] = useState(() => readStoredAuth() ?? { isAuthenticated: false, user: null });

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    if (authState.isAuthenticated) {
      window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authState));
      return;
    }

    window.localStorage.removeItem(AUTH_STORAGE_KEY);
  }, [authState]);

  const login = (email, password) => {
    const normalizedEmail = email.trim().toLowerCase();
    const credentials = VALID_CREDENTIALS[normalizedEmail];

    if (!credentials || credentials.password !== password) {
      return false;
    }

    setAuthState({
      isAuthenticated: true,
      user: {
        email: normalizedEmail,
        role: normalizeRole(credentials.role),
      },
    });

    return true;
  };

  const logout = () => {
    window.localStorage.clear();
    window.sessionStorage.clear();
    setAuthState({ isAuthenticated: false, user: null });
    window.location.href = '/login';
  };

  const value = useMemo(
    () => ({
      isAuthenticated: authState.isAuthenticated,
      user: authState.user,
      usuario: authState.user,
      login,
      logout,
    }),
    [authState],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}

function PrivateRoute({ children, allowedRoles }) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/acceso-denegado" replace />;
  }

  return children;
}

function DashboardLayout({ moduloActivo, children }) {
  const { user, logout } = useAuth();

  return (
    <Layout
      moduloActivo={moduloActivo}
      email={user?.email ?? 'Usuario'}
      role={user?.role ?? ''}
      onLogout={logout}
    >
      {children}
    </Layout>
  );
}

function LoginPage() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    const success = await Promise.resolve(login(email, password));
    setIsSubmitting(false);
    if (!success) {
      setErrorMessage('Correo o contraseña incorrectos');
      return;
    }
    const nextPath = location.state?.from?.pathname ?? '/dashboard';
    navigate(nextPath, { replace: true });
  };

  return (
    <div className="flex min-h-screen bg-slate-50">

      {/* ── Left — form panel ── */}
      <div className="flex w-full items-center justify-center px-6 py-12 lg:w-[46%]">
        <div className="w-full max-w-sm rounded-3xl border border-slate-100 bg-white p-8 shadow-2xl">

          {/* Logo */}
          <div className="flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-brand text-sm font-black text-white shadow-md">
              GC
            </div>
          </div>

          {/* Heading */}
          <div className="mt-5 text-center">
            <h1 className="text-2xl font-bold tracking-tight text-[#0F172A]">Iniciar sesión</h1>
            <p className="mt-1 text-xs text-slate-400">Grupo Cordillera · Plataforma de Monitoreo</p>
          </div>

          {/* Fields */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <label className="block text-xs font-semibold text-slate-600">
              Correo electrónico
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50/60 px-3 py-2.5 text-xs font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                placeholder="correo@cordillera.cl"
                autoComplete="email"
              />
            </label>

            <label className="block text-xs font-semibold text-slate-600">
              Contraseña
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50/60 px-3 py-2.5 text-xs font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </label>

            {errorMessage && (
              <div className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 ring-1 ring-red-100">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-red-400" aria-hidden="true" />
                <p className="text-xs font-semibold text-red-600">{errorMessage}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-gradient-brand py-2.5 text-xs font-bold text-white shadow-sm transition hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? 'Ingresando...' : 'Ingresar →'}
            </button>
          </form>

          {/* Forgot password */}
          <p className="mt-5 text-center">
            <button
              type="button"
              onClick={(e) => e.preventDefault()}
              className="text-xs font-medium text-slate-400 transition-colors hover:text-slate-600"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </p>

          {/* Hint */}
          <div className="mt-6 border-t border-slate-100 pt-4 text-center">
            <p className="text-[10px] text-slate-300">
              admin@cordillera.cl · ejecutivo@cordillera.cl · analista@cordillera.cl
            </p>
            <p className="mt-0.5 text-[10px] text-slate-300">Contraseña: <span className="font-semibold">1234</span></p>
          </div>
        </div>
      </div>

      {/* ── Right — brand panel ── */}
      <div className="relative hidden overflow-hidden bg-gradient-brand lg:flex lg:w-[54%] lg:flex-col lg:items-center lg:justify-center lg:px-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.15),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.08),transparent_25%)]" />

        <div className="relative max-w-md">
          <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-white/50">
            Grupo Cordillera
          </p>
          <h2 className="mt-4 text-4xl font-bold leading-tight tracking-tight text-white">
            Plataforma de<br />Monitoreo Inteligente
          </h2>
          <p className="mt-3 text-sm leading-6 text-white/60">
            Centraliza indicadores, audita integraciones y gestiona tu equipo desde un único panel.
          </p>

          <div className="mt-8 space-y-3">
            {loginFeatures.map((feature) => (
              <div
                key={feature}
                className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/8 px-4 py-3 backdrop-blur-sm"
              >
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-white/60" aria-hidden="true" />
                <p className="text-xs leading-5 text-white/70">{feature}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex items-center gap-3">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/30">
              Software Empresarial
            </span>
            <div className="h-px flex-1 bg-white/10" />
          </div>
        </div>
      </div>
    </div>
  );
}

function AccesoDenegadoPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm overflow-hidden rounded-xl border border-slate-100 bg-white p-8 text-center shadow-2xl">
        <div className="flex justify-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-brand text-xs font-black text-white shadow-md">
            GC
          </div>
        </div>
        <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">Acceso restringido</p>
        <h1 className="mt-1 text-lg font-bold tracking-tight text-[#0F172A]">Sin permisos para continuar</h1>
        <p className="mt-2 text-xs leading-5 text-slate-500">
          La ruta solicitada requiere otro perfil o una sesión activa.
        </p>
        <Link
          to="/login"
          className="mt-5 inline-flex rounded-lg bg-gradient-brand px-4 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90"
        >
          Volver al login
        </Link>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/acceso-denegado" element={<AccesoDenegadoPage />} />
          <Route path="/dashboard" element={<PrivateRoute><Navigate to="/dashboard/indicadores" replace /></PrivateRoute>} />
          <Route
            path="/dashboard/indicadores"
            element={
              <PrivateRoute>
                <DashboardLayout moduloActivo="Indicadores">
                  <IndicadoresPage />
                </DashboardLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard/datos"
            element={
              <PrivateRoute>
                <DashboardLayout moduloActivo="Datos">
                  <DatosPage />
                </DashboardLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard/reportes"
            element={
              <PrivateRoute>
                <DashboardLayout moduloActivo="Reportes">
                  <ReportesPage />
                </DashboardLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard/usuarios"
            element={
              <PrivateRoute allowedRoles={['ADMINISTRADOR']}>
                <DashboardLayout moduloActivo="Usuarios">
                  <UsuariosPage />
                </DashboardLayout>
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
