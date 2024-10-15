'use client';
import Loading from '@/components/layouts/loading';
// import { ArticleSchema } from '@/components/schema/schema';
import { addNewArticle } from '@/components/utils/Helper';
import { useFormik } from 'formik';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
const AddArticle = () => {
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
    const [relatedPosts, setRelatedPosts] = useState<string[]>([]);
    const [types, setTypes] = useState<string>('');
    const [loading, setLoading] = useState(false);

    const navigate = useRouter();

    const formik = useFormik({
        initialValues: {
            titleEnglish: '',
            titleArabic: '',
            type: '',
            arTitle: '',
            name: '',
            arName: '',
            types: '',
        },
        onSubmit: async (values) => {
            const formData = new FormData();

            formData.append('enMainTitle', values.titleEnglish);
            formData.append('arMainTitle', values.titleArabic);
            formData.append('enTitle', values.titleEnglish);
            formData.append('arTitle', values.arTitle);
            formData.append('enName', values.name);
            formData.append('arName', values.arName);
            formData.append('enContent', descriptionEn);
            formData.append('arContent', descriptionAr);
            formData.append('enConclusion', conclusionEn);
            formData.append('arConclusion', conclusionAr);
            formData.append('enAdminName', adminNameEn);
            formData.append('arAdminName', adminNameAr);
            formData.append('enFeedback', adminFeedbackEn);
            formData.append('arFeedback', adminFeedbackAr);
            formData.append('types', types);

            if (primaryImage) formData.append('primaryImage', primaryImage);
            if (secondaryImage) formData.append('secondaryImage', secondaryImage);
            if (adminImage) formData.append('adminImage', adminImage);

            setLoading(true);
            try {
                const response = await addNewArticle(formData);
                if (response.success === true) {
                    toast.success(response.message);
                    // console.log('Article added successfully:', response);
                    navigate.push('/apps/articles');
                    setLoading(false);
                } else {
                    setLoading(false);
                    toast.error(response.message);
                }
            } catch (error: any) {
                setLoading(false);
                toast.error(error.message);
                // console.error('Failed to add article:', error);
                // Handle error (e.g., show an error toast)
            }
        },
    });

    const handlePrimaryImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPrimaryImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPrimaryImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSecondaryImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSecondaryImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setSecondaryImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAdminImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setAdminImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setAdminImagePreview(reader.result as string);
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
        <>
            {loading === true ? (
                <Loading />
            ) : (
                <div>
                    <h2 className="py-2 text-[20px] font-medium">Add Articles</h2>
                    <form onSubmit={formik.handleSubmit}>
                        <div className="panel border-white-light px-3 dark:border-[#1b2e4b]">
                            <label>Primary Image Section</label>
                            {primaryImagePreview && <Image width={50} height={50} src={primaryImagePreview} alt="Primary Preview" className="h-40 w-40 object-cover" />}
                            <div className="my-2">
                                <label htmlFor="primary-file-input" className="btn btn-primary w-fit cursor-pointer rounded-l-md">
                                    Upload primary image
                                    <input type="file" id="primary-file-input" placeholder="Choose a File" accept="image/*" onChange={handlePrimaryImageChange} style={{ display: 'none' }} />
                                </label>
                            </div>

                            <label>Secondary Image Section</label>
                            {secondaryImagePreview && <Image width={50} height={50} src={secondaryImagePreview} alt="Primary Preview" className="h-40 w-40 object-cover" />}
                            <div className="my-2">
                                <label htmlFor="secondary-file-input" className="btn btn-primary w-fit cursor-pointer rounded-l-md">
                                    Upload secondary image
                                    <input type="file" id="secondary-file-input" placeholder="Choose a File" accept="image/*" onChange={handleSecondaryImageChange} style={{ display: 'none' }} />
                                </label>
                            </div>
                            <div className="max-md:gap-2 max-sm:grid-cols-1 mb-2 grid grid-cols-2 gap-4 gap-y-0">
                                <div>
                                    <h2 className="mb-1 flex items-center px-2 py-3 font-semibold text-[#0e1726] dark:text-[#888EA8]">
                                        <span>Main Title English</span>
                                    </h2>
                                    <input
                                        type="text"
                                        className="w-full rounded-lg border-[1px] border-solid border-white-light px-3 py-3 dark:border-[#17263c] dark:bg-[#222B45]"
                                        {...formik.getFieldProps('titleEnglish')}
                                    />

                                </div>
                                <div>

                                    <h2 className="mb-1 flex items-center px-2 py-3 font-semibold text-[#0e1726] dark:text-[#888EA8]">
                                        <span>Main Title Arabic</span>
                                    </h2>
                                    <input
                                        type="text"
                                        className="w-full rounded-lg border-[1px] border-solid border-white-light px-3 py-3 dark:border-[#17263c] dark:bg-[#222B45]"
                                        {...formik.getFieldProps('titleArabic')}
                                    />
                                </div>
                                <div>

                                    <h2 className="mb-1 flex items-center px-2 py-3 font-semibold text-[#0e1726] dark:text-[#888EA8]">
                                        <span>Article Type</span>
                                    </h2>
                                    <select className="form-select" value={types} onChange={(e) => setTypes(e.target.value)}>
                                        <option value="">Select Options</option>
                                        <option value="uiux">Ui/Ux</option>
                                        <option value="branding">Branding</option>
                                        <option value="graphicdesign">Graphic Designing</option>
                                        <option value="motionDesign">Motion Grraphic Design</option>
                                    </select>
                                </div>
                                <div>

                                    <h2 className="mb-1 flex items-center px-2 py-3 font-semibold text-[#0e1726] dark:text-[#888EA8]">
                                        <span>Arabic Title</span>
                                    </h2>
                                    <input
                                        type="text"
                                        className="w-full rounded-lg border-[1px] border-solid border-white-light px-3 py-3 dark:border-[#17263c] dark:bg-[#222B45]"
                                        {...formik.getFieldProps('arTitle')}
                                    />
                                </div>
                                <div>

                                    <h2 className="mb-1 flex items-center px-2 py-3 font-semibold text-[#0e1726] dark:text-[#888EA8]">
                                        <span>Author Name English</span>
                                    </h2>
                                    <input
                                        type="text"
                                        className="w-full rounded-lg border-[1px] border-solid border-white-light px-3 py-3 dark:border-[#17263c] dark:bg-[#222B45]"
                                        {...formik.getFieldProps('name')}
                                    />
                                </div>
                                <div>

                                    <h2 className="mb-1 flex items-center px-2 py-3 font-semibold text-[#0e1726] dark:text-[#888EA8]">
                                        <span>Author Name Arabic</span>
                                    </h2>
                                    <input
                                        type="text"
                                        className="w-full rounded-lg border-[1px] border-solid border-white-light px-3 py-3 dark:border-[#17263c] dark:bg-[#222B45]"
                                        {...formik.getFieldProps('arName')}
                                    />
                                </div>
                                <div>

                                    <h2 className="mb-1 flex items-center px-2 py-3 font-semibold text-[#0e1726] dark:text-[#888EA8]">
                                        <span>Content English</span>
                                    </h2>
                                    <ReactQuill theme="snow" value={descriptionEn} onChange={setDescriptionEn} modules={modules} />
                                </div>
                                <div>

                                    <h2 className="mb-1 flex items-center px-2 py-3 font-semibold text-[#0e1726] dark:text-[#888EA8]">
                                        <span>Content Arabic</span>
                                    </h2>
                                    <ReactQuill theme="snow" value={descriptionAr} onChange={setDescriptionAr} modules={modules} />
                                </div>
                                <div>

                                    <h2 className="mb-1 flex items-center px-2 py-3 font-semibold text-[#0e1726] dark:text-[#888EA8]">
                                        <span>Conclusion English</span>
                                    </h2>
                                    <ReactQuill theme="snow" value={conclusionEn} onChange={setConclusionEn} modules={modules} />
                                </div>
                                <div>

                                    <h2 className="mb-1 flex items-center px-2 py-3 font-semibold text-[#0e1726] dark:text-[#888EA8]">
                                        <span>Conclusion Arabic</span>
                                    </h2>
                                    <ReactQuill theme="snow" value={conclusionAr} onChange={setConclusionAr} modules={modules} />
                                </div>
                                <div>

                                    <h2 className="mb-1 flex items-center px-2 py-3 font-semibold text-[#0e1726] dark:text-[#888EA8]">
                                        <span>Admin Name English</span>
                                    </h2>
                                    <input
                                        type="text"
                                        className="w-full rounded-lg border-[1px] border-solid border-white-light px-3 py-3 dark:border-[#17263c] dark:bg-[#222B45]"
                                        value={adminNameEn}
                                        onChange={(e) => setAdminNameEn(e.target.value)}
                                    />
                                </div>
                                <div>

                                    <h2 className="mb-1 flex items-center px-2 py-3 font-semibold text-[#0e1726] dark:text-[#888EA8]">
                                        <span>Admin Name Arabic</span>
                                    </h2>
                                    <input
                                        type="text"
                                        className="w-full rounded-lg border-[1px] border-solid border-white-light px-3 py-3 dark:border-[#17263c] dark:bg-[#222B45]"
                                        value={adminNameAr}
                                        onChange={(e) => setAdminNameAr(e.target.value)}
                                    />
                                </div>
                                <div>

                                    <h2 className="mb-1 flex items-center px-2 py-3 font-semibold text-[#0e1726] dark:text-[#888EA8]">
                                        <span>Admin Feedback English</span>
                                    </h2>
                                    <ReactQuill theme="snow" value={adminFeedbackEn} onChange={setAdminFeedbackEn} modules={modules} />
                                </div>
                                <div>

                                    <h2 className="mb-1 flex items-center px-2 py-3 font-semibold text-[#0e1726] dark:text-[#888EA8]">
                                        <span>Admin Feedback Arabic</span>
                                    </h2>
                                    <ReactQuill theme="snow" value={adminFeedbackAr} onChange={setAdminFeedbackAr} modules={modules} />
                                </div>

                            </div>

                            <label>Admin Image Section</label>
                            {adminImagePreview && <Image width={50} height={50} src={adminImagePreview} alt="Admin Preview" className="h-40 w-40 object-cover" />}
                            <div className="my-2">
                                <label htmlFor="admin-file-input" className="btn btn-primary w-fit cursor-pointer rounded-l-md">
                                    Upload admin image
                                    <input type="file" id="admin-file-input" placeholder="Choose a File" accept="image/*" onChange={handleAdminImageChange} style={{ display: 'none' }} />
                                </label>
                            </div>

                            <div className="my-4">
                                <button type="submit" className="rounded bg-blue-500 px-4 py-2 text-white" disabled={loading}>
                                    {loading ? 'Adding...' : 'Add Article'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            )}
        </>
    );
};

export default AddArticle;
