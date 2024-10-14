'use client';
import React, { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useFormik } from 'formik';
import { GetServices, submitServiceData } from '@/components/utils/Helper';
import toast from 'react-hot-toast';
import Workdata from './Workdata';
import ProcessData from './ProcessData';
import WhychooseData from './WhychooseData';
import Image from 'next/image';

interface WorkData {
    workIcon: string;
    workTitle: string;
    workDescription: string;
    _id: string;
}

interface ProcessData {
    process: string;
    explain: string;
    _id: string;
}

interface WhyChooseData {
    icon: string;
    title: string;
    description: string;
    _id: string;
}

interface ServiceData {
    howWorks: {
        mainTitle: string;
        mainSubTitle: string;
        mainDescription: string;
        data: WorkData[];
    };
    ourProcess: {
        mainTitle: string;
        mainSubTitle: string;
        mainDescription: string;
        image: string;
        data: ProcessData[];
    };
    whyChooseDesinior: {
        mainTitle: string;
        data: WhyChooseData[];
    };
    serviceTitle: string;
    serviceDescription: string;
    servicePrimaryImage: string;
    serviceSecondaryImage: string;
}
interface ServicesProps {
    type: any;
}

interface SelectedRowDataType {
    enItem: {
        icon: string;
        title: string;
        description: string;
    };
    arItem: {
        icon: string;
        title: string;
        description: string;
    };
}

