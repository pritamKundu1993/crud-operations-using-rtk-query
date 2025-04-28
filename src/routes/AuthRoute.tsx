// src/routes/AuthRoute.tsx
import { Navigate, Outlet } from 'react-router';

export default function AuthRoute() {
    const isLoggedIn = !!localStorage.getItem('token');
    return isLoggedIn ? <Navigate to="/dashboard" replace /> : <Outlet />;
}
