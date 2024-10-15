'use client';
import { ChallengeSchema, MainOurWork, ProblemSchema } from '@/components/schema/mainourwork';
import { addOurWorkChallenge, addOurWorkMain, addOurWorkProblem } from '@/components/utils/Helper';
import { IRootState } from '@/store';
import { selectId } from '@/store/AricleSlice';
import { useFormik } from 'formik';
import Image from 'next/image';
import { useState } from 'react';
import toast from 'react-hot-toast';
import ReactQuill from 'react-quill';
import { useSelector } from 'react-redux';

const ChallengeWork = ({ onNextStep }: any) => {
    const id = useSelector((state: IRootState) => selectId(state));
    // console.log('IDD Challenge=>', id);
    const [loading, setLoading] = useState(false);
    const [challengePreview, setChallengePreview] = useState<string | null>(null);
    const formik = useFormik({
        initialValues: {
            ourWorkId: id,
            challengesTitle: '',
            arChallengesTitle: '',
            challengesDescription: '',
            arChallengesDescription: '',
            challengeImage: null,
        },
        validationSchema: ChallengeSchema,

        onSubmit: async (values) => {
            // console.log('Working =>', values);
            setLoading(true);
            try {
                const response = await addOurWorkChallenge(values);
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
    const handleChallengeImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                const previewUrl = reader.result as string;
                setChallengePreview(previewUrl);
                formik.setFieldValue('challengeImage', file);
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
                        <label>Challenges Title</label>
                        <input
                            type="text"
                            name="challengesTitle"
                            className="w-full border-[1px] px-2 py-2 dark:border-[#17263C] dark:bg-[#121E32]"
                            value={formik.values.challengesTitle}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        {formik.touched.challengesTitle && formik.errors.challengesTitle ? <p className="text-xs text-red-800">{formik.errors.challengesTitle}</p> : null}
                    </div>
                    <div>
                        <label>Arabic Challenges Title</label>
                        <input
                            type="text"
                            name="arChallengesTitle"
                            className="w-full border-[1px] px-2 py-2 dark:border-[#17263C] dark:bg-[#121E32]"
                            value={formik.values.arChallengesTitle}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        {formik.touched.arChallengesTitle && formik.errors.arChallengesTitle ? <p className="text-xs text-red-800">{formik.errors.arChallengesTitle}</p> : null}
                    </div>

                    <div className="mt-4">
                        <label>Challenges Description</label>
                        <div className="relative rounded bg-gray-50 dark:bg-[#0E1726]">
                            <ReactQuill
                                theme="snow"
                                value={formik.values.challengesDescription}
                                onChange={(content) => formik.setFieldValue('challengesDescription', content)}
                                placeholder="Description English"
                            />
                        </div>
                        {formik.touched.challengesDescription && formik.errors.challengesDescription ? <p className="text-xs text-red-800">{formik.errors.challengesDescription}</p> : null}
                    </div>

                    <div className="mt-4">
                        <label>Arabic Challenges Description</label>
                        <div className="relative rounded bg-gray-50 dark:bg-[#0E1726]">
                            <ReactQuill
                                theme="snow"
                                value={formik.values.arChallengesDescription}
                                onChange={(content) => formik.setFieldValue('arChallengesDescription', content)}
                                placeholder="Description Arabic"
                            />
                        </div>
                        {formik.touched.arChallengesDescription && formik.errors.arChallengesDescription ? <p className="text-xs text-red-800">{formik.errors.arChallengesDescription}</p> : null}
                    </div>
                </div>

                {/* Challenge Image */}
                <label>Challenge Image</label>
                {challengePreview && (
                    <div className="my-2">
                        <Image width={1000} height={1000} src={challengePreview} alt="Challenge Image" className="h-20 w-20 rounded-lg object-cover" />
                    </div>
                )}
                <label htmlFor="challengeImage" className="btn btn-primary w-fit" style={{ cursor: 'pointer' }}>
                    Choose Image
                    <input type="file" name="challengeImage" id="challengeImage" accept="image/*" onChange={handleChallengeImageChange} className="form-input" style={{ display: 'none' }} />
                </label>

                {formik.touched.challengeImage && formik.errors.challengeImage ? <p className="text-xs text-red-800">{formik.errors.challengeImage}</p> : null}
                <button onClick={handleSubmit} disabled={loading || formik.isSubmitting} className="rounded bg-blue-500 px-4 py-2 text-white">
                    {loading ? 'Loading...' : 'Next'}
                </button>
            </form>
        </div>
    );
};

export default ChallengeWork;
