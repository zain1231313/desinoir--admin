import ComponentsDashboardSales from '@/components/dashboard/components-dashboard-sales';
import { Metadata } from 'next';
import React from 'react';
// import BoxedSignIn from '../(auth)/auth/boxed-signin/page';

export const metadata: Metadata = {
    title: 'Dashboard',
};

const Sales = () => {
    return <ComponentsDashboardSales />;
};

export default Sales;
