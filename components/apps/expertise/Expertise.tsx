'use client';
import React, { useEffect, useState } from 'react';
import { createExpertise, createMainSection, fetchHomeData } from '@/components/utils/Helper';
import { useDispatch } from 'react-redux';
import { setData, setLoading, setError } from '@/store/HomeSlice';
import { useFormik } from 'formik';
import toast from 'react-hot-toast';

const Expertise = () => {
    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();
    const formik = useFormik({
        initialValues: {
            ExpertisetitleEnglish: '',
            ExpertisetitleArabic: '',
            ExpertisesubtitleEnglish: '',
            ExpertisesubtitleArabic: '',
        },
        enableReinitialize: true, // This allows Formik to update initial values when props change
        onSubmit: async (values) => {
            // Create a new FormData instance
            setLoading(true);
            const formData = new FormData();

            // Append form values to formData

            formData.append('expertiseTitle', values.ExpertisetitleEnglish);
            formData.append('arExpertiseTitle', values.ExpertisetitleArabic);
            formData.append('expertiseSubTitle', values.ExpertisesubtitleEnglish);
            formData.append('arExpertiseSubTitle', values.ExpertisesubtitleArabic);

            try {
                const result = await createExpertise(formData);
                // console.log(result);
                // Update the values in the component
                formik.setValues({
                    ExpertisetitleEnglish: result.data.data.en.ourExpertise.expertiseTitle,
                    ExpertisetitleArabic: result.data.data.ar.ourExpertise.expertiseTitle,
                    ExpertisesubtitleEnglish: result.data.data.en.ourExpertise.expertiseSubTitle,
                    ExpertisesubtitleArabic: result.data.data.ar.ourExpertise.expertiseSubTitle,
                });
                setLoading(false);
                toast.success(result.message);
                fetchDataAsync();
            } catch (error: any) {
                toast.error(error);
            }
        },
    });

    const fetchDataAsync = async () => {
        setLoading(true); // Set loading to true before fetching
        try {
            const result = await fetchHomeData();
            if (result) {
                dispatch(setData(result)); // Store the fetched data in Redux

                formik.setValues({
                    ExpertisetitleEnglish: result.data.data.en.ourExpertise.expertiseTitle || '',
                    ExpertisetitleArabic: result.data.data.ar.ourExpertise.expertiseTitle || '',
                    ExpertisesubtitleEnglish: result.data.data.en.ourExpertise.expertiseSubTitle || '',
                    ExpertisesubtitleArabic: result.data.data.ar.ourExpertise.expertiseSubTitle || '',
                });
                // console.log(result.data.data.en);
            }
            setLoading(false); // Set loading to false after fetching
        } catch (error) {
            dispatch(setError('Failed to fetch data')); // Handle any errors
            setLoading(false); // Set loading to false after fetching
        }
    };
    useEffect(() => {
        fetchDataAsync();
    }, [dispatch]);

    return (
        <div>
            <h2 className="mb-1 flex items-center px-2 py-3 font-extrabold uppercase ">
                <span>Expertise</span>
            </h2>
            <div className="panel border-white-light px-3 dark:border-[#1b2e4b]">
                <form onSubmit={formik.handleSubmit}>
                    <div className="max-sm:my-2 lg:my-3">
                        <div>
                            <label>Title (EN)</label>
                            <input
                                type="text"
                                placeholder="Title English"
                                className="form-input ltr:rounded-l-none rtl:rounded-r-none"
                                name="ExpertisetitleEnglish"
                                value={formik.values.ExpertisetitleEnglish}
                                onChange={formik.handleChange}
                            />
                        </div>
                    </div>
                    <div className="max-sm:my-2 lg:my-3">
                        <div>
                            <label>Title (AR)</label>
                            <input
                                type="text"
                                placeholder="Title Arabic"
                                className="form-input ltr:rounded-l-none rtl:rounded-r-none"
                                name="ExpertisetitleArabic"
                                value={formik.values.ExpertisetitleArabic}
                                onChange={formik.handleChange}
                            />
                        </div>
                    </div>
                    <div className="max-sm:my-2 lg:my-3">
                        <div>
                            <label>Subtitle (EN)</label>
                            <input
                                type="text"
                                placeholder="Subtitle English"
                                className="form-input ltr:rounded-l-none rtl:rounded-r-none"
                                name="ExpertisesubtitleEnglish"
                                value={formik.values.ExpertisesubtitleEnglish}
                                onChange={formik.handleChange}
                            />
                        </div>
                    </div>
                    <div className="max-sm:my-2 lg:my-3">
                        <div>
                            <label>Subtitle (AR)</label>
                            <input
                                type="text"
                                placeholder="Subtitle Arabic"
                                className="form-input ltr:rounded-l-none rtl:rounded-r-none"
                                name="ExpertisesubtitleArabic"
                                value={formik.values.ExpertisesubtitleArabic}
                                onChange={formik.handleChange}
                            />
                        </div>
                    </div>

                    <button type="submit" className="mt-4 rounded bg-blue-500 px-4 py-2 text-white">
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Expertise;
