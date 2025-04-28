// src/features/auth/authApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'https://foodordersystem.glitch.me/api/user/',
    }),
    endpoints: (builder) => ({
        signIn: builder.mutation({
            query: (credentials) => ({
                url: 'signin',
                method: 'POST',
                body: credentials,
            }),
        }),
        signUp: builder.mutation({
            query: (newUser) => ({
                url: 'signup',
                method: 'POST',
                body: newUser,
            }),
        }),
    }),
});

export const { useSignInMutation, useSignUpMutation } = authApi;
