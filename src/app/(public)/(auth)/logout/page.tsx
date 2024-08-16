'use client';

import { getRefreshTokenFormLocalStorage } from '@/lib/utils';
import { useLogoutMutation } from '@/queries/useAuth';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useRef, Suspense } from 'react';

function LogoutComponent() {
    const { mutateAsync } = useLogoutMutation();
    const router = useRouter();
    const searchParams = useSearchParams();
    const refreshTokenFromUrl = searchParams.get('refreshToken');
    const ref = useRef<any>(null);

    useEffect(() => {
        if (ref.current || refreshTokenFromUrl !== getRefreshTokenFormLocalStorage()) return;
        ref.current = mutateAsync;
        mutateAsync().then((res) => {
            setTimeout(() => {
                ref.current = null;
            }, 1000);
            router.push('/login');
        });
    }, [mutateAsync, router, refreshTokenFromUrl]);

    return <div>Logging out...</div>;
}

export default function LogoutPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <LogoutComponent />
        </Suspense>
    );
}
