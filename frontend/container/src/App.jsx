import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { BrowserRouter, Link, Navigate, NavLink, Route, Routes, useLocation, useNavigate } from 'react-router-dom';

const AUTH_STORAGE_KEY = 'grupo-cordillera-auth';

const VALID_CREDENTIALS = {
  'ejecutivo@cordillera.cl': { password: '1234', role: 'ejecutivo' },
  'analista@cordillera.cl': { password: '1234', role: 'analista' },
  'admin@cordillera.cl': { password: '1234', role: 'admin' },
};

const AuthContext = createContext(null);

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
      role: typeof user.role === 'string' ? user.role : VALID_CREDENTIALS[email]?.role ?? 'viewer',
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
        role: credentials.role,
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

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#1E5FA8]">Grupo Cordillera</p>
          <p className="mt-1 text-sm text-slate-500">Sesión activa: {user?.email ?? 'Usuario'}</p>
        </div>

        <nav className="flex items-center gap-3 text-sm font-semibold text-slate-600">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              [
                'rounded-full px-4 py-2 transition-colors',
                isActive ? 'bg-[#1E5FA8] text-white' : 'hover:bg-slate-100 hover:text-slate-900',
              ].join(' ')
            }
          >
            Dashboard
          </NavLink>

          <button
            type="button"
            onClick={logout}
            className="rounded-full border border-slate-300 px-4 py-2 text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-50"
          >
            Cerrar sesión
          </button>
        </nav>
      </div>
    </header>
  );
}

function AppShell({ children }) {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f8fafc_0%,#eef4fb_100%)] text-slate-900">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl px-4 py-8">{children}</main>
    </div>
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
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,#dbeafe_0,#f8fafc_45%,#eff6ff_100%)] px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-[2rem] border border-white/60 bg-white/85 p-8 shadow-[0_24px_80px_rgba(15,23,42,0.12)] backdrop-blur"
      >
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#1E5FA8]">Acceso</p>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-900">Iniciar sesión</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">Ingresa para acceder al dashboard protegido.</p>

        <label className="mt-6 block text-sm font-semibold text-slate-700">
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#1E5FA8]"
            placeholder="correo@cordillera.cl"
            autoComplete="email"
          />
        </label>

        <label className="mt-4 block text-sm font-semibold text-slate-700">
          Contraseña
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#1E5FA8]"
            placeholder="Contraseña"
            autoComplete="current-password"
          />
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-6 w-full rounded-2xl bg-[#1E5FA8] px-4 py-3 font-semibold text-white transition-colors hover:bg-[#174a83] disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {isSubmitting ? 'Ingresando...' : 'Ingresar'}
        </button>

        {errorMessage ? <p className="mt-4 text-sm font-medium text-rose-600">{errorMessage}</p> : null}
      </form>
    </div>
  );
}

function DashboardPage() {
  return <div className="text-4xl font-black tracking-tight text-slate-900">Dashboard</div>;
}

function AccesoDenegadoPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-white">
      <div className="max-w-lg rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-rose-300">Acceso denegado</p>
        <h1 className="mt-3 text-3xl font-black tracking-tight">No tienes permisos para continuar</h1>
        <p className="mt-3 text-sm leading-6 text-slate-300">
          La ruta solicitada requiere otro perfil o una sesión activa.
        </p>
        <Link
          to="/login"
          className="mt-6 inline-flex rounded-2xl bg-white px-4 py-3 font-semibold text-slate-950 transition-colors hover:bg-slate-100"
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
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <AppShell>
                  <DashboardPage />
                </AppShell>
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}