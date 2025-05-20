// src/routes/router.tsx
import { createBrowserRouter, Navigate } from 'react-router';
import { lazy } from 'react';
import AuthRoute from '@/routes/AuthRoute';
import ProtectedRoute from '@/routes/ProtectedRoute';
import ErrorPage from '@/pages/ErrorPage';
import { withSuspense } from '@/utils/WithSuspance';
import { AuthLayout, DashboardLayout } from '@/Layout';
// Lazy loaded pages

const Login = lazy(() => import('@/pages/Login'));
const Signup = lazy(() => import('@/pages/Signup'));
const Home = lazy(() => import('@/pages/Home'));
const FoodDetails = lazy(() => import('@/pages/FoodDetails'));
const AddFood = lazy(() => import('@/pages/AddFood'));

export const router = createBrowserRouter([
    {
        element: <AuthRoute />,
        children: [
            {
                path: '/',
                element: <AuthLayout />,
                children: [
                    { index: true, element: <Navigate to="/log-in" /> },
                    { path: 'log-in', element: withSuspense(Login) },
                    { path: 'sign-up', element: withSuspense(Signup) },
                ],
                errorElement: <ErrorPage />,
            },
        ],
    },
    {
        element: <ProtectedRoute />,
        children: [
            {
                path: '/dashboard',
                element: <DashboardLayout />,
                children: [
                    { index: true, element: withSuspense(Home) },
                    { path: 'food/:id', element: withSuspense(FoodDetails) },
                    { path: 'add-food', element: withSuspense(AddFood) },
                ],
                errorElement: <ErrorPage />,
            },
        ],
    },
]);
