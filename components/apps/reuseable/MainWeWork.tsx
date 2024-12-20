'use client';
import React, { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useFormik } from 'formik';
import { fetchType, GetServices, submitServiceData, weWorkSubmitData } from '@/components/utils/Helper';
import toast from 'react-hot-toast';
import Workdata from './Workdata';
import ProcessData from './ProcessData';
import WhychooseData from './WhychooseData';
import MainService from './MainService';

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
interface OptionType {
    _id: string;
    type: string;
}

const MainWeWork = (type: any) => {
    const [value, setValue] = useState<any>('');
    const [edit, setEdit] = useState(false);
    const [valuear, setValuear] = useState<any>('');
    const [tableData, setTableData] = useState<any>('');
    const [open, setOpen] = useState(false);
    const [preview, setPreview] = useState<any>(null);
    const [process, setProcess] = useState<any>(null);
    const [types, setTypes] = useState<[]>([]);
    const [selecttype, setSelectType] = useState<OptionType | undefined>();
    const [primaryImagePreview, setPrimaryImagePreview] = useState<any>(null);
    const [Category, setCategory] = useState<string | undefined>();

    const fetchData = async () => {
        try {
            const result = await GetServices(type.type._id);
            setValue(result.data[0].data.en);
            // const typeData = await fetchType();
            // setTypes(typeData?.data);
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
            maintitle: '',
            maintitleAr: '',
            mainSubTitle: '',
            mainSubTitleAr: '',
            mainDescription: '',
            mainDescriptionAr: '',
        },
        onSubmit: async (values) => {
            console.log('We Work=>', type);
            try {
                const response = await weWorkSubmitData(values, type?.type?._id);
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
            type: '',
            maintitle: value?.howWorks?.mainTitle || '',
            maintitleAr: valuear?.howWorks?.mainTitle || '',
            mainSubTitle: value?.howWorks?.mainSubTitle || '',
            mainSubTitleAr: valuear?.howWorks?.mainSubTitle || '',
            mainDescription: value?.howWorks?.mainDescription || '',
            mainDescriptionAr: valuear?.howWorks?.mainDescription || '',
        });
        setPrimaryImagePreview(value?.servicePrimaryImage);
        setPreview(value?.serviceSecondaryImage);
        setProcess(value?.ourProcess?.image);
    }, [value, valuear]);

    useEffect(() => {
        if (value && valuear) {
            console.log('Get==>', value);
            formik.setValues({
                type: ``,
                maintitle: value?.howWorks?.mainTitle,
                maintitleAr: valuear?.howWorks?.mainTitle,
                mainSubTitle: value?.howWorks?.mainSubTitle,
                mainSubTitleAr: valuear?.howWorks?.mainSubTitle,
                mainDescription: value?.howWorks?.mainDescription,
                mainDescriptionAr: valuear?.howWorks?.mainDescription,
            });
            console.log('------', value);
            setPrimaryImagePreview(value?.servicePrimaryImage);
        }
    }, []);

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
                <div className="panel border-white-light px-3 dark:border-[#1b2e4b]">
                    <h5 className="text-lg font-semibold dark:text-white-light">How We Works Section</h5>
                    <form onSubmit={formik.handleSubmit}>
                        <div className="max-lg:gap-2 max-2xl:gap-3 mb-3 grid grid-cols-1 gap-4 lg:grid-cols-2">
                            <div className="my-2">
                                <div className="">
                                    <label className="font-semibold ">Title</label>
                                    <input type="text" placeholder="Title English" className="form-input" value={formik.values.maintitle} onChange={formik.handleChange} name="maintitle" />
                                </div>
                            </div>
                            <div className="my-2">
                                <div>
                                    <label className="font-semibold ">Title</label>
                                    <input
                                        type="text"
                                        id="maintitleAr"
                                        name="maintitleAr"
                                        placeholder="Title Arabic"
                                        className="form-input"
                                        value={formik.values.maintitleAr}
                                        onChange={formik.handleChange}
                                    />
                                </div>
                            </div>
                            <div className="my-2">
                                <div className="">
                                    <label className="font-semibold ">Subtitle</label>
                                    <input type="text" placeholder="Title English" className="form-input" value={formik.values.mainSubTitle} onChange={formik.handleChange} name="mainSubTitle" />
                                </div>
                            </div>
                            <div className="my-2">
                                <div>
                                    <label className="font-semibold ">Subtitle</label>
                                    <input
                                        type="text"
                                        id="mainSubTitleAr"
                                        name="mainSubTitleAr"
                                        placeholder="Title Arabic"
                                        className="form-input"
                                        value={formik.values.mainSubTitleAr}
                                        onChange={formik.handleChange}
                                    />
                                </div>
                            </div>
                            <div className="mb-5">
                                <ReactQuill theme="snow" value={formik.values.mainDescription} onChange={(value) => formik.setFieldValue('mainDescription', value)} />
                            </div>
                            <div className="mb-5">
                                <ReactQuill theme="snow" value={formik.values.mainDescriptionAr} onChange={(value) => formik.setFieldValue('mainDescriptionAr', value)} />
                            </div>
                        </div>

                        <button type="submit" className="mt-4 btn bg-[#20D091] border-none text-white ml-auto">
                            Save
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default MainWeWork;
