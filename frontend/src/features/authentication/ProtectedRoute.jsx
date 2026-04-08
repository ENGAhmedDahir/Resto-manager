import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCurrentUser } from "./useCurrentUser";
import LoadingSpinner from "@/components/ui_components/LoadingSpinner";
import { toast } from "react-hot-toast";

function ProtectedRoute({ children, allowedRoles }) {
    const navigate = useNavigate();
    const { isLoading, user } = useCurrentUser();

    // Check if user is authenticated based on existence and role
    const isAuthenticated = user && user.role;

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            navigate("/login", { replace: true });
        }
    }, [isLoading, isAuthenticated, navigate]);

    useEffect(() => {
        if (!isLoading && isAuthenticated && allowedRoles && !allowedRoles.includes(user.role)) {
            toast.error("You do not have permission to access this page");
            navigate("/dashboard", { replace: true });
        }
    }, [isLoading, isAuthenticated, allowedRoles, user?.role, navigate]);

    if (isLoading) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-background">
                <LoadingSpinner message="Verifying authentication..." />
            </div>
        );
    }

    if (isAuthenticated) {
        if (allowedRoles && !allowedRoles.includes(user.role)) {
            return null; // Redirection handled in useEffect
        }
        return children;
    }

    return null; // Redirection to login handled in useEffect
}

export default ProtectedRoute;
