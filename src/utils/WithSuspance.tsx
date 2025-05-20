import React, { Suspense } from 'react';

export const withSuspense = (Component: React.LazyExoticComponent<React.ComponentType<any>>) => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Component />
        </Suspense>
    );
};
