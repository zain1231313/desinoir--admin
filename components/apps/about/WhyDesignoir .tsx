'use client';
import React, { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import FileUploader from '../reuseable/FileUploader';
import { useFormik } from 'formik';
import fetchAboutData, { AboutWhyChooses, postAboutData } from '@/components/utils/Helper';
import toast from 'react-hot-toast';
import Loading from '@/components/layouts/loading';
import Image from 'next/image';

const AboutWhyChoose = () => {
    const [loading, setLoading] = useState(false);
    const [image2, setImage2] = useState<File | null>(null);

    const [filePreview2, setFilePreview2] = useState<string | null>(null);
    const [filePreview3, setFilePreview3] = useState<string | null>(null);

    const handleFileChange2 = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setImage2(file);
            const reader = new FileReader();
            reader.onload = () => {
                setFilePreview3(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const formik = useFormik({
        initialValues: {
            whyDesignoirTitle: '',
            whyDesignoirSubtitle: '',
            whyDesignoirFlow1: '',
            whyDesignoirFlow2: '',
            whyDesignoirFlow3: '',
            whyDesignoirFlow4: '',
            whyDesignoirTitleAr: '',
            whyDesignoirSubtitleAr: '',
            whyDesignoirFlow1Ar: '',
            whyDesignoirFlow2Ar: '',
            whyDesignoirFlow3Ar: '',
            whyDesignoirFlow4Ar: '',
        },
        onSubmit: async (values) => {
            setLoading(true);
            try {
                const formData = new FormData();

                // Append all values from Formik
                formData.append('whyDesignoirTitle', values.whyDesignoirTitle);
                formData.append('arWhyDesignoirTitle', values.whyDesignoirTitleAr);
                formData.append('whyDesignoirSubtitle', values.whyDesignoirSubtitle);
                formData.append('arWhyDesignoirSubtitle', values.whyDesignoirSubtitleAr);
                formData.append('whyDesignoirFlow1', values.whyDesignoirFlow1);
                formData.append('arWhyDesignoirFlow1', values.whyDesignoirFlow1Ar);
                formData.append('whyDesignoirFlow2', values.whyDesignoirFlow2);
                formData.append('arWhyDesignoirFlow2', values.whyDesignoirFlow2Ar);
                formData.append('whyDesignoirFlow3', values.whyDesignoirFlow3);
                formData.append('arWhyDesignoirFlow3', values.whyDesignoirFlow3Ar);
                formData.append('whyDesignoirFlow4', values.whyDesignoirFlow4);
                formData.append('arWhyDesignoirFlow4', values.whyDesignoirFlow4Ar);

                if (image2) {
                    formData.append('whyDesignoirImage', image2);
                }

                // Call the API helper function
                const result = await AboutWhyChooses(formData); // Assuming postAboutData is the API helper
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
                whyDesignoirTitle: result.data.data.en.whyDesignoir.title,
                whyDesignoirSubtitle: result.data.data.en.whyDesignoir.subtitle,
                whyDesignoirFlow1: result.data.data.en.whyDesignoir.flow1,
                whyDesignoirFlow2: result.data.data.en.whyDesignoir.flow2,
                whyDesignoirFlow3: result.data.data.en.whyDesignoir.flow3,
                whyDesignoirFlow4: result.data.data.en.whyDesignoir.flow4,

                whyDesignoirTitleAr: result.data.data.ar.whyDesignoir.title,
                whyDesignoirSubtitleAr: result.data.data.ar.whyDesignoir.subtitle,
                whyDesignoirFlow1Ar: result.data.data.ar.whyDesignoir.flow1,
                whyDesignoirFlow2Ar: result.data.data.ar.whyDesignoir.flow2,
                whyDesignoirFlow3Ar: result.data.data.ar.whyDesignoir.flow3,
                whyDesignoirFlow4Ar: result.data.data.ar.whyDesignoir.flow4,
            });

            // setImage1(result.data.data.en.creativitySection.image);
            setFilePreview2(result.data.data.en.creativitySection.image);
            setFilePreview3(result.data.data.en.whyDesignoir.whyDesignoirImage);
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
                                <h5 className="mt-5 text-lg  font-semibold dark:text-white-light">Why Designoir Section</h5>
                                <div className="mt-5">
                                    <div className="my-2">
                                        <div className="">
                                            {filePreview3 && <Image width={1000} height={1000} src={filePreview3} alt="Initial Image" className="h-40 w-40 object-cover" />}
                                            <div className="my-2">
                                                <div className="">
                                                    <label htmlFor="file-input2" className="btn btn-primary w-fit" style={{ cursor: 'pointer' }}>
                                                        Upload image
                                                        <input type="file" id="file-input2" placeholder="Choose a File" accept="image/*" onChange={handleFileChange2} style={{ display: 'none' }} />
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="whyDesignoirTitle" className="">
                                                Why Designoir Title
                                            </label>
                                            <input type="text" id="whyDesignoirTitle" {...formik.getFieldProps('whyDesignoirTitle')} className="form-input" />
                                        </div>
                                        <div>
                                            <label htmlFor="whyDesignoirTitleAr" className="">
                                                Why Designoir Title Arabic
                                            </label>
                                            <input type="text" id="whyDesignoirTitleAr" {...formik.getFieldProps('whyDesignoirTitleAr')} className="form-input" />
                                        </div>
                                        <div>
                                            <label htmlFor="whyDesignoirSubtitle" className="">
                                                Why Designoir Subtitle
                                            </label>
                                            <input type="text" id="whyDesignoirSubtitle" {...formik.getFieldProps('whyDesignoirSubtitle')} className="form-input" />
                                        </div>
                                        <div>
                                            <label htmlFor="whyDesignoirSubtitleAr" className="">
                                                Why Designoir Subtitle Arabic
                                            </label>
                                            <input type="text" id="whyDesignoirSubtitleAr" {...formik.getFieldProps('whyDesignoirSubtitleAr')} className="form-input" />
                                        </div>
                                        <div>
                                            <label htmlFor="whyDesignoirFlow1" className="">
                                                Why Designoir Flow 1
                                            </label>
                                            <input type="text" id="whyDesignoirFlow1" {...formik.getFieldProps('whyDesignoirFlow1')} className="form-input" />
                                        </div>
                                        <div>
                                            <label htmlFor="whyDesignoirFlow1Ar" className="">
                                                Why Designoir Flow 1 Arabic
                                            </label>
                                            <input type="text" id="whyDesignoirFlow1Ar" {...formik.getFieldProps('whyDesignoirFlow1Ar')} className="form-input" />
                                        </div>
                                        <div>
                                            <label htmlFor="whyDesignoirFlow2" className="">
                                                Why Designoir Flow 2
                                            </label>
                                            <input type="text" id="whyDesignoirFlow2" {...formik.getFieldProps('whyDesignoirFlow2')} className="form-input" />
                                        </div>
                                        <div>
                                            <label htmlFor="whyDesignoirFlow2Ar" className="">
                                                Why Designoir Flow 2 Arabic
                                            </label>
                                            <input type="text" id="whyDesignoirFlow2Ar" {...formik.getFieldProps('whyDesignoirFlow2Ar')} className="form-input" />
                                        </div>
                                        <div>
                                            <label htmlFor="whyDesignoirFlow3" className="">
                                                Why Designoir Flow 3
                                            </label>
                                            <input type="text" id="whyDesignoirFlow3" {...formik.getFieldProps('whyDesignoirFlow3')} className="form-input" />
                                        </div>
                                        <div>
                                            <label htmlFor="whyDesignoirFlow3Ar" className="">
                                                Why Designoir Flow 3 Arabic
                                            </label>
                                            <input type="text" id="whyDesignoirFlow3Ar" {...formik.getFieldProps('whyDesignoirFlow3Ar')} className="form-input" />
                                        </div>
                                        <div>
                                            <label htmlFor="whyDesignoirFlow4" className="">
                                                Why Designoir Flow 4
                                            </label>
                                            <input type="text" id="whyDesignoirFlow4" {...formik.getFieldProps('whyDesignoirFlow4')} className="form-input" />
                                        </div>
                                        <div>
                                            <label htmlFor="whyDesignoirFlow4Ar" className="">
                                                Why Designoir Flow 4 Arabic
                                            </label>
                                            <input type="text" id="whyDesignoirFlow4Ar" {...formik.getFieldProps('whyDesignoirFlow4Ar')} className="form-input" />
                                        </div>
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

export default AboutWhyChoose;
