'use client';
import { ChallengeSchema, MainOurWork, MajorScreenSchema, ProblemSchema, SolutionSchema } from '@/components/schema/mainourwork';
import { addOurWorkChallenge, addOurWorkMain, addOurWorkMajorScreen, addOurWorkProblem, addOurWorkSolution } from '@/components/utils/Helper';
import { IRootState } from '@/store';
import { selectId } from '@/store/AricleSlice';
import { useFormik } from 'formik';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';
import ReactQuill from 'react-quill';
import { useSelector } from 'react-redux';

const MajorScreenWork = ({ onNextStep }: any) => {
    const id = useSelector((state: IRootState) => selectId(state));
    const [description2Preview, setDescription2Preview] = useState<string | null>(null);
    const [majorScreensPreviews, setMajorScreensPreviews] = useState<string[]>([]);
    const { push } = useRouter();
    const [loading, setLoading] = useState(false);
    const [solutionPreview, setSolutionPreview] = useState<string | null>(null);
    const formik = useFormik({
        initialValues: {
            ourWorkId: id,
            description2: '',
            arDescription2: '',
            description2Image: '',
            MajorScreensImages: '',
        },
        validationSchema: MajorScreenSchema,

        onSubmit: async (values) => {
            console.log('Working =>', values);
            setLoading(true);
            try {
                const response = await addOurWorkMajorScreen(values);
                console.log('Response ==>', response);
                if (response.success === true) {
                    push('/apps/our-work/');
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
    const handleDescription2Image = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                const previewUrl = reader.result as string;
                setDescription2Preview(previewUrl); // Local state for preview
                formik.setFieldValue('description2Image', file); // Store file in Formik
            };
            reader.readAsDataURL(file);
        }
    };
    const handleMajorScreensImagesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            const filesArray = Array.from(files);
            const filePreviews = filesArray.map((file) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                return new Promise<string>((resolve) => {
                    reader.onload = () => resolve(reader.result as string);
                });
            });

            Promise.all(filePreviews).then((previews) => {
                setMajorScreensPreviews(previews); // Local state for previews
                formik.setFieldValue('MajorScreensImages', filesArray); // Store files in Formik
            });
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
                    <div className="mt-4">
                        <label>Description</label>
                        <div className="relative rounded bg-gray-50 dark:bg-[#0E1726]">
                            <ReactQuill
                                theme="snow"
                                value={formik.values.description2}
                                onChange={(content) => {
                                    formik.setFieldValue('description2', content);
                                }}
                                placeholder="Description English"
                            />
                        </div>
                        {formik.touched.description2 && formik.errors.description2 ? <p className="text-xs text-red-800">{formik.errors.description2}</p> : null}
                    </div>

                    <div className="mt-4">
                        <label>Arabic Description</label>
                        <div className="relative rounded bg-gray-50 dark:bg-[#0E1726]">
                            <ReactQuill
                                theme="snow"
                                value={formik.values.arDescription2}
                                onChange={(content) => {
                                    formik.setFieldValue('arDescription2', content);
                                }}
                                placeholder="Description Arabic"
                            />
                        </div>
                        {formik.touched.arDescription2 && formik.errors.arDescription2 ? <p className="text-xs text-red-800">{formik.errors.arDescription2}</p> : null}
                    </div>
                </div>
                <label>Description 2 Image</label>
                {description2Preview && (
                    <div className="my-2">
                        <Image width={50} height={50} src={description2Preview} alt="Description 2 Image" className="h-20 w-20 rounded-lg object-cover" />
                    </div>
                )}
                <label htmlFor="description2Image" className="btn btn-primary w-fit" style={{ cursor: 'pointer' }}>
                    Choose Image
                    <input type="file" name="description2Image" id="description2Image" accept="image/*" onChange={handleDescription2Image} className="form-input" style={{ display: 'none' }} />
                </label>
                {formik.touched.description2Image && formik.errors.description2Image ? <p className="text-xs text-red-800">{formik.errors.description2Image}</p> : null}
                {/* Major Screens Images */}
                <label>Major Screens Images</label>
                {majorScreensPreviews.length > 0 && (
                    <div className="my-2 flex flex-wrap gap-2">
                        {majorScreensPreviews.map((preview, index) => (
                            <Image width={50} height={50} key={index} src={preview} alt={`Major Screens Image ${index}`} className="h-20 w-20 rounded-lg object-cover" />
                        ))}
                    </div>
                )}
                <label htmlFor="majorScreensImages" className="btn btn-primary w-fit" style={{ cursor: 'pointer' }}>
                    Choose Image
                    <input
                        type="file"
                        multiple
                        name="majorScreensImages"
                        id="majorScreensImages"
                        accept="image/*"
                        onChange={handleMajorScreensImagesChange}
                        className="form-input"
                        style={{ display: 'none' }}
                    />
                </label>
                {formik.touched.MajorScreensImages && formik.errors.MajorScreensImages ? <p className="text-xs text-red-800">{formik.errors.MajorScreensImages}</p> : null}{' '}
                <button onClick={handleSubmit} disabled={loading || formik.isSubmitting} className="rounded bg-blue-500 px-4 py-2 text-white">
                    {loading ? 'Loading...' : 'Next'}
                </button>
            </form>
        </div>
    );
};

export default MajorScreenWork;
