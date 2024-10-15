'use client'
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { addFooterData, getFooterData } from '@/components/utils/Helper'; // Import the helper function
import toast from 'react-hot-toast';

const Footer = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [footerData, setFooterData] = useState<any>(null);


    async function fetchData() {
        try {
            const result = await getFooterData();
            setFooterData(result.data[0].data);
            // console.log(result.data[0].data)
            setLoading(false);
        } catch (error) {
            // console.error('Error fetching footer data:', error);
            setError('Failed to fetch footer data.');
            setLoading(false);
        }
    }
    useEffect(() => {
        fetchData();
    }, []);

    const formik = useFormik({
        enableReinitialize: true, // Reinitialize form when footerData is available
        initialValues: {
            phone: footerData?.en?.contactInfo?.phone || '',
            email: footerData?.en?.contactInfo?.email || '',
            address: footerData?.en?.contactInfo?.address || '',
            facebook: footerData?.en?.socialLinks?.facebook || '',
            instagram: footerData?.en?.socialLinks?.instagram || '',
            linkedIn: footerData?.en?.socialLinks?.linkedIn || '',
            dribble: footerData?.en?.socialLinks?.dribble || '',
            greetingTitle: footerData?.en?.greetingTitle || '',
            greetingTitleAr: footerData?.ar?.greetingTitle || '',
            greetingDescription: footerData?.en?.greetingDescription || '',
            greetingDescriptionAr: footerData?.ar?.greetingDescription || '',
            rights: footerData?.en?.rights || '',
        },
        onSubmit: async (values) => {
            try {
                // console.log("asjdkaksdhjhasdjhajksh", values)
                const result = await addFooterData(values);
                // console.log(result)
                if (result.success === true) {
                    toast.success(result.message)
                    fetchData()
                } else {
                    toast.error(result.message)

                }
            } catch (error: any) {
                toast.error(error.message)

                setError('Failed to update footer data.');
            }
        },
    });

    return (
        <>
            <h2 className="mb-1 flex items-center px-2 py-3 font-extrabold uppercase">
                <span>Footer</span>
            </h2>
            <div className="panel border-white-light px-3 dark:border-[#1b2e4b]">
                <form onSubmit={formik.handleSubmit}>
                    {/* Title Section */}
                    <div className="my-2">
                        <h5 className="text-lg font-semibold dark:text-white-light">Phone</h5>
                        <input
                            type="text"
                            name="phone"
                            value={formik.values.phone}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="form-input"
                            placeholder="Phone"
                        />
                    </div>
                    <div className="my-2">
                        <h5 className="text-lg font-semibold dark:text-white-light">Email</h5>
                        <input
                            type="email"
                            name="email"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="form-input"
                            placeholder="Email"
                        />
                    </div>
                    <div className="my-2">
                        <h5 className="text-lg font-semibold dark:text-white-light">Address</h5>
                        <input
                            type="text"
                            name="address"
                            value={formik.values.address}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="form-input"
                            placeholder="Address"
                        />
                    </div>
                    <div className="my-2">
                        <h5 className="text-lg font-semibold dark:text-white-light">Facebook</h5>
                        <input
                            type="url"
                            name="facebook"
                            value={formik.values.facebook}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="form-input"
                            placeholder="Facebook URL"
                        />
                    </div>
                    <div className="my-2">
                        <h5 className="text-lg font-semibold dark:text-white-light">Instagram</h5>
                        <input
                            type="url"
                            name="instagram"
                            value={formik.values.instagram}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="form-input"
                            placeholder="Instagram URL"
                        />
                    </div>
                    <div className="my-2">
                        <h5 className="text-lg font-semibold dark:text-white-light">LinkedIn</h5>
                        <input
                            type="url"
                            name="linkedIn"
                            value={formik.values.linkedIn}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="form-input"
                            placeholder="LinkedIn URL"
                        />
                    </div>
                    <div className="my-2">
                        <h5 className="text-lg font-semibold dark:text-white-light">Dribble</h5>
                        <input
                            type="url"
                            name="dribble"
                            value={formik.values.dribble}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="form-input"
                            placeholder="Dribble URL"
                        />
                    </div>
                    <div className="my-2">
                        <h5 className="text-lg font-semibold dark:text-white-light">Greeting Title</h5>
                        <input
                            type="text"
                            name="greetingTitle"
                            value={formik.values.greetingTitle}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="form-input"
                            placeholder="Greeting Title"
                        />
                    </div>
                    <div className="my-2">
                        <h5 className="text-lg font-semibold dark:text-white-light">Greeting Title Arabic</h5>
                        <input
                            type="text"
                            name="greetingTitleAr"
                            value={formik.values.greetingTitleAr}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="form-input"
                            placeholder="Greeting Title"
                        />
                    </div>
                    <div className="my-2">
                        <h5 className="text-lg font-semibold dark:text-white-light">Greeting Description</h5>
                        <input
                            name="greetingDescription"
                            value={formik.values.greetingDescription}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="form-input"
                            placeholder="Greeting Description"
                        />
                    </div>
                    <div className="my-2">
                        <h5 className="text-lg font-semibold dark:text-white-light">Greeting Description Arabic</h5>
                        <input
                            name="greetingDescriptionAr"
                            value={formik.values.greetingDescriptionAr}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="form-input"
                            placeholder="Greeting Description Arabic"
                        />
                    </div>
                    <div className="my-2">
                        <h5 className="text-lg font-semibold dark:text-white-light">Rights</h5>
                        <input
                            type="number"
                            name="rights"
                            value={formik.values.rights}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="form-input"
                            placeholder="Rights"
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">
                        Submit
                    </button>
                </form>
            </div>
        </>
    );
};

export default Footer;
