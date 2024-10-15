'use client';
import { ChallengeSchema, MainOurWork, ProblemSchema, SolutionSchema } from '@/components/schema/mainourwork';
import { addOurWorkChallenge, addOurWorkMain, addOurWorkProblem, addOurWorkSolution } from '@/components/utils/Helper';
import { IRootState } from '@/store';
import { selectId } from '@/store/AricleSlice';
import { useFormik } from 'formik';
import Image from 'next/image';
import { useState } from 'react';
import toast from 'react-hot-toast';
import ReactQuill from 'react-quill';
import { useSelector } from 'react-redux';

const SolutionWork = ({ onNextStep }: any) => {
    const id = useSelector((state: IRootState) => selectId(state));
    // console.log('IDD Challenge=>', id);
    const [loading, setLoading] = useState(false);
    const [solutionPreview, setSolutionPreview] = useState<string | null>(null);
    const formik = useFormik({
        initialValues: {
            ourWorkId: id,
            SolutionTitle: '',
            arSolutionTitle: '',
            SolutionDescription: '',
            arSolutionDescription: '',
            SolutionImage: null,
        },
        validationSchema: SolutionSchema,

        onSubmit: async (values) => {
            // console.log('Working =>', values);
            setLoading(true);
            try {
                const response = await addOurWorkSolution(values);
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
    const handleSolutionImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                const previewUrl = reader.result as string;
                setSolutionPreview(previewUrl);
                formik.setFieldValue('SolutionImage', file); // Store file in Formik
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        console.log('Fromik values', formik?.values);
        //@ts-ignore
        formik.handleSubmit(formik?.values);
    };

    return (
        <div className="panel border-white-light px-3 dark:border-[#1b2e4b]">
            <form>
                <div className="max-md:gap-2 max-sm:grid-cols-1 mb-2 grid grid-cols-2 gap-4 gap-y-0">
                    <div>
                        <label>Solution Title</label>
                        <input
                            type="text"
                            name="SolutionTitle"
                            className="w-full border-[1px] px-2 py-2 dark:border-[#17263C] dark:bg-[#121E32]"
                            value={formik.values.SolutionTitle}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        {formik.touched.SolutionTitle && formik.errors.SolutionTitle ? <p className="text-xs text-red-800">{formik.errors.SolutionTitle}</p> : null}
                    </div>
                    <div>
                        <label>Arabic Solution Title</label>
                        <input
                            type="text"
                            name="arSolutionTitle"
                            className="w-full border-[1px] px-2 py-2 dark:border-[#17263C] dark:bg-[#121E32]"
                            value={formik.values.arSolutionTitle}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />

                        {formik.touched.arSolutionTitle && formik.errors.arSolutionTitle ? <p className="text-xs text-red-800">{formik.errors.arSolutionTitle}</p> : null}
                    </div>

                    <div className="mt-4">
                        <label>Solution Description</label>
                        <div className="relative rounded bg-gray-50 dark:bg-[#0E1726]">
                            <ReactQuill
                                theme="snow"
                                value={formik.values.SolutionDescription}
                                onChange={(content) => {
                                    formik.setFieldValue('SolutionDescription', content);
                                }}
                                placeholder="Description English"
                            />
                        </div>
                        {formik.touched.SolutionDescription && formik.errors.SolutionDescription ? <p className="text-xs text-red-800">{formik.errors.SolutionDescription}</p> : null}
                    </div>

                    <div className="mt-4">
                        <label>Arabic Solution Description</label>
                        <div className="relative rounded bg-gray-50 dark:bg-[#0E1726]">
                            <ReactQuill
                                theme="snow"
                                value={formik.values.arSolutionDescription}
                                onChange={(content) => {
                                    formik.setFieldValue('arSolutionDescription', content);
                                }}
                                placeholder="Description Arabic"
                            />
                        </div>
                        {formik.touched.arSolutionDescription && formik.errors.arSolutionDescription ? <p className="text-xs text-red-800">{formik.errors.arSolutionDescription}</p> : null}
                    </div>
                </div>

                <label>Solution Image</label>
                {solutionPreview && (
                    <div className="my-2">
                        <Image width={1000} height={1000} src={solutionPreview} alt="solution  Image" className="h-20 w-20 rounded-lg object-cover" />
                    </div>
                )}
                <label htmlFor="solutionImage" className="btn btn-primary w-fit" style={{ cursor: 'pointer' }}>
                    Choose Image
                    <input type="file" name="solutionImage" id="solutionImage" accept="image/*" onChange={handleSolutionImageChange} className="form-input" style={{ display: 'none' }} />
                </label>
                {formik.touched.SolutionImage && formik.errors.SolutionImage ? <p className="text-xs text-red-800">{formik.errors.SolutionImage}</p> : null}
                <button onClick={handleSubmit} disabled={loading || formik.isSubmitting} className="rounded bg-blue-500 px-4 py-2 text-white">
                    {loading ? 'Loading...' : 'Next'}
                </button>
            </form>
        </div>
    );
};

export default SolutionWork;
