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

const Services = (type: any) => {
    const [value, setValue] = useState<any>(''); // Adjusted type if needed
    const [valuear, setValuear] = useState<any>(''); // Adjusted type if needed
    const [tableData, setTableData] = useState<any>(''); // Adjusted type if needed
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
        setCategory(type.type)
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
                console.log(response, 'responseresponse')
                toast.success(response.message)
                fetchData()

            } catch (error: any) {
                toast.error(error.message)
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
        setProcess(value?.ourProcess?.image)

    }, [value, valuear]);

    console.log(value.ourProcess)


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
            console.log('------', value)
            setPrimaryImagePreview(value?.servicePrimaryImage)
        }
    }, []);


    const handleImage = (event: React.ChangeEvent<HTMLInputElement>, imageField: string) => {
        const file = event.currentTarget?.files?.[0];
        if (file) {
            const objectUrl = URL.createObjectURL(file);
            formik.setFieldValue(imageField, file);
            if (imageField === "servicePrimaryImage") {
                setPrimaryImagePreview(objectUrl);
            } else if (imageField === "serviceSecondaryImage") {
                setPreview(objectUrl);
            } else if (imageField === "Processimage") {
                setProcess(objectUrl);
            }
        }
    };
    ////////////////////////////////////
    const handleOpen = () => {
        setOpen(true);
    }
    return (
        <div className="">
            <h2 className="mb-1 flex items-center px-2 py-3 font-extrabold uppercase ">
                <span>
                    {Category == "uiux" ? "UI/UX Design"
                        : Category == "branding" ? "Branding Design"
                            : Category == "graphicdesign" ? "Graphic Design"
                                : Category == "motionGraphic" ? "Motion Graphic Design"
                                    : 'Service'}
                </span>
            </h2>
            <div className="grid grid-cols-1 gap-4 ">

                {/* Section Services */}
                <div className="panel border-white-light px-3 dark:border-[#1b2e4b]">
                    <h5 className="text-lg font-semibold dark:text-white-light">Service Section</h5>
                    <div className="max-lg:gap-2 max-2xl:gap-3 mb-3 grid grid-cols-1 gap-4 lg:grid-cols-2">
                        <div className="my-2">
                            <div>
                                <label className="font-semibold ">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    placeholder="Title English"
                                    className="form-input"
                                    value={formik.values.serviceTitle}
                                    onChange={formik.handleChange}
                                    name="serviceTitle"
                                />
                            </div>
                        </div>
                        <div className="my-2">
                            <div>
                                <label className="font-semibold ">
                                    Title
                                </label>
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
                        <div className="mb-5">
                            <ReactQuill
                                theme="snow"
                                value={formik.values.serviceDescription}
                                onChange={(value) => formik.setFieldValue('serviceDescription', value)}
                            />
                        </div>
                        <div className="mb-5">
                            <ReactQuill
                                theme="snow"
                                value={formik.values.serviceDescriptionAr}
                                onChange={(value) => formik.setFieldValue('serviceDescriptionAr', value)}
                            />
                        </div>



                        <div className='my-2'>
                            <label>
                                Main service Image
                            </label>
                            {primaryImagePreview && (
                                <div className="my-2">
                                    <img src={primaryImagePreview} alt="Preview" className="rounded-lg w-20 h-20 object-cover" />
                                </div>
                            )}
                            <label htmlFor="servicePrimaryImage" className='btn btn-primary w-fit' style={{ cursor: 'pointer' }}>
                                Main service Image
                                <input type="file" className='form-input'
                                    accept='image/*'
                                    id='servicePrimaryImage'
                                    name="servicePrimaryImage"
                                    onChange={(event) => handleImage(event, "servicePrimaryImage")}
                                    style={{ display: 'none' }}
                                />
                            </label>
                        </div>




                        <div className='my-2'>
                            <label>
                                Service Image
                            </label>
                            {preview && (
                                <div className="my-2">
                                    <img src={preview} alt="Preview" className="rounded-lg w-20 h-20 object-cover" />
                                </div>
                            )}
                            <label htmlFor="serviceSecondaryImage" className='btn btn-primary w-fit' style={{ cursor: 'pointer' }}>
                                Service Image
                                <input type="file" className='form-input'
                                    accept='image/*'
                                    id='serviceSecondaryImage'
                                    name="serviceSecondaryImage"
                                    onChange={(event) => handleImage(event, "serviceSecondaryImage")}
                                    style={{ display: 'none' }}
                                />
                            </label>
                        </div>




                    </div>
                </div>

                {/* Section 1 */}
                <div className="panel border-white-light px-3 dark:border-[#1b2e4b]">
                    <h5 className="text-lg font-semibold dark:text-white-light">How We Works Section</h5>
                    <form onSubmit={formik.handleSubmit}>
                        <div className="max-lg:gap-2 max-2xl:gap-3 mb-3 grid grid-cols-1 gap-4 lg:grid-cols-2">
                            <div className="my-2">
                                <div className="">
                                    <label className="font-semibold ">
                                        Title
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Title English"
                                        className="form-input"
                                        value={formik.values.maintitle}
                                        onChange={formik.handleChange}
                                        name="maintitle"
                                    />
                                </div>
                            </div>
                            <div className="my-2">
                                <div>
                                    <label className="font-semibold ">
                                        Title
                                    </label>
                                    <input
                                        type="text"
                                        id='maintitleAr'
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
                                    <label className="font-semibold ">
                                        Subtitle
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Title English"
                                        className="form-input"
                                        value={formik.values.mainSubTitle}
                                        onChange={formik.handleChange}
                                        name="mainSubTitle"
                                    />
                                </div>
                            </div>
                            <div className="my-2">
                                <div>
                                    <label className="font-semibold ">
                                        Subtitle
                                    </label>
                                    <input
                                        type="text"
                                        id='mainSubTitleAr'
                                        name="mainSubTitleAr"
                                        placeholder="Title Arabic"
                                        className="form-input"
                                        value={formik.values.mainSubTitleAr}
                                        onChange={formik.handleChange}
                                    />
                                </div>
                            </div>
                            <div className="mb-5">
                                <ReactQuill
                                    theme="snow"
                                    value={formik.values.mainDescription}
                                    onChange={(value) => formik.setFieldValue('mainDescription', value)}
                                />
                            </div>
                            <div className="mb-5">
                                <ReactQuill
                                    theme="snow"
                                    value={formik.values.mainDescriptionAr}
                                    onChange={(value) => formik.setFieldValue('mainDescriptionAr', value)}
                                />
                            </div>
                        </div>

                        <Workdata type={type} />
                        {/* Section 2 */}
                        <div className="panel border-white-light px-3 dark:border-[#1b2e4b]">
                            <h5 className="text-lg font-semibold dark:text-white-light">Process Section</h5>
                            <div className="max-lg:gap-2 max-2xl:gap-3 mb-3 grid grid-cols-1 gap-4 lg:grid-cols-2">
                                <div className="my-2">
                                    <div>
                                        <label className="font-semibold ">
                                            Title
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Title English"
                                            className="form-input"
                                            value={formik.values.ProcessMainTitle}
                                            onChange={formik.handleChange}
                                            name="ProcessMainTitle"
                                        />
                                    </div>
                                </div>
                                <div className="my-2">
                                    <div>
                                        <label className="font-semibold ">
                                            Title
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Title Arabic"
                                            className="form-input"
                                            value={formik.values.ProcessMainTitleAr}
                                            onChange={formik.handleChange}
                                            name="ProcessMainTitleAr"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="max-lg:gap-2 max-2xl:gap-3 mb-3 grid grid-cols-1 gap-4 lg:grid-cols-2">
                                <div className="my-2">
                                    <div>
                                        <label className="font-semibold ">
                                            Subtitle
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Subtitle English"
                                            className="form-input"
                                            value={formik.values.ProcessMainSubTitle}
                                            onChange={formik.handleChange}
                                            name="ProcessMainSubTitle"
                                        />
                                    </div>
                                </div>
                                <div className="my-2">
                                    <div>
                                        <label className="font-semibold ">
                                            Subtitle
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Subtitle Arabic"
                                            className="form-input"
                                            value={formik.values.ProcessMainSubTitleAr}
                                            onChange={formik.handleChange}
                                            name="ProcessMainSubTitleAr"
                                        />
                                    </div>
                                </div>
                                <div className="mb-5">
                                    <ReactQuill
                                        theme="snow"
                                        value={formik.values.ProcessmainDescription}
                                        onChange={(value) => formik.setFieldValue('ProcessmainDescription', value)}
                                    />
                                </div>
                                <div className="mb-5">
                                    <ReactQuill
                                        theme="snow"
                                        value={formik.values.ProcessmainDescriptionAr}
                                        onChange={(value) => formik.setFieldValue('ProcessmainDescriptionAr', value)}
                                    />
                                </div>

                            </div>


                            <div className='my-2'>
                                <label>
                                    Process Image
                                </label>
                                {process && (
                                    <div className="my-2">
                                        <img src={process} alt="Preview" className="rounded-lg w-20 h-20 object-cover" />
                                    </div>
                                )}
                                <label htmlFor="Processimage" className='btn btn-primary w-fit' style={{ cursor: 'pointer' }}>
                                    Process Image
                                    <input type="file" className='form-input'
                                        accept='image/*'
                                        id='Processimage'
                                        name="Processimage"
                                        onChange={(event) => handleImage(event, "Processimage")}
                                        style={{ display: 'none' }}
                                    />
                                </label>
                            </div>
                            <ProcessData type={type} />
                        </div>

                        {/* Section 3 */}
                        <div className="panel border-white-light px-3 dark:border-[#1b2e4b]">
                            <h5 className="text-lg font-semibold dark:text-white-light">Why Choose Us Section</h5>
                            <div className="max-lg:gap-2 max-2xl:gap-3 mb-3 grid grid-cols-1 gap-4 lg:grid-cols-2">
                                <div className="my-2">
                                    <div>
                                        <label className="font-semibold ">
                                            Title
                                        </label>
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
                                        <label className="font-semibold ">
                                            Title
                                        </label>
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
                            <WhychooseData type={type} />
                            {/* <table>
                                <thead>
                                    <tr>
                                        <th>Icon</th>
                                        <th>Title (EN)</th>
                                        <th>Title (AR)</th>
                                        <th>Description (EN)</th>
                                        <th>Description (AR)</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {value?.whyChooseDesinior?.data.map((item: any, index: number) => (
                                        <tr key={item._id}>
                                            <td>
                                                <img src={item.icon} alt={item.title} width={50} />
                                            </td>
                                            <td>{item.title}</td>
                                            <td>{valuear?.whyChooseDesinior?.data[index]?.title}</td>
                                            <td>{item.description}</td>
                                            <td>{valuear?.whyChooseDesinior?.data[index]?.description}</td>
                                            <td className='flex items-center'>
                                                <div>
                                                    <IconPencil />
                                                </div>
                                                <div>
                                                    <IconTrash />
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table> */}
                        </div>


                        <button
                            type="submit"
                            className="mt-4 rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                        >
                            Save
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Services;