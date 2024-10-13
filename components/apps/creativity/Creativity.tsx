'use client';
import React, { useCallback, useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { createMainSection, fetchHomeData } from '@/components/utils/Helper';
import { useDispatch } from 'react-redux';
import { setData, setLoading, setError } from '@/store/HomeSlice';
import { useFormik } from 'formik';
import toast from 'react-hot-toast';
import Loading from '@/components/layouts/loading';

const Creativity = () => {
    const dispatch = useDispatch();

    const [image2, setImage2] = useState<File | null>(null);
    const [filePreview2, setFilePreview2] = useState<string | null>(null);
    const [fileName2, setFileName2] = useState<string | null>(null);
    const [engDescrip, setEngDescrip] = useState('');
    const [arDescrip, setArDescrip] = useState('');
    const [loading, setLoading] = useState(false);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setImage2(file);
            setFileName2(file.name);
            const reader = new FileReader();
            reader.onload = () => {
                setFilePreview2(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const formik = useFormik({
        initialValues: {
            CreativitytitleEnglish: '',
            CreativitytitleArabic: '',
            CreativitysubtitleEnglish: '',
            CreativitysubtitleArabic: '',
            Creativityyears: '',
            CreativityyearsArabic: '',
        },
        enableReinitialize: true,
        onSubmit: async (values) => {
            const formData = new FormData();
            if (image2) {
                formData.append('creativityImage', image2);
            }
            formData.append('creativityTitle', values.CreativitytitleEnglish);
            formData.append('arCreativityTitle', values.CreativitytitleArabic);
            formData.append('creativitySubtitle', values.CreativitysubtitleEnglish);
            formData.append('arCreativitySubtitle', values.CreativitysubtitleArabic);
            formData.append('creativityDescription', engDescrip);
            formData.append('arCreativityDescription', arDescrip);
            formData.append('creativityYearsOfExperience', values.Creativityyears);
            formData.append('arCreativityYearsOfExperience', values.CreativityyearsArabic);

            try {
                setLoading(true);
                const result = await createMainSection(formData);
                formik.setValues({
                    CreativitytitleEnglish: result.data.data.en.creativitySection.creativityTitle,
                    CreativitytitleArabic: result.data.data.ar.creativitySection.creativityTitle,
                    CreativitysubtitleEnglish: result.data.data.en.creativitySection.creativitySubtitle,
                    CreativitysubtitleArabic: result.data.data.ar.creativitySection.creativitySubtitle,
                    Creativityyears: result.data.data.en.creativitySection.creativityYearsOfExperience,
                    CreativityyearsArabic: result.data.data.ar.creativitySection.creativityYearsOfExperience,
                });
                setEngDescrip(result.data.data.en.creativitySection.creativityDescription);
                setArDescrip(result.data.data.ar.creativitySection.creativityDescription);
                setImage2(result.data.data.en.creativitySection.creativityImage);
                setFilePreview2(result.data.data.en.creativitySection.creativityImage);
                toast.success(result.message);
                fetchDataAsync();
                setLoading(false);
            } catch (error: any) {
                setLoading(false);
                toast.error(error);
                console.error(error);
            }
        },
    });

    const fetchDataAsync = async () => {
        setLoading(true);
        try {
            const result = await fetchHomeData();
            if (result) {
                setData(result);
                formik.setValues({
                    CreativitytitleEnglish: result.data.data.en.creativitySection.creativityTitle,
                    CreativitytitleArabic: result.data.data.ar.creativitySection.creativityTitle,
                    CreativitysubtitleEnglish: result.data.data.en.creativitySection.creativitySubtitle,
                    CreativitysubtitleArabic: result.data.data.ar.creativitySection.creativitySubtitle,
                    Creativityyears: result.data.data.en.creativitySection.creativityYearsOfExperience,
                    CreativityyearsArabic: result.data.data.ar.creativitySection.creativityYearsOfExperience,
                });
                setEngDescrip(result.data.data.en.creativitySection.creativityDescription);
                setArDescrip(result.data.data.ar.creativitySection.creativityDescription);
                setImage2(result.data.data.en.creativitySection.creativityImage);
            }
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.error('Error fetching data:', error);
            dispatch(setError('Failed to fetch data'));
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
                <div>
                    <h2 className="mb-1 flex items-center px-2 py-3 font-extrabold uppercase ">
                        <span>Creativity</span>
                    </h2>
                    <div className="panel border-white-light px-3 dark:border-[#1b2e4b]">
                        <form onSubmit={formik.handleSubmit}>
                            <div className="my-2">
                                <div className="">
                                    {image2 && <img src={`${!filePreview2 ? image2 : filePreview2}`} alt="Initial Image" className="h-40 w-40 object-cover" />}
                                    <div className="my-2">
                                        <div className="">
                                            <label htmlFor="file-input" className="btn btn-primary w-fit" style={{ cursor: 'pointer' }}>
                                                Upload image
                                                <input type="file" id="file-input" placeholder="Choose a File" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/*  ///////////////////// title /////////////////  */}
                            <div className="max-md:gap-2 max-sm:grid-cols-1 grid grid-cols-2 gap-4">
                                <div className="max-sm:my-2 lg:my-3">
                                    <div>
                                        <label>Title (EN)</label>
                                        <input
                                            type="text"
                                            placeholder="Title English"
                                            className="form-input ltr:rounded-l-none rtl:rounded-r-none"
                                            name="CreativitytitleEnglish"
                                            value={formik.values.CreativitytitleEnglish}
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
                                            name="CreativitytitleArabic"
                                            value={formik.values.CreativitytitleArabic}
                                            onChange={formik.handleChange}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/*  ///////////////////// subtitle /////////////////  */}
                            <div className="max-md:gap-2 max-sm:grid-cols-1 grid grid-cols-2 gap-4">
                                <div className="max-sm:my-2 lg:my-3">
                                    <div>
                                        <label>Subtitle (EN)</label>
                                        <input
                                            type="text"
                                            placeholder="Subtitle English"
                                            className="form-input ltr:rounded-l-none rtl:rounded-r-none"
                                            name="CreativitysubtitleEnglish"
                                            value={formik.values.CreativitysubtitleEnglish}
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
                                            name="CreativitysubtitleArabic"
                                            value={formik.values.CreativitysubtitleArabic}
                                            onChange={formik.handleChange}
                                        />
                                    </div>
                                </div>
                            </div>
                            {/* ////////////////////////// description ///////////// */}
                            <div className="max-lg:grid-cols-1 max-lg:gap-0 grid grid-cols-2 gap-4">
                                <div className="mb-5">
                                    <label className="">Description (EN)</label>
                                    <ReactQuill
                                        theme="snow"
                                        value={engDescrip}
                                        onChange={(content) => {
                                            console.log('asdyhjkashdjkhasjkd', content);
                                            setEngDescrip(content);
                                        }}
                                        placeholder="Description Arabic"
                                    />
                                </div>
                                <div className="mb-5">
                                    <label className="">Description (AR)</label>
                                    <ReactQuill
                                        theme="snow"
                                        value={arDescrip}
                                        onChange={(content) => {
                                            console.log('asdyhjkashdjkhasjkd', content);
                                            setArDescrip(content);
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="max-sm:my-2 lg:my-3">
                                <div>
                                    <label>Creativity Years English</label>
                                    <input
                                        type="text"
                                        placeholder="Creativity Years English"
                                        className="form-input ltr:rounded-l-none rtl:rounded-r-none"
                                        name="Creativityyears"
                                        value={formik.values.Creativityyears}
                                        onChange={formik.handleChange}
                                    />
                                </div>
                            </div>
                            <div className="max-sm:my-2 lg:my-3">
                                <div>
                                    <label>Creativity Years Arabic</label>
                                    <input
                                        type="text"
                                        placeholder="Creativity Years Arabic English"
                                        className="form-input ltr:rounded-l-none rtl:rounded-r-none"
                                        name="CreativityyearsArabic"
                                        value={formik.values.CreativityyearsArabic}
                                        onChange={formik.handleChange}
                                    />
                                </div>
                            </div>

                            <button type="submit" className="btn btn-primary !mt-6">
                                Submit Form
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default Creativity;
