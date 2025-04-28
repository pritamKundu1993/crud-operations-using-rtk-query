// src/layout/DashboardLayout.tsx
import Navbar from '@/components/Navbar';
import { Outlet } from 'react-router';

export default function DashboardLayout() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="p-4">
                <Outlet />
            </main>
        </div>
    );
}
