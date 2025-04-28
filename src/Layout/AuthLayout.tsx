// src/layout/AuthLayout.tsx
import { Outlet } from 'react-router';

export default function AuthLayout() {
    return (
        <div className="min-h-screen flex justify-center items-center bg-gray-100">
            <div className="w-full max-w-md">
                <Outlet />
            </div>
        </div>
    );
}
