'use client';
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useFormik } from 'formik';
import { IRootState } from '@/store/index'; // Adjust this based on your store structure
import toast from "react-hot-toast";
import { updateArticle } from "@/components/utils/Helper";
import { useRouter } from "next/navigation";
// import { useRouter } from "next/router";
import Loading from "@/components/layouts/loading";
import API_ENDPOINT from "@/components/apiRoutes/ApiRoutes";

type ComponentType = 'quill' | 'uploader';

interface ComponentItem {
    id: number;
    type: ComponentType;
}

const EditArticle = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get('id');

    const [open, setOpen] = useState<boolean>(false);
    const [dropdown, setDropdown] = useState<boolean>(false);
    const [components, setComponents] = useState<ComponentItem[]>([]);

    const [descriptionEn, setDescriptionEn] = useState<string>('');
    const [descriptionAr, setDescriptionAr] = useState<string>('');
    const [conclusionEn, setConclusionEn] = useState<string>('');
    const [conclusionAr, setConclusionAr] = useState<string>('');
    const [primaryImage, setPrimaryImage] = useState<File | null>(null);
    const [primaryImagePreview, setPrimaryImagePreview] = useState<string | null>(null);
    const [secondaryImage, setSecondaryImage] = useState<File | null>(null);
    const [secondaryImagePreview, setSecondaryImagePreview] = useState<string | null>(null);
    const [adminNameEn, setAdminNameEn] = useState<string>('');
    const [adminNameAr, setAdminNameAr] = useState<string>('');
    const [adminFeedbackEn, setAdminFeedbackEn] = useState<string>('');
    const [adminFeedbackAr, setAdminFeedbackAr] = useState<string>('');
    const [adminImage, setAdminImage] = useState<File | null>(null);
    const [adminImagePreview, setAdminImagePreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false)
    const [articles, setArticles] = useState<any>()
    const [data, setData] = useState<any>()

    const articleData = useSelector((state: IRootState) => state.articles.selectedArticle);


    console.log(id); // Use id as needed

    const formik = useFormik({
        initialValues: {
            titleEnglish: data?.title.en,
            titleArabic: data?.title.ar,
            type: data?.types,
            title: data?.title.en,
            arTitle: data?.title.ar,
            name: data?.name.en,
            arName: data?.name.ar
        },
        enableReinitialize: true,
        onSubmit: async (values) => {
            const formData = new FormData();
            formData.append('mainTitle', values?.titleEnglish || "");
            formData.append('arMainTitle', values?.titleArabic || "");
            formData.append('title', values?.type || "");
            formData.append('arTitle', values?.arTitle || "");
            formData.append('name', values?.name || "");
            formData.append('arName', values?.arName || "");
            formData.append('content', descriptionEn);
            formData.append('arContent', descriptionAr);
            formData.append('conclusion', conclusionEn);
            formData.append('arConclusion', conclusionAr);
            formData.append('adminName', adminNameEn);
            formData.append('arAdminName', adminNameAr);
            formData.append('feedback', adminFeedbackEn);
            formData.append('arFeedback', adminFeedbackAr);

            if (primaryImage) formData.append('primaryImage', primaryImage);
            if (secondaryImage) formData.append('secondaryImage', secondaryImage);
            if (adminImage) formData.append('adminImage', adminImage);
            try {
                setLoading(true)

                if (id) {
                    const result = await updateArticle(id, formData);
                    toast.success(result.message || 'Article updated successfully');
                    router.push('/apps/articles')
                    setLoading(false)
                }
            } catch (error: any) {
                setLoading(false)
                toast.error(error.message || "An error occurred");
            }
        },
    });

    console.log(data);

    useEffect(() => {
        const requestOptions: any = {
            method: "GET",
            redirect: "follow"
        };

        fetch(`${API_ENDPOINT.ARTICLE_BY_ID}${id}`, requestOptions)
        // fetch(`https://desinoir.com/backend/api/articles/get-article-id/${id}`, requestOptions)
            .then((response) => response.json())
            .then(
                (result) => {
                    return setData(result.data)
                }
            )
            .catch((error) => console.error(error));
    }, []);

    useEffect(() => {
        if (data) {
            setDescriptionEn(data.content.en);
            setDescriptionAr(data.content.ar);
            setConclusionEn(data.conclusion.en);
            setConclusionAr(data.conclusion.ar);

            setAdminNameEn(data.adminFeedback.name.en);
            setAdminNameAr(data.adminFeedback.name.ar);
            setAdminFeedbackEn(data.adminFeedback.feedback.en);
            setAdminFeedbackAr(data.adminFeedback.feedback.ar);

            if (data.primaryImage) {
                setPrimaryImagePreview(data.primaryImage);
            }
            if (data.secondaryImage) {
                setSecondaryImagePreview(data.secondaryImage);
            }
            if (data.adminFeedback.adminImage) {
                setAdminImagePreview(data.adminFeedback.adminImage);
            }
        }
    }, [data]);

    const handlePrimaryImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setPrimaryImage(file);
            const reader = new FileReader();
            reader.onload = () => setPrimaryImagePreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleSecondaryImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSecondaryImage(file);
            const reader = new FileReader();
            reader.onload = () => setSecondaryImagePreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleAdminImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setAdminImage(file);
            const reader = new FileReader();
            reader.onload = () => setAdminImagePreview(reader.result as string);
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
        <>


            {loading === true ? <Loading /> :
                <div>
                    <h2 className="font-medium text-[20px] py-2">
                        Edit Articles
                    </h2>
                    <form onSubmit={formik.handleSubmit}>

                        <div className="panel border-white-light px-3 dark:border-[#1b2e4b]">
                            <h5 className="text-lg font-semibold dark:text-white-light">Primary Image Section</h5>
                            {primaryImagePreview && (
                                <img src={primaryImagePreview} alt="Primary Preview" className='w-40 h-40 object-cover' />
                            )}
                            <div className="my-2">
                                <label htmlFor="primary-file-input" className="rounded-l-md btn btn-primary w-fit cursor-pointer">
                                    Upload primary image
                                    <input
                                        type="file"
                                        id="primary-file-input"
                                        placeholder="Choose a File"
                                        accept="image/*"
                                        onChange={handlePrimaryImageChange}
                                        style={{ display: 'none' }}
                                    />
                                </label>
                            </div>

                            <h5 className="text-lg font-semibold dark:text-white-light">Secondary Image Section</h5>
                            {secondaryImagePreview && (
                                <img src={secondaryImagePreview} alt="Secondary Preview" className='w-40 h-40 object-cover' />
                            )}
                            <div className="my-2">
                                <label htmlFor="secondary-file-input" className="rounded-l-md btn btn-primary w-fit cursor-pointer">
                                    Upload secondary image
                                    <input
                                        type="file"
                                        id="secondary-file-input"
                                        placeholder="Choose a File"
                                        accept="image/*"
                                        onChange={handleSecondaryImageChange}
                                        style={{ display: 'none' }}
                                    />
                                </label>
                            </div>

                            <h2 className="mb-1 flex items-center px-2 py-3 font-semibold text-[#0e1726] dark:text-[#888EA8]">
                                <span>Main Title English</span>
                            </h2>
                            <input
                                type="text"
                                className="px-3 py-3 w-full border-[1px] border-solid border-white-light dark:border-[#17263c] rounded-lg dark:bg-[#222B45]"
                                {...formik.getFieldProps('titleEnglish')}
                            />

                            <h2 className="mb-1 flex items-center px-2 py-3 font-semibold text-[#0e1726] dark:text-[#888EA8]">
                                <span>Main Title Arabic</span>
                            </h2>
                            <input
                                type="text"
                                className="px-3 py-3 w-full border-[1px] border-solid border-white-light dark:border-[#17263c] rounded-lg dark:bg-[#222B45]"
                                {...formik.getFieldProps('titleArabic')}
                            />

                            <h2 className="mb-1 flex items-center px-2 py-3 font-semibold text-[#0e1726] dark:text-[#888EA8]">
                                <span>Article Type</span>
                            </h2>
                            <select
                                className="form-select"
                                {...formik.getFieldProps('type')}
                            >
                                <option value="">Select Options</option>
                                <option value="uiux">Ui/Ux</option>
                                <option value="branding">Branding</option>
                                <option value="graphicdesign">Graphic Designing</option>
                                <option value="motionDesign">Motion Grraphic Design</option>
                            </select>

                            <h2 className="mb-1 flex items-center px-2 py-3 font-semibold text-[#0e1726] dark:text-[#888EA8]">
                                <span>Arabic Title</span>
                            </h2>
                            <input
                                type="text"
                                className="px-3 py-3 w-full border-[1px] border-solid border-white-light dark:border-[#17263c] rounded-lg dark:bg-[#222B45]"
                                {...formik.getFieldProps('arTitle')}
                            />

                            <h2 className="mb-1 flex items-center px-2 py-3 font-semibold text-[#0e1726] dark:text-[#888EA8]">
                                <span>Name</span>
                            </h2>
                            <input
                                type="text"
                                className="px-3 py-3 w-full border-[1px] border-solid border-white-light dark:border-[#17263c] rounded-lg dark:bg-[#222B45]"
                                {...formik.getFieldProps('name')}
                            />

                            <h2 className="mb-1 flex items-center px-2 py-3 font-semibold text-[#0e1726] dark:text-[#888EA8]">
                                <span>Arabic Name</span>
                            </h2>
                            <input
                                type="text"
                                className="px-3 py-3 w-full border-[1px] border-solid border-white-light dark:border-[#17263c] rounded-lg dark:bg-[#222B45]"
                                {...formik.getFieldProps('arName')}
                            />

                            <h2 className="mb-1 flex items-center px-2 py-3 font-semibold text-[#0e1726] dark:text-[#888EA8]">
                                <span>Description English</span>
                            </h2>
                            <ReactQuill
                                value={descriptionEn}
                                onChange={setDescriptionEn}
                                modules={modules}
                                theme="snow"
                            />

                            <h2 className="mb-1 flex items-center px-2 py-3 font-semibold text-[#0e1726] dark:text-[#888EA8]">
                                <span>Description Arabic</span>
                            </h2>
                            <ReactQuill
                                value={descriptionAr}
                                onChange={setDescriptionAr}
                                modules={modules}
                                theme="snow"
                            />

                            <h2 className="mb-1 flex items-center px-2 py-3 font-semibold text-[#0e1726] dark:text-[#888EA8]">
                                <span>Conclusion English</span>
                            </h2>
                            <ReactQuill
                                value={conclusionEn}
                                onChange={setConclusionEn}
                                modules={modules}
                                theme="snow"
                            />

                            <h2 className="mb-1 flex items-center px-2 py-3 font-semibold text-[#0e1726] dark:text-[#888EA8]">
                                <span>Conclusion Arabic</span>
                            </h2>
                            <ReactQuill
                                value={conclusionAr}
                                onChange={setConclusionAr}
                                modules={modules}
                                theme="snow"
                            />

                            <h2 className="mb-1 flex items-center px-2 py-3 font-semibold text-[#0e1726] dark:text-[#888EA8]">
                                <span>Admin Name English</span>
                            </h2>
                            <input
                                type="text"
                                className="px-3 py-3 w-full border-[1px] border-solid border-white-light dark:border-[#17263c] rounded-lg dark:bg-[#222B45]"
                                value={adminNameEn}
                                onChange={(e) => setAdminNameEn(e.target.value)}
                            />

                            <h2 className="mb-1 flex items-center px-2 py-3 font-semibold text-[#0e1726] dark:text-[#888EA8]">
                                <span>Admin Name Arabic</span>
                            </h2>
                            <input
                                type="text"
                                className="px-3 py-3 w-full border-[1px] border-solid border-white-light dark:border-[#17263c] rounded-lg dark:bg-[#222B45]"
                                value={adminNameAr}
                                onChange={(e) => setAdminNameAr(e.target.value)}
                            />

                            <h2 className="mb-1 flex items-center px-2 py-3 font-semibold text-[#0e1726] dark:text-[#888EA8]">
                                <span>Admin Feedback English</span>
                            </h2>
                            <ReactQuill
                                value={adminFeedbackEn}
                                onChange={setAdminFeedbackEn}
                                modules={modules}
                                theme="snow"
                            />

                            <h2 className="mb-1 flex items-center px-2 py-3 font-semibold text-[#0e1726] dark:text-[#888EA8]">
                                <span>Admin Feedback Arabic</span>
                            </h2>
                            <ReactQuill
                                value={adminFeedbackAr}
                                onChange={setAdminFeedbackAr}
                                modules={modules}
                                theme="snow"
                            />

                            {adminImagePreview && (
                                <img src={adminImagePreview} alt="Admin Preview" className='w-40 h-40 object-cover my-2' />
                            )}
                            <div className="my-2">
                                <label htmlFor="admin-file-input" className="rounded-l-md btn btn-primary w-fit cursor-pointer">
                                    Upload admin image
                                    <input
                                        type="file"
                                        id="admin-file-input"
                                        placeholder="Choose a File"
                                        accept="image/*"
                                        onChange={handleAdminImageChange}
                                        style={{ display: 'none' }}
                                    />
                                </label>
                            </div>

                            <div className="flex items-center justify-between px-2 py-3">
                                <button
                                    type="submit"
                                    className="btn btn-primary w-fit"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            }
        </>
    );
};

export default EditArticle;
