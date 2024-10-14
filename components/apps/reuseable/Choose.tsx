'use client';
import React, { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useFormik } from 'formik';
import { GetServices, submitChooseData, submitServiceData } from '@/components/utils/Helper';
import toast from 'react-hot-toast';
import Workdata from './Workdata';
import ProcessData from './ProcessData';
import WhychooseData from './WhychooseData';
import MainService from './MainService';
import MainWeWork from './MainWeWork';
import MainProcess from './MainProcess';

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

const MainChoose = (type: any) => {
    const [value, setValue] = useState<any>(''); // Adjusted type if needed
    const [valuear, setValuear] = useState<any>(''); // Adjusted type if needed
    const [tableData, setTableData] = useState<any>(''); // Adjusted type if needed
    const [edit, setEdit] = useState(false); // Adjusted type if needed
    const [open, setOpen] = useState(false);
    const [workdata, setWorkdata] = useState<any>();
    const [isEditMode, setIsEditMode] = useState<boolean>(false);
    const [preview, setPreview] = useState<any>(null);
    const [process, setProcess] = useState<any>(null);
    const [primaryImagePreview, setPrimaryImagePreview] = useState<any>(null);
    const [Category, setCategory] = useState();

    const fetchData = async () => {
        try {
            const result = await GetServices(type);

            setValue(result.data[0].data.en);

            setValuear(result.data[0].data.ar);
            setTableData(result.data[0].data);
        } catch (error) {
            console.error('Failed to fetch data:', error);
        }
    };

    useEffect(() => {
        setCategory(type.type);
        fetchData();
    }, [type]);

    const formik = useFormik({
        initialValues: {
            type: type.type,
            whyChooseDesinior: '',
            whyChooseDesiniorAr: '',
        },
        onSubmit: async (values) => {
            try {
                const response = await submitChooseData(values, type);
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
            type: type.type,
            whyChooseDesinior: value?.whyChooseDesinior?.mainTitle || '',
            whyChooseDesiniorAr: valuear?.whyChooseDesinior?.mainTitle || '',
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
                whyChooseDesinior: value?.whyChooseDesinior?.mainTitle,
                whyChooseDesiniorAr: valuear?.whyChooseDesinior?.mainTitle,
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
    const handleOpen = () => {
        setOpen(true);
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
                {/* Section 1 */}
                <div className="panel border-white-light px-3 dark:border-[#1b2e4b]">
                    <form onSubmit={formik.handleSubmit}>
                        <input className="form-input" readOnly disabled name="type" value={type.type} placeholder="Type" />
                        <div className="panel border-white-light px-3 dark:border-[#1b2e4b]">
                            <h5 className="text-lg font-semibold dark:text-white-light">Why Choose Us Section</h5>
                            <div className="max-lg:gap-2 max-2xl:gap-3 mb-3 grid grid-cols-1 gap-4 lg:grid-cols-2">
                                <div className="my-2">
                                    <div>
                                        <label className="font-semibold ">Title</label>
                                        <input
                                            type="text"
                                            placeholder="Title English"
                                            className="form-input"
                                            value={formik.values.whyChooseDesinior}
                                            onChange={formik.handleChange}
                                            name="whyChooseDesinior"
                                        />
                                    </div>
                                </div>
                                <div className="my-2">
                                    <div>
                                        <label className="font-semibold ">Title</label>
                                        <input
                                            type="text"
                                            placeholder="Title Arabic"
                                            className="form-input"
                                            value={formik.values.whyChooseDesiniorAr}
                                            onChange={formik.handleChange}
                                            name="whyChooseDesiniorAr"
                                        />
                                    </div>
                                </div>
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

export default MainChoose;
