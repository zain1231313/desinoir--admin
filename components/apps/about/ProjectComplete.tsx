'use client';
import React, { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import FileUploader from '../reuseable/FileUploader';
import { useFormik } from 'formik';
import fetchAboutData, { AboutProjects, postAboutData } from '@/components/utils/Helper';
import toast from 'react-hot-toast';
import Loading from '@/components/layouts/loading';

const AboutProject = () => {
    const [loading, setLoading] = useState(false);
    const [image1, setImage1] = useState<File | null>(null); // For creativityImage
    const [image2, setImage2] = useState<File | null>(null); // For whyDesignoirImage
    const [creativeDescrip, setCreativeDescrip] = useState(''); // For creativityDescription
    const [creativeDescripAr, setCreativeDescripAr] = useState('');

    const [filePreview2, setFilePreview2] = useState<string | null>(null);
    const [filePreview3, setFilePreview3] = useState<string | null>(null);

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
            completedProjectsCount: 0,
            completedProjectsText: '',
            happyClientsCount: 0,
            happyClientsText: '',
            positiveRatingCount: 0,
            positiveRatingText: '',
            yearsExperienceCount: 0,
            yearsExperienceText: '',
            completedProjectsTextAr: '',
            happyClientsTextAr: '',
            positiveRatingTextAr: '',
            yearsExperienceTextAr: '',
        },
        onSubmit: async (values) => {
            setLoading(true);
            try {
                const formData = new FormData();

                // Append all values from Formik
                formData.append('completedProjects', String(values.completedProjectsCount));
                formData.append('happyClients', String(values.happyClientsCount));
                formData.append('happyClientsText', values.happyClientsText);
                formData.append('positiveRating', String(values.positiveRatingCount));
                formData.append('yearsExperience', String(values.yearsExperienceCount));
                formData.append('completedProjectsText', values.completedProjectsText);
                formData.append('positiveRatingText', values.positiveRatingText);
                formData.append('yearsExperienceText', values.yearsExperienceText);

                // Call the API helper function
                const result = await AboutProjects(formData); // Assuming postAboutData is the API helper
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
                completedProjectsCount: result.data.data.en.counters.completedProjects.count,
                completedProjectsText: result.data.data.en.counters.completedProjects.text || '',
                happyClientsCount: result.data.data.en.counters.happyClients.count,
                happyClientsText: result.data.data.en.counters.happyClients.text,
                positiveRatingCount: result.data.data.en.counters.positiveRating.count,
                positiveRatingText: result.data.data.en.counters.positiveRating.text,
                yearsExperienceCount: result.data.data.en.counters.yearsExperience.count,
                yearsExperienceText: result.data.data.en.counters.yearsExperience.text,
                completedProjectsTextAr: result.data.data.ar.counters.completedProjects.text,
                happyClientsTextAr: result.data.data.ar.counters.happyClients.text,
                positiveRatingTextAr: result.data.data.ar.counters.positiveRating.text,
                yearsExperienceTextAr: result.data.data.ar.counters.yearsExperience.text,
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
                            <div className="panel border-white-light px-3 dark:border-[#1b2e4b]">
                                <h5 className="text-lg font-semibold dark:text-white-light">Bubble Section</h5>
                                <div className="grid grid-cols-4 gap-4">
                                    <div className="col-span-1">
                                        <label htmlFor="completedProjectsCount" className="">
                                            Completed Projects Count
                                        </label>
                                        <input type="number" id="completedProjectsCount" {...formik.getFieldProps('completedProjectsCount')} className="form-input" />
                                    </div>
                                    <div className="col-span-3">
                                        <label htmlFor="completedProjectsText" className="">
                                            Completed Projects Text
                                        </label>
                                        <input type="text" id="completedProjectsText" {...formik.getFieldProps('completedProjectsText')} className="form-input" />
                                    </div>
                                    <div className="col-span-1">
                                        <label htmlFor="happyClientsCount" className="">
                                            Happy Clients Count
                                        </label>
                                        <input type="number" id="happyClientsCount" {...formik.getFieldProps('happyClientsCount')} className="form-input" />
                                    </div>
                                    <div className="col-span-3">
                                        <label htmlFor="happyClientsText" className="">
                                            Happy Clients Text
                                        </label>
                                        <input type="text" id="happyClientsText" {...formik.getFieldProps('happyClientsText')} className="form-input" />
                                    </div>
                                    <div className="col-span-1">
                                        <label htmlFor="positiveRatingCount" className="">
                                            Positive Rating Count
                                        </label>
                                        <input type="number" id="positiveRatingCount" {...formik.getFieldProps('positiveRatingCount')} className="form-input" />
                                    </div>
                                    <div className="col-span-3">
                                        <label htmlFor="positiveRatingText" className="">
                                            Positive Rating Text
                                        </label>
                                        <input type="text" id="positiveRatingText" {...formik.getFieldProps('positiveRatingText')} className="form-input" />
                                    </div>
                                    <div className="col-span-1">
                                        <label htmlFor="yearsExperienceCount" className="">
                                            Years Experience Count
                                        </label>
                                        <input type="number" id="yearsExperienceCount" {...formik.getFieldProps('yearsExperienceCount')} className="form-input" />
                                    </div>
                                    <div className="col-span-3">
                                        <label htmlFor="yearsExperienceText" className="">
                                            Years Experience Text
                                        </label>
                                        <input type="text" id="yearsExperienceText" {...formik.getFieldProps('yearsExperienceText')} className="form-input" />
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

export default AboutProject;
