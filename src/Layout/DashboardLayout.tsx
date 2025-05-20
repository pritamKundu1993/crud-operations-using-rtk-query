// src/layout/DashboardLayout.tsx
import { Footer, Navbar } from '@/components';
import { Outlet } from 'react-router';

export default function DashboardLayout() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="p-4">
                <Outlet />
            </main>
            <footer className="bg-gray-800 text-white py-4">
                <Footer />
            </footer>
        </div>
    );
}
