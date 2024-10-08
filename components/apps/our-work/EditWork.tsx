'use client';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useDispatch } from 'react-redux';
// import { useSelector } from 'react-redux';
// import { IRootState } from "@/store/index"
import { fetchAllOurWork, updateWorkData } from '@/components/utils/Helper';
import { useRouter, useSearchParams } from 'next/navigation';
import API_ENDPOINT from '@/components/apiRoutes/ApiRoutes';

const EditWorkForm = () => {


    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    console.log('ID==>', id);
    // const dispatch = useDispatch();
    // const workData = useSelector((state: IRootState) => state.selectedWork.selectedWork);

    // Initialize state with default empty string to avoid TypeScript errors
    const [data, setData] = useState<any>();
    const [engDescrip, setEngDescrip] = useState<string>('');
    const [arDescrip, setArDescrip] = useState<string>('');
    const [engProblemDescrip, setEngProblemDescrip] = useState<string>('');
    const [arProblemDescrip, setArProblemDescrip] = useState<string>('');
    const [engchallengesDescrip, setEngchallengesDescrip] = useState<string>('');
    const [arChallengesDescrip, setArChallengesDescrip] = useState<string>('');
    const [engSolutionDescrip, setEngSolutionDescrip] = useState<string>('');
    const [arSolutionDescrip, setArSolutionDescrip] = useState<string>('');
    const [engdescription2, setEngdescription2] = useState<string>('');
    const [ardescription2, setArdescription2] = useState<string>('');

    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [problemPreview, setProblemPreview] = useState<string | null>(null);
    const [challengePreview, setChallengePreview] = useState<string | null>(null);
    const [solutionPreview, setSolutionPreview] = useState<string | null>(null);
    const [description2Preview, setDescription2Preview] = useState<string | null>(null);
    const [descriptionPreview, setDescriptionPreview] = useState<string | null>(null);
    const [majorScreensPreviews, setMajorScreensPreviews] = useState<string[]>([]);

    useEffect(() => {
        const requestOptions: any = {
            method: 'GET',
            redirect: 'follow',
        };

        // fetch(`https://desinoir.com/backend/api/our-work/getWorkById/${id}`, requestOptions)
        fetch( `${API_ENDPOINT.OUR_WORK_BY_ID}${id}`, requestOptions)
            .then((response) => response.json())
            .then((result) => {
                return setData(result.data);
            })
            .catch((error) => console.error(error));
    }, []);

    ////////////////////////////
    // States for holding file objects and preview URLs
    // const [primaryImage, setPrimaryImage] = useState<string | null>(null);
    // const [Primaryicon, setPrimaryicon] = useState<File | null>(null);

    // const [problemImage, setProblemImage] = useState<string | null>(null);
    // const [Problemicon, setProblemicon] = useState<File | null>(null);

    // const [challengeImage, setChallengeImage] = useState<string | null>(null);
    // const [ChallengeIcon, setChallengeIcon] = useState<File | null>(null);

    // const [motionGraphicsImage, setMotionGraphicsImage] = useState<string | null>(null);
    // const [MotionIcon, setMotionIcon] = useState<File | null>(null);

    // const [description2Image, setDescription2Image] = useState<File | string | null>(null);

    // const [majorScreensImages, setMajorScreensImages] = useState<File[]>([]);
    // const [majorScreensImagesPreviews, setMajorScreensImagesPreviews] = useState<string[]>([]);

    //////////////////////////////////////////////////////////

    // /////////////////////////////

    const [fileName, setFileName] = useState<string | null>(null);
    ////////////////////////////

    const navigate = useRouter();
    const formik = useFormik({
        initialValues: {
            _id: id,
            title: data?.title?.en || '',
            arTitle: data?.title?.ar || '',
            subtitle: data?.subtitle?.en || '',
            arSubtitle: data?.subtitle?.ar || '',
            types: data?.types || '',
            description: data?.description?.en || '',
            arDescription: data?.description?.ar || '',
            ProblemStatementTitle: data?.ProblemStatementTitle?.en || '',
            arProblemStatementTitle: data?.ProblemStatementTitle?.ar || '',
            ProblemStatementDescription: data?.ProblemStatementDescription?.en || '',
            arProblemStatementDescription: data?.ProblemStatementDescription?.ar || '',
            challengesTitle: data?.challengesTitle?.en || '',
            arChallengesTitle: data?.challengesTitle?.ar || '',
            challengesDescription: data?.challengesDescription?.en || '',
            arChallengesDescription: data?.challengesDescription?.ar || '',
            SolutionTitle: data?.SolutionTitle?.en || '',
            arSolutionTitle: data?.SolutionTitle?.ar || '',
            SolutionDescription: data?.SolutionDescription?.en || '',
            arSolutionDescription: data?.SolutionDescription?.ar || '',
            description2: data?.description2?.en || '',
            arDescription2: data?.description2?.ar || '',

            primaryImage: data?.primaryImage || '',
            descriptionImage: data?.descriptionImage || '',
            ProblemStatementImage: data?.ProblemStatementImage || '',
            challengeImage: data?.challengeImage || '',
            SolutionImage: data?.SolutionImage || '',
            description2Image: data?.description2Image || '',
            MajorScreensImages: data?.MajorScreensImages || [],
        },
        enableReinitialize: true,
        onSubmit: async (values) => {
            const formData = new FormData();
            formData.append('subtitle', values.subtitle);
            formData.append('arSubtitle', values.arSubtitle);
            formData.append('title', values.title);
            formData.append('arTitle', values.arTitle);
            formData.append('types', values.types);
            formData.append('description', engDescrip);
            formData.append('arDescription', arDescrip);
            formData.append('ProblemStatementTitle', values.ProblemStatementTitle);
            formData.append('arProblemStatementTitle', values.arProblemStatementTitle);
            formData.append('ProblemStatementDescription', engProblemDescrip);
            formData.append('arProblemStatementDescription', arProblemDescrip);
            formData.append('challengesTitle', values.challengesTitle);
            formData.append('arChallengesTitle', values.arChallengesTitle);
            formData.append('challengesDescription', engchallengesDescrip);
            formData.append('arChallengesDescription', arChallengesDescrip);
            formData.append('SolutionTitle', values.SolutionTitle);
            formData.append('arSolutionTitle', values.arSolutionTitle);
            formData.append('SolutionDescription', engSolutionDescrip);
            formData.append('arSolutionDescription', arSolutionDescrip);
            formData.append('description2', engdescription2);
            formData.append('arDescription2', ardescription2);
            // Append Primary Image
            if (values.primaryImage) {
                formData.append('primaryImage', values.primaryImage);
            }

            // Append Problem Image
            if (values.ProblemStatementImage) {
                formData.append('ProblemStatementImage', values.ProblemStatementImage);
            }

            // Append Challenge Image
            if (values.challengeImage) {
                formData.append('challengeImage', values.challengeImage);
            }

            // Append Motion Graphics Image
            if (values.SolutionImage) {
                formData.append('SolutionImage', values.SolutionImage);
            }

            if (values.description2Image) formData.append('description2Image', values.description2Image);
            if (values.descriptionImage) formData.append('descriptionImage', values.descriptionImage);
            // Append Major Screens Images (handle multiple images)
            if (values.MajorScreensImages && values.MajorScreensImages.length > 0) {
                values.MajorScreensImages.forEach((imageFile: any) => {
                    formData.append(`MajorScreensImages`, imageFile);
                });
            }

            try {
                if (id) {
                    const result = await updateWorkData(id, formData);
                    console.log(result);
                    setEngDescrip(result?.description?.en || '');
                    setArDescrip(result?.description?.ar || '');

                    setEngProblemDescrip(result?.ProblemStatementDescription?.en || '');
                    setArProblemDescrip(result?.ProblemStatementDescription?.ar || '');

                    setEngchallengesDescrip(result?.challengesDescription?.en || '');
                    setArChallengesDescrip(result?.challengesDescription?.ar || '');

                    setEngSolutionDescrip(result?.SolutionDescription?.en || '');
                    setArSolutionDescrip(result?.SolutionDescription?.ar || '');

                    setEngdescription2(result?.description2?.en || '');
                    setArdescription2(result?.description2?.ar || '');

                    if (result.success === true) {
                        toast.success(result.message);
                        navigate.push('/apps/our-work');
                    } else {
                        toast.error(result.message);
                    }
                }
            } catch (error: any) {
                toast.error(error.message);
                console.error('Failed to update work data:', error);
            }
        },
    });

    useEffect(() => {
        setEngDescrip(data?.description?.en || '');
        setArDescrip(data?.description?.ar || '');

        setEngProblemDescrip(data?.ProblemStatementDescription?.en || '');
        setArProblemDescrip(data?.ProblemStatementDescription?.ar || '');

        setEngchallengesDescrip(data?.challengesDescription?.en || '');
        setArChallengesDescrip(data?.challengesDescription?.ar || '');

        setEngSolutionDescrip(data?.SolutionDescription?.en || '');
        setArSolutionDescrip(data?.SolutionDescription?.ar || '');

        setEngdescription2(data?.description2?.en || '');
        setArdescription2(data?.description2?.ar || '');

        // Set image previews
        if (data?.primaryImage) {
            setImagePreview(data?.primaryImage);
        }
        if (data?.ProblemStatementImage) {
            setProblemPreview(data?.ProblemStatementImage);
        }
        if (data?.challengeImage) {
            setChallengePreview(data?.challengeImage);
        }
        if (data?.SolutionImage) {
            setSolutionPreview(data?.SolutionImage);
        }
        if (data?.MajorScreensImages && data?.MajorScreensImages.length > 0) {
            setMajorScreensPreviews(data?.MajorScreensImages);
        }
        if (data?.description2Image) {
            setDescription2Preview(data?.description2Image);
        }

        if (data?.descriptionImage) {
            setDescriptionPreview(data?.descriptionImage);
        }
    }, [data]);

    // Primary Image Handler
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
                formik.setFieldValue('primaryImage', file); // Store file in Formik
            };
            reader.readAsDataURL(file);
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
                formik.setFieldValue('ProblemStatementImage', file); // Store file in Formik
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
                formik.setFieldValue('SolutionImage', file); // Store file in Formik
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
    
            // Set previews and the actual files in Formik
            Promise.all(filePreviews).then((previews) => {
                setMajorScreensPreviews(previews); // Local state for previews
                formik.setFieldValue('MajorScreensImages', filesArray); // Store files in Formik
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
        <form onSubmit={formik.handleSubmit}>
            <h2 className="mb-1 flex items-center px-2 py-3 font-extrabold uppercase">
                <span>Edit Work</span>
            </h2>
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
                    </div>
                    <div>
                        <label>Types</label>
                        <select name="types" className="form-select" value={formik.values.types} onChange={formik.handleChange} onBlur={formik.handleBlur}>
                            <option value=""></option>
                            <option value="uiux">UI/UX</option>
                            <option value="branding">Branding</option>
                            <option value="graphicdesign">Graphic Design</option>
                            <option value="motiongraphic">Motion Graphic</option>
                        </select>
                    </div>
                </div>
                {/* Primary Image */}
                <div className="my-2">
                    <label>Primary Image</label>
                    {imagePreview && (
                        <div className="my-2">
                            <img src={imagePreview} alt="Preview" className="h-20 w-20 rounded-lg object-cover" />
                        </div>
                    )}
                    <label htmlFor="primaryImage" className="btn btn-primary w-fit" style={{ cursor: 'pointer' }}>
                        Choose Image
                        <input type="file" id="primaryImage" name="primaryImage" accept="image/*" onChange={handlePrimaryImageChange} className="form-input" style={{ display: 'none' }} />
                    </label>
                </div>

                <div className="max-md:gap-2 max-sm:grid-cols-1 mb-2 grid grid-cols-2 gap-4 gap-y-0">
                    <div className="mt-4">
                        <h5 className="my-3 text-lg font-semibold dark:text-white-light">Description English</h5>
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
                    </div>

                    <div className="mt-4">
                        <h5 className="my-3 text-lg font-semibold dark:text-white-light">Description Arabic</h5>
                        <div className="relative rounded bg-gray-50 dark:bg-[#0E1726]">
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
                </div>

                <div className="my-2">
                    <label>Description Image</label>
                    {descriptionPreview && (
                        <div className="my-2">
                            <img src={descriptionPreview} alt="Preview" className="h-20 w-20 rounded-lg object-cover" />
                        </div>
                    )}
                    <label htmlFor="description" className="btn btn-primary w-fit" style={{ cursor: 'pointer' }}>
                        Choose Image
                        <input type="file" id="description" accept="image/*" name="description" onChange={handleDescriptionImageChange} className="form-input" style={{ display: 'none' }} />
                    </label>
                </div>
                {/* Problem Statement Title and Description */}
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
                    </div>

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
                    </div>
                </div>

                <label>Problem Statement Image</label>
                {problemPreview && (
                    <div className="my-2">
                        <img src={problemPreview} alt="Problem Statement Image" className="h-20 w-20 rounded-lg object-cover" />
                    </div>
                )}
                <label htmlFor="problemImage" className="btn btn-primary w-fit" style={{ cursor: 'pointer' }}>
                    Choose Image
                    <input type="file" name="problemImage" id="problemImage" accept="image/*" onChange={handleProblemImageChange} className="form-input" style={{ display: 'none' }} />
                </label>

                {/* Challenge Title and Description */}
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
                    </div>
                </div>

                {/* Challenge Image */}
                <label>Challenge Image</label>
                {challengePreview && (
                    <div className="my-2">
                        <img src={challengePreview} alt="Challenge Image" className="h-20 w-20 rounded-lg object-cover" />
                    </div>
                )}
                <label htmlFor="challengeImage" className="btn btn-primary w-fit" style={{ cursor: 'pointer' }}>
                    Choose Image
                    <input type="file" name="challengeImage" id="challengeImage" accept="image/*" onChange={handleChallengeImageChange} className="form-input" style={{ display: 'none' }} />
                </label>

                {/* solution Title and Description */}
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
                    </div>
                </div>

                <label>Solution Image</label>
                {solutionPreview && (
                    <div className="my-2">
                        <img src={solutionPreview} alt="Solution Image" className="h-20 w-20 rounded-lg object-cover" />
                    </div>
                )}
                <label htmlFor="SolutionImage" className="btn btn-primary w-fit" style={{ cursor: 'pointer' }}>
                    Choose Image
                    <input type="file" name="SolutionImage" id="SolutionImage" accept="image/*" onChange={handleSolutionImageChange} className="form-input" style={{ display: 'none' }} />
                </label>

                {/* Description 2 Image and description */}

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
                    </div>
                </div>

                <label>Description 2 Image</label>
                {description2Preview && (
                    <div className="my-2">
                        <img src={description2Preview} alt="Description 2 Image" className="h-20 w-20 rounded-lg object-cover" />
                    </div>
                )}
                <label htmlFor="description2Image" className="btn btn-primary w-fit" style={{ cursor: 'pointer' }}>
                    Choose Image
                    <input type="file" name="description2Image" id="description2Image" accept="image/*" onChange={handleDescription2Image} className="form-input" style={{ display: 'none' }} />
                </label>

                {/* Major Screens Images */}
                <label>Major Screens Images</label>
                {majorScreensPreviews.length > 0 && (
                    <div className="my-2 flex flex-wrap gap-2">
                        {majorScreensPreviews.map((preview, index) => (
                            <img key={index} src={preview} alt={`Major Screens Image ${index}`} className="h-20 w-20 rounded-lg object-cover" />
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

                <div className="mt-4">
                    <button type="submit" className="rounded bg-blue-500 px-4 py-2 text-white">
                        Submit
                    </button>
                </div>
            </div>
        </form>
    );
};

export default EditWorkForm;
