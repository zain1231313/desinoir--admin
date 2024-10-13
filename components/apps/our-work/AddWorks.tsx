'use client';
import { useFormik } from 'formik';
import toast from 'react-hot-toast';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { addOurWork } from '@/components/utils/Helper';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SelectContextProvider } from '@material-tailwind/react/components/Select/SelectContext';
import { WorkSchema } from '@/components/schema/schema';
import Loading from '@/components/layouts/loading';
import MainOurwork from './AddWork';
import ProblemWork from './AddProblem';
import ChallengeWork from './AddChallenge';
import { useDispatch } from 'react-redux';
import { setId } from '@/store/AricleSlice';
import SolutionWork from './AddSolution';
import MajorScreenWork from './AddMajorScreen';

// Define the FormValues interface

// Define component
const AddWorks = () => {
    const [step, setStep] = useState(0);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [problemPreview, setProblemPreview] = useState<string | null>(null);
    const [challengePreview, setChallengePreview] = useState<string | null>(null);
    const [solutionPreview, setSolutionPreview] = useState<string | null>(null);
    const [description2Preview, setDescription2Preview] = useState<string | null>(null);
    const [descriptionPreview, setDescriptionPreview] = useState<string | null>(null);
    const [majorScreensPreviews, setMajorScreensPreviews] = useState<string[]>([]);
    const dispatch = useDispatch();
    const navigate = useRouter();
    const formik = useFormik({
        initialValues: {
            subtitle: '',
            arSubtitle: '',
            title: '',
            arTitle: '',
            types: '',
            description: '',
            arDescription: '',
            ProblemStatementTitle: '',
            arProblemStatementTitle: '',
            ProblemStatementDescription: '',
            arProblemStatementDescription: '',
            challengesTitle: '',
            arChallengesTitle: '',
            challengesDescription: '',
            arChallengesDescription: '',
            SolutionTitle: '',
            arSolutionTitle: '',
            SolutionDescription: '',
            arSolutionDescription: '',
            description2: '',
            arDescription2: '',
            primaryImage: null,
            problemImage: null,
            challengeImage: null,
            solutionImage: null,
            description2Image: null,
            descriptionImage: null,
            majorScreensImages: [],
        },
        validationSchema: WorkSchema,
        onSubmit: async (values) => {
            setLoading(true);
            try {
                console.log(values);
                const result = await addOurWork(values);
                console.log('resut090909???', result);
                if (result.success == true) {
                    toast.success(result.message);
                    navigate.push('/apps/our-work');
                    setLoading(false);
                } else {
                    setLoading(false);
                    toast.error(result.message);
                }
            } catch (error: any) {
                setLoading(false);
                toast.error(error.message);
                console.error('Failed to update work data:', error);
            }
        },
    });
    // const handleNextStep = async (values: any) => {
    //     // Check for required fields based on the current step
    //     const requiredFields: any = {
    //         0: ['subtitle', 'arSubtitle', 'title', 'arTitle', 'types', 'description', 'arDescription', 'primaryImage', 'descriptionImage'],
    //         1: ['ProblemStatementTitle', 'arProblemStatementTitle', 'ProblemStatementDescription', 'arProblemStatementDescription', 'problemImage'],
    //         2: ['challengesTitle', 'arChallengesTitle', 'challengesDescription', 'arChallengesDescription', 'challengeImage'],
    //         3: ['SolutionTitle', 'arSolutionTitle', 'SolutionDescription', 'arSolutionDescription', 'solutionImage'],
    //         4: ['description2', 'arDescription2', 'description2Image', 'majorScreensImages[]'],
    //     };

    //     const fieldsToCheck = requiredFields[step];

    //     const isValid = fieldsToCheck.every((field: any) => values[field]);

    //     if (!isValid) {
    //         toast.error('Please fill all required fields before proceeding to the next step.');
    //         return;
    //     }

    //     try {
    //         let response;
    //         switch (step) {
    //             case 0:
    //                 response = await addWorkStep1(values);
    //                 break;
    //             case 1:
    //                 response = await addWorkStep2(values);
    //                 break;
    //             case 2:
    //                 response = await addWorkStep3(values);
    //                 break;
    //             case 3:
    //                 response = await addWorkStep4(values);
    //                 break;
    //             case 4:
    //                 response = await addWorkStep5(values);
    //                 break;
    //             default:
    //                 throw new Error('Invalid step');
    //         }

    //         if (response.success) {
    //             toast.success(response.message);
    //             setStep((prevStep) => prevStep + 1);
    //         } else {
    //             toast.error(response.message);
    //         }
    //     } catch (error: any) {
    //         toast.error(error.message);
    //     }
    // };
    const handleNextStep = (response: any) => {
        if (response.success == true) {
            if (step === 0) {
                dispatch(setId(response?.data?.id));
            }
            setStep((prevStep) => prevStep + 1);
        }
    };

    // Problem Image Handler
    const handleProblemImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                const previewUrl = reader.result as string;
                setProblemPreview(previewUrl);
                formik.setFieldValue('problemImage', file); // Store file in Formik
            };
            reader.readAsDataURL(file);
        }
    };

    // Challenge Image Handler
    const handleChallengeImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                const previewUrl = reader.result as string;
                setChallengePreview(previewUrl);
                formik.setFieldValue('challengeImage', file); // Store file in Formik
            };
            reader.readAsDataURL(file);
        }
    };

    // Solution Image Handler
    const handleSolutionImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                const previewUrl = reader.result as string;
                setSolutionPreview(previewUrl);
                formik.setFieldValue('solutionImage', file); // Store file in Formik
            };
            reader.readAsDataURL(file);
        }
    };

    // Major Screens Images Handler
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
                formik.setFieldValue('majorScreensImages', filesArray); // Store files in Formik
            });
        }
    };

    // Description2 Image Handler
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

    return (
        <>
            {loading === true ? (
                <Loading />
            ) : (
                <div className="panel border-white-light px-3 dark:border-[#1b2e4b]">
                    <form onSubmit={formik.handleSubmit}>
                        <h2 className="mb-1 flex items-center px-2 py-3 font-extrabold uppercase">
                            <span>Add Work</span>
                        </h2>
                        {step === 0 && <MainOurwork onNextStep={handleNextStep} />}
                        {/* Problem Statement Title and Description */}
                        {step === 1 && <ProblemWork onNextStep={handleNextStep} />}

                        {/* Challenge Title and Description */}
                        {step === 2 && <ChallengeWork onNextStep={handleNextStep} />}

                        {/* solution Title and Description */}
                        {step === 3 && <SolutionWork onNextStep={handleNextStep} />}

                        {step === 4 && <MajorScreenWork onNextStep={handleNextStep} />}
                    </form>
                </div>
            )}
        </>
    );
};

export default AddWorks;
