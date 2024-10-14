'use client';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { fetchAllOurWork, updateOurWorkChallenges, updateOurWorkSolution, updateWorkData } from '@/components/utils/Helper';
import { useRouter, useSearchParams } from 'next/navigation';
import API_ENDPOINT from '@/components/apiRoutes/ApiRoutes';
import Image from 'next/image';

const EditSolution = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    console.log('ID==>', id);
    const [data, setData] = useState<any>();
    const [engchallengesDescrip, setEngchallengesDescrip] = useState<string>('');
    const [arChallengesDescrip, setArChallengesDescrip] = useState<string>('');
    const [solutionPreview, setSolutionPreview] = useState<string | null>(null);

    useEffect(() => {
        const requestOptions: any = {
            method: 'GET',
            redirect: 'follow',
        };
        fetch(`${API_ENDPOINT.OUR_WORK_BY_ID}${id}`, requestOptions)
            .then((response) => response.json())
            .then((result) => {
                return setData(result.data);
            })
            .catch((error) => console.error(error));
    }, []);

    const [fileName, setFileName] = useState<string | null>(null);

    const navigate = useRouter();
    const formik = useFormik({
        initialValues: {
            _id: id,

            SolutionTitle: data?.SolutionTitle?.en || '',
            arSolutionTitle: data?.SolutionTitle?.ar || '',
            SolutionDescription: data?.SolutionDescription?.en || '',
            arSolutionDescription: data?.SolutionDescription?.ar || '',
            SolutionImage: data?.SolutionImage || '',
        },
        enableReinitialize: true,
        onSubmit: async (values) => {
            const formData = new FormData();
            formData.append('SolutionTitle', values.SolutionTitle);
            formData.append('arSolutionTitle', values.arSolutionTitle);
            formData.append('SolutionDescription', values.SolutionDescription);
            formData.append('arSolutionDescription', values.arSolutionDescription);

            // Append Primary Image

            // Append Challenge Image
            if (values.SolutionImage) {
                formData.append('SolutionImage', values.SolutionImage);
            }

            // Append Motion Graphics Image

            try {
                if (id) {
                    const result = await updateOurWorkSolution(id, formData);
                    console.log(result);
                    setEngchallengesDescrip(result?.SolutionDescription?.en || '');
                    setArChallengesDescrip(result?.SolutionDescription?.ar || '');
                    if (result.success === true) {
                        toast.success(result.message);
                        // navigate.push('/apps/our-work');
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
        setEngchallengesDescrip(data?.SolutionDescription?.en || '');
        setArChallengesDescrip(data?.SolutionDescription?.ar || '');
        if (data?.SolutionImage) {
            setSolutionPreview(data?.SolutionImage);
        }
    }, [data]);

    // Challenge Image Handler
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

    // Description2 Image Handler

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

    const modules = {
        toolbar: toolbarOptions,
    };
    return (
        <form onSubmit={formik.handleSubmit}>
            <h2 className="mb-1 flex items-center px-2 py-3 font-extrabold uppercase">
                <span>Edit Solution</span>
            </h2>
            <div className="panel border-white-light px-3 dark:border-[#1b2e4b]">
                {/* Challenge Title and Description */}
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
                                modules={modules}
                                value={formik.values.SolutionDescription}
                                onChange={(content) => formik.setFieldValue('SolutionDescription', content)}
                                placeholder="Description English"
                            />
                        </div>
                    </div>

                    <div className="mt-4">
                        <label>Arabic Solution Description</label>
                        <div className="relative rounded bg-gray-50 dark:bg-[#0E1726]">
                            <ReactQuill
                                theme="snow"
                                modules={modules}
                                value={formik.values.arSolutionDescription}
                                onChange={(content) => formik.setFieldValue('arSolutionDescription', content)}
                                placeholder="Description Arabic"
                            />
                        </div>
                    </div>
                </div>

                {/* Challenge Image */}
                <label>Solution Image</label>
                {solutionPreview && (
                    <div className="my-2">
                        <Image width={50} height={50} src={solutionPreview} alt="Challenge Image" className="h-20 w-20 rounded-lg object-cover" />
                    </div>
                )}
                <label htmlFor="SolutionImage" className="btn btn-primary w-fit" style={{ cursor: 'pointer' }}>
                    Choose Image
                    <input type="file" name="SolutionImage" id="SolutionImage" accept="image/*" onChange={handleSolutionImageChange} className="form-input" style={{ display: 'none' }} />
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

export default EditSolution;
