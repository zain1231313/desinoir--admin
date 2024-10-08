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

// Define the FormValues interface

// Define component
const AddWorks = () => {
    ////////////////////////////
    // States for holding file objects and preview URLs
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [problemPreview, setProblemPreview] = useState<string | null>(null);
    const [challengePreview, setChallengePreview] = useState<string | null>(null);
    const [solutionPreview, setSolutionPreview] = useState<string | null>(null);
    const [description2Preview, setDescription2Preview] = useState<string | null>(null);
    const [descriptionPreview, setDescriptionPreview] = useState<string | null>(null);
    const [majorScreensPreviews, setMajorScreensPreviews] = useState<string[]>([]);

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
            setLoading(true)
            try {
                console.log(values);
                const result = await addOurWork(values);
                console.log('resut090909???', result);
                if (result.success == true) {
                    toast.success(result.message);
                    navigate.push('/apps/our-work');
                    setLoading(false)
                } else {
                    setLoading(false)
                    toast.error(result.message);
                }
            } catch (error: any) {
                setLoading(false)
                toast.error(error.message);
                console.error('Failed to update work data:', error);
            }
        },
    });

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
                                    <select name="types" className="form-select" value={formik.values.types} onChange={formik.handleChange} onBlur={formik.handleBlur}>
                                        <option value="">Select Options</option>
                                        <option value="uiux">Ui/Ux</option>
                                        <option value="branding">Branding</option>
                                        <option value="graphicdesign">Graphic Designing</option>
                                        <option value="motionDesign">Motion Grraphic Design</option>
                                    </select>
                                    {formik.touched.types && formik.errors.types ? <p className="text-xs text-red-800">{formik.errors.types}</p> : null}
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
                                    <img src={descriptionPreview} alt="Preview" className="h-20 w-20 rounded-lg object-cover" />
                                </div>
                            )}
                            <label htmlFor="description" className="btn btn-primary w-fit" style={{ cursor: 'pointer' }}>
                                Choose Image
                                <input type="file" name="description" id="description" accept="image/*" onChange={handleDescriptionImageChange} className="form-input" style={{ display: 'none' }} />
                            </label>
                        </div>
                        {formik.touched.description && formik.errors.description ? <p className="text-xs text-red-800">{formik.errors.description}</p> : null}
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
                        {formik.touched.problemImage && formik.errors.problemImage ? <p className="text-xs text-red-800">{formik.errors.problemImage}</p> : null}

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
                                {formik.touched.arChallengesDescription && formik.errors.arChallengesDescription ? (
                                    <p className="text-xs text-red-800">{formik.errors.arChallengesDescription}</p>
                                ) : null}
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

                        {formik.touched.challengeImage && formik.errors.challengeImage ? <p className="text-xs text-red-800">{formik.errors.challengeImage}</p> : null}

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
                                <img src={solutionPreview} alt="solution  Image" className="h-20 w-20 rounded-lg object-cover" />
                            </div>
                        )}
                        <label htmlFor="solutionImage" className="btn btn-primary w-fit" style={{ cursor: 'pointer' }}>
                            Choose Image
                            <input type="file" name="solutionImage" id="solutionImage" accept="image/*" onChange={handleSolutionImageChange} className="form-input" style={{ display: 'none' }} />
                        </label>
                        {formik.touched.solutionImage && formik.errors.solutionImage ? <p className="text-xs text-red-800">{formik.errors.solutionImage}</p> : null}

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
                                <img src={description2Preview} alt="Description 2 Image" className="h-20 w-20 rounded-lg object-cover" />
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
                        {formik.touched.majorScreensImages && formik.errors.majorScreensImages ? <p className="text-xs text-red-800">{formik.errors.majorScreensImages}</p> : null}

                        <div className="mt-4">
                            <button type="submit" className="rounded bg-blue-500 px-4 py-2 text-white">
                                Submit
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </>
    );
};

export default AddWorks;
