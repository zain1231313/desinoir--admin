'use client';
import React, { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useFormik } from 'formik';
import { GetServices, GetTeamHeader, submitServiceData, submitTeamHeader } from '@/components/utils/Helper';
import toast from 'react-hot-toast';
import Workdata from './Workdata';
import ProcessData from './ProcessData';
import WhychooseData from './WhychooseData';

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

const TeamHeader = () => {
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
            const resultEN = await GetTeamHeader('en');
            console.log('Team Header=>', resultEN);
            setValue(resultEN.data[0]);
            const resultAR = await GetTeamHeader('ar');
            setValuear(resultAR.data[0]);
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
            enTitle: '',
            arTitle: '',
            enSubTitle: '',
            arSubTitle: '',
            servicePrimaryImage: '',
        },
        onSubmit: async (values) => {
            console.log('Vlaues==>', values);
            try {
                const response = await submitTeamHeader(values);
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
            servicePrimaryImage: value?.emoji || '',
            enTitle: value?.title || '',
            arTitle: valuear?.title || '',
            enSubTitle: value?.subTitle || '',
            arSubTitle: valuear?.subTitle || '',
        });
        setPrimaryImagePreview(value?.emoji);
    }, [value, valuear]);

    useEffect(() => {
        if (value && valuear) {
            formik.setValues({
                enTitle: value?.title,
                arTitle: valuear?.title,
                enSubTitle: value?.subTitle,
                arSubTitle: valuear?.subTitle,
                servicePrimaryImage: value?.emoji,
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
            }
        }
    };
    ////////////////////////////////////

    const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setType(event.target.value); // Select type and update state
    };
    return (
        <div className="">
            <div className="grid grid-cols-1 gap-4 ">
                {/* Section Services */}
                <div className="panel border-white-light px-3 dark:border-[#1b2e4b]">
                    <form onSubmit={formik.handleSubmit}>
                        <div className="max-lg:gap-2 max-2xl:gap-3 mb-3 grid grid-cols-1 gap-4 lg:grid-cols-1">
                            <div className="flex w-full gap-2">
                                <div className="my-2 w-full">
                                    <div>
                                        <label className="font-semibold ">Title</label>
                                        <input type="text" placeholder="Title English" className="form-input" value={formik.values.enTitle} onChange={formik.handleChange} name="enTitle" />
                                    </div>
                                </div>
                                <div className="my-2 w-full ">
                                    <div>
                                        <label className="font-semibold ">Title</label>
                                        <input type="text" placeholder="Title Arabic" className="form-input" value={formik.values.arTitle} onChange={formik.handleChange} name="arTitle" />
                                    </div>
                                </div>
                            </div>
                            <div className="flex w-full gap-2">
                                <div className="mb-5 w-full">
                                    <label className="font-semibold ">SubTitle</label>
                                    <input type="text" placeholder="SubTitle English" className="form-input" value={formik.values.enSubTitle} name="enSubTitle" onChange={formik.handleChange} />
                                </div>
                                <div className="mb-5 w-full">
                                    <label className="font-semibold ">SubTitle</label>
                                    <input type="text" placeholder="SubTitle Arabic" className="form-input" value={formik.values.arSubTitle} name="arSubTitle" onChange={formik.handleChange} />
                                </div>
                            </div>

                            <div className="my-2">
                                <label>Emoji Image</label>
                                {primaryImagePreview && (
                                    <div className="my-2">
                                        <img src={primaryImagePreview} alt="Preview" className="h-20 w-20 rounded-lg object-cover" />
                                    </div>
                                )}
                                <label htmlFor="servicePrimaryImage" className="btn btn-primary w-fit" style={{ cursor: 'pointer' }}>
                                    Emoji Image
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
                        </div>
                        <button type="submit" className="btn bg-[#20D091] border-none text-white ml-auto">
                            Save
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default TeamHeader;
