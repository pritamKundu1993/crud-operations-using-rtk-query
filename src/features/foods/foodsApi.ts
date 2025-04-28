// src/features/foods/foodApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const foodApi = createApi({
    reducerPath: 'foodApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'https://foodordersystem.glitch.me/api',
    }),
    tagTypes: ['Foods'],
    endpoints: (builder) => ({
        getAllFoods: builder.query({
            query: () => '/foods',
            providesTags: ['Foods'],
        }),
        getFoodById: builder.query({
            query: (id) => `/food/${id}`,
        }),
        addFood: builder.mutation({
            query: (body) => ({
                url: '/food',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Foods'],
        }),
        updateFood: builder.mutation({
            query: ({ id, formData }) => ({
                url: `/food/${id}`,
                method: 'PUT',
                body: formData,
            }),
            invalidatesTags: ['Foods'],
        }),
        deleteFood: builder.mutation({
            query: (id) => ({
                url: `/food/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Foods'],
        }),
        getFoodsByPriceRange: builder.query({
            query: ({ lim1, lim2 }) => `/foods/${lim1}/${lim2}`,
        }),
    }),
});

export const {
    useGetAllFoodsQuery,
    useGetFoodByIdQuery,
    useAddFoodMutation,
    useUpdateFoodMutation,
    useDeleteFoodMutation,
    useGetFoodsByPriceRangeQuery,
} = foodApi;
