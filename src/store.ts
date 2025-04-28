// src/app/store.ts
import { configureStore } from '@reduxjs/toolkit';
import { authApi } from '@/features/auth/authApi';
import { foodApi } from '@/features/foods/foodsApi';

export const store = configureStore({
    reducer: {
        [authApi.reducerPath]: authApi.reducer,
        [foodApi.reducerPath]: foodApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(authApi.middleware, foodApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
