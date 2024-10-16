'use client';
import React, { useState } from 'react';
import { useFormik } from 'formik';
import { addUiStore } from '@/components/utils/Helper';
import toast from 'react-hot-toast';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useRouter } from 'next/navigation';
import { AddUISchema } from '@/components/schema/schema';
import Image from 'next/image';

// Component
const AddUiStore = () => {
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [sliderPreview, setSliderPreview] = useState<string[]>([]);

    const navigate = useRouter();
    const formik = useFormik({
        initialValues: {
            title: '',
            arTitle: '',
            subtitle: '',
            arSubtitle: '',
            priceOrFree: '',
            types: '',
            buylink:'',
            Description: '',
            DescriptionAr: '',
            uIKitrecommendedTitle: '',
            arUIKitrecommendedTitle: '',
            uIKitrecommendedDescription: '',
            arUIKitrecommendedDescription: '',
            whatinsideTitle: '',
            arWhatinsideTitle: '',
            whatinsideDescription: '',
            arWhatinsideDescription: '',
            licenseTitle: '',
            arLicenseTitle: '',
            licenseDescription: '',
            arLicenseDescription: '',
            primaryImage: null,
            sliderImages: [] as File[],
        },
        validationSchema: AddUISchema,
        onSubmit: async (values) => {
            console.log('Values===>', values);
            try {
                const result = await addUiStore(values);
                if (result.success === true) {
                    toast.success(result.message);
                    navigate.push('/apps/ui-store');
                } else {
                    toast.error(result.message);
                }
            } catch (error: any) {
                toast.error(error.message);
                console.error('Error updating store:', error);
            }
        },
    });

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            formik.setFieldValue('primaryImage', file);
            const reader = new FileReader();

            reader.onload = () => setImagePreview(reader.result as string);
            reader.readAsDataURL(file);
        } else {
            formik.setFieldValue('primaryImage', null);
            setImagePreview(null);
        }
    };
    const handleSliderImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
                setSliderPreview(previews); // Local state for previews
                formik.setFieldValue('sliderImages', filesArray); // Store files in Formik
            });

            // // Assuming `formik` is set up properly elsewhere
            // formik.setFieldValue('sliderImages', [...formik.values.sliderImages, ...fileArray]);

            // // Clean up the object URLs after use
            // fileUrls.forEach(fileUrl => URL.revokeObjectURL(fileUrl));
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
                    <div className="max-md:gap-2 mb-2 grid grid-cols-1 gap-4 gap-y-0 sm:grid-cols-2">
                        <div className="my-2">
                            <label className="">Title (EN)</label>
                            <input type="text" name="title" value={formik.values.title} onChange={formik.handleChange} onBlur={formik.handleBlur} className="form-input" placeholder="English Title" />
                            {formik.touched.title && formik.errors.title && <p className="text-sm text-red-500">{formik.errors.title}</p>}
                        </div>
                        <div className="my-2">
                            <label className="">Title (AR)</label>
                            <input
                                type="text"
                                name="arTitle"
                                value={formik.values.arTitle}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="form-input"
                                placeholder="Arabic Title"
                            />
                            {formik.touched.arTitle && formik.errors.arTitle && <p className="text-sm text-red-500">{formik.errors.arTitle}</p>}
                        </div>
                        <div className="my-2">
                            <label>Subtitle (EN)</label>
                            <input
                                type="text"
                                name="subtitle"
                                value={formik.values.subtitle}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="form-input"
                                placeholder="English Subtitle"
                            />
                            {formik.touched.subtitle && formik.errors.subtitle && <p className="text-sm text-red-500">{formik.errors.subtitle}</p>}
                        </div>
                        <div className="my-2">
                            <label>Subtitle (AR)</label>

                            <input
                                type="text"
                                name="arSubtitle"
                                value={formik.values.arSubtitle}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="form-input"
                                placeholder="Arabic Subtitle"
                            />
                            {formik.touched.arSubtitle && formik.errors.arSubtitle && <p className="text-sm text-red-500">{formik.errors.arSubtitle}</p>}
                        </div>

                        {/* Price or Free Option Section */}
                        <div className="my-2">
                            <label>Price or Free</label>
                            <input
                                type="text"
                                name="priceOrFree"
                                value={formik.values.priceOrFree}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="form-input"
                                placeholder="Price or Free"
                            />
                            {formik.touched.priceOrFree && formik.errors.priceOrFree && <p className="text-sm text-red-500">{formik.errors.priceOrFree}</p>}
                        </div>
                        <div className="my-2">
                            <label>Buy Link</label>
                            <input
                                type="text"
                                name="buylink"
                                value={formik.values.buylink}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="form-input"
                                placeholder="Buy Link"
                            />
                            {formik.touched.buylink && formik.errors.buylink && <p className="text-sm text-red-500">{formik.errors.buylink}</p>}
                        </div>

                        {/* Types Section */}
                        <div className="my-2">
                            <label>Type</label>
                            <select name="types" value={formik.values.types} onChange={formik.handleChange} onBlur={formik.handleBlur} className="form-select">
                                <option value="">Select type</option>
                                <option value="uiux">uiux</option>
                                <option value="branding">branding</option>
                                <option value="graphicdesign">graphicdesigning</option>
                                <option value="motionGraphic">motionGraphics</option>
                            </select>
                            {formik.touched.types && formik.errors.types && <p className="text-sm text-red-500">{formik.errors.types}</p>}
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
                        <label htmlFor="file-input" className="btn btn-primary w-fit cursor-pointer">
                            Choose image
                            <input type="file" accept="image/*" name="primaryImage" id="file-input" onChange={handleFileChange} className="hidden" />
                        </label>
                        {formik.touched.primaryImage && formik.errors.primaryImage && <p className="text-sm text-red-500">{formik.errors.primaryImage}</p>}
                    </div>

                    <div className="max-md:gap-2 mb-2 grid grid-cols-1 gap-4 gap-y-0 sm:grid-cols-2">
                        <div className="my-2">
                            <label>Description (EN)</label>
                            <ReactQuill value={formik.values.Description} onChange={(content) => formik.setFieldValue('Description', content)} modules={modules} />
                            {formik.touched.Description && formik.errors.Description && <p className="text-sm text-red-500">{formik.errors.Description}</p>}
                        </div>
                        <div className="my-2">
                            <label>Description (AR)</label>
                            <ReactQuill value={formik.values.DescriptionAr} onChange={(content) => formik.setFieldValue('DescriptionAr', content)} modules={modules} />
                            {formik.touched.Description && formik.errors.Description && <p className="text-sm text-red-500">{formik.errors.Description}</p>}
                        </div>
                    </div>

                    {/* Slider Images Section */}
                    <div className="my-2">
                        <label>Slider Images</label>
                        {sliderPreview.length > 0 && (
                            <div className="my-2 flex flex-wrap gap-2">
                                {sliderPreview.map((preview, index) => (
                                    <Image width={1000} height={1000} key={index} src={preview} alt={`Slider ${index}`} className="h-20 w-20 rounded-lg object-cover" />
                                ))}
                            </div>
                        )}
                        <label className="btn btn-primary w-fit" style={{ cursor: 'pointer' }}>
                            Choose Images
                            <input type="file" name="sliderImages" accept="image/*" multiple onChange={handleSliderImageChange} className="form-input" style={{ display: 'none' }} />
                        </label>
                        {/* Preview Slider Images */}
                    </div>

                    <div className="max-md:gap-2 mb-2 grid grid-cols-1 gap-4 gap-y-0 sm:grid-cols-2">
                        <div className="my-2">
                            <label>UI Kit Recommended Title (EN)</label>
                            <input
                                type="text"
                                name="uIKitrecommendedTitle"
                                value={formik.values.uIKitrecommendedTitle}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="form-input"
                                placeholder="English Title"
                            />
                            {formik.touched.uIKitrecommendedTitle && formik.errors.uIKitrecommendedTitle && <p className="text-sm text-red-500">{formik.errors.uIKitrecommendedTitle}</p>}
                        </div>
                        <div className="my-2">
                            <label>UI Kit Recommended Title (AR)</label>
                            <input
                                type="text"
                                name="arUIKitrecommendedTitle"
                                value={formik.values.arUIKitrecommendedTitle}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="form-input"
                                placeholder="Arabic Title"
                            />
                            {formik.touched.arUIKitrecommendedTitle && formik.errors.arUIKitrecommendedTitle && <p className="text-sm text-red-500">{formik.errors.arUIKitrecommendedTitle}</p>}
                        </div>

                        <div className="my-2">
                            <label>UI Kit Recommended Description (EN)</label>
                            <ReactQuill value={formik.values.uIKitrecommendedDescription} onChange={(content) => formik.setFieldValue('uIKitrecommendedDescription', content)} modules={modules} />
                            {formik.touched.uIKitrecommendedDescription && formik.errors.uIKitrecommendedDescription && (
                                <p className="text-sm text-red-500">{formik.errors.uIKitrecommendedDescription}</p>
                            )}
                        </div>
                        <div className="my-2">
                            <label>UI Kit Recommended Description (AR)</label>
                            <ReactQuill value={formik.values.arUIKitrecommendedDescription} onChange={(content) => formik.setFieldValue('arUIKitrecommendedDescription', content)} modules={modules} />
                            {formik.touched.arUIKitrecommendedDescription && formik.errors.arUIKitrecommendedDescription && (
                                <p className="text-sm text-red-500">{formik.errors.arUIKitrecommendedDescription}</p>
                            )}
                        </div>
                    </div>

                    <div className="max-md:gap-2 mb-2 grid grid-cols-1 gap-4 gap-y-0 sm:grid-cols-2">
                        <div className="my-2">
                            <label>What Inside Title (EN)</label>
                            <input
                                type="text"
                                name="whatinsideTitle"
                                value={formik.values.whatinsideTitle}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="form-input"
                                placeholder="English Title"
                            />
                            {formik.touched.whatinsideTitle && formik.errors.whatinsideTitle && <p className="text-sm text-red-500">{formik.errors.whatinsideTitle}</p>}
                        </div>
                        <div className="my-2">
                            <label>What Inside Title (AR)</label>
                            <input
                                type="text"
                                name="arWhatinsideTitle"
                                value={formik.values.arWhatinsideTitle}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="form-input"
                                placeholder="Arabic Title"
                            />
                            {formik.touched.arWhatinsideTitle && formik.errors.arWhatinsideTitle && <p className="text-sm text-red-500">{formik.errors.arWhatinsideTitle}</p>}
                        </div>

                        <div className="my-2">
                            <label>What Inside Description (EN)</label>
                            <ReactQuill value={formik.values.whatinsideDescription} onChange={(content) => formik.setFieldValue('whatinsideDescription', content)} modules={modules} />
                            {formik.touched.whatinsideDescription && formik.errors.whatinsideDescription && <p className="text-sm text-red-500">{formik.errors.whatinsideDescription}</p>}
                        </div>
                        <div className="my-2">
                            <label>What Inside Description (AR)</label>
                            <ReactQuill value={formik.values.arWhatinsideDescription} onChange={(content) => formik.setFieldValue('arWhatinsideDescription', content)} modules={modules} />
                            {formik.touched.arWhatinsideDescription && formik.errors.arWhatinsideDescription && <p className="text-sm text-red-500">{formik.errors.arWhatinsideDescription}</p>}
                        </div>
                    </div>
                    <div className="max-md:gap-2 mb-2 grid grid-cols-1 gap-4 gap-y-0 sm:grid-cols-2">
                        <div className="my-2">
                            <label>License Title (EN)</label>
                            <input
                                type="text"
                                name="licenseTitle"
                                value={formik.values.licenseTitle}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="form-input"
                                placeholder="English Title"
                            />
                            {formik.touched.licenseTitle && formik.errors.licenseTitle && <p className="text-sm text-red-500">{formik.errors.licenseTitle}</p>}
                        </div>
                        <div className="my-2">
                            <label>License Title (AR)</label>

                            <input
                                type="text"
                                name="arLicenseTitle"
                                value={formik.values.arLicenseTitle}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="form-input"
                                placeholder="Arabic Title"
                            />
                            {formik.touched.arLicenseTitle && formik.errors.arLicenseTitle && <p className="text-sm text-red-500">{formik.errors.arLicenseTitle}</p>}
                        </div>
                        <div className="my-2">
                            <label>License Description (EN)</label>
                            <ReactQuill value={formik.values.licenseDescription} onChange={(content) => formik.setFieldValue('licenseDescription', content)} modules={modules} />
                            {formik.touched.licenseDescription && formik.errors.licenseDescription && <p className="text-sm text-red-500">{formik.errors.licenseDescription}</p>}
                        </div>
                        <div className="my-2">
                            <label>License Description (AR)</label>

                            <ReactQuill value={formik.values.arLicenseDescription} onChange={(content) => formik.setFieldValue('arLicenseDescription', content)} modules={modules} />
                            {formik.touched.arLicenseDescription && formik.errors.arLicenseDescription && <p className="text-sm text-red-500">{formik.errors.arLicenseDescription}</p>}
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary">
                        Save
                    </button>
                </form>
            </div>
        </>
    );
};

export default AddUiStore;
