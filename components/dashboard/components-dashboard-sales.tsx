'use client';
// import Dropdown from '@/components/dropdown';
// import IconCreditCard from '@/components/icon/icon-credit-card';
// import IconDollarSign from '@/components/icon/icon-dollar-sign';
// import IconHorizontalDots from '@/components/icon/icon-horizontal-dots';
// import IconInbox from '@/components/icon/icon-inbox';
// import IconShoppingCart from '@/components/icon/icon-shopping-cart';
// import IconTag from '@/components/icon/icon-tag';
import { IRootState } from '@/store';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
// import ReactApexChart from 'react-apexcharts';
import { useSelector } from 'react-redux';
import getAndDecryptCookie from '../libs/auth';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import logo from "../../public/logo-main.svg"
import darkLogo from "../../public/DarkLogo.png"

const ComponentsDashboardSales = () => {
    const isDark = useSelector((state: IRootState) => state.themeConfig.theme === 'dark' || state.themeConfig.isDarkMode);
    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl';

    const [isMounted, setIsMounted] = useState(false);
    const token = getAndDecryptCookie('AccessToken');
    const navigate = useRouter()
    useEffect(() => {
        if (token) {
            // console.log("token is there")
        } else {
            navigate.push("/sign-in");
        }
    })
    useEffect(() => {
        setIsMounted(true);
    }, []);

    return (
        <>

            <div className='flex items-center justify-center !h-[70svh]'>
                <div className='flex flex-col items-center justify-center'>
                    <div>
                        <Image src={isDark ? logo : darkLogo} width={200} height={200} alt='..' />
                    </div>
                    <div className='font-semibold mt-2  '>
                        Welcome to admin panel
                    </div>
                </div>
            </div>

            
        </>
    );
};

export default ComponentsDashboardSales;
