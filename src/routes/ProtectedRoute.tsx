// src/routes/ProtectedRoute.tsx
import { Navigate, Outlet } from 'react-router';

export default function ProtectedRoute() {
    const isLoggedIn = !!localStorage.getItem('token');

    return isLoggedIn ? <Outlet /> : <Navigate to="/" replace />;
}
