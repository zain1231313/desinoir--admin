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
import MainService from './MainService';
import MainWeWork from './MainWeWork';
import MainProcess from './MainProcess';
import MainChoose from './Choose';

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

const Services = () => {
    const [value, setValue] = useState<any>(''); // Adjusted type if needed
    const [edit, setEdit] = useState(false); // Adjusted type if needed
    const [type, setType] = useState('uiux');
    const [valuear, setValuear] = useState<any>(''); // Adjusted type if needed
    const [tableData, setTableData] = useState<any>(''); // Adjusted type if needed
    const [open, setOpen] = useState(false);
    const [workdata, setWorkdata] = useState<any>();
    const [isEditMode, setIsEditMode] = useState<boolean>(false);
    const [preview, setPreview] = useState<any>(null);
    const [process, setProcess] = useState<any>(null);
    const [primaryImagePreview, setPrimaryImagePreview] = useState<any>(null);
    const [Category, setCategory] = useState<string | undefined>();

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
        setCategory(type);
        fetchData();
    }, [type]);

    const formik = useFormik({
        initialValues: {
            type: type,
            servicePrimaryImage: '',
            serviceSecondaryImage: '',
            serviceTitle: '',
            serviceTitleAr: '',
            serviceDescription: '',
            serviceDescriptionAr: '',

            maintitle: '',
            maintitleAr: '',
            mainSubTitle: '',
            mainSubTitleAr: '',
            mainDescription: '',
            mainDescriptionAr: '',

            ProcessMainTitle: '',
            ProcessMainTitleAr: '',
            ProcessMainSubTitle: '',
            ProcessMainSubTitleAr: '',
            ProcessmainDescription: '',
            ProcessmainDescriptionAr: '',
            Processimage: '',
            whyChooseDesinior: '',
            whyChooseDesiniorAr: '',
        },
        onSubmit: async (values) => {
            try {
                const response = await submitServiceData(values, type);
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
            /////////////////
            maintitle: value?.howWorks?.mainTitle || '',
            maintitleAr: valuear?.howWorks?.mainTitle || '',
            mainSubTitle: value?.howWorks?.mainSubTitle || '',
            mainSubTitleAr: valuear?.howWorks?.mainSubTitle || '',
            mainDescription: value?.howWorks?.mainDescription || '',
            mainDescriptionAr: valuear?.howWorks?.mainDescription || '',
            /////////////////
            ProcessMainTitle: value?.ourProcess?.mainTitle || '',
            ProcessMainTitleAr: valuear?.ourProcess?.mainTitle || '',
            ProcessMainSubTitle: value?.ourProcess?.mainSubTitle || '',
            ProcessMainSubTitleAr: valuear?.ourProcess?.mainSubTitle || '',
            ProcessmainDescription: value?.ourProcess?.mainDescription || '',
            ProcessmainDescriptionAr: valuear?.ourProcess?.mainDescription || '',
            /////////////////

            Processimage: value?.ourProcess?.image || '',

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
                serviceTitle: value?.serviceTitle,
                serviceTitleAr: valuear?.serviceTitle,
                serviceDescription: value?.serviceDescription,
                serviceDescriptionAr: valuear?.serviceDescription,
                maintitle: value?.howWorks?.mainTitle,
                maintitleAr: valuear?.howWorks?.mainTitle,
                mainSubTitle: value?.howWorks?.mainSubTitle,
                mainSubTitleAr: valuear?.howWorks?.mainSubTitle,
                mainDescription: value?.howWorks?.mainDescription,
                mainDescriptionAr: valuear?.howWorks?.mainDescription,
                ProcessMainTitle: value?.ourProcess?.mainTitle,
                ProcessMainTitleAr: valuear?.ourProcess?.mainTitle,
                ProcessMainSubTitle: value?.ourProcess?.mainSubTitle,
                ProcessMainSubTitleAr: valuear?.ourProcess?.mainSubTitle,
                ProcessmainDescription: value?.ourProcess?.mainDescription,
                ProcessmainDescriptionAr: valuear?.ourProcess?.mainDescription,
                Processimage: value?.ourProcess?.image,

                servicePrimaryImage: value?.servicePrimaryImage,
                serviceSecondaryImage: value?.serviceSecondaryImage,
                whyChooseDesinior: value?.whyChooseDesinior?.mainTitle,
                whyChooseDesiniorAr: valuear?.whyChooseDesinior?.mainTitle,
            });
            console.log('------', value);
            setPrimaryImagePreview(value?.servicePrimaryImage);
        }
    }, []);

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
            <div>
                {edit ? (
                    <input className="form-input" readOnly disabled name="type" value={formik.values.type} placeholder="Type" />
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
            <div className="grid grid-cols-1 gap-4 ">
                {/* <MainService type={type} /> */}
                <div className="panel border-white-light px-3 dark:border-[#1b2e4b]">
                    <MainWeWork type={type} />

                    <Workdata type={type} />
                    <div className="panel border-white-light px-3 dark:border-[#1b2e4b]">
                        <MainProcess type={type} />
                        <ProcessData type={type} />
                    </div>
                    <MainChoose type={type} />
                    <WhychooseData type={type} />
                </div>
            </div>
        </div>
    );
};

export default Services;
