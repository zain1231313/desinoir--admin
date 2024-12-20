'use client';
import { IRootState } from '@/store';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import { updateUiStore } from '@/components/utils/Helper';
import toast from 'react-hot-toast';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useRouter, useSearchParams } from 'next/navigation';
import API_ENDPOINT from '@/components/apiRoutes/ApiRoutes';
import Image from 'next/image';

// Validation Schema
interface TranslatableField {
    en: string;
    ar: string;
}

// interface UiStoreItem {
//     _id: string;
//     primaryImage: string;
//     title: TranslatableField;
//     licenseTitle: TranslatableField;
//     licenseDescription: TranslatableField;
//     priceOrFree: string;
//     relatedProducts: string[]; // Assuming these are IDs or names
//     sliderImages: string[]; // Assuming these are URLs
//     subtitle: TranslatableField;
//     types: string;
//     uIKitrecommendedDescription: TranslatableField;
//     uIKitrecommendedTitle: TranslatableField;
//     updatedAt: string; // Assuming this is an ISO date string
//     whatinsideDescription: TranslatableField;
//     whatinsideTitle: TranslatableField;
// }

// Component
const UpdateUiStore = () => {
    const dispatch = useDispatch();
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const selectedItem = useSelector((state: IRootState) => state.uiStore.selectedItem);
    const [data, setData] = useState<any>();
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [sliderPreviews, setSliderPreviews] = useState<string[]>([]);
    const [fileUrls, setFileUrls] = useState<any>();

    // Example function to update the state
    const addFileUrl = (newUrl: string) => {
        setFileUrls((prevUrls: any) => [...prevUrls, newUrl]);
    };
    const navigate = useRouter();

    useEffect(() => {
        const myHeaders = new Headers();
        myHeaders.append('Accept', 'application/json');

        const requestOptions: any = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow',
        };

        fetch(`${API_ENDPOINT.UISTORE_BY_ID}${id}`, requestOptions)
            .then((response) => response.json())
            .then((result) => {
                return setData(result.data);
            })
            .catch((error) => console.error(error));
    }, []);
    useEffect(() => {
        if (data?.sliderImages) {
            setImagePreview(data?.sliderImages);
        }
        if (data?.sliderImages && data?.sliderImages.length > 0) {
            setSliderPreviews(data?.sliderImages);
        }
    }, [data]);
    console.log(data?.primaryImage);
    const formik = useFormik({
        initialValues: {
            title: data?.title.en,
            titleAr: data?.title.ar,
            subtitle: data?.subtitle.en,
            subtitleAr: data?.subtitle.ar,
            priceOrFree: data?.priceOrFree,
            primaryImage: data?.primaryImage || null,
            sliderImages: data?.sliderImages || [],
            types: data?.types,
            buylink: data?.buylink,
            uIKitrecommendedDescription: data?.uIKitrecommendedDescription.en,
            uIKitrecommendedDescriptionAr: data?.uIKitrecommendedDescription.ar,
            uIKitrecommendedTitle: data?.uIKitrecommendedTitle.en,
            uIKitrecommendedTitleAr: data?.uIKitrecommendedTitle.ar,

            whatinsideDescription: data?.whatinsideDescription.en,
            whatinsideDescriptionAr: data?.whatinsideDescription.ar,

            whatinsideTitle: data?.whatinsideTitle.en,
            whatinsideTitleAr: data?.whatinsideTitle.ar,

            licenseTitle: data?.licenseTitle.en,
            licenseTitleAr: data?.licenseTitle.ar,

            licenseDescription: data?.licenseDescription.en,
            licenseDescriptionAr: data?.licenseDescription.ar,
        },
        enableReinitialize: true,
        onSubmit: async (values) => {
            try {
                console.log('Updates ==========', values);
                if (id) {
                    const result = await updateUiStore(id, values);
                    toast.success(result.message);
                    navigate.push('/apps/ui-store');
                }
            } catch (error: any) {
                toast.error(error.message);
                console.error('Error updating store:', error);
            }
        },
    });

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

    const handleSliderImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            const newImages = Array.from(files);
            setSliderPreviews(newImages.map((file) => URL.createObjectURL(file)));
            formik.setFieldValue('sliderImages', newImages);
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
            <h2 className="mb-1 flex items-center px-2 py-3 font-extrabold uppercase">
                <span>Ui Store</span>
            </h2>
            <div className="panel border-white-light px-3 dark:border-[#1b2e4b]">
                <form onSubmit={formik.handleSubmit}>
                    {/* Title Section */}
                    <div className='flex w-full gap-2'>
                        <div className="my-2 w-full">
                            <label>Title (EN)</label>
                            <input type="text" name="title" value={formik.values.title} onChange={formik.handleChange} onBlur={formik.handleBlur} className="form-input" placeholder="English Title" />
                        </div>
                        <div className="my-2 w-full">
                            <label>Title (AR)</label>
                            <input
                                type="text"
                                name="titleAr"
                                value={formik.values.titleAr}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="form-input"
                                placeholder="Arabic Title"
                            />
                        </div>
                    </div>
                    <div className='flex w-full gap-2'>
                        <div className="my-2 w-full">
                            <label>Subtitle (EN)</label>
                            <input
                                type="text"
                                name="subtitle"
                                value={formik.values.subtitle}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="form-input"
                                placeholder="English Title"
                            />
                        </div>
                        <div className="my-2 w-full">
                            <label>Subtitle (AR)</label>
                            <input
                                type="text"
                                name="subtitleAr"
                                value={formik.values.subtitleAr}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="form-input"
                                placeholder="Arabic Title"
                            />
                        </div>
                    </div>

                    {/* Price or Free Option Section */}
                    <div className='flex w-full gap-2'>
                        <div className="my-2 w-full">
                            <label>Price or Free</label>
                            <input type="text" name="priceOrFree" value={formik.values.priceOrFree} onChange={formik.handleChange} onBlur={formik.handleBlur} className="form-input" />
                        </div>

                        <div className="my-2 w-full">
                            <label>Buy Link</label>
                            <input type="text" name="buylink" value={formik.values.buylink} onChange={formik.handleChange} onBlur={formik.handleBlur} className="form-input" />
                        </div>
                    </div>

                    {/* Primary Image Section */}
                    <div className="my-2">
                        <label>Primary Image</label>
                        {imagePreview && (
                            <div className="my-2">
                                <Image width={1000} height={1000} src={imagePreview} alt="Preview" className="h-20 w-20 rounded-lg object-cover" />
                            </div>
                        )}
                        <label htmlFor="primaryImage" className="btn btn-primary w-fit" style={{ cursor: 'pointer' }}>
                            Choose Image
                            <input type="file" id="primaryImage" name="primaryImage" accept="image/*" onChange={handlePrimaryImageChange} className="form-input" style={{ display: 'none' }} />
                        </label>
                    </div>

                    {/* Slider Images Section */}
                    <div className="my-2">
                        <label>Slider Images</label>
                        {sliderPreviews.length > 0 && (
                            <div className="my-2 flex gap-2">
                                {sliderPreviews.map((preview, index) => (
                                    <Image width={1000} height={1000} key={index} src={preview} alt={`Slider ${index}`} className="h-20 w-20 rounded-lg object-cover" />
                                ))}
                            </div>
                        )}
                        <label htmlFor="sliderImages" className="btn btn-primary w-fit" style={{ cursor: 'pointer' }}>
                            Choose Images
                            <input type="file" name="sliderImages" id="sliderImages" multiple accept="image/*" onChange={handleSliderImageChange} style={{ display: 'none' }} />
                        </label>
                    </div>

                    {/* Types Section */}
                    <div className="my-2">
                        <label>Type</label>
                        <select name="types" value={formik.values.types} onChange={formik.handleChange} onBlur={formik.handleBlur} className="form-select">
                            <option value="">Select type</option>
                            <option value="uiux">UiUx</option>
                            <option value="branding">Branding</option>
                            <option value="graphicdesign">Graphic Design</option>
                            <option value="motionGraphic">Motion Graphic</option>
                        </select>
                    </div>

                    <label>UI Kit Recommended Title</label>
                    <div className="max-md:gap-2 max-sm:grid-cols-1 mb-2 grid grid-cols-2 gap-4 gap-y-0">
                        {/* UI Kit Recommended Title Section */}
                        <div className="my-2">
                            <input
                                type="text"
                                name="uIKitrecommendedTitle"
                                value={formik.values.uIKitrecommendedTitle}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="form-input"
                                placeholder="English UI Kit Recommended Title"
                            />
                        </div>
                        <div className="my-2">
                            <input
                                type="text"
                                name="uIKitrecommendedTitleAr"
                                value={formik.values.uIKitrecommendedTitleAr}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="form-input"
                                placeholder="Arabic UI Kit Recommended Title"
                            />
                        </div>
                    </div>

                    {/* UI Kit Recommended Description Section */}
                    <label>UI Kit Recommended Description</label>
                    <div className="max-md:gap-2 max-sm:grid-cols-1 mb-2 grid grid-cols-2 gap-4 gap-y-0">
                        <div className="my-2">
                            <ReactQuill
                                value={formik.values.uIKitrecommendedDescription}
                                onChange={(content) => formik.setFieldValue('uIKitrecommendedDescription', content)}
                                modules={modules}
                                theme="snow"
                            />
                        </div>
                        <div className="my-2">
                            <ReactQuill
                                value={formik.values.uIKitrecommendedDescriptionAr}
                                onChange={(content) => formik.setFieldValue('uIKitrecommendedDescriptionAr', content)}
                                modules={modules}
                                theme="snow"
                            />
                        </div>
                    </div>

                    {/* What’s Inside Title Section */}
                    <label>What’s Inside Title</label>
                    <div className="max-md:gap-2 max-sm:grid-cols-1 mb-2 grid grid-cols-2 gap-4 gap-y-0">
                        <div className="my-2">
                            <input
                                type="text"
                                name="whatinsideTitle"
                                value={formik.values.whatinsideTitle}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="form-input"
                                placeholder="English What’s Inside Title"
                            />
                        </div>
                        <div className="my-2">
                            <input
                                type="text"
                                name="whatinsideTitleAr"
                                value={formik.values.whatinsideTitleAr}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="form-input"
                                placeholder="Arabic What’s Inside Title"
                            />
                        </div>
                    </div>

                    {/* What’s Inside Description Section */}
                    <label>What’s Inside Description</label>
                    <div className="max-md:gap-2 max-sm:grid-cols-1 mb-2 grid grid-cols-2 gap-4 gap-y-0">
                        <div className="my-2">
                            <ReactQuill value={formik.values.whatinsideDescription} onChange={(content) => formik.setFieldValue('whatinsideDescription', content)} modules={modules} theme="snow" />
                        </div>
                        <div className="my-2">
                            <ReactQuill value={formik.values.whatinsideDescriptionAr} onChange={(content) => formik.setFieldValue('whatinsideDescriptionAr', content)} modules={modules} theme="snow" />
                        </div>
                    </div>

                    {/* licenseTitle Title Section */}
                    <label>License Title</label>
                    <div className="max-md:gap-2 max-sm:grid-cols-1 mb-2 grid grid-cols-2 gap-4 gap-y-0">
                        <div className="my-2">
                            <input
                                type="text"
                                name="licenseTitle"
                                value={formik.values.licenseTitle}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="form-input"
                                placeholder="English License Title"
                            />
                        </div>
                        <div className="my-2">
                            <input
                                type="text"
                                name="licenseTitleAr"
                                value={formik.values.licenseTitleAr}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="form-input"
                                placeholder="Arabic License Title"
                            />
                        </div>
                    </div>

                    {/* License Description Section */}
                    <label>License Description</label>
                    <div className="max-md:gap-2 max-sm:grid-cols-1 mb-2 grid grid-cols-2 gap-4 gap-y-0">
                        <div className="my-2">
                            <ReactQuill value={formik.values.licenseDescription} onChange={(content) => formik.setFieldValue('licenseDescription', content)} modules={modules} theme="snow" />
                        </div>
                        <div className="my-2">
                            <ReactQuill value={formik.values.licenseDescriptionAr} onChange={(content) => formik.setFieldValue('licenseDescriptionAr', content)} modules={modules} theme="snow" />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button type="submit" className="mt-4 rounded bg-blue-500 px-4 py-2 text-white">
                        Update
                    </button>
                </form>
            </div>
        </>
    );
};

export default UpdateUiStore;
