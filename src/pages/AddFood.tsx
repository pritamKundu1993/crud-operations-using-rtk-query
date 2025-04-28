import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router';
import toast from 'react-hot-toast';
import { useEffect, useRef, useState } from 'react';
import { useAddFoodMutation } from '@/features/foods/foodsApi';

// Zod schema for validation
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ['image/png', 'image/jpeg', 'image/jpg'];

const formSchema = z.object({
    food_name: z.string().min(1, 'Food name is required'),
    food_desc: z.string().min(10, 'Description must be at least 10 characters'),
    food_price: z
        .number({ invalid_type_error: 'Price must be a number' })
        .positive('Price must be positive')
        .finite('Price must be a valid number'),
    food_image: z
        .custom<FileList | undefined>((val) => val === undefined || val instanceof FileList, {
            message: 'Invalid file input',
        })
        .refine((files) => files && files.length > 0, 'Image is required')
        .refine(
            (files) => files && files[0] && ALLOWED_FILE_TYPES.includes(files[0].type),
            'File must be an image (PNG, JPEG, JPG)'
        )
        .refine(
            (files) => files && files[0] && files[0].size <= MAX_FILE_SIZE,
            'Image must be less than 5MB'
        ),
});

type AddFoodFormValues = z.infer<typeof formSchema>;

export default function AddFood() {
    const form = useForm<AddFoodFormValues>({
        resolver: zodResolver(formSchema),
        mode: 'onChange',
        defaultValues: {
            food_name: '',
            food_desc: '',
            food_price: 0,
            food_image: undefined,
        },
    });

    const [addFood, { isLoading }] = useAddFoodMutation();
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    // Handle image preview and file input
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        form.setValue('food_image', files || undefined, { shouldValidate: true });
        if (files && files.length > 0 && ALLOWED_FILE_TYPES.includes(files[0].type)) {
            // Clean up previous preview
            if (imagePreview) {
                URL.revokeObjectURL(imagePreview);
            }
            // Set new preview
            setImagePreview(URL.createObjectURL(files[0]));
        } else {
            // Clear preview if invalid file
            if (imagePreview) {
                URL.revokeObjectURL(imagePreview);
                setImagePreview(null);
            }
        }
    };

    // Clean up preview URL on unmount
    useEffect(() => {
        return () => {
            if (imagePreview) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview]);

    const onSubmit = async (values: AddFoodFormValues) => {
        try {
            // Create FormData for file upload
            const formData = new FormData();
            formData.append('food_name', values.food_name);
            formData.append('food_desc', values.food_desc);
            formData.append('food_price', values.food_price.toString());
            if (values.food_image && values.food_image[0]) {
                formData.append('food_image', values.food_image[0]);
            }

            const res = await addFood(formData).unwrap();
            toast.success(res.message || 'Food item added successfully!');
            navigate('/dashboard');
        } catch (err: any) {
            const errorMsg = err?.data?.message || 'Failed to add food item. Please try again.';
            toast.error(errorMsg);
            console.error('Add food failed:', err);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-6 bg-white rounded-2xl shadow-lg">
                <h2 className="text-2xl font-bold mb-6 text-center">Add Food Item</h2>

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full max-w-md">
                    {/* Food Name */}
                    <div className="flex flex-col">
                        <label htmlFor="food_name" className="text-sm font-medium text-gray-600">
                            Food Name
                        </label>
                        <input
                            id="food_name"
                            type="text"
                            {...form.register('food_name')}
                            className={`mt-2 p-3 border rounded-lg focus:outline-none focus:ring-2 transition duration-200 ${
                                form.formState.errors.food_name
                                    ? 'border-red-400 focus:ring-red-400'
                                    : 'border-gray-200 focus:ring-indigo-500'
                            } bg-white shadow-sm`}
                        />
                        {form.formState.errors.food_name && (
                            <p className="text-sm text-red-400 mt-1">
                                {form.formState.errors.food_name.message}
                            </p>
                        )}
                    </div>

                    {/* Food Description */}
                    <div className="flex flex-col">
                        <label htmlFor="food_desc" className="text-sm font-medium text-gray-600">
                            Description
                        </label>
                        <textarea
                            id="food_desc"
                            {...form.register('food_desc')}
                            className={`mt-2 p-3 border rounded-lg focus:outline-none focus:ring-2 transition duration-200 ${
                                form.formState.errors.food_desc
                                    ? 'border-red-400 focus:ring-red-400'
                                    : 'border-gray-200 focus:ring-indigo-500'
                            } bg-white shadow-sm`}
                            rows={4}
                        />
                        {form.formState.errors.food_desc && (
                            <p className="text-sm text-red-400 mt-1">
                                {form.formState.errors.food_desc.message}
                            </p>
                        )}
                    </div>

                    {/* Food Price */}
                    <div className="flex flex-col">
                        <label htmlFor="food_price" className="text-sm font-medium text-gray-600">
                            Price ($)
                        </label>
                        <input
                            id="food_price"
                            type="number"
                            step="0.01"
                            {...form.register('food_price', { valueAsNumber: true })}
                            className={`mt-2 p-3 border rounded-lg focus:outline-none focus:ring-2 transition duration-200 ${
                                form.formState.errors.food_price
                                    ? 'border-red-400 focus:ring-red-400'
                                    : 'border-gray-200 focus:ring-indigo-500'
                            } bg-white shadow-sm`}
                        />
                        {form.formState.errors.food_price && (
                            <p className="text-sm text-red-400 mt-1">
                                {form.formState.errors.food_price.message}
                            </p>
                        )}
                    </div>

                    {/* Food Image */}
                    <div className="flex flex-col">
                        <label htmlFor="food_image" className="text-sm font-medium text-gray-600">
                            Food Image
                        </label>
                        <input
                            id="food_image"
                            type="file"
                            accept="image/png,image/jpeg,image/jpg"
                            onChange={handleFileChange}
                            className={`mt-2 p-3 border rounded-lg focus:outline-none focus:ring-2 transition duration-200 ${
                                form.formState.errors.food_image
                                    ? 'border-red-400 focus:ring-red-400'
                                    : 'border-gray-200 focus:ring-indigo-500'
                            } bg-white shadow-sm`}
                            ref={fileInputRef}
                        />
                        {form.formState.errors.food_image && (
                            <p className="text-sm text-red-400 mt-1">
                                {form.formState.errors.food_image.message}
                            </p>
                        )}
                    </div>

                    {/* Image Preview */}
                    {imagePreview && (
                        <div className="flex flex-col items-center">
                            <p className="text-sm font-medium text-gray-600 mb-2">Image Preview</p>
                            <img
                                src={imagePreview}
                                alt="Food preview"
                                className="w-48 h-auto rounded-lg shadow-sm"
                            />
                        </div>
                    )}

                    {/* Button */}
                    <button
                        type="submit"
                        className="w-full mt-6 p-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200 disabled:bg-indigo-300"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Adding...' : 'Add Food'}
                    </button>
                </form>
            </div>
        </div>
    );
}
