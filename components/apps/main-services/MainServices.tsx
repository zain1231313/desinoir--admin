"use client"
import React, { useEffect, useState } from 'react'
import FileUploader from '../reuseable/FileUploader'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import { createMainSection, createServiceHome, fetchHomeData } from '@/components/utils/Helper';
import { setData, setLoading, setError } from '@/store/HomeSlice';
import toast from 'react-hot-toast';
import Image from 'next/image';

const MainServices = () => {
    const dispatch = useDispatch();
    const [uiicon, setUiicon] = useState<File | null>(null);
    const [brandingicon, setBrandingicon] = useState<File | null>(null);
    const [graphicIcon, setGraphicIcon] = useState<File | null>(null);
    const [motionIcon, setMotionIcon] = useState<File | null>(null);
    const [uiuxFilePreview, setUiuxFilePreview] = useState<string | null>(null);
    const [brandingFilePreview, setBrandingFilePreview] = useState<string | null>(null);
    const [graphicDesignFilePreview, setGraphicDesignFilePreview] = useState<string | null>(null);
    const [motionGraphicsFilePreview, setMotionGraphicsFilePreview] = useState<string | null>(null);
    const [uiuxFileName, setUiuxFileName] = useState<string | null>(null);
    const [brandingFileName, setBrandingFileName] = useState<string | null>(null);
    const [graphicDesignFileName, setGraphicDesignFileName] = useState<string | null>(null);
    const [motionGraphicsFileName, setMotionGraphicsFileName] = useState<string | null>(null);

    const [fileName, setFileName] = useState<string | null>(null);
    const [enguiuxDescrip, setEnguiuxDescrip] = useState('');
    const [aruiuxDescrip, setAruiuxDescrip] = useState('');
    const [engbrandingDescrip, setEngbrandingDescrip] = useState('');
    const [arbrandingDescrip, setArbrandingDescrip] = useState('');
    const [enggraphicDescrip, setEnggraphicDescrip] = useState('');
    const [argraphicDescrip, setArgraphicDescrip] = useState('');
    const [engmotionDescrip, setEngmotionDescrip] = useState('');
    const [armotionDescrip, setArmotionDescrip] = useState('');



    const [formData, setFormData] = useState<any>({

        mainSectionheadertitle: '',
        mainSectionheadertitleAr: '',
        mainSectionheaderSubtitle: '',
        mainSectionheaderSubtitleAr: '',


        uiuxTitle: '',
        uiuxTitleAr: '',
        uiuxDescription: '',
        uiuxDescriptionAr: '',
        uiuxIcon: '',

        brandingTitle: '',
        brandingTitleAr: '',
        brandingDescription: '',
        brandingDescriptionAr: '',
        brandingIcon: '',

        motionGraphicDesignTitle: '',
        motionGraphicDesignTitleAr: '',
        motionGraphicDesignDescription: '',
        motionGraphicDesignDescriptionAr: '',
        motionGraphicDesignIcon: '',

        graphicDesignTitle: '',
        graphicDesignTitleAr: '',
        graphicDesignDescription: '',
        graphicDesignDescriptionAr: '',
        graphicDesignIcon: '',
    });



    const formik = useFormik({
        initialValues: formData,
        enableReinitialize: true,
        onSubmit: async (values) => {
            const formData = new FormData();

            formData.append("mainServiceTitle", values.mainSectionheadertitle);
            formData.append("arMainServiceTitle", values.mainSectionheadertitleAr);
            formData.append("mainServiceSubTitle", values.mainSectionheaderSubtitle);
            formData.append("arMainServiceSubTitle", values.mainSectionheaderSubtitleAr);

            if (uiicon) {
                formData.append("uiuxIcon", uiicon);
            }
            formData.append("uiuxTitle", values.uiuxTitle);
            formData.append("arUiuxTitle", values.uiuxTitleAr);
            formData.append("uiuxDescription", enguiuxDescrip); // Ensure this value is preserved
            formData.append("arUiuxDescription", aruiuxDescrip);

            if (brandingicon) {
                formData.append("brandingIcon", brandingicon);
            }
            formData.append("brandingTitle", values.brandingTitle);
            formData.append("arBrandingTitle", values.brandingTitleAr);
            formData.append("brandingDescription", engbrandingDescrip); // Ensure this value is preserved
            formData.append("arBrandingDescription", arbrandingDescrip);

            if (graphicIcon) {
                formData.append("graphicDesignIcon", graphicIcon);
            }
            formData.append("graphicDesignTitle", values.graphicDesignTitle);
            formData.append("arGraphicDesignTitle", values.graphicDesignTitleAr);
            formData.append("graphicDesignDescription", enggraphicDescrip); // Ensure this value is preserved
            formData.append("arGraphicDesignDescription", argraphicDescrip);

            if (motionIcon) {
                formData.append("motionGraphicDesignIcon", motionIcon);
            }
            formData.append("motionGraphicDesignTitle", values.motionGraphicDesignTitle);
            formData.append("arMotionGraphicDesignTitle", values.motionGraphicDesignTitleAr);
            formData.append("motionGraphicDesignDescription", engmotionDescrip); // Ensure this value is preserved
            formData.append("arMotionGraphicDesignDescription", armotionDescrip);

            try {
                const result = await createServiceHome(formData);
                // console.log("results ---------", result);
                formik.setValues({
                    // Update formik values if necessary
                    uiuxTitle: result.data.data.en.serviceSection.uiuxTitle,
                    uiuxTitleAr: result.data.data.ar.serviceSection.uiuxTitle,
                    uiuxDescription: result.data.data.en.serviceSection.uiuxDescription,
                    uiuxDescriptionAr: result.data.data.ar.serviceSection.uiuxDescription,

                    brandingTitle: result.data.data.en.serviceSection.brandingTitle,
                    brandingTitleAr: result.data.data.ar.serviceSection.brandingTitle,
                    brandingDescription: result.data.data.en.serviceSection.brandingDescription,
                    brandingDescriptionAr: result.data.data.ar.serviceSection.brandingDescription,

                    motionGraphicDesignTitle: result.data.data.en.serviceSection.graphicDesignTitle,
                    motionGraphicDesignTitleAr: result.data.data.ar.serviceSection.graphicDesignTitle,
                    motionGraphicDesignDescription: result.data.data.en.serviceSection.motionGraphicDesignDescription,
                    motionGraphicDesignDescriptionAr: result.data.data.ar.serviceSection.motionGraphicDesignDescription,

                    graphicDesignTitle: result.data.data.en.serviceSection.motionGraphicDesignTitle,
                    graphicDesignTitleAr: result.data.data.ar.serviceSection.motionGraphicDesignTitle,
                    graphicDesignDescription: result.data.data.en.serviceSection.graphicDesignDescription,
                    graphicDesignDescriptionAr: result.data.data.ar.serviceSection.graphicDesignDescription,
                });

                setEnguiuxDescrip(result.data.data.en.uiuxDescription);
                setAruiuxDescrip(result.data.data.ar.uiuxDescription);
                setEngbrandingDescrip(result.data.data.en.brandingDescription);
                setArbrandingDescrip(result.data.data.ar.brandingDescription);
                setEnggraphicDescrip(result.data.data.en.graphicDesignDescription);
                setArgraphicDescrip(result.data.data.ar.graphicDesignDescription);
                setEngmotionDescrip(result.data.data.en.motionGraphicDesignDescription);
                setArmotionDescrip(result.data.data.ar.motionGraphicDesignDescription);
                setUiicon(result.data.data.en.uiuxIcon);
                setBrandingicon(result.data.data.en.brandingIcon);
                setGraphicIcon(result.data.data.en.graphicDesignIcon);
                setMotionIcon(result.data.data.en.motionGraphicDesignIcon);
                toast.success(result.message);
                fetchDataAsync()
            } catch (error: any) {
                toast.error(error.message);
                // console.error(error);
            }
        }
    });

    const fetchDataAsync = async () => {
        dispatch(setLoading(true));
        try {
            const result = await fetchHomeData();
            if (result) {
                const data = result.data.data.en.serviceSection;
                const dataar = result.data.data.ar.serviceSection;
                dispatch(setData(result));

                setFormData({
                    mainSectionheadertitle: data.mainServiceTitle,
                    mainSectionheadertitleAr: dataar.mainServiceTitle,
                    mainSectionheaderSubtitle: data.mainServiceSubTitle,
                    mainSectionheaderSubtitleAr: dataar.mainServiceSubTitle,

                    uiuxTitle: data.uiuxTitle,
                    uiuxTitleAr: dataar.uiuxTitle,
                    uiuxDescription: data.uiuxDescription,
                    uiuxDescriptionAr: dataar.uiuxDescription,

                    brandingTitle: data.brandingTitle,
                    brandingTitleAr: dataar.brandingTitle,
                    brandingDescription: data.brandingDescription,
                    brandingDescriptionAr: dataar.brandingDescription,

                    graphicDesignTitle: data.graphicDesignTitle,
                    graphicDesignTitleAr: dataar.graphicDesignTitle,
                    graphicDesignDescription: data.graphicDesignDescription,
                    graphicDesignDescriptionAr: dataar.graphicDesignDescription,

                    motionGraphicDesignTitle: data.motionGraphicDesignTitle,
                    motionGraphicDesignTitleAr: dataar.motionGraphicDesignTitle,
                    motionGraphicDesignDescription: data.motionGraphicDesignDescription,
                    motionGraphicDesignDescriptionAr: dataar.motionGraphicDesignDescription,
                });

                setEnguiuxDescrip(data.uiuxDescription);
                setAruiuxDescrip(dataar.uiuxDescription);
                setEngbrandingDescrip(data.brandingDescription);
                setArbrandingDescrip(dataar.brandingDescription);
                setEnggraphicDescrip(data.graphicDesignDescription);
                setArgraphicDescrip(dataar.graphicDesignDescription);
                setEngmotionDescrip(data.motionGraphicDesignDescription);
                setArmotionDescrip(dataar.motionGraphicDesignDescription);
                setUiicon(data.uiuxIcon);
                setBrandingicon(data.brandingIcon);
                setGraphicIcon(data.graphicDesignIcon);
                setMotionIcon(data.motionGraphicDesignIcon);
            }
        } catch (error) {
            dispatch(setError('Failed to fetch data'));
        } finally {
            dispatch(setLoading(false));
        }
    };
    useEffect(() => {

        fetchDataAsync();
    }, [dispatch]);


    const handleUiuxImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setUiicon(file);
            setUiuxFileName(file.name);
            const reader = new FileReader();
            reader.onload = () => setUiuxFilePreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleBrandingImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const brandingfile = event.target.files?.[0];
        if (brandingfile) {
            setBrandingicon(brandingfile);
            setBrandingFileName(brandingfile.name);
            const brandingreader = new FileReader();
            brandingreader.onload = () => {
                setBrandingFilePreview(brandingreader.result as string);
            };
            brandingreader.readAsDataURL(brandingfile);
        } else {
            setBrandingFileName(null);
            setBrandingFilePreview(null);
        }
    };

    const handleGraphicDesignImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const graphicfile = event.target.files?.[0];
        if (graphicfile) {
            setGraphicIcon(graphicfile);
            setGraphicDesignFileName(graphicfile.name);
            const Graphicreader = new FileReader();
            Graphicreader.onload = () => {
                setGraphicDesignFilePreview(Graphicreader.result as string);
            };
            Graphicreader.readAsDataURL(graphicfile);
        } else {
            setGraphicDesignFileName(null);
            setGraphicDesignFilePreview(null);
        }
    };

    const handleMotionGraphicsImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const Motionfile = event.target.files?.[0];
        if (Motionfile) {
            setMotionIcon(Motionfile);
            setMotionGraphicsFileName(Motionfile.name);
            const Motionreader = new FileReader();
            Motionreader.onload = () => {
                setMotionGraphicsFilePreview(Motionreader.result as string);
            };
            Motionreader.readAsDataURL(Motionfile);
        } else {
            setMotionGraphicsFileName(null);
            setMotionGraphicsFilePreview(null);
        }
    };


    return (
        <>
            <h2 className="mb-1 flex items-center px-2 py-3 font-extrabold uppercase ">
                <span>Main Services</span>
            </h2>
            <form onSubmit={formik.handleSubmit}>
                <div className="panel border-white-light px-3 mb-3 dark:border-[#1b2e4b]">
                    <h5 className="text-lg font-semibold dark:text-white-light">Title Section 123</h5>

                    <div className="grid grid-cols-2 gap-4 max-md:gap-2 gap-y-0 max-sm:grid-cols-1 mb-2">

                        <div className="my-2">
                            <div>
                                <label className="">
                                    Title (EN)
                                </label>
                                <input
                                    type="text"
                                    placeholder="Title English"
                                    className="form-input"
                                    name="mainSectionheadertitle"
                                    value={formik.values.mainSectionheadertitle}
                                    onChange={formik.handleChange}
                                />
                            </div>
                        </div>
                        <div className="my-2">
                            <div>
                                <label className="">
                                    Title (AR)
                                </label>
                                <input
                                    type="text"
                                    placeholder="Title Arabic"
                                    className="form-input "
                                    name="mainSectionheadertitleAr"
                                    value={formik.values.mainSectionheadertitleAr}
                                    onChange={formik.handleChange}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 max-md:gap-2 gap-y-0 max-sm:grid-cols-1 mb-2">
                        <div className="my-2">
                            <div>
                                <label className="">
                                    Subtitle (EN)
                                </label>
                                <input
                                    type="text"
                                    placeholder="Subtitle English"
                                    className="form-input "
                                    name="mainSectionheaderSubtitle"
                                    value={formik.values.mainSectionheaderSubtitle}
                                    onChange={formik.handleChange}
                                />
                            </div>
                        </div>
                        <div className="my-2">
                            <div>
                                <label className="">
                                    Subtitle (AR)
                                </label>
                                <input
                                    type="text"
                                    placeholder="Subtitle Arabic"
                                    className="form-input "
                                    name="mainSectionheaderSubtitleAr"
                                    value={formik.values.mainSectionheaderSubtitleAr}
                                    onChange={formik.handleChange}
                                />
                            </div>
                        </div>
                    </div>




                </div>
                <div className="panel border-white-light px-3 mb-3 dark:border-[#1b2e4b]">
                    <h5 className="text-lg font-semibold dark:text-white-light">UI/UX Design Section</h5>
                    {uiicon && (
                        <Image width={50} height={50} src={`${!uiuxFilePreview ? uiicon : uiuxFilePreview}`} alt="Initial Image" className='w-40 h-40 object-cover' />
                    )}
                    <div className="my-2">
                        <div className="">
                            <label htmlFor="uiux-file-input" className="rounded-l-md btn btn-primary w-fit" style={{ cursor: 'pointer' }}>
                                Upload image
                                <input
                                    type="file"
                                    id="uiux-file-input"
                                    placeholder="Choose a File"
                                    accept="image/*"
                                    onChange={handleUiuxImageChange}
                                    style={{ display: 'none' }}
                                />
                            </label>
                            {fileName && <p>Selected file: {fileName}</p>}

                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 max-md:gap-2 gap-y-0 max-sm:grid-cols-1 mb-2">
                        <div className="lg:my-2">
                            <div>
                                <label className="">
                                    Title (EN)
                                </label>
                                <input
                                    type="text"
                                    placeholder="Title English"
                                    className="form-input "
                                    name="uiuxTitle"
                                    value={formik.values.uiuxTitle}
                                    onChange={formik.handleChange}
                                />
                            </div>
                        </div>
                        <div className="lg:my-1">
                            <div>
                                <label className="">
                                    Title (AR)
                                </label>
                                <input
                                    type="text"
                                    placeholder="Title Arabic"
                                    className="form-input "
                                    name="uiuxTitleAr"
                                    value={formik.values.uiuxTitleAr}
                                    onChange={formik.handleChange}
                                />
                            </div>
                        </div>
                    </div>

                    <div className='grid grid-cols-2 gap-4 max-md:gap-2 max-sm:grid-cols-1 '>
                        <div>
                            <label className="">
                                Description (EN)
                            </label>
                            <ReactQuill
                                theme="snow"
                                value={enguiuxDescrip}
                                onChange={(content) => {
                                    // console.log("asdyhjkashdjkhasjkd", content)
                                    setEnguiuxDescrip(content)
                                }}
                                placeholder="Description English"
                            />
                        </div>
                        <div>
                            <label className="">
                                Description (AR)
                            </label>
                            <ReactQuill
                                theme="snow"
                                value={aruiuxDescrip}
                                onChange={(content) => {
                                    // console.log("asdyhjkashdjkhasjkd", content)
                                    setAruiuxDescrip(content)
                                }}
                                placeholder="Description Arabic"
                            />
                        </div>
                    </div>


                </div>
                <div className="panel border-white-light px-3 mb-3 dark:border-[#1b2e4b]">
                    <h5 className="text-lg font-semibold dark:text-white-light">Branding Section</h5>

                    {brandingicon && (
                        <Image width={50} height={50} src={`${!brandingFilePreview ? brandingicon : brandingFilePreview}`} alt="Initial Image" className='w-40 h-40 object-cover' />
                    )}
                    <div className="my-2">
                        <div className="">
                            <label htmlFor="branding-file-input" className="rounded-l-md btn btn-primary w-fit" style={{ cursor: 'pointer' }}>
                                Upload image
                                <input
                                    type="file"
                                    id="branding-file-input"
                                    placeholder="Choose a File"
                                    accept="image/*"
                                    onChange={handleBrandingImageChange}
                                    style={{ display: 'none' }}
                                />
                            </label>
                            {fileName && <p>Selected file: {fileName}</p>}

                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 max-md:gap-2 gap-y-0 max-sm:grid-cols-1 mb-2">
                        <div className="lg:my-2">
                            <div>
                                <label className="">
                                    Title(EN)
                                </label>
                                <input
                                    type="text"
                                    placeholder="Title English"
                                    className="form-input "
                                    name="brandingTitle"
                                    value={formik.values.brandingTitle}
                                    onChange={formik.handleChange}
                                />
                            </div>
                        </div>
                        <div className="lg:my-1">
                            <div>
                                <label className="">
                                    Title(AR)
                                </label>
                                <input
                                    type="text"
                                    placeholder="Title Arabic"
                                    className="form-input "
                                    name="brandingTitleAr"
                                    value={formik.values.brandingTitleAr}
                                    onChange={formik.handleChange}
                                />
                            </div>
                        </div>
                    </div>

                    <div className='grid grid-cols-2 gap-4 max-md:gap-2 max-sm:grid-cols-1'>
                        <div>
                            <label className="">
                                Description (EN)
                            </label>
                            <ReactQuill
                                theme="snow"
                                value={engbrandingDescrip}
                                onChange={(content) => {
                                    // console.log("asdyhjkashdjkhasjkd", content)
                                    setEngbrandingDescrip(content)
                                }}
                                placeholder="Description English"
                            />
                        </div>
                        <div>

                            <label className="">
                                Description (AR)
                            </label>
                            <ReactQuill
                                theme="snow"
                                value={arbrandingDescrip}
                                onChange={(content) => {
                                    // console.log("asdyhjkashdjkhasjkd", content)
                                    setArbrandingDescrip(content)
                                }}
                                placeholder="Description Arabic"
                            />
                        </div>
                    </div>


                </div>
                <div className="panel border-white-light px-3 mb-3 dark:border-[#1b2e4b]">
                    <h5 className="text-lg font-semibold dark:text-white-light">Graphic Designing Section</h5>

                    {graphicIcon && (
                        <Image width={50} height={50} src={`${!graphicDesignFilePreview ? graphicIcon : graphicDesignFilePreview}`} alt="Initial Image" className='w-40 h-40 object-cover' />
                    )}
                    <div className="my-2">
                        <div className="">
                            <label htmlFor="graphics-input" className="rounded-l-md btn btn-primary w-fit" style={{ cursor: 'pointer' }}>
                                Upload image
                                <input
                                    type="file"
                                    id="graphics-input"
                                    placeholder="Choose a File"
                                    accept="image/*"
                                    onChange={handleGraphicDesignImageChange}
                                    style={{ display: 'none' }}
                                />
                            </label>
                            {fileName && <p>Selected file: {fileName}</p>}

                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 max-md:gap-2 gap-y-0 max-sm:grid-cols-1 mb-2">


                        <div className=" lg:my-2">
                            <div>
                                <label className="">
                                    Title (EN)
                                </label>
                                <input type="text" placeholder="Title English" className="form-input " name="graphicDesignTitle"
                                    value={formik.values.graphicDesignTitle}
                                    onChange={formik.handleChange} />
                            </div>
                        </div>
                        <div className=" lg:my-1">
                            <div>
                                <label className="">
                                    Title (AR)
                                </label>
                                <input type="text" placeholder="Title Arabic" name='graphicDesignTitleAr' className="form-input " value={formik.values.graphicDesignTitleAr}
                                    onChange={formik.handleChange} />
                            </div>
                        </div>


                    </div>

                    <div className='grid grid-cols-2 gap-4 max-md:gap-2 max-sm:grid-cols-1 '>
                        <div>
                            <label className="">
                                Description (EN)
                            </label>
                            <ReactQuill
                                theme="snow"
                                value={enggraphicDescrip}
                                onChange={(content) => {
                                    // console.log("asdyhjkashdjkhasjkd", content)
                                    setEnggraphicDescrip(content)
                                }}
                                placeholder="Description English"
                            />
                        </div>
                        <div>
                            <label className="">
                                Description (AR)
                            </label>
                            <ReactQuill
                                theme="snow"
                                value={argraphicDescrip}
                                onChange={(content) => {
                                    // console.log("asdyhjkashdjkhasjkd", content)
                                    setArgraphicDescrip(content)
                                }}
                                placeholder="Description Arabic"
                            />
                        </div>
                    </div>


                </div>
                <div className="panel border-white-light px-3 mb-3 dark:border-[#1b2e4b]">
                    <h5 className="text-lg font-semibold dark:text-white-light">Motion Graphics Designing Section</h5>

                    {motionIcon && (
                        <Image width={50} height={50} src={`${!motionGraphicsFilePreview ? motionIcon : motionGraphicsFilePreview}`} alt="Initial Image" className='w-40 h-40 object-cover' />
                    )}
                    <div className="my-2">
                        <div className="">
                            <label htmlFor="motion-input" className="rounded-l-md btn btn-primary w-fit" style={{ cursor: 'pointer' }}>
                                Upload image
                                <input
                                    type="file"
                                    id="motion-input"
                                    placeholder="Choose a File"
                                    accept="image/*"
                                    onChange={handleMotionGraphicsImageChange}
                                    style={{ display: 'none' }}
                                />
                            </label>
                            {fileName && <p>Selected file: {fileName}</p>}

                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 max-md:gap-2 gap-y-0 max-sm:grid-cols-1 mb-2">


                        <div className=" lg:my-2">
                            <div>
                                <label className="">
                                    Title (EN)
                                </label>
                                <input type="text" placeholder="Title English" name='motionGraphicDesignTitle' className="form-input " value={formik.values.motionGraphicDesignTitle}
                                    onChange={formik.handleChange} />
                            </div>
                        </div>
                        <div className=" lg:my-1">
                            <div>
                                <label className="">
                                    Title (AR)
                                </label>
                                <input type="text" placeholder="Title Arabic" name='motionGraphicDesignTitleAr' className="form-input " value={formik.values.motionGraphicDesignTitleAr}
                                    onChange={formik.handleChange} />
                            </div>
                        </div>


                    </div>

                    <div className='grid grid-cols-2 gap-4 max-md:gap-2 max-sm:grid-cols-1 '>
                        <div>
                            <label className="">
                                Description (EN)
                            </label>
                            <ReactQuill
                                theme="snow"
                                value={engmotionDescrip}
                                onChange={(content) => {
                                    // console.log("asdyhjkashdjkhasjkd", content)
                                    setEngmotionDescrip(content)
                                }}
                                placeholder="Description English"
                            />
                        </div>
                        <div>
                            <label className="">
                                Description (AR)
                            </label>
                            <ReactQuill
                                theme="snow"
                                value={armotionDescrip}
                                onChange={(content) => {
                                    // console.log("asdyhjkashdjkhasjkd", content)
                                    setArmotionDescrip(content)
                                }}
                                placeholder="Description Arabic"
                            />
                        </div>
                    </div>

                </div>
                <button type="submit" className="btn btn-primary !mt-6">
                    Submit Form
                </button>
            </form >
        </>
    )
}

export default MainServices
