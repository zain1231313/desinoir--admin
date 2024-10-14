'use client';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { fetchAllOurWork, updateOurWorkChallenges, updateWorkData } from '@/components/utils/Helper';
import { useRouter, useSearchParams } from 'next/navigation';
import API_ENDPOINT from '@/components/apiRoutes/ApiRoutes';
import Image from 'next/image';

const EditChallenges = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    console.log('ID==>', id);
    const [data, setData] = useState<any>();
    const [engchallengesDescrip, setEngchallengesDescrip] = useState<string>('');
    const [arChallengesDescrip, setArChallengesDescrip] = useState<string>('');
    const [challengePreview, setChallengePreview] = useState<string | null>(null);

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
            challengesTitle: data?.challengesTitle?.en || '',
            arChallengesTitle: data?.challengesTitle?.ar || '',
            challengesDescription: data?.challengesDescription?.en || '',
            arChallengesDescription: data?.challengesDescription?.ar || '',
            challengeImage: data?.challengeImage || '',
        },
        enableReinitialize: true,
        onSubmit: async (values) => {
            const formData = new FormData();
            formData.append('challengesTitle', values.challengesTitle);
            formData.append('arChallengesTitle', values.arChallengesTitle);
            formData.append('challengesDescription', values.challengesDescription);
            formData.append('arChallengesDescription', values.arChallengesDescription);
            if (values.challengeImage) {
                formData.append('challengeImage', values.challengeImage);
            }

            // Append Motion Graphics Image

            try {
                if (id) {
                    const result = await updateOurWorkChallenges(id, formData);
                    console.log(result);
                    setEngchallengesDescrip(result?.challengesDescription?.en || '');
                    setArChallengesDescrip(result?.challengesDescription?.ar || '');
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
        setEngchallengesDescrip(data?.challengesDescription?.en || '');
        setArChallengesDescrip(data?.challengesDescription?.ar || '');

        if (data?.challengeImage) {
            setChallengePreview(data?.challengeImage);
        }
    }, [data]);

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
                <span>Edit Challenge</span>
            </h2>
            <div className="panel border-white-light px-3 dark:border-[#1b2e4b]">
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
                                modules={modules}
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
                                modules={modules}
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
                        <Image width={50} height={50} src={challengePreview} alt="Challenge Image" className="h-20 w-20 rounded-lg object-cover" />
                    </div>
                )}
                <label htmlFor="challengeImage" className="btn btn-primary w-fit" style={{ cursor: 'pointer' }}>
                    Choose Image
                    <input type="file" name="challengeImage" id="challengeImage" accept="image/*" onChange={handleChallengeImageChange} className="form-input" style={{ display: 'none' }} />
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

export default EditChallenges;
