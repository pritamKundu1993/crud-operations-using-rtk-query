import { Link, useLocation } from 'react-router';

export default function ErrorPage() {
    const location = useLocation();
    const path = location.pathname;

    const isDashboard = path.startsWith('/dashboard');
    const isAuth = !isDashboard;

    const heading = isAuth ? 'Authentication Error' : 'Dashboard Page Not Found';
    const description = isAuth
        ? 'Page not found. Please login or sign up.'
        : 'Sorry, this page does not exist in your dashboard.';
    const buttonText = isAuth ? 'Back to Login' : 'Go to Dashboard Home';
    const buttonLink = isAuth ? '/' : '/dashboard';
    const bgColor = isAuth ? 'bg-red-50' : 'bg-blue-50';
    const textColor = isAuth ? 'text-red-500' : 'text-blue-600';
    const buttonColor = isAuth ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-600 hover:bg-blue-700';

    return (
        <div
            className={`flex flex-col items-center justify-center min-h-screen ${bgColor} p-6 text-center`}
        >
            <h1 className={`text-5xl font-bold ${textColor} mb-4`}>404</h1>
            <h2 className="text-2xl font-semibold mb-2">{heading}</h2>
            <p className="mb-6 text-gray-600">{description}</p>
            <Link
                to={buttonLink}
                className={`px-6 py-3 text-white rounded-lg transition ${buttonColor}`}
            >
                {buttonText}
            </Link>
            <p className="mt-4 text-gray-400 text-sm">Error at: {location.pathname}</p>
        </div>
    );
}
