'use client';
import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { GetTeamHeader, submitTeamHeader } from '@/components/utils/Helper';
import toast from 'react-hot-toast';

const TeamHeader = () => {
    const [value, setValue] = useState<any>('');
    const [valuear, setValuear] = useState<any>('');
    const [primaryImagePreview, setPrimaryImagePreview] = useState<any>(null);

    const fetchData = async () => {
        try {
            const resultEN = await GetTeamHeader('en');
            console.log('Team Header=>', resultEN);
            setValue(resultEN.data[0]);
            const resultAR = await GetTeamHeader('ar');
            setValuear(resultAR.data[0]);

            // Set primary image preview with fetched image URL
            if (resultEN.data[0]?.emoji) {
                setPrimaryImagePreview(resultEN.data[0].emoji);
            }
        } catch (error) {
            console.error('Failed to fetch data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const formik = useFormik({
        initialValues: {
            enTitle: '',
            arTitle: '',
            enSubTitle: '',
            arSubTitle: '',
            servicePrimaryImage: '',
        },
        onSubmit: async (values) => {
            console.log('Values==>', values);
            try {
                const response = await submitTeamHeader(values);
                console.log(response, 'responseresponse');
                toast.success(response.message);
                fetchData(); // Fetch data again after submitting to update UI
            } catch (error: any) {
                toast.error(error.message);
            }
        },
    });

    useEffect(() => {
        if (value && valuear) {
            formik.setValues({
                enTitle: value.title,
                arTitle: valuear.title,
                enSubTitle: value.subTitle,
                arSubTitle: valuear.subTitle,
                servicePrimaryImage: value.emoji,
            });
            setPrimaryImagePreview(value.emoji);
        }
    }, [value, valuear]);

    const handleImage = (event: React.ChangeEvent<HTMLInputElement>, imageField: string) => {
        const file = event.currentTarget?.files?.[0];
        if (file) {
            const objectUrl = URL.createObjectURL(file);
            formik.setFieldValue(imageField, file);
            if (imageField === 'servicePrimaryImage') {
                setPrimaryImagePreview(objectUrl);
            }
        }
    };




    console.log("Preivew=>", primaryImagePreview)

    return (
        <div>
            <div className="panel border-white-light px-3 dark:border-[#1b2e4b]">
                <form onSubmit={formik.handleSubmit}>
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-1">
                        <div className="flex w-full gap-2">
                            <div className="my-2 w-full">
                                <label className="font-semibold">Title</label>
                                <input
                                    type="text"
                                    placeholder="Title English"
                                    className="form-input"
                                    value={formik.values.enTitle}
                                    onChange={formik.handleChange}
                                    name="enTitle"
                                />
                            </div>
                            <div className="my-2 w-full">
                                <label className="font-semibold">Title</label>
                                <input
                                    type="text"
                                    placeholder="Title Arabic"
                                    className="form-input"
                                    value={formik.values.arTitle}
                                    onChange={formik.handleChange}
                                    name="arTitle"
                                />
                            </div>
                        </div>
                        <div className="flex w-full gap-2">
                            <div className="mb-5 w-full">
                                <label className="font-semibold">SubTitle</label>
                                <input
                                    type="text"
                                    placeholder="SubTitle English"
                                    className="form-input"
                                    value={formik.values.enSubTitle}
                                    name="enSubTitle"
                                    onChange={formik.handleChange}
                                />
                            </div>
                            <div className="mb-5 w-full">
                                <label className="font-semibold">SubTitle</label>
                                <input
                                    type="text"
                                    placeholder="SubTitle Arabic"
                                    className="form-input"
                                    value={formik.values.arSubTitle}
                                    name="arSubTitle"
                                    onChange={formik.handleChange}
                                />
                            </div>
                        </div>

                        <div className="my-2">
                            <label>Emoji Image</label>
                            {primaryImagePreview && (
                                <div className="my-2">
                                    <img src={primaryImagePreview} alt="Preview" className="h-20 w-20 rounded-lg object-cover" />
                                </div>
                            )}
                            <label htmlFor="servicePrimaryImage" className="btn btn-primary w-fit" style={{ cursor: 'pointer' }}>
                                Emoji Image
                                <input
                                    type="file"
                                    className="form-input"
                                    accept="image/*"
                                    id="servicePrimaryImage"
                                    name="servicePrimaryImage"
                                    onChange={(event) => handleImage(event, 'servicePrimaryImage')}
                                    style={{ display: 'none' }}
                                />
                            </label>
                        </div>
                    </div>
                    <button type="submit" className="btn bg-[#20D091] border-none text-white ml-auto">
                        Save
                    </button>
                </form>
            </div>
        </div>
    );
};

export default TeamHeader;
