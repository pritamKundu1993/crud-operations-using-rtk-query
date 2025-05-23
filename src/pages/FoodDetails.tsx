import { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useGetFoodByIdQuery, useUpdateFoodMutation } from '@/features/foods/foodsApi';
import { Food } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'react-hot-toast';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

interface RouteState {
    food?: Food;
}

const formSchema = z.object({
    food_name: z.string().min(1, 'Food name is required'),
    food_desc: z.string().min(10, 'Description must be at least 10 characters'),
    food_price: z
        .number({ invalid_type_error: 'Price must be a number' })
        .positive('Price must be positive')
        .finite('Price must be a valid number'),
});

interface FormData {
    food_name: string;
    food_desc: string;
    food_price: number;
}

export default function FoodDetails() {
    const { id } = useParams();
    const { state } = useLocation() as { state: RouteState | null };
    const navigate = useNavigate();
    const { data: fetchedFood, isLoading } = useGetFoodByIdQuery(id, {
        skip: !!state?.food || !id,
    });
    const [updateFood, { isLoading: isUpdating }] = useUpdateFoodMutation();
    const [imageFile, setImageFile] = useState<File | null>(null);

    const initialFood = state?.food || fetchedFood;

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        mode: 'onChange',
        defaultValues: {
            food_name: '',
            food_desc: '',
            food_price: 0,
        },
    });

    useEffect(() => {
        if (initialFood) {
            form.reset({
                food_name: initialFood.food_name,
                food_desc: initialFood.food_desc,
                food_price: initialFood.food_price,
            });
        }
        return () => {
            // No async side effects to clean up here
        };
    }, [initialFood, form.reset]);

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        if (initialFood?.food_image) {
            const fetchImage = async () => {
                try {
                    const response = await fetch(initialFood.food_image, {
                        signal: controller.signal,
                    });
                    if (!response.ok) throw new Error('Failed to fetch image');
                    const blob = await response.blob();

                    const extension =
                        initialFood.food_image.split('.').pop()?.toLowerCase() || 'jpg';
                    const mimeType =
                        extension === 'png'
                            ? 'image/png'
                            : extension === 'jpeg' || extension === 'jpg'
                            ? 'image/jpeg'
                            : 'image/jpeg';
                    const file = new File([blob], `food_image.${extension}`, { type: mimeType });

                    if (isMounted) setImageFile(file);
                } catch (error) {
                    if (error.name !== 'AbortError') {
                        console.error('Image Fetch Error:', error);
                        toast.error(
                            'Failed to load existing image. Please try again or contact support.'
                        );
                    }
                }
            };
            fetchImage();
        }

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, [initialFood?.food_image]);

    useEffect(() => {
        if (isLoading || isUpdating) {
            NProgress.start();
        } else {
            NProgress.done();
        }

        return () => {
            NProgress.done(); // Ensure it always stops
        };
    }, [isLoading, isUpdating]);

    const onSubmit: SubmitHandler<FormData> = async (values) => {
        if (!id) {
            toast.error('Invalid food ID');
            return;
        }

        if (!form.formState.isValid) {
            const errors = Object.values(form.formState.errors)
                .map((err) => err.message)
                .join(', ');
            toast.error(`Please fix: ${errors}`);
            return;
        }

        if (!imageFile && initialFood?.food_image) {
            toast.error('Existing image could not be loaded. Please try again or contact support.');
            return;
        }

        const formData = new FormData();
        formData.append('food_name', values.food_name);
        formData.append('food_desc', values.food_desc);
        formData.append('food_price', values.food_price.toString());
        if (imageFile) {
            formData.append('food_image', imageFile);
        }

        try {
            const response = await updateFood({ id, formData }).unwrap();
            toast.success(response.message || 'Food item updated successfully!');
            navigate('/dashboard');
        } catch (err: any) {
            console.error('Full Error:', JSON.stringify(err, null, 2));
            let errorMsg = 'Failed to update food item. Please try again.';
            if (
                err?.data &&
                typeof err.data === 'string' &&
                err.data.includes('Cannot read property')
            ) {
                errorMsg = 'Backend error: Failed to process image. Please contact support.';
            } else if (err?.data?.message) {
                errorMsg = err.data.message;
            }
            toast.error(errorMsg);
        }
    };

    if (isLoading && !state?.food) {
        return <div>Loading...</div>;
    }

    if (!initialFood && !isLoading) {
        return <div>Food not found</div>;
    }

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h2 className="text-2xl font-bold mb-6">Edit Food</h2>
            <p className="text-sm text-gray-500 mb-4">
                The existing food image will be retained. Contact{' '}
                <a href="mailto:support@example.com" className="text-blue-500 underline">
                    support
                </a>{' '}
                to update the food image.
            </p>
            {initialFood?.food_image ? (
                <div>
                    <Label>Current Image</Label>
                    <img
                        src={initialFood.food_image}
                        alt="Current food"
                        className="mt-2 h-48 w-full object-cover rounded-md"
                    />
                </div>
            ) : (
                <p className="text-sm text-gray-500">No image available</p>
            )}
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-6">
                <div>
                    <Label htmlFor="food_name">Food Name</Label>
                    <Input
                        id="food_name"
                        {...form.register('food_name')}
                        className={form.formState.errors.food_name ? 'border-red-400' : ''}
                    />
                    {form.formState.errors.food_name && (
                        <p className="text-sm text-red-400 mt-1">
                            {form.formState.errors.food_name.message}
                        </p>
                    )}
                </div>

                <div>
                    <Label htmlFor="food_desc">Description</Label>
                    <Textarea
                        id="food_desc"
                        {...form.register('food_desc')}
                        className={form.formState.errors.food_desc ? 'border-red-400' : ''}
                        rows={4}
                    />
                    {form.formState.errors.food_desc && (
                        <p className="text-sm text-red-400 mt-1">
                            {form.formState.errors.food_desc.message}
                        </p>
                    )}
                </div>

                <div>
                    <Label htmlFor="food_price">Price (₹)</Label>
                    <Input
                        id="food_price"
                        type="number"
                        step="0.01"
                        {...form.register('food_price', { valueAsNumber: true })}
                        className={form.formState.errors.food_price ? 'border-red-400' : ''}
                    />
                    {form.formState.errors.food_price && (
                        <p className="text-sm text-red-400 mt-1">
                            {form.formState.errors.food_price.message}
                        </p>
                    )}
                </div>

                <div className="flex gap-2">
                    <Button
                        type="submit"
                        disabled={isUpdating || !form.formState.isValid || !imageFile}
                    >
                        {isUpdating ? (
                            <div className="flex items-center gap-2">
                                <svg
                                    className="animate-spin h-4 w-4 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    />
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8v8H4z"
                                    />
                                </svg>
                                Updating...
                            </div>
                        ) : (
                            'Submit'
                        )}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => navigate('/dashboard')}>
                        Cancel
                    </Button>
                </div>
            </form>
        </div>
    );
}
