import { Navigate } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';

interface Props {
  children: React.ReactNode;
  tiposPermitidos?: string[];
}

export function ProtectedRoute({ children, tiposPermitidos }: Props) {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0F1013] flex items-center justify-center">
        <div className="font-mono text-[#D4FF00] text-sm animate-pulse tracking-widest">
          INICIALIZANDO_SISTEMA...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/" replace />;

  if (tiposPermitidos && user && !tiposPermitidos.includes(user.tipo)) {
    const destino = user.tipo === 'desenvolvedor' ? '/dev' : '/dashboard';
    return <Navigate to={destino} replace />;
  }

  return <>{children}</>;
}
