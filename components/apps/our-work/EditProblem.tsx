'use client';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useDispatch } from 'react-redux';
// import { useSelector } from 'react-redux';
// import { IRootState } from "@/store/index"
import { fetchAllOurWork, updateOurWorkProblem, updateWorkData } from '@/components/utils/Helper';
import { useRouter, useSearchParams } from 'next/navigation';
import API_ENDPOINT from '@/components/apiRoutes/ApiRoutes';
import Image from 'next/image';

const EditProblemForm = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    console.log('ID==>', id);
    const [data, setData] = useState<any>();
    const [engProblemDescrip, setEngProblemDescrip] = useState<string>('');
    const [arProblemDescrip, setArProblemDescrip] = useState<string>('');

    const [problemPreview, setProblemPreview] = useState<string | null>(null);

    useEffect(() => {
        const requestOptions: any = {
            method: 'GET',
            redirect: 'follow',
        };

        // fetch(`https://desinoir.com/backend/api/our-work/getWorkById/${id}`, requestOptions)
        fetch(`${API_ENDPOINT.OUR_WORK_BY_ID}${id}`, requestOptions)
            .then((response) => response.json())
            .then((result) => {
                return setData(result.data);
            })
            .catch((error) => console.error(error));
    }, []);

    const [fileName, setFileName] = useState<string | null>(null);
    ////////////////////////////

    const navigate = useRouter();
    const formik = useFormik({
        initialValues: {
            _id: id,
            ProblemStatementTitle: data?.ProblemStatementTitle?.en || '',
            arProblemStatementTitle: data?.ProblemStatementTitle?.ar || '',
            ProblemStatementDescription: data?.ProblemStatementDescription?.en || '',
            arProblemStatementDescription: data?.ProblemStatementDescription?.ar || '',
            ProblemStatementImage: data?.ProblemStatementImage || '',
        },
        enableReinitialize: true,
        onSubmit: async (values) => {
            const formData = new FormData();
            formData.append('ProblemStatementTitle', values.ProblemStatementTitle);
            formData.append('arProblemStatementTitle', values.arProblemStatementTitle);
            formData.append('ProblemStatementDescription', values.ProblemStatementDescription);
            formData.append('arProblemStatementDescription', values.arProblemStatementDescription);
            if (values.ProblemStatementImage) {
                formData.append('ProblemStatementImage', values.ProblemStatementImage);
            }
            try {
                if (id) {
                    console.log('Problem Data=>', formData);
                    const result = await updateOurWorkProblem(id, formData);
                    console.log(result);
                    setEngProblemDescrip(result?.ProblemStatementDescription?.en || '');
                    setArProblemDescrip(result?.ProblemStatementDescription?.ar || '');

                    if (result.success === true) {
                        toast.success(result.message);
                        // navigate.push('/apps/problem');
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
        setEngProblemDescrip(data?.ProblemStatementDescription?.en || '');
        setArProblemDescrip(data?.ProblemStatementDescription?.ar || '');

        if (data?.ProblemStatementImage) {
            setProblemPreview(data?.ProblemStatementImage);
        }
    }, [data]);

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
                <span>Edit Problem</span>
            </h2>
            <div className="panel border-white-light px-3 dark:border-[#1b2e4b]">
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
                                modules={modules}
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
                                modules={modules}
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
                        <Image width={1000} height={1000} src={problemPreview} alt="Problem Statement Image" className="h-20 w-20 rounded-lg object-cover" />
                    </div>
                )}
                <label htmlFor="problemImage" className="btn btn-primary w-fit" style={{ cursor: 'pointer' }}>
                    Choose Image
                    <input type="file" name="problemImage" id="problemImage" accept="image/*" onChange={handleProblemImageChange} className="form-input" style={{ display: 'none' }} />
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

export default EditProblemForm;
