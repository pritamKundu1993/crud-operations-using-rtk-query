// src/pages/Login.tsx
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSignInMutation } from '@/features/auth/authApi';
import { useNavigate } from 'react-router';
import toast from 'react-hot-toast';

// Zod schema for validation
const formSchema = z.object({
    email: z.string().email('Invalid email address'),
    pass1: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
        .regex(/[^A-Za-z0-9]/, 'Must contain at least one special character'),
});

type LoginFormValues = z.infer<typeof formSchema>;

export default function Login() {
    const form = useForm<LoginFormValues>({
        resolver: zodResolver(formSchema),
        mode: 'onChange',
        defaultValues: {
            email: '',
            pass1: '',
        },
    });

    const [signin, { isLoading }] = useSignInMutation();
    const navigate = useNavigate();

    const onSubmit = async (values: LoginFormValues) => {
        try {
            const res = await signin(values).unwrap();
            // Check if status is "success"
            if (res.status === 'success') {
                localStorage.setItem('token', res.token);
                localStorage.setItem('user_id', res.user_id);
                localStorage.setItem('activeUser', res.activeUser);

                toast.success(res.message || 'Login successful!');
                navigate('/dashboard');
            } else {
                // Handle unexpected status
                toast.error(res.message || 'Unexpected response status');
            }
        } catch (err) {
            const errorMsg = 'Login failed.';
            toast.error(errorMsg);
            console.error('Login failed:', err);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-6 bg-white rounded-2xl shadow-lg">
                <h2 className="text-2xl font-bold mb-6 text-center">Log In</h2>

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full max-w-md">
                    {/* Email */}
                    <div className="flex flex-col">
                        <label htmlFor="email" className="text-sm font-medium text-gray-600">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            {...form.register('email')}
                            className={`mt-2 p-3 border rounded-lg focus:outline-none focus:ring-2 transition duration-200 ${
                                form.formState.errors.email
                                    ? 'border-red-400 focus:ring-red-400'
                                    : 'border-gray-200 focus:ring-indigo-500'
                            } bg-white shadow-sm`}
                        />
                        {form.formState.errors.email && (
                            <p className="text-sm text-red-400 mt-1">
                                {form.formState.errors.email.message}
                            </p>
                        )}
                    </div>

                    {/* Password */}
                    <div className="flex flex-col">
                        <label htmlFor="pass1" className="text-sm font-medium text-gray-600">
                            Password
                        </label>
                        <input
                            id="pass1"
                            type="password"
                            {...form.register('pass1')}
                            className={`mt-2 p-3 border rounded-lg focus:outline-none focus:ring-2 transition duration-200 ${
                                form.formState.errors.pass1
                                    ? 'border-red-400 focus:ring-red-400'
                                    : 'border-gray-200 focus:ring-indigo-500'
                            } bg-white shadow-sm`}
                        />
                        {form.formState.errors.pass1 && (
                            <p className="text-sm text-red-400 mt-1">
                                {form.formState.errors.pass1.message}
                            </p>
                        )}
                    </div>

                    {/* Button */}
                    <button
                        type="submit"
                        className="w-full mt-6 p-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200 disabled:bg-indigo-300"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Logging in...' : 'Log In'}
                    </button>
                </form>
                <div className="mt-4 text-center text-sm text-gray-600">
                    Don't have an account?{' '}
                    <a href="/signup" className="text-indigo-600 hover:underline">
                        Sign Up
                    </a>
                </div>
            </div>
        </div>
    );
}
