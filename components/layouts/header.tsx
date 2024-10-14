'use client';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { IRootState } from '@/store';
import { toggleTheme, toggleSidebar, toggleRTL } from '@/store/themeConfigSlice';
import Dropdown from '@/components/dropdown';
import IconMenu from '@/components/icon/icon-menu';
import IconSun from '@/components/icon/icon-sun';
import IconMoon from '@/components/icon/icon-moon';
import IconLaptop from '@/components/icon/icon-laptop';
import IconLogout from '@/components/icon/icon-logout';
import { usePathname, useRouter } from 'next/navigation';
import getAndDecryptCookie, { clearAllCookies } from '../libs/auth';
import Image from 'next/image';
import logo from '../../public/logo-main.svg';
import darkLogo from '../../public/DarkLogo.png';
import Loading from './loading';

const Header = () => {
    const pathname = usePathname();
    const dispatch = useDispatch();
    const router = useRouter();

    useEffect(() => {
        const selector = document.querySelector('ul.horizontal-menu a[href="' + window.location.pathname + '"]');
        if (selector) {
            const all: any = document.querySelectorAll('ul.horizontal-menu .nav-link.active');
            for (let i = 0; i < all.length; i++) {
                all[0]?.classList.remove('active');
            }

            let allLinks = document.querySelectorAll('ul.horizontal-menu a.active');
            for (let i = 0; i < allLinks.length; i++) {
                const element = allLinks[i];
                element?.classList.remove('active');
            }
            selector?.classList.add('active');

            const ul: any = selector.closest('ul.sub-menu');
            if (ul) {
                let ele: any = ul.closest('li.menu').querySelectorAll('.nav-link');
                if (ele) {
                    ele = ele[0];
                    setTimeout(() => {
                        ele?.classList.add('active');
                    });
                }
            }
        }
    }, [pathname]);

    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl';

    const themeConfig = useSelector((state: IRootState) => state.themeConfig);

    const token = getAndDecryptCookie('AccessToken');
    const Email = getAndDecryptCookie('Email');
    const UserName = getAndDecryptCookie('Name');

    // useEffect(() => {
    //     if (!token) {
    //         window.location.reload();
    //         router.push('/sign-in');
    //     }
    // }, [token]);
    const isDark = useSelector((state: IRootState) => state.themeConfig.theme === 'dark' || state.themeConfig.isDarkMode);

    const handlelogout = () => {
        clearAllCookies();
        router.push('/sign-in');
    };

    return (
        <>
            {!token ? <Loading /> :
                <header className={`z-40 ${themeConfig.semidark && themeConfig.menu === 'horizontal' ? 'dark' : ''}`}>
                    <div className="shadow-sm">
                        <div className="relative flex w-full items-center bg-white px-5 py-2.5 dark:bg-black">
                            <div className="horizontal-logo flex items-center justify-between lg:hidden ltr:mr-2 rtl:ml-2">
                                <Link href="/" className="main-logo flex shrink-0 items-center">
                                    <Image src={isDark ? logo : darkLogo} width={150} height={150} alt=".." />
                                    {/* <span className="hidden align-middle text-2xl  font-semibold  transition-all duration-300 ltr:ml-1.5 rtl:mr-1.5 dark:text-white-light md:inline">Desinoir</span> */}
                                </Link>
                                <button
                                    type="button"
                                    className="collapse-icon flex flex-none rounded-full bg-white-light/40 p-2 hover:bg-white-light/90 hover:text-primary dark:bg-dark/40 dark:text-[#d0d2d6] dark:hover:bg-dark/60 dark:hover:text-primary lg:hidden ltr:ml-2 rtl:mr-2"
                                    onClick={() => dispatch(toggleSidebar())}
                                >
                                    <IconMenu className="h-5 w-5" />
                                </button>
                            </div>

                            <div className="flex items-center justify-end space-x-1.5 dark:text-[#d0d2d6] sm:flex-1 lg:space-x-2 ltr:ml-auto ltr:sm:ml-0 rtl:mr-auto rtl:space-x-reverse sm:rtl:mr-0">
                                <div>
                                    {themeConfig.theme === 'light' ? (
                                        <button
                                            className={`${themeConfig.theme === 'light' &&
                                                'flex items-center rounded-full bg-white-light/40 p-2 hover:bg-white-light/90 hover:text-primary dark:bg-dark/40 dark:hover:bg-dark/60'
                                                }`}
                                            onClick={() => dispatch(toggleTheme('dark'))}
                                        >
                                            <IconSun />
                                        </button>
                                    ) : (
                                        ''
                                    )}
                                    {themeConfig.theme === 'dark' && (
                                        <button
                                            className={`${themeConfig.theme === 'dark' &&
                                                'flex items-center rounded-full bg-white-light/40 p-2 hover:bg-white-light/90 hover:text-primary dark:bg-dark/40 dark:hover:bg-dark/60'
                                                }`}
                                            onClick={() => dispatch(toggleTheme('system'))}
                                        >
                                            <IconMoon />
                                        </button>
                                    )}
                                    {themeConfig.theme === 'system' && (
                                        <button
                                            className={`${themeConfig.theme === 'system' &&
                                                'flex items-center rounded-full bg-white-light/40 p-2 hover:bg-white-light/90 hover:text-primary dark:bg-dark/40 dark:hover:bg-dark/60'
                                                }`}
                                            onClick={() => dispatch(toggleTheme('light'))}
                                        >
                                            <IconLaptop />
                                        </button>
                                    )}
                                </div>

                                <div className="dropdown flex shrink-0">
                                    <Dropdown
                                        offset={[0, 8]}
                                        placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                                        btnClassName="relative group block"
                                        button={<Image width={50} height={50} className="h-9 w-9 rounded-full object-cover saturate-50 group-hover:saturate-100" src="/assets/images/user-profile.jpg" alt="userProfile" />}
                                    >
                                        <ul className="w-[230px] !py-0 font-semibold text-dark dark:text-white-dark dark:text-white-light/90">
                                            <li>
                                                <div className="flex items-center px-4 py-4">
                                                    <Image width={50} height={50} className="h-10 w-10 rounded-md object-cover" src="/assets/images/user-profile.jpg" alt="userProfile" />
                                                    <div className="truncate ltr:pl-4 rtl:pr-4">
                                                        <h4 className="text-base">{UserName}</h4>
                                                        <button type="button" className="text-black/60 hover:text-primary dark:text-dark-light/60 dark:hover:text-white">
                                                            {Email}
                                                        </button>
                                                    </div>
                                                </div>
                                            </li>

                                            <li className="border-t border-white-light dark:border-white-light/10 dark:hover:text-white">
                                                <div onClick={handlelogout} className="flex cursor-pointer items-center !py-3 px-4 text-danger">
                                                    <IconLogout className="h-4.5 w-4.5 shrink-0 rotate-90 ltr:mr-2 rtl:ml-2" />
                                                    Sign Out
                                                </div>
                                            </li>
                                        </ul>
                                    </Dropdown>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>}
        </>
    );
};

export default Header;
