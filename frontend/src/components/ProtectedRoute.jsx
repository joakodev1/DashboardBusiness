import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // Verificamos si existe el token en el almacenamiento local
  const token = localStorage.getItem('access_token');

  if (!token) {
    // Si no hay token, lo mandamos al login
    return <Navigate to="/" replace />;
  }

  // Si hay token, renderizamos el componente hijo (el Dashboard)
  return children;
};

export default ProtectedRoute;