const MainService = () => {
    const [value, setValue] = useState<any>('');
    const [edit, setEdit] = useState(false); // Adjusted type if needed
    const [valuear, setValuear] = useState<any>(''); // Adjusted type if needed
    const [tableData, setTableData] = useState<any>(''); // Adjusted type if needed
    const [open, setOpen] = useState(false);
    const [type, setType] = useState('uiux');
    const [workdata, setWorkdata] = useState<any>();
    const [isEditMode, setIsEditMode] = useState<boolean>(false);
    const [preview, setPreview] = useState<any>(null);
    const [process, setProcess] = useState<any>(null);
    const [primaryImagePreview, setPrimaryImagePreview] = useState<any>(null);
    const [Category, setCategory] = useState<string | undefined>();

    const fetchData = async () => {
        try {
            const result = await GetServices(type);
            console.log('Header=>', result);

            setValue(result.data[0].data.en);

            setValuear(result.data[0].data.ar);
            setTableData(result.data[0].data);
        } catch (error) {
            console.error('Failed to fetch data:', error);
        }
    };

    useEffect(() => {
        setCategory(type);
        fetchData();
    }, [type]);

    const formik = useFormik({
        initialValues: {
            type: '',
            servicePrimaryImage: '',
            serviceSecondaryImage: '',
            serviceTitle: '',
            serviceTitleAr: '',
            serviceDescription: '',
            serviceDescriptionAr: '',
        },
        onSubmit: async (values) => {
            console.log('Vlaues==>', values);
            try {
                const response = await submitServiceData(values, values.type);
                console.log(response, 'responseresponse');
                toast.success(response.message);
                fetchData();
            } catch (error: any) {
                toast.error(error.message);
            }
        },
    });

    useEffect(() => {
        formik.setValues({
            type: type,
            servicePrimaryImage: value?.servicePrimaryImage || '',
            serviceSecondaryImage: value?.serviceSecondaryImage || '',
            serviceTitle: value?.serviceTitle || '',
            serviceTitleAr: valuear?.serviceTitle || '',
            serviceDescription: value?.serviceDescription || '',
            serviceDescriptionAr: valuear?.serviceDescription || '',
        });
        setPrimaryImagePreview(value?.servicePrimaryImage);
        setPreview(value?.serviceSecondaryImage);
        setProcess(value?.ourProcess?.image);
    }, [value, valuear]);

    console.log(value.ourProcess);

    useEffect(() => {
        if (value && valuear) {
            formik.setValues({
                type: `${type}`,
                serviceTitle: value?.serviceTitle,
                serviceTitleAr: valuear?.serviceTitle,
                serviceDescription: value?.serviceDescription,
                serviceDescriptionAr: valuear?.serviceDescription,
                servicePrimaryImage: value?.servicePrimaryImage,
                serviceSecondaryImage: value?.serviceSecondaryImage,
            });
            console.log('------', value);
            setPrimaryImagePreview(value?.servicePrimaryImage);
        }
    }, []);

    const handleImage = (event: React.ChangeEvent<HTMLInputElement>, imageField: string) => {
        const file = event.currentTarget?.files?.[0];
        if (file) {
            const objectUrl = URL.createObjectURL(file);
            formik.setFieldValue(imageField, file);
            if (imageField === 'servicePrimaryImage') {
                setPrimaryImagePreview(objectUrl);
            } else if (imageField === 'serviceSecondaryImage') {
                setPreview(objectUrl);
            } else if (imageField === 'Processimage') {
                setProcess(objectUrl);
            }
        }
    };
    ////////////////////////////////////

    const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setType(event.target.value); // Select type and update state
    };
    return (
        <div className="">
            <h2 className="mb-1 flex items-center px-2 py-3 font-extrabold uppercase ">
                <span>
                    {Category == 'uiux'
                        ? 'UI/UX Design'
                        : Category == 'branding'
                        ? 'Branding Design'
                        : Category == 'graphicdesign'
                        ? 'Graphic Design'
                        : Category == 'motionGraphic'
                        ? 'Motion Graphic Design'
                        : 'Service'}
                </span>
            </h2>
            <div className="grid grid-cols-1 gap-4 ">
                {/* Section Services */}
                <div className="panel border-white-light px-3 dark:border-[#1b2e4b]">
                    <div>
                        {edit ? (
                            <input className="form-input" readOnly disabled name="type" value={type} placeholder="Type" />
                        ) : (
                            <div>
                                <select className="form-select" value={type} onChange={handleTypeChange} name="type">
                                    <option value="">Select type</option>
                                    <option value="uiux">UI/UX</option>
                                    <option value="branding">Branding</option>
                                    <option value="motionGraphic">Motion Graphic</option>
                                    <option value="graphicdesign">Graphic Design</option>
                                </select>
                            </div>
                        )}
                    </div>
                    <h5 className="text-lg font-semibold dark:text-white-light">Service Section</h5>
                    <form onSubmit={formik.handleSubmit}>
                        <div className="max-lg:gap-2 max-2xl:gap-3 mb-3 grid grid-cols-1 gap-4 lg:grid-cols-1">
                            {edit ? (
                                <>
                                    <label className="font-semibold ">Serive Type</label>
                                    <input className="form-input" readOnly disabled name="type" value={formik.values.type} placeholder="Type" />
                                </>
                            ) : (
                                <select className="form-select" value={formik.values.type} onChange={formik.handleChange} name="type">
                                    <option value="">Select type</option>
                                    <option value="uiux">Ui/Ux</option>
                                    <option value="branding">Branding</option>
                                    <option value="motiongraphic">Motion Graphic</option>
                                    <option value="graphicdesign">Graphic Design</option>
                                </select>
                            )}
                            <div className="flex w-full gap-2">
                                <div className="my-2 w-full">
                                    <div>
                                        <label className="font-semibold ">Title</label>
                                        <input type="text" placeholder="Title English" className="form-input" value={formik.values.serviceTitle} onChange={formik.handleChange} name="serviceTitle" />
                                    </div>
                                </div>
                                <div className="my-2 w-full ">
                                    <div>
                                        <label className="font-semibold ">Title</label>
                                        <input
                                            type="text"
                                            placeholder="Title Arabic"
                                            className="form-input"
                                            value={formik.values.serviceTitleAr}
                                            onChange={formik.handleChange}
                                            name="serviceTitleAr"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="mb-5">
                                <ReactQuill theme="snow" value={formik.values.serviceDescription} onChange={(value) => formik.setFieldValue('serviceDescription', value)} />
                            </div>
                            <div className="mb-5">
                                <ReactQuill theme="snow" value={formik.values.serviceDescriptionAr} onChange={(value) => formik.setFieldValue('serviceDescriptionAr', value)} />
                            </div>

                            <div className="my-2">
                                <label>Main service Image</label>
                                {primaryImagePreview && (
                                    <div className="my-2">
                                        <Image width={50} height={50} src={primaryImagePreview} alt="Preview" className="h-20 w-20 rounded-lg object-cover" />
                                    </div>
                                )}
                                <label htmlFor="servicePrimaryImage" className="btn btn-primary w-fit" style={{ cursor: 'pointer' }}>
                                    Main service Image
                                    <input
                                        type="file"
                                        className="form-input"
                                        accept="image/*"
                                        id="servicePrimaryImage"
                                        name="servicePrimaryImage"
                                        onChange={(event) => handleImage(event, 'servicePrimaryImage')}
                                        style={{ display: 'none' }}
                                    />
                                </label>
                            </div>

                            <div className="my-2">
                                <label>Service Image</label>
                                {preview && (
                                    <div className="my-2">
                                        <Image width={50} height={50} src={preview} alt="Preview" className="h-20 w-20 rounded-lg object-cover" />
                                    </div>
                                )}
                                <label htmlFor="serviceSecondaryImage" className="btn btn-primary w-fit" style={{ cursor: 'pointer' }}>
                                    Service Image
                                    <input
                                        type="file"
                                        className="form-input"
                                        accept="image/*"
                                        id="serviceSecondaryImage"
                                        name="serviceSecondaryImage"
                                        onChange={(event) => handleImage(event, 'serviceSecondaryImage')}
                                        style={{ display: 'none' }}
                                    />
                                </label>
                            </div>
                        </div>
                        <button type="submit" className="mt-4 rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
                            Save
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default MainService;
