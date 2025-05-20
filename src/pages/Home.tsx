import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useNavigate } from 'react-router';
import { toast } from 'react-hot-toast';
import { Food } from '@/types';
import SkeletonCard from '@/components/SkeletonCard';
import { useDeleteFoodMutation, useGetAllFoodsQuery } from '@/features/foods/foodsApi';
import 'nprogress/nprogress.css';
import NProgress from 'nprogress';

const ITEMS_PER_PAGE = 3;

export default function Home() {
    const navigate = useNavigate();
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [deleteFood] = useDeleteFoodMutation();
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const { data = [], isLoading } = useGetAllFoodsQuery({});
    const [foodToDelete, setFoodToDelete] = useState<Food | null>(null);

    // NProgress config
    useEffect(() => {
        NProgress.configure({ showSpinner: false });
    }, []);

    // Start/stop NProgress for loading state
    useEffect(() => {
        if (isLoading) {
            NProgress.start();
        } else {
            NProgress.done();
        }

        return () => {
            NProgress.done();
        };
    }, [isLoading]);

    // Memoize filtered foods
    const filteredFoods = useMemo(() => {
        let filtered = data;

        if (searchTerm) {
            filtered = filtered.filter((item: Food) =>
                item.food_name.toLowerCase().includes(searchTerm.toLowerCase().trim())
            );
        }

        if (minPrice) {
            filtered = filtered.filter((item: Food) => item.food_price >= Number(minPrice));
        }

        if (maxPrice) {
            filtered = filtered.filter((item: Food) => item.food_price <= Number(maxPrice));
        }

        return filtered;
    }, [data, searchTerm, minPrice, maxPrice]);

    const totalPages = Math.ceil(filteredFoods.length / ITEMS_PER_PAGE);

    useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(totalPages);
        } else if (filteredFoods.length > 0 && currentPage === 0) {
            setCurrentPage(1);
        }

        return () => {};
    }, [currentPage, totalPages, filteredFoods.length]);

    useEffect(() => {
        setCurrentPage(1);

        return () => {};
    }, [searchTerm, minPrice, maxPrice]);

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedFoods = filteredFoods.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const handlePagination = (direction: 'next' | 'prev') => {
        if (direction === 'next' && currentPage < totalPages) {
            setCurrentPage((prev) => prev + 1);
        } else if (direction === 'prev' && currentPage > 1) {
            setCurrentPage((prev) => prev - 1);
        }
    };

    const handleEdit = (food: Food) => {
        NProgress.start();
        navigate(`/dashboard/food/${food._id}`);
    };

    const handleDelete = async () => {
        if (!foodToDelete) return;

        NProgress.start();
        try {
            const response = await deleteFood(foodToDelete._id).unwrap();
            toast.success(response.message);
        } catch {
            toast.error('Failed to delete food');
        } finally {
            NProgress.done();
            setFoodToDelete(null);
        }
    };

    const openDeleteDialog = (food: Food) => {
        setFoodToDelete(food);
    };

    if (isLoading) {
        return (
            <>
                {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                    <SkeletonCard key={i} />
                ))}
            </>
        );
    }

    return (
        <div className="max-w-5xl mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6 text-center">Our Delicious Foods</h1>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 justify-center mb-6">
                <div>
                    <Label htmlFor="search">Search</Label>
                    <Input
                        id="search"
                        placeholder="Search by name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div>
                    <Label htmlFor="minPrice">Min Price</Label>
                    <Input
                        id="minPrice"
                        type="number"
                        placeholder="Min"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                    />
                </div>
                <div>
                    <Label htmlFor="maxPrice">Max Price</Label>
                    <Input
                        id="maxPrice"
                        type="number"
                        placeholder="Max"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                    />
                </div>
            </div>

            {/* Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedFoods.length > 0 ? (
                    paginatedFoods.map((food: Food) => (
                        <Card
                            key={food._id}
                            className="rounded-2xl overflow-hidden shadow-md flex flex-col"
                        >
                            <img
                                src={food.food_image}
                                alt={food.food_name}
                                className="h-48 w-full object-cover"
                            />
                            <CardContent className="p-4 flex flex-col flex-1 justify-between">
                                <div>
                                    <h2 className="text-xl font-semibold">{food.food_name}</h2>
                                    <p className="text-gray-600 text-sm mb-2">{food.food_desc}</p>
                                    <p className="text-lg font-bold mb-4">₹{food.food_price}</p>
                                </div>
                                <div className="flex gap-2 mt-auto">
                                    <Button
                                        className="w-1/2 cursor-pointer"
                                        onClick={() => handleEdit(food)}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        className="w-1/2 cursor-pointer"
                                        variant="destructive"
                                        onClick={() => openDeleteDialog(food)}
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <p className="col-span-full text-center text-red-500">No foods found</p>
                )}
            </div>

            {/* Alert Dialog */}
            <AlertDialog open={!!foodToDelete} onOpenChange={() => setFoodToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the food item
                            "{foodToDelete?.food_name}" from the database.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setFoodToDelete(null)}>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            onClick={handleDelete}
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center mt-6">
                    <Pagination className="cursor-pointer">
                        <PaginationContent className="flex gap-2">
                            <PaginationItem>
                                <PaginationPrevious
                                    onClick={() => handlePagination('prev')}
                                    className={
                                        currentPage === 1 ? 'pointer-events-none opacity-50' : ''
                                    }
                                />
                            </PaginationItem>

                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                                <PaginationItem key={pageNum}>
                                    <button
                                        onClick={() => setCurrentPage(pageNum)}
                                        className={`px-3 py-1 rounded-md text-sm font-medium ${
                                            currentPage === pageNum
                                                ? 'bg-primary text-white'
                                                : 'bg-muted text-foreground hover:bg-accent'
                                        }`}
                                    >
                                        {pageNum}
                                    </button>
                                </PaginationItem>
                            ))}

                            <PaginationItem>
                                <PaginationNext
                                    onClick={() => handlePagination('next')}
                                    className={
                                        currentPage === totalPages
                                            ? 'pointer-events-none opacity-50'
                                            : ''
                                    }
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            )}
        </div>
    );
}
