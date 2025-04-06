import { Navigate } from 'react-router-dom';
import { useAuth } from '../components/AuthProvider';

interface PublicRouteProps {
  children: React.ReactNode;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children}) => {
  const { isAuthenticated } = useAuth();
  
  if (isAuthenticated) {
    const storedData = sessionStorage.getItem('authToken');
    if (storedData){
      return <Navigate to={`/asistencia?token=${storedData}`} replace />;
    }
  }

  return <>{children}</>;
};

export default PublicRoute;
