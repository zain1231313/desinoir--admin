'use client';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { toggleSidebar } from '@/store/themeConfigSlice';
import AnimateHeight from 'react-animate-height';
import { IRootState } from '@/store';
import { useState, useEffect } from 'react';
import IconCaretsDown from '@/components/icon/icon-carets-down';
import IconCaretDown from '@/components/icon/icon-caret-down';
import IconMinus from '@/components/icon/icon-minus';
import { usePathname } from 'next/navigation';
import { getTranslation } from '@/i18n';
import logo from '../../public/logo-main.svg';
import darkLogo from '../../public/DarkLogo.png';
import Image from 'next/image';
import IconHome from '../icon/icon-home';
import IconChrome from '../icon/icon-chrome';
import IconPencilPaper from '../icon/icon-pencil-paper';
import IconUser from '../icon/icon-user';
import IconClipboardText from '../icon/icon-clipboard-text';
import IconSettings from '../icon/icon-settings';
import IconDesktop from '../icon/icon-desktop';
import IconInbox from '../icon/icon-inbox';
import IconLoader from '../icon/icon-loader';
import IconCircleCheck from '../icon/icon-circle-check';
import IconInfoCircle from '../icon/icon-info-circle';
import IconMenu from '../icon/icon-menu';
const Sidebar = () => {
    const dispatch = useDispatch();
    const { t } = getTranslation();
    const pathname = usePathname();
    // const [currentMenu, setCurrentMenu] = useState<string>('');
    // const [errorSubMenu, setErrorSubMenu] = useState(false);
    const [homeMenuOpen, setHomeMenuOpen] = useState(false);
    const [servicesMenuOpen, setServicesMenuOpen] = useState(false);
    const [aboutMenu, setAboutMenu] = useState(false);
    const [ourWork, setOurWork] = useState(false);
    const themeConfig = useSelector((state: IRootState) => state.themeConfig);
    const semidark = useSelector((state: IRootState) => state.themeConfig.semidark);
    const toggleHomeMenu = () => {
        setHomeMenuOpen(!homeMenuOpen);
        setServicesMenuOpen(false); // Close Services menu when Home menu is opened
    };

    const toggleServicesMenu = () => {
        setServicesMenuOpen(!servicesMenuOpen);
    };
    const toggleAboutMenu = () => {
        setAboutMenu(!aboutMenu);
    };
    const toggleOurWork = () => {
        setOurWork(!ourWork);
    };
    const isDark = useSelector((state: IRootState) => state.themeConfig.theme === 'dark' || state.themeConfig.isDarkMode);

    useEffect(() => {
        const selector = document.querySelector('.sidebar ul a[href="' + window.location.pathname + '"]');
        if (selector) {
            selector.classList.add('active');
            const ul: any = selector.closest('ul.sub-menu');
            if (ul) {
                let ele: any = ul.closest('li.menu').querySelectorAll('.nav-link') || [];
                if (ele.length) {
                    ele = ele[0];
                    setTimeout(() => {
                        ele.click();
                    });
                }
            }
        }
    }, []);

    useEffect(() => {
        setActiveRoute();
        if (window.innerWidth < 1024 && themeConfig.sidebar) {
            dispatch(toggleSidebar());
        }
    }, [pathname]);

    const setActiveRoute = () => {
        let allLinks = document.querySelectorAll('.sidebar ul a.active');
        for (let i = 0; i < allLinks.length; i++) {
            const element = allLinks[i];
            element?.classList.remove('active');
        }
        const selector = document.querySelector('.sidebar ul a[href="' + window.location.pathname + '"]');
        selector?.classList.add('active');
    };

    return (
        <div className={semidark ? 'dark' : ''}>
            <nav
                className={`sidebar fixed bottom-0 top-0 z-50 h-full min-h-screen w-[260px] shadow-[5px_0_25px_0_rgba(94,92,154,0.1)] transition-all duration-300 ${semidark ? 'text-white-dark' : ''}`}
            >
                <div className="h-full bg-white dark:bg-black">
                    <div className="flex items-center justify-between px-4 py-3">
                        <Link href="/" className="main-logo flex shrink-0 items-center">
                            <Image src={isDark ? logo : darkLogo} width={150} height={150} alt=".." />
                        </Link>

                        <button
                            type="button"
                            className="collapse-icon flex h-8 w-8 items-center rounded-full transition duration-300 hover:bg-gray-500/10 rtl:rotate-180 dark:text-white-light dark:hover:bg-dark-light/10"
                            onClick={() => dispatch(toggleSidebar())}
                        >
                            <IconCaretsDown className="m-auto rotate-90" />
                        </button>
                    </div>
                    <PerfectScrollbar className="relative h-[calc(100vh-80px)]">
                        <ul className="relative space-y-0.5 p-4 py-0 font-semibold">
                            <li className="nav-item">
                                <ul>
                                    <h2 className="-mx-4 mb-1 flex items-center bg-white-light/30 px-7 py-3 font-extrabold uppercase dark:bg-dark dark:bg-opacity-[0.08]">
                                        <IconMinus className="hidden h-5 w-4 flex-none" />
                                        <span>{t('Pages')}</span>
                                    </h2>

                                    <li className="menu nav-item">
                                        <button type="button" className={`${homeMenuOpen ? 'active' : ''} nav-link group w-full`} onClick={toggleHomeMenu}>
                                            <div className="flex items-center">
                                                <IconHome className="shrink-0 group-hover:!text-primary" />
                                                <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">{t('Home')}</span>
                                            </div>

                                            <div className={homeMenuOpen ? '' : '-rotate-90 rtl:rotate-90'}>
                                                <IconCaretDown />
                                            </div>
                                        </button>

                                        <AnimateHeight duration={300} height={homeMenuOpen ? 'auto' : 0}>
                                            <ul className="sub-menu text-gray-500">
                                                <li className="ps-2">
                                                    <Link href="/apps/home-header" className="group">
                                                        <div className="flex ">
                                                            <span className="text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('Header')}</span>
                                                        </div>
                                                        <div className="ltr:pl-3 rtl:pr-3 "></div>
                                                    </Link>
                                                </li>
                                                <li className="ps-2">
                                                    <Link href="/apps/main-services" className="group">
                                                        <div className="flex ">
                                                            <span className="text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('Main Services')}</span>
                                                        </div>
                                                        <div className="ltr:pl-3 rtl:pr-3 "></div>
                                                    </Link>
                                                </li>

                                                <li className="ps-2">
                                                    <Link href="/apps/creativity" className="group">
                                                        <div className="flex ">
                                                            <span className="text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('Creativity')}</span>
                                                        </div>
                                                        <div className="ltr:pl-3 rtl:pr-3 "></div>
                                                    </Link>
                                                </li>

                                                <li className="ps-2">
                                                    <Link href="/apps/expertise" className="group">
                                                        <div className="flex ">
                                                            <span className="text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('Expertise')}</span>
                                                        </div>
                                                        <div className="ltr:pl-3 rtl:pr-3 "></div>
                                                    </Link>
                                                </li>

                                                <li className="ps-2">
                                                    <Link href="/apps/testimonial" className="group">
                                                        <div className="flex ">
                                                            <span className="text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('Testimonial')}</span>
                                                        </div>
                                                        <div className="ltr:pl-3 rtl:pr-3 "></div>
                                                    </Link>
                                                </li>
                                                <li className="ps-2">
                                                    <Link href="/apps/productlogo" className="group">
                                                        <div className="flex ">
                                                            <span className="text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('Product Logo')}</span>
                                                        </div>
                                                        <div className="ltr:pl-3 rtl:pr-3 "></div>
                                                    </Link>
                                                </li>
                                            </ul>
                                        </AnimateHeight>
                                    </li>

                                    <li className="nav-item">
                                        <Link href="/apps/meta-tags" className="group">
                                            <div className="flex items-center">
                                                <IconChrome className="shrink-0 group-hover:!text-primary" />
                                                <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">{t('Meta Tags')}</span>
                                            </div>
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link href="/apps/articles" className="group">
                                            <div className="flex items-center">
                                                <IconPencilPaper className="shrink-0 group-hover:!text-primary" />
                                                <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">{t('Articles')}</span>
                                            </div>
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link href="/apps/teams" className="group">
                                            <div className="flex items-center">
                                                <IconUser className="shrink-0 group-hover:!text-primary" />
                                                <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">{t('Team')}</span>
                                            </div>
                                        </Link>
                                    </li>

                                    <li className="menu nav-item">
                                        <button type="button" className={`${ourWork ? 'active' : ''} nav-link group w-full`} onClick={toggleOurWork}>
                                            <div className="flex items-center">
                                                <IconClipboardText className="shrink-0 group-hover:!text-primary" />
                                                <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">{t('Our Work')}</span>
                                            </div>

                                            <div className={ourWork ? '' : '-rotate-90 rtl:rotate-90'}>
                                                <IconCaretDown />
                                            </div>
                                        </button>

                                        <AnimateHeight duration={300} height={ourWork ? 'auto' : 0}>
                                            <ul className="sub-menu text-gray-500">
                                                <li className="ps-2">
                                                    <Link href="/apps/our-work" className="group">
                                                        <div className="flex ">
                                                            <span className="text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('Add Our Work')}</span>
                                                        </div>
                                                        <div className="ltr:pl-3 rtl:pr-3 "></div>
                                                    </Link>
                                                </li>
                                                <li className="ps-2">
                                                    <Link href="/apps/our-work/problem" className="group">
                                                        <div className="flex ">
                                                            <span className="text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('Problem Section')}</span>
                                                        </div>
                                                        <div className="ltr:pl-3 rtl:pr-3 "></div>
                                                    </Link>
                                                </li>

                                                <li className="ps-2">
                                                    <Link href="/apps/our-work/challenges" className="group">
                                                        <div className="flex ">
                                                            <span className="text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('Challenges Section')}</span>
                                                        </div>
                                                        <div className="ltr:pl-3 rtl:pr-3 "></div>
                                                    </Link>
                                                </li>

                                                <li className="ps-2">
                                                    <Link href="/apps/our-work/solution" className="group">
                                                        <div className="flex ">
                                                            <span className="text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('Solution Section')}</span>
                                                        </div>
                                                        <div className="ltr:pl-3 rtl:pr-3 "></div>
                                                    </Link>
                                                </li>

                                                <li className="ps-2">
                                                    <Link href="/apps/our-work/major-screen" className="group">
                                                        <div className="flex ">
                                                            <span className="text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('Major Screen Section ')}</span>
                                                        </div>
                                                        <div className="ltr:pl-3 rtl:pr-3 "></div>
                                                    </Link>
                                                </li>
                                            </ul>
                                        </AnimateHeight>
                                    </li>

                                    <li className="nav-item">
                                        <Link href="/apps/footer" className="group">
                                            <div className="flex items-center">
                                                <IconSettings className="shrink-0 group-hover:!text-primary" />
                                                <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">{t('Footer')}</span>
                                            </div>
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link href="/apps/all-headers" className="group">
                                            <div className="flex items-center">
                                                <IconDesktop className="shrink-0 group-hover:!text-primary" />
                                                <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">{t('All Headers ')}</span>
                                            </div>
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link href="/apps/Faqs" className="group">
                                            <div className="flex items-center">
                                                <IconInbox className="shrink-0 group-hover:!text-primary" />
                                                <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">{t('Faq ')}</span>
                                            </div>
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link href="/apps/slider" className="group">
                                            <div className="flex items-center">
                                                <IconLoader className="shrink-0 group-hover:!text-primary" />
                                                <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">{t('Slider Section ')}</span>
                                            </div>
                                        </Link>
                                    </li>

                                    <li className="menu nav-item">
                                        <button type="button" className={`${servicesMenuOpen ? 'active' : ''} nav-link group w-full`} onClick={toggleServicesMenu}>
                                            <div className="flex items-center">
                                                <IconCircleCheck className="shrink-0 group-hover:!text-primary" />
                                                <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">{t('Services')}</span>
                                            </div>

                                            <div className={servicesMenuOpen ? '' : '-rotate-90 rtl:rotate-90'}>
                                                <IconCaretDown />
                                            </div>
                                        </button>

                                        <AnimateHeight duration={300} height={servicesMenuOpen ? 'auto' : 0}>
                                            <ul className="sub-menu text-gray-500">
                                                <li>
                                                    <Link href="/apps/services/seriveHeader">{t('Service-Header')}</Link>
                                                </li>
                                                <li>
                                                    <Link href="/apps/services/weWork">{t('We Work')}</Link>
                                                </li>
                                                <li>
                                                    <Link href="/apps/services/weProcess">{t('We Process')}</Link>
                                                </li>
                                                <li>
                                                    <Link href="/apps/services/weChoose">{t('We Choose')}</Link>
                                                </li>
                                            </ul>
                                        </AnimateHeight>
                                    </li>

                                    
                                    <li className="menu nav-item">
                                        <button type="button" className={`${aboutMenu ? 'active' : ''} nav-link group w-full`} onClick={toggleAboutMenu}>
                                            <div className="flex items-center">
                                                <IconInfoCircle className="shrink-0 group-hover:!text-primary" />
                                                <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">{t('About')}</span>
                                            </div>

                                            <div className={aboutMenu ? '' : '-rotate-90 rtl:rotate-90'}>
                                                <IconCaretDown />
                                            </div>
                                        </button>

                                        <AnimateHeight duration={300} height={aboutMenu ? 'auto' : 0}>
                                            <ul className="sub-menu text-gray-500">
                                                <li>
                                                    <Link href="/apps/about/about-creative">{t('Creative')}</Link>
                                                </li>
                                                <li>
                                                    <Link href="/apps/about/about-project">{t('Complete Porjects')}</Link>
                                                </li>
                                                <li>
                                                    <Link href="/apps/about/about-whychoose">{t('Why Choose')}</Link>
                                                </li>
                                            </ul>
                                        </AnimateHeight>
                                    </li>

                                    <li className="nav-item">
                                        <Link href="/apps/ui-store" className="group">
                                            <div className="flex items-center">
                                                <IconMenu className="shrink-0 group-hover:!text-primary" />
                                                <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">{t('UI Store')}</span>
                                            </div>
                                        </Link>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </PerfectScrollbar>
                </div>
            </nav>
        </div>
    );
};

export default Sidebar;
