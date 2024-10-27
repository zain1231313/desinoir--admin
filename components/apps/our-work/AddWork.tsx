'use client';
import { MainOurWork } from '@/components/schema/mainourwork';
import { addOurWorkMain, fetchType } from '@/components/utils/Helper';
import { useFormik } from 'formik';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import ReactQuill from 'react-quill';

interface OptionType {
    _id: string;
    type: string;
}
const MainOurwork = ({ onNextStep }: any) => {
    const [loading, setLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [descriptionPreview, setDescriptionPreview] = useState<string | null>(null);
    const [types, setTypes] = useState<[]>([]);
    const [selecttype, setSelectType] = useState<OptionType | undefined>();
    const [type, setType] = useState<OptionType | undefined>();

    const fetchData = async () => {
        try {

            const typeData = await fetchType();


            setTypes(typeData?.data);
        } catch (error) {
            console.error('Failed to fetch data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    console.log("type -----------", type)

    const formik = useFormik({
        initialValues: {
            title: '',
            arTitle: '',
            subtitle: '',
            arSubtitle: '',
            types: '',
            description: '',
            arDescription: '',
            primaryImage: null,
            descriptionImage: null,
        },
        validationSchema: MainOurWork,

        onSubmit: async (values) => {
            setLoading(true);
            try {
                const response = await addOurWorkMain(values, type);
                if (response.success === true) {
                    onNextStep(response);
                } else {
                    toast.error(response.message);
                }
            } catch (error: any) {
                toast.error(error.message);
                console.error('Failed to submit form:', error);
            } finally {
                setLoading(false);
            }
        },
    });
    const handleDescriptionImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                const previewUrl = reader.result as string;
                setDescriptionPreview(previewUrl);
                formik.setFieldValue('descriptionImage', file); // Store file in Formik
            };
            reader.readAsDataURL(file);
        }
    };
    const handlePrimaryImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                const previewUrl = reader.result as string;
                setImagePreview(previewUrl);
                formik.setFieldValue('primaryImage', file);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        //@ts-ignore
        formik.handleSubmit(formik?.values);
    };

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = e.target.value;
        // Find the selected object based on the selected value
        const selectedObj = types.find((option: any) => option._id === selectedValue);

        if (selectedObj) {
            //@ts-ignore
            setType(selectedObj._id);
            setSelectType(selectedObj);
        } else {
            console.error("Selected object is undefined");
        }
    };

    return (
        <div className="panel border-white-light px-3 dark:border-[#1b2e4b]">
            <form>
                <div className="panel border-white-light px-3 dark:border-[#1b2e4b]">
                    <div className="max-md:gap-2 max-sm:grid-cols-1 mb-2 grid grid-cols-2 gap-4 gap-y-0">
                        <div>
                            <label>Title</label>
                            <input
                                type="text"
                                name="title"
                                className="w-full border-[1px] px-2 py-2 dark:border-[#17263C] dark:bg-[#121E32]"
                                value={formik.values.title}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.title && formik.errors.title ? <p className="text-xs text-red-800">{formik.errors.title}</p> : null}
                        </div>
                        <div>
                            <label>Arabic Title</label>
                            <input
                                type="text"
                                name="arTitle"
                                className="w-full border-[1px] px-2 py-2 dark:border-[#17263C] dark:bg-[#121E32]"
                                value={formik.values.arTitle}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.arTitle && formik.errors.arTitle ? <p className="text-xs text-red-800">{formik.errors.arTitle}</p> : null}
                        </div>
                        <div>
                            <label>Subtitle</label>
                            <input
                                type="text"
                                name="subtitle"
                                className="w-full border-[1px] px-2 py-2 dark:border-[#17263C] dark:bg-[#121E32]"
                                value={formik.values.subtitle}
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                            />
                            {formik.touched.subtitle && formik.errors.subtitle ? <p className="text-xs text-red-800">{formik.errors.subtitle}</p> : null}
                        </div>
                        <div>
                            <label>Arabic Subtitle</label>
                            <input
                                type="text"
                                name="arSubtitle"
                                className="w-full border-[1px] px-2 py-2 dark:border-[#17263C] dark:bg-[#121E32]"
                                value={formik.values.arSubtitle}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.arSubtitle && formik.errors.arSubtitle ? <p className="text-xs text-red-800">{formik.errors.arSubtitle}</p> : null}
                        </div>
                        <div>
                            <label>Types</label>

                            <div>
                                <select
                                    className="form-select"
                                    value={selecttype?._id}
                                    onChange={handleSelectChange}
                                >
                                    {types.map((option: any, index: number) => (
                                        <option key={index} value={option._id}>
                                            {option.type}
                                        </option>
                                    ))}
                                </select>
                            </div>


                        </div>
                    </div>

                    {/* Primary Image */}
                    <div className="my-2">
                        <label>Primary Image</label>
                        {imagePreview && (
                            <div className="my-2">
                                <Image width={1000} height={1000} src={imagePreview} alt="Preview" className="h-20 w-20 rounded-lg object-cover" />
                            </div>
                        )}
                        <label htmlFor="primaryImage" className="btn btn-primary w-fit" style={{ cursor: 'pointer' }}>
                            Choose image
                            <input type="file" name="primaryImage" id="primaryImage" accept="image/*" onChange={handlePrimaryImageChange} className="form-input" style={{ display: 'none' }} />
                        </label>
                    </div>
                    {formik.touched.primaryImage && formik.errors.primaryImage ? <p className="text-xs text-red-800">{formik.errors.primaryImage}</p> : null}
                </div>
                <div className="max-md:gap-2 max-sm:grid-cols-1 mb-2 grid grid-cols-2 gap-4 gap-y-0">
                    <div className="mt-4">
                        <label>Description English</label>
                        <div className="relative rounded bg-gray-50 dark:bg-[#0E1726]">
                            <ReactQuill
                                theme="snow"
                                value={formik.values.description}
                                onChange={(content) => {
                                    formik.setFieldValue('description', content);
                                }}
                                placeholder="Description English"
                            />
                        </div>
                        {formik.touched.description && formik.errors.description ? <p className="text-xs text-red-800">{formik.errors.description}</p> : null}
                    </div>

                    <div className="mt-4">
                        <label>Description Arabic</label>
                        <div className="relative rounded bg-gray-50 dark:bg-[#0E1726] ">
                            <ReactQuill
                                theme="snow"
                                value={formik.values.arDescription}
                                onChange={(content) => {
                                    formik.setFieldValue('arDescription', content);
                                }}
                                placeholder="Description Arabic"
                            />
                        </div>
                    </div>
                    {formik.touched.arDescription && formik.errors.arDescription ? <p className="text-xs text-red-800">{formik.errors.arDescription}</p> : null}
                </div>

                <div className="my-2">
                    <label>Description Image</label>
                    {descriptionPreview && (
                        <div className="my-2">
                            <Image width={1000} height={1000} src={descriptionPreview} alt="Preview" className="h-20 w-20 rounded-lg object-cover" />
                        </div>
                    )}
                    <label htmlFor="description" className="btn btn-primary w-fit" style={{ cursor: 'pointer' }}>
                        Choose Image
                        <input type="file" name="description" id="description" accept="image/*" onChange={handleDescriptionImageChange} className="form-input" style={{ display: 'none' }} />
                    </label>
                </div>
                {formik.touched.description && formik.errors.description ? <p className="text-xs text-red-800">{formik.errors.description}</p> : null}
                {/* <div className="flex justify-end">
                    <button className="rounded bg-blue-500 px-4 py-2 text-white" onClick={() => handleNextStep(formik.values)}>
                        Next
                    </button>
                </div> */}

                <button onClick={handleSubmit} disabled={loading || formik.isSubmitting} className="rounded bg-blue-500 px-4 py-2 text-white">
                    {loading ? 'Loading...' : 'Next'}
                </button>
            </form>
        </div>
    );
};

export default MainOurwork;
