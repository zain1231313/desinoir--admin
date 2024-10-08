"use client"
import React, { useEffect, useState } from 'react';
import { createMainSection, fetchHomeData } from '@/components/utils/Helper';
import { useFormik } from 'formik';
import { useDispatch } from 'react-redux';
import { setData, setLoading, setError } from '@/store/HomeSlice';
import toast from 'react-hot-toast';
import Loading from '@/components/layouts/loading';

const HomeHeader = () => {
    const dispatch = useDispatch();

    const [image1, setImage1] = useState<File | null>(null);
    const [initialImage, setInitialImage] = useState<string | null>(null);
    const [filePreview, setFilePreview] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false)
    const [fileName, setFileName] = useState<string | null>(null);


    const formik = useFormik({
        initialValues: {
            titleEnglish: '',
            titleArabic: '',
            counter: '',
            image: ''
        },
        enableReinitialize: true, // This allows Formik to update initial values when props change
        onSubmit: async (values) => {
            // Create a new FormData instance
            setLoading(true)
            const formData = new FormData();

            // Append form values to formData
            if (image1) {
                formData.append("image", image1);
            }
            formData.append("count", values.counter);
            formData.append("title", values.titleEnglish);
            formData.append("arTitle", values.titleArabic);

            try {
                const result = await createMainSection(formData);
                console.log(result);
                // Update the values in the component
                if (result.success === true) {
                    formik.setValues({
                        titleEnglish: result.data.data.en.mainBanner.title,
                        titleArabic: result.data.data.ar.mainBanner.title,
                        counter: result.data.data.en.mainBanner.count,
                        image: result.data.data.en.mainBanner.image,
                    });
                    setImage1(result.data.data.en.mainBanner.image);
                    setInitialImage(result.data.data.en.mainBanner.image);
                    fetchDataAsync()
                    setLoading(false)
                    toast.success(result.message)
                } else {
                    setLoading(false)
                    toast.error(result.message)

                }
            } catch (error: any) {
                setLoading(false)
                toast.error(error)
                console.error(error)
            }
        }

    });
    const handleFileSelect1 = (file: File) => {
        setImage1(file);

        const reader = new FileReader();
        reader.onload = () => {
            setFilePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setFile(file);
            setFileName(file.name);
            const reader = new FileReader();
            reader.onload = () => {
                setFilePreview(reader.result as string);
            };
            reader.readAsDataURL(file);

            handleFileSelect1(file);
        }
    };
    const fetchDataAsync = async () => {
        setLoading(true) // Set loading to true before fetching
        try {
            const result = await fetchHomeData();
            if (result) {
                dispatch(setData(result)); // Store the fetched data in Redux

                formik.setValues({
                    titleEnglish: result.data.data.en.mainBanner.title,
                    titleArabic: result.data.data.ar.mainBanner.title,
                    counter: result.data.data.en.mainBanner.count,
                    image: result.data.data.en.mainBanner.image,
                });
                setImage1(result.data.data.en.mainBanner.image);
                console.log(result.data.data.en.mainBanner.image);
            }
        } catch (error) {
            dispatch(setError('Failed to fetch data')); // Handle any errors
        } finally {
            setLoading(false) // Set loading to false after fetching
        }
    };
    useEffect(() => {

        fetchDataAsync();
    }, [dispatch]);

    return (
        <>
            {loading === true ? <Loading /> :
                <div className="panel border-white-light px-3 mb-3 dark:border-[#1b2e4b]">
                    <h5 className="text-lg font-semibold dark:text-white-light">Header Section</h5>
                    <form onSubmit={formik.handleSubmit}>
                        <div className="my-2">
                            <div>
                                <label className="">
                                    Title (EN)
                                </label>
                                <input
                                    type="text"
                                    placeholder="Title English"
                                    className="form-input"
                                    name="titleEnglish"
                                    value={formik.values.titleEnglish}
                                    onChange={formik.handleChange}
                                />
                            </div>
                        </div>
                        <div className="my-2">
                            <div>
                                <label className="">
                                    Title (AR)
                                </label>
                                <input
                                    type="text"
                                    placeholder="Title Arabic"
                                    className="form-input"
                                    name="titleArabic"
                                    value={formik.values.titleArabic}
                                    onChange={formik.handleChange}
                                />
                            </div>
                        </div>
                        <div className="my-2">
                            <div >
                                <label>
                                    Counter
                                </label>
                                <input
                                    type="text"
                                    placeholder="Counter"
                                    className="form-input"
                                    name="counter"
                                    value={formik.values.counter}
                                    onChange={formik.handleChange}
                                />
                            </div>
                        </div>
                        {image1 && (
                            <img src={`${!filePreview ? image1 : filePreview}`} alt="Initial Image" className='w-40 h-40 object-cover' />
                        )}
                        <div className="my-2">
                            <div className="">
                                <label htmlFor="file-input" className="btn btn-primary w-fit" style={{ cursor: 'pointer' }}>
                                    Upload image
                                    <input
                                        type="file"
                                        id="file-input"
                                        placeholder="Choose a File"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        style={{ display: 'none' }}
                                    />
                                </label>
                                {fileName && <p>Selected file: {fileName}</p>}

                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary !mt-6">
                            Submit Form
                        </button>
                    </form >
                </div >}
        </>
    );
};

export default HomeHeader;
