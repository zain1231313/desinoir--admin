'use client';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useDispatch } from 'react-redux';
// import { useSelector } from 'react-redux';
// import { IRootState } from "@/store/index"
import { fetchAllOurWork, updateWorkData, updateWorkMajorScreen } from '@/components/utils/Helper';
import { useRouter, useSearchParams } from 'next/navigation';
import API_ENDPOINT from '@/components/apiRoutes/ApiRoutes';
import Image from 'next/image';

const EditMajorScreen = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    console.log('ID==>', id);
    // const dispatch = useDispatch();
    // const workData = useSelector((state: IRootState) => state.selectedWork.selectedWork);

    // Initialize state with default empty string to avoid TypeScript errors
    const [data, setData] = useState<any>();
    const [engdescription2, setEngdescription2] = useState<string>('');
    const [ardescription2, setArdescription2] = useState<string>('');

    const [description2Preview, setDescription2Preview] = useState<string | null>(null);
    const [majorScreensPreviews, setMajorScreensPreviews] = useState<string[]>([]);

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
    ////////////////////////////

    const navigate = useRouter();
    const formik = useFormik({
        initialValues: {
            _id: id,
            description2: data?.description2?.en || '',
            arDescription2: data?.description2?.ar || '',
            description2Image: data?.description2Image || '',
            MajorScreensImages: data?.MajorScreensImages || [],
        },
        enableReinitialize: true,
        onSubmit: async (values) => {
            console.log('Values==>', values);

            const formData = new FormData();
            formData.append('description2', values.description2); // Use formik values
            formData.append('arDescription2', values.arDescription2); // Use formik values

            if (values.description2Image) {
                formData.append('description2Image', values.description2Image);
            }

            // Append Major Screens Images
            if (values.MajorScreensImages && values.MajorScreensImages.length > 0) {
                values.MajorScreensImages.forEach((imageFile: any) => {
                    formData.append('MajorScreensImages', imageFile);
                });
            }

            try {
                if (id) {
                    console.log('FormData=>', formData);
                    const result = await updateWorkMajorScreen(id, formData);
                    console.log(result);

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
        setEngdescription2(data?.description2?.en || '');
        setArdescription2(data?.description2?.ar || '');
        if (data?.MajorScreensImages && data?.MajorScreensImages.length > 0) {
            setMajorScreensPreviews(data?.MajorScreensImages);
        }
        if (data?.description2Image) {
            setDescription2Preview(data?.description2Image);
        }
    }, [data]);

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
                setMajorScreensPreviews(previews);
                formik.setFieldValue('MajorScreensImages', filesArray);
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
    const removeImage = (indexToRemove: number) => {
        // Update the local preview state
        setMajorScreensPreviews((prevPreviews) => prevPreviews.filter((_, index) => index !== indexToRemove));

        // Update the Formik state to remove the actual file
        formik.setFieldValue(
            'MajorScreensImages',
            formik.values.MajorScreensImages.filter((_: any, index: number) => index !== indexToRemove)
        );
    };

    return (
        <form onSubmit={formik.handleSubmit}>
            <h2 className="mb-1 flex items-center px-2 py-3 font-extrabold uppercase">
                <span>Edit Work</span>
            </h2>
            <div className="panel border-white-light px-3 dark:border-[#1b2e4b]">
                {/* Description 2 Image and description */}

                <div className="max-md:gap-2 max-sm:grid-cols-1 mb-2 grid grid-cols-2 gap-4 gap-y-0">
                    <div className="mt-4">
                        <label>Description</label>
                        <div className="relative rounded bg-gray-50 dark:bg-[#0E1726]">
                            <ReactQuill
                                theme="snow"
                                modules={modules}
                                value={formik.values.description2}
                                onChange={(content) => {
                                    formik.setFieldValue('description2', content); // Update formik's field value
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
                                modules={modules}
                                value={formik.values.arDescription2}
                                onChange={(content) => {
                                    formik.setFieldValue('arDescription2', content); // Update formik's field value
                                }}
                                placeholder="Description Arabic"
                            />
                        </div>
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

                {/* Major Screens Images */}
                <label>Major Screens Images</label>
                {majorScreensPreviews.length > 0 && (
                    <div className="my-2 flex flex-wrap gap-2">
                        {majorScreensPreviews.map((preview, index) => (
                            <div key={index} className="relative inline-block">
                                <Image width={50} height={50} src={preview} alt={`Major Screens Image ${index}`} className="h-20 w-20 rounded-lg object-cover" />
                                {/* Cross button to remove the image */}
                                <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="absolute right-0 top-0 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-white"
                                    style={{ transform: 'translate(50%, -50%)' }}
                                >
                                    X
                                </button>
                            </div>
                        ))}
                    </div>
                )}
                {/* <label>Major Screens Images</label>
                {majorScreensPreviews.length > 0 && (
                    <div className="my-2 flex flex-wrap gap-2">
                        {majorScreensPreviews.map((preview, index) => (
                            <Image width={50} height={50} key={index} src={preview} alt={`Major Screens Image ${index}`} className="h-20 w-20 rounded-lg object-cover" />
                        ))}
                    </div>
                )} */}
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

export default EditMajorScreen;
