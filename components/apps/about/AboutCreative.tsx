'use client';
import React, { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import FileUploader from '../reuseable/FileUploader';
import { useFormik } from 'formik';
import fetchAboutData, { AboutCreatives, postAboutData } from '@/components/utils/Helper';
import toast from 'react-hot-toast';
import Loading from '@/components/layouts/loading';
import Image from 'next/image';

const AboutCreative = () => {
    const [loading, setLoading] = useState(false);
    const [image1, setImage1] = useState<File | null>(null);
    const [image2, setImage2] = useState<File | null>(null);

    const [filePreview2, setFilePreview2] = useState<string | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setImage1(file);
            const reader = new FileReader();
            reader.onload = () => {
                setFilePreview2(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const formik = useFormik({
        initialValues: {
            creativitySectionTitle: '',
            creativitySectionSubtitle: '',
            creativeDescrip: '',
            creativeDescripAr: '',
            creativitySectionTitleAr: '',
            creativitySectionSubtitleAr: '',
        },
        onSubmit: async (values) => {
            setLoading(true);
            try {
                const formData = new FormData();

                // Append all values from Formik
                formData.append('creativityTitle', values.creativitySectionTitle);
                formData.append('arCreativityTitle', values.creativitySectionTitleAr);
                formData.append('creativitySubtitle', values.creativitySectionSubtitle);
                formData.append('arCreativitySubtitle', values.creativitySectionSubtitleAr);
                formData.append('creativityDescription', values.creativeDescrip);
                formData.append('arCreativityDescription', values.creativeDescripAr);

                if (image1) {
                    formData.append('creativityImage', image1);
                }
                if (image2) {
                    formData.append('whyDesignoirImage', image2);
                }

                // Call the API helper function
                const result = await AboutCreatives(formData); // Assuming postAboutData is the API helper
                setLoading(false);
                toast.success(result.message || 'About data successfully updated');
                fetchData(); // Assuming you are refreshing the data after a successful submission
            } catch (error) {
                setLoading(false);
                toast.error('An error occurred');
                // console.error('Error submitting form:', error);
            }
        },
    });
    const fetchData = async () => {
        try {
            const result = await fetchAboutData();
            formik.setValues({
                creativitySectionTitle: result.data.data.en.creativitySection.title,
                creativitySectionSubtitle: result.data.data.en.creativitySection.subtitle,
                creativeDescrip: result.data.data.en.creativitySection.description,
                creativeDescripAr: result.data.data.ar.creativitySection.description,

                // Arabic values
                creativitySectionTitleAr: result.data.data.ar.creativitySection.title,
                creativitySectionSubtitleAr: result.data.data.ar.creativitySection.subtitle,
            });

            // setImage1(result.data.data.en.creativitySection.image);
            setFilePreview2(result.data.data.en.creativitySection.image);
            // setCreativeDescrip(result.data.data.en.creativitySection.description);
            // setCreativeDescripAr(result.data.data.ar.creativitySection.description);
        } catch (error) {
            // console.error('Error fetching about data:', error);
        }
    };
    useEffect(() => {
        fetchData();
    }, []);
    const toolbarOptions = [
        [{ font: [] }, { size: [] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ color: [] }, { background: [] }],
        [{ script: 'sub' }, { script: 'super' }],
        [{ header: '1' }, { header: '2' }, 'blockquote', 'code-block'],
        [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
        [{ align: [] }],
        ['link', 'image', 'video'],
        ['clean'],
    ];

    const quillModules = {
        toolbar: toolbarOptions,
    };

    return (
        <>
            {loading === true ? (
                <Loading />
            ) : (
                <div>
                    <h2 className="mb-1 flex items-center px-2 py-3 font-extrabold uppercase">
                        <span>About</span>
                    </h2>
                    <form onSubmit={formik.handleSubmit}>
                        <div className="grid grid-cols-1 gap-4">
                            {/* Creativity Section */}
                            <div className="panel border-white-light px-3 dark:border-[#1b2e4b]">
                                <h5 className="text-lg font-semibold dark:text-white-light">Creativity Section</h5>
                                <div className="my-2">
                                    <div className="">
                                        {filePreview2 && <Image width={50} height={50} src={filePreview2} alt="Initial Image" className="h-40 w-40 object-cover" />}
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
                                <div className="max-md:gap-2 max-sm:grid-cols-1 grid grid-cols-2 gap-4">
                                    <div className="max-sm:my-2 lg:my-3">
                                        <div>
                                            <label>Title (EN)</label>
                                            <input
                                                type="text"
                                                placeholder="Title English"
                                                {...formik.getFieldProps('creativitySectionTitle')}
                                                className="form-input ltr:rounded-l-none rtl:rounded-r-none"
                                            />
                                        </div>
                                    </div>
                                    <div className="max-sm:my-2 lg:my-3">
                                        <div>
                                            <label>Title (AR)</label>
                                            <input
                                                type="text"
                                                placeholder="Title Arabic"
                                                {...formik.getFieldProps('creativitySectionTitleAr')}
                                                className="form-input ltr:rounded-l-none rtl:rounded-r-none"
                                            />
                                        </div>
                                    </div>
                                    <div className="max-sm:my-2 lg:my-3">
                                        <div>
                                            <label>Subtitle (EN)</label>
                                            <input
                                                type="text"
                                                placeholder="Subtitle English"
                                                {...formik.getFieldProps('creativitySectionSubtitle')}
                                                className="form-input ltr:rounded-l-none rtl:rounded-r-none"
                                            />
                                        </div>
                                    </div>
                                    <div className="max-sm:my-2 lg:my-3">
                                        <div>
                                            <label>Subtitle (AR)</label>
                                            <input
                                                type="text"
                                                placeholder="Subtitle Arabic"
                                                {...formik.getFieldProps('creativitySectionSubtitleAr')}
                                                className="form-input ltr:rounded-l-none rtl:rounded-r-none"
                                            />
                                        </div>
                                    </div>
                                    <div className="mb-5">
                                        <label className="">Description (EN)</label>
                                        <ReactQuill value={formik.values.creativeDescrip} onChange={(content) => formik.setFieldValue('creativeDescrip', content)} modules={quillModules} />
                                    </div>
                                    <div className="mb-5">
                                        <label>Description (AR)</label>
                                        <ReactQuill value={formik.values.creativeDescripAr} onChange={(content) => formik.setFieldValue('creativeDescripAr', content)} modules={quillModules} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-3 flex items-center gap-4">
                            <button
                                type="submit"
                                className="hover:bg-primary-dark focus:ring-primary-dark inline-flex items-center rounded-md border border-transparent bg-primary px-4 py-2 text-base font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2"
                            >
                                Save
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </>
    );
};

export default AboutCreative;
