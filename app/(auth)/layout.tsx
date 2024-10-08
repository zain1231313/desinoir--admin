import React from 'react';
import { Toaster } from 'react-hot-toast';

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
    return <div className="min-h-screen text-black dark:text-white-dark">
        <Toaster position="top-right" />
        {children}
    </div>;
};

export default AuthLayout;
