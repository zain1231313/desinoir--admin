import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export const metadata: Metadata = {
    title: 'Error 500',
};

const Error500 = () => {
    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden">
            <div className="ppx-6 py-16 text-center font-semibold before:container before:absolute before:left-1/2 before:aspect-square before:-translate-x-1/2 before:rounded-full before:bg-[linear-gradient(180deg,#4361EE_0%,rgba(67,97,238,0)_50.73%)] before:opacity-10 md:py-20">
                <div className="relative">
                    <Image width={50} height={50} src="/assets/images/error/500-dark.svg" alt="500" className="dark-img mx-auto -mt-10 w-full max-w-xs object-cover md:-mt-14 md:max-w-xl" />
                    <Image width={50} height={50} src="/assets/images/error/500-light.svg" alt="500" className="light-img mx-auto -mt-10 w-full max-w-xs object-cover md:-mt-14 md:max-w-xl" />
                    <p className="mt-5 text-base dark:text-white">Internal server error!</p>
                    <Link href="/" className="btn btn-gradient mx-auto !mt-7 w-max border-0 uppercase shadow-none">
                        Home
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Error500;
