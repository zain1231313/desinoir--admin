'use client';
import { MainOurWork, ProblemSchema } from '@/components/schema/mainourwork';
import { addOurWorkMain, addOurWorkProblem } from '@/components/utils/Helper';
import { IRootState } from '@/store';
import { selectId } from '@/store/AricleSlice';
import { useFormik } from 'formik';
import Image from 'next/image';
import { useState } from 'react';
import toast from 'react-hot-toast';
import ReactQuill from 'react-quill';
import { useSelector } from 'react-redux';

const ProblemWork = ({ onNextStep }: any) => {
    const id = useSelector((state: IRootState) => selectId(state));
    // console.log('IDD1=>', id);
    const [loading, setLoading] = useState(false);
    const [problemPreview, setProblemPreview] = useState<string | null>(null);

    const formik = useFormik({
        initialValues: {
            ourWorkId: id,
            ProblemStatementTitle: '',
            arProblemStatementTitle: '',
            ProblemStatementDescription: '',
            arProblemStatementDescription: '',
            ProblemStatementImage: null,
        },
        validationSchema: ProblemSchema,

        onSubmit: async (values) => {
            // console.log('Working =>', values);
            setLoading(true);
            try {
                const response = await addOurWorkProblem(values);
                // console.log('Response ==>', response);
                if (response.success === true) {
                    onNextStep(response);
                } else {
                    toast.error(response.message);
                }
            } catch (error: any) {
                toast.error(error.message);
                // console.error('Failed to submit form:', error);
            } finally {
                setLoading(false);
            }
        },
    });
    // Problem Image Handler
    const handleProblemImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                const previewUrl = reader.result as string;
                setProblemPreview(previewUrl);
                formik.setFieldValue('ProblemStatementImage', file); // Store file in Formik
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        //@ts-ignore
        formik.handleSubmit(formik?.values);
    };

    return (
        <div className="panel border-white-light px-3 dark:border-[#1b2e4b]">
            <form>
                <div className="max-md:gap-2 max-sm:grid-cols-1 mb-2 grid grid-cols-2 gap-4 gap-y-0">
                    <div>
                        <label>Problem Statement Title</label>
                        <input
                            type="text"
                            name="ProblemStatementTitle"
                            className="w-full border-[1px] px-2 py-2 dark:border-[#17263C] dark:bg-[#121E32]"
                            value={formik.values.ProblemStatementTitle}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        {formik.touched.ProblemStatementTitle && formik.errors.ProblemStatementTitle ? <p className="text-xs text-red-800">{formik.errors.ProblemStatementTitle}</p> : null}
                    </div>
                    <div>
                        <label>Arabic Problem Statement Title</label>
                        <input
                            type="text"
                            name="arProblemStatementTitle"
                            className="w-full border-[1px] px-2 py-2 dark:border-[#17263C] dark:bg-[#121E32]"
                            value={formik.values.arProblemStatementTitle}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        {formik.touched.arProblemStatementTitle && formik.errors.arProblemStatementTitle ? <p className="text-xs text-red-800">{formik.errors.arProblemStatementTitle}</p> : null}
                    </div>
                </div>

                <div className="max-md:gap-2 max-sm:grid-cols-1 mb-2 grid grid-cols-2 gap-4 gap-y-0">
                    <div className="mt-4">
                        <label>Problem Statement Description</label>
                        <div className="relative rounded bg-gray-50 dark:bg-[#0E1726]">
                            <ReactQuill
                                theme="snow"
                                value={formik.values.ProblemStatementDescription}
                                onChange={(content) => {
                                    formik.setFieldValue('ProblemStatementDescription', content);
                                }}
                                placeholder="Description English"
                            />
                        </div>
                        {formik.touched.ProblemStatementDescription && formik.errors.ProblemStatementDescription ? (
                            <p className="text-xs text-red-800">{formik.errors.ProblemStatementDescription}</p>
                        ) : null}
                    </div>

                    <div className="mt-4">
                        <label>Arabic Problem Statement Description</label>
                        <div className="relative rounded bg-gray-50 dark:bg-[#0E1726]">
                            <ReactQuill
                                theme="snow"
                                value={formik.values.arProblemStatementDescription}
                                onChange={(content) => {
                                    formik.setFieldValue('arProblemStatementDescription', content);
                                }}
                                placeholder="Description Arabic"
                            />
                        </div>
                        {formik.touched.arProblemStatementDescription && formik.errors.arProblemStatementDescription ? (
                            <p className="text-xs text-red-800">{formik.errors.arProblemStatementDescription}</p>
                        ) : null}
                    </div>
                </div>

                <label>Problem Statement Image 1234</label>
                {problemPreview && (
                    <div className="my-2">
                        <Image width={1000} height={1000} src={problemPreview} alt="Problem Statement Image" className="h-20 w-20 rounded-lg object-cover" />
                    </div>
                )}
                <label htmlFor="problemImage" className="btn btn-primary w-fit" style={{ cursor: 'pointer' }}>
                    Choose Image
                    <input type="file" name="problemImage" id="problemImage" accept="image/*" onChange={handleProblemImageChange} className="form-input" style={{ display: 'none' }} />
                </label>
                {formik.touched.ProblemStatementImage && formik.errors.ProblemStatementImage ? <p className="text-xs text-red-800">{formik.errors.ProblemStatementImage}</p> : null}

                <button onClick={handleSubmit} disabled={loading || formik.isSubmitting} className="rounded bg-blue-500 px-4 py-2 text-white">
                    {loading ? 'Loading...' : 'Next'}
                </button>
            </form>
        </div>
    );
};

export default ProblemWork;
