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
    setAuthState({ isAuthenticated: false, user: null });
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
    <div className="flex min-h-screen flex-col bg-gray-50 lg:flex-row">
      <div className="flex w-full items-center justify-center bg-white px-6 py-10 lg:w-2/5 lg:px-10">
        <form onSubmit={handleSubmit} className="w-full max-w-md">
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-600 text-lg font-black text-white shadow-sm">
              GC
            </div>
            <div className="mt-6 w-full">
              <h1 className="text-4xl font-black tracking-tight text-gray-900">Bienvenido</h1>
              <p className="mt-2 text-sm text-gray-500">Inicia sesión en tu cuenta</p>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <label className="block text-sm font-semibold text-gray-700">
              Email
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                placeholder="correo@cordillera.cl"
                autoComplete="email"
              />
            </label>

            <label className="block text-sm font-semibold text-gray-700">
              Contraseña
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                placeholder="Contraseña"
                autoComplete="current-password"
              />
            </label>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-2xl bg-gradient-brand px-4 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? 'Ingresando...' : 'Ingresar'}
            </button>

            {errorMessage ? <p className="text-sm font-medium text-danger">{errorMessage}</p> : null}
          </div>
        </form>
      </div>

      <div className="relative flex w-full items-center justify-center overflow-hidden bg-gradient-brand px-8 py-12 text-white lg:w-3/5 lg:px-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.18),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.12),transparent_28%)]" />
        <div className="relative max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-white/70">Grupo Cordillera</p>
          <h2 className="mt-4 text-5xl font-black tracking-tight">Grupo Cordillera</h2>
          <p className="mt-3 text-lg text-white/80">Plataforma de Monitoreo Inteligente</p>

          <div className="mt-10 space-y-4">
            {loginFeatures.map((feature) => (
              <div key={feature} className="flex items-start gap-4 rounded-2xl border border-white/15 bg-white/10 px-5 py-4 backdrop-blur-sm">
                <span className="mt-1 h-3 w-3 rounded-full bg-white" aria-hidden="true" />
                <p className="text-sm leading-6 text-white/90">{feature}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AccesoDenegadoPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 text-gray-900">
      <div className="max-w-lg rounded-[2rem] border border-gray-200 bg-white p-8 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary-600">Acceso denegado</p>
        <h1 className="mt-3 text-3xl font-black tracking-tight">No tienes permisos para continuar</h1>
        <p className="mt-3 text-sm leading-6 text-gray-600">
          La ruta solicitada requiere otro perfil o una sesión activa.
        </p>
        <Link
          to="/login"
          className="mt-6 inline-flex rounded-lg bg-gradient-brand px-4 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
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
