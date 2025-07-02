import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ 
  isAllowed, 
  redirectPath = '/login', 
  children,
  fallback = (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Unauthorized Access</h2>
        <p className="text-gray-600">Redirecting to login page...</p>
      </div>
    </div>
  ) 
}) => {
  if (!isAllowed) {
    return fallback || <Navigate to={redirectPath} replace />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;