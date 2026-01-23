import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from "../../contexts/AuthContext";
import { LoadingSkeleton } from '../LoadingSkeleton';

export function ProtectedRoute() {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return <LoadingSkeleton />;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }



    return <Outlet />;
}
