// src/routes/router.tsx
import { createBrowserRouter } from 'react-router';
import AuthLayout from '@/Layout/AuthLayout';
import DashboardLayout from '@/Layout/DashboardLayout';
import AddFood from '@/pages/AddFood';
import FoodDetails from '@/pages/FoodDetails';
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import ErrorPage from '@/pages/ErrorPage';
import ProtectedRoute from '@/routes/ProtectedRoute';
import AuthRoute from '@/routes/AuthRoute';

export const router = createBrowserRouter([
    {
        element: <AuthRoute />, // 👈 if logged in, redirect to dashboard
        children: [
            {
                path: '/',
                element: <AuthLayout />,
                children: [
                    { index: true, element: <Login /> },
                    { path: 'signup', element: <Signup /> },
                ],
                errorElement: <ErrorPage />,
            },
        ],
    },
    {
        element: <ProtectedRoute />, // 👈 only if logged in
        children: [
            {
                path: '/dashboard',
                element: <DashboardLayout />,
                children: [
                    { index: true, element: <Home /> },
                    { path: 'food/:id', element: <FoodDetails /> },
                    { path: 'add-food', element: <AddFood /> },
                ],
                errorElement: <ErrorPage />,
            },
        ],
    },
]);
