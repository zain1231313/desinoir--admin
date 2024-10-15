'use client';
import React, { useEffect, useState } from 'react';
import { createHeaderHome, createMainSection, fetchHomeData } from '@/components/utils/Helper';
import { useFormik } from 'formik';
import { useDispatch } from 'react-redux';
import { setData, setLoading, setError } from '@/store/HomeSlice';
import toast from 'react-hot-toast';
import Loading from '@/components/layouts/loading';
import Image from 'next/image';

const HomeHeader = () => {
    const dispatch = useDispatch();

    const [image1, setImage1] = useState<File | null>(null);
    const [initialImage, setInitialImage] = useState<string | null>(null);
    const [filePreview, setFilePreview] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [fileName, setFileName] = useState<string | null>(null);

    const formik = useFormik({
        initialValues: {
            titleEnglish: '',
            titleArabic: '',
            counter: '',
            arCount: '',  // New field
            completedProjects: '',  // New field
            arCompletedProjects: '',  // New field
            image: '',
        },
        enableReinitialize: true,
        onSubmit: async (values) => {
            // console.log('MAIN Home =>', values);
            setLoading(true);
            const formData = new FormData();
            if (image1) {
                formData.append('image', image1);
            }
            formData.append('count', values.counter);
            formData.append('arCount', values.arCount);  // New field added to formData
            formData.append('completedProjects', values.completedProjects);  // New field added to formData
            formData.append('arCompletedProjects', values.arCompletedProjects);  // New field added to formData
            formData.append('title', values.titleEnglish);
            formData.append('arTitle', values.titleArabic);

            try {
                const result = await createHeaderHome(formData);
                // console.log(result);
                if (result.success === true) {
                    formik.setValues({
                        titleEnglish: result.data.data.en.mainBanner.title,
                        titleArabic: result.data.data.ar.mainBanner.title,
                        counter: result.data.data.en.mainBanner.count,
                        arCount: result.data.data.ar.mainBanner.count,  // Set new field value
                        completedProjects: result.data.data.en.mainBanner.completedProjects,  // Set new field value
                        arCompletedProjects: result.data.data.ar.mainBanner.completedProjects,  // Set new field value
                        image: result.data.data.en.mainBanner.image,
                    });
                    setImage1(result.data.data.en.mainBanner.image);
                    setInitialImage(result.data.data.en.mainBanner.image);
                    fetchDataAsync();
                    setLoading(false);
                    toast.success(result.message);
                } else {
                    setLoading(false);
                    toast.error(result.message);
                }
            } catch (error: any) {
                setLoading(false);
                toast.error(error);
                // console.error(error);
            }
        },
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
        setLoading(true);
        try {
            const result = await fetchHomeData();
            if (result) {
                dispatch(setData(result));

                formik.setValues({
                    titleEnglish: result.data.data.en.mainBanner.title,
                    titleArabic: result.data.data.ar.mainBanner.title,
                    counter: result.data.data.en.mainBanner.count,
                    arCount: result.data.data.ar.mainBanner.count,  // Fetch new field value
                    completedProjects: result.data.data.en.mainBanner.completedProjects,  // Fetch new field value
                    arCompletedProjects: result.data.data.ar.mainBanner.completedProjects,  // Fetch new field value
                    image: result.data.data.en.mainBanner.image,
                });
                setImage1(result.data.data.en.mainBanner.image);
                // console.log(result.data.data.en.mainBanner.image);
            }
        } catch (error) {
            dispatch(setError('Failed to fetch data'));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDataAsync();
    }, [dispatch]);

    return (
        <>
            {loading === true ? (
                <Loading />
            ) : (
                <div className="panel mb-3 border-white-light px-3 dark:border-[#1b2e4b]">
                    <h5 className="text-lg font-semibold dark:text-white-light">Header Section</h5>
                    <form onSubmit={formik.handleSubmit}>
                        <div className="my-2">
                            <label className="">Title (EN)</label>
                            <input
                                type="text"
                                placeholder="Title English"
                                className="form-input"
                                name="titleEnglish"
                                value={formik.values.titleEnglish}
                                onChange={formik.handleChange}
                            />
                        </div>
                        <div className="my-2">
                            <label className="">Title (AR)</label>
                            <input
                                type="text"
                                placeholder="Title Arabic"
                                className="form-input"
                                name="titleArabic"
                                value={formik.values.titleArabic}
                                onChange={formik.handleChange}
                            />
                        </div>
                        <div className="my-2">
                            <label>Counter</label>
                            <input
                                type="number"
                                placeholder="Counter"
                                className="form-input"
                                name="counter"
                                value={formik.values.counter}
                                onChange={formik.handleChange}
                            />
                        </div>
                        <div className="my-2">
                            <label>Arabic Counter</label> {/* New field */}
                            <input
                                type="number"
                                placeholder="Arabic Counter"
                                className="form-input"
                                name="arCount"
                                value={formik.values.arCount}
                                onChange={formik.handleChange}
                            />
                        </div>
                        <div className="my-2">
                            <label>Completed Projects</label> {/* New field */}
                            <input
                                type="text"
                                placeholder="Completed Projects"
                                className="form-input"
                                name="completedProjects"
                                value={formik.values.completedProjects}
                                onChange={formik.handleChange}
                            />
                        </div>
                        <div className="my-2">
                            <label>Arabic Completed Projects</label> {/* New field */}
                            <input
                                type="text"
                                placeholder="Arabic Completed Projects"
                                className="form-input"
                                name="arCompletedProjects"
                                value={formik.values.arCompletedProjects}
                                onChange={formik.handleChange}
                            />
                        </div>
                        {image1 && <Image width={1000} height={1000} src={`${!filePreview ? image1 : filePreview}`} alt="Initial Image" className="h-40 w-40 object-cover" />}
                        <div className="my-2">
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
                        <button type="submit" className="btn bg-[#20D091] border-none text-white ml-auto !mt-6">
                            Submit Form
                        </button>
                    </form>
                </div>
            )}
        </>
    );
};

export default HomeHeader;
