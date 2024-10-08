
import Aboutlist from '@/components/apps/about/aboutlist';
import { Metadata } from 'next';
 
import React from 'react'
export const metadata: Metadata = {
        title: 'About List',
    };
function page() {
    return <Aboutlist/>  ;
}

export default page
