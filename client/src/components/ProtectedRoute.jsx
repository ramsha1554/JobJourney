import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Briefcase, Loader2 } from 'lucide-react';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gray-50 gap-4">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center">
                        <Briefcase size={16} color="white" />
                    </div>
                    <span className="text-xl font-bold text-gray-900">Job<span className="text-teal-600">Journey</span></span>
                </div>
                <Loader2 className="w-6 h-6 animate-spin text-teal-600" />
                <div className="text-center">
                    <p className="text-sm font-medium text-gray-700">Starting up the server...</p>
                    <p className="text-xs text-gray-400 mt-1">This may take up to 30 seconds on first load</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/landing" state={{ from: location }} replace />;
    }

    return children;
};

export default ProtectedRoute;
