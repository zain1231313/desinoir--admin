'use client';
import IconLockDots from '@/components/icon/icon-lock-dots';
import IconMail from '@/components/icon/icon-mail';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useFormik } from "formik";
import { LoginSchema } from '../schema/schema';
import { postLogin } from '../utils/Helper';
import getAndDecryptCookie, {  getCookies, storeCookies} from '../libs/auth';

const ComponentsAuthLoginForm = () => {
    const router = useRouter();

    const [response, setResponse] = useState(null);

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        validationSchema: LoginSchema,
        onSubmit: async (values) => {
            try {
                const result = await postLogin(values.email, values.password);


                storeCookies('AccessToken', result.data.token);
                storeCookies('Email', values.email);
                storeCookies('Name', result.data.user.name);
                toast.success(result.message)
                setResponse(result);
                // console.log(result)
                // console.log("token ---> ", getAndDecryptCookie('AccessToken'))

                // Redirect to the homepage
                router.push('/');
            } catch (error: any) {
                toast.error(`Login failed: ${error.message || 'An unexpected error occurred'}`)
            }
        }

    });


    return (
        <>
            <form className="space-y-5 dark:text-white" onSubmit={formik.handleSubmit}>
                <div>
                    <label htmlFor="email">Email</label>
                    <div className="relative text-white-dark">
                        <input id="email"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            type="email"
                            placeholder="Enter Email"
                            className="form-input ps-10 placeholder:text-white-dark" />
                        <span className="absolute start-4 top-1/2 -translate-y-1/2">
                            <IconMail fill={true} />
                        </span>
                    </div>
                    {formik.touched.email && formik.errors.email ? (
                        <div className=" text-sm text-[#FF2424]">{formik.errors.email}</div>
                    ) : null}
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <div className="relative text-white-dark">
                        <input id="password"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            type="password"
                            placeholder="Enter Password" className="form-input ps-10 placeholder:text-white-dark" />
                        <span className="absolute start-4 top-1/2 -translate-y-1/2">
                            <IconLockDots fill={true} />
                        </span>
                    </div>
                    {formik.touched.password && formik.errors.password ? (
                        <div className=" text-sm text-[#FF2424]">{formik.errors.password}</div>
                    ) : null}
                </div>

                <button type="submit" className="btn btn-gradient !mt-6 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]">
                    Sign in
                </button>
            </form>
        </>
    );
};

export default ComponentsAuthLoginForm;
