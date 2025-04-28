import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSignUpMutation } from '@/features/auth/authApi';
import { useNavigate } from 'react-router';
import toast from 'react-hot-toast';

// Zod schema for validation
const formSchema = z
    .object({
        name: z.string().min(1, 'Name is required'),
        email: z.string().email('Invalid email'),
        phone: z.string().min(10, 'Phone number is too short'),
        pass1: z
            .string()
            .min(8, 'Password must be at least 8 characters')
            .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
            .regex(/[^A-Za-z0-9]/, 'Must contain at least one special character'),
        pass2: z.string().min(8, 'Confirm Password is required'),
    })
    .refine((data) => data.pass1 === data.pass2, {
        message: 'Passwords do not match',
        path: ['pass2'],
    });

type SignupFormValues = z.infer<typeof formSchema>;

export default function Signup() {
    const form = useForm<SignupFormValues>({
        resolver: zodResolver(formSchema),
        mode: 'onChange', // validate on every keystroke
        defaultValues: {
            name: '',
            email: '',
            phone: '',
            pass1: '',
            pass2: '',
        },
    });

    const [signup, { isLoading }] = useSignUpMutation();
    const navigate = useNavigate();

    const onSubmit = async (values: SignupFormValues) => {
        try {
            const { pass2, ...rest } = values;
            const res = await signup(rest).unwrap();
            console.log('Signup Success:', res);
            toast.success(res.mesaage || 'Login successful!');
            navigate('/');
        } catch (err) {
            console.error('Signup failed:', err);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                {[
                    { name: 'name', label: 'Name', type: 'text' },
                    { name: 'email', label: 'Email', type: 'email' },
                    { name: 'phone', label: 'Phone', type: 'text' },
                    { name: 'pass1', label: 'Password', type: 'password' },
                    { name: 'pass2', label: 'Confirm Password', type: 'password' },
                ].map(({ name, label, type }) => (
                    <div key={name} className="flex flex-col">
                        <label htmlFor={name} className="text-sm font-medium text-gray-700">
                            {label}
                        </label>
                        <input
                            id={name}
                            type={type}
                            {...form.register(name as keyof SignupFormValues)}
                            className={`mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 ${
                                form.formState.touchedFields[name as keyof SignupFormValues] &&
                                form.formState.errors[name as keyof SignupFormValues]
                                    ? 'border-red-500 focus:ring-red-500'
                                    : 'border-gray-300 focus:ring-blue-500'
                            }`}
                        />
                        {form.formState.touchedFields[name as keyof SignupFormValues] &&
                            form.formState.errors[name as keyof SignupFormValues] && (
                                <p className="text-sm text-red-500">
                                    {form.formState.errors[name as keyof SignupFormValues]?.message}
                                </p>
                            )}
                    </div>
                ))}

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-5 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    {isLoading ? 'Signing up...' : 'Sign Up'}
                </button>
            </form>
            <p className="mt-4 text-center text-sm text-gray-600">
                Already have an account?{' '}
                <a href="/" className="text-blue-500 hover:underline">
                    Log In
                </a>
            </p>
        </div>
    );
}
