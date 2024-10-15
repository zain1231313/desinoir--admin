'use client';
import IconPencil from '@/components/icon/icon-pencil';
import IconTrash from '@/components/icon/icon-trash';
import { addServiceData, addWorkData, deleteServiceData, GetServices, updateServiceData } from '@/components/utils/Helper';
import { Button, Dialog, DialogBody, DialogFooter, DialogHeader } from '@material-tailwind/react';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import $ from 'jquery';
import 'datatables.net';
import { workDataSchema } from '@/components/schema/schema';
import DeleteModal from '@/components/Modals/DeleteModal';
import Image from 'next/image';
import { result } from 'lodash';

const Workdata = (type: any) => {
    const [tableData, setTableData] = useState<any>(''); // Adjusted type if needed
    const [open, setOpen] = useState(false);
    const [workdata, setWorkdata] = useState<any>();
    const [isEditMode, setIsEditMode] = useState<boolean>(false);
    const [preview, setPreview] = useState<any>();
    const [modelData, setModelData] = useState<any>();
    const [workId, setWorkId] = useState<any>();
    const [arWorkId, setArworkId] = useState<any>();
    const [openDel, setOpenDel] = useState(false);
    const [edit, setEdit] = useState(false); // Adjusted type if needed
    const fetchData = async () => {
        try {
            console.log('data fetched ');
            const result = await GetServices(type);
            console.log('Words Data==>', result);
            const datamap = result?.data?.map((item: any, index: number) => {
                const mapLanguageData = (langData: any, lang: string) => {
                    return langData?.map((item2: any) => {
                        const { workIcon, workTitle, workDescription, _id } = item2;
                        return {
                            id: _id,
                            icon: workIcon,
                            title: workTitle,
                            description: workDescription,
                            language: lang,
                        };
                    });
                };

                const arData = mapLanguageData(item?.data?.ar?.howWorks?.data, 'ar');
                const enData = mapLanguageData(item?.data?.en?.howWorks?.data, 'en');

                return {
                    arData,
                    enData,
                };
            });
            setWorkdata(datamap);
            setTableData(result.data[0].data);
        } catch (error) {
            console.error('Failed to fetch data:', error);
        }
    };

    useEffect(() => {
        if (workdata) {
            if ($.fn.dataTable.isDataTable('#workTable')) {
                $('#workTable').DataTable().destroy();
            }

            $('#workTable').DataTable({
                paging: true,
                searching: true,
                ordering: false,
                info: false,
            });
        }
    }, [workdata, type]);

    useEffect(() => {
        fetchData();
    }, [type]);

    const handleOpen = () => {
        setOpen(true);
    };
    const formik = useFormik({
        initialValues: {
            workIcon: null,
            workTitleEn: '',
            workTitleAr: '',
            workDescriptionEn: '',
            workDescriptionAr: '',
            workId: '',
            workArId: '',
            type: type.type,
        },
        validationSchema: workDataSchema,
        enableReinitialize: true,
        onSubmit: async (values) => {
            try {
                if (!isEditMode) {
                    console.log('edit mode is off');

                    const howWorksData = [
                        {
                            workTitle: values.workTitleEn,
                            workDescription: values.workDescriptionEn,
                        },
                    ];

                    const arHowWorksData = [
                        {
                            workTitle: values.workTitleAr,
                            workDescription: values.workDescriptionAr,
                        },
                    ];

                    // Make the API call with helper function
                    const result = await addWorkData(values.workIcon, values.type, howWorksData, arHowWorksData);
                    fetchData();
                    formik.resetForm();
                    setOpen(false);
                    console.log('API response:', result);
                    toast.success(result.message);
                } else {
                    console.log('edit mode is on');

                    // Prepare data for update
                    const serviceData = {
                        howWorksData: JSON.stringify({
                            workTitle: values.workTitleEn,
                            workDescription: values.workDescriptionEn,
                        }),
                        arHowWorksData: JSON.stringify({
                            workTitle: values.workTitleAr,
                            workDescription: values.workDescriptionAr,
                        }),
                        workId: values.workId,
                        workarId: values.workArId,
                        workIcon: values.workIcon,
                        type: values.type,
                        // processData: '',  // Include actual values if needed
                        // arProcessData: '',
                        // whyChooseData: '',  // Include actual values if needed
                        // arWhyChooseData: '',
                        // processId: '', // Include actual values if needed
                    };
                    // console.log(type.type.type);
                    // Make the API call with the update helper function
                    const result = await updateServiceData(serviceData);
                    console.log('ressiljadhshfjksadhadksujkds', result);
                    fetchData();
                    console.log('fetch ke neeche', result);
                    setOpen(false);
                    if (result.success === true) {
                        toast.success(result.message);
                    } else {
                        toast.error(result.message);
                    }
                }
            } catch (error: any) {
                toast.error(error.message);
                console.error('Error submitting the form:', error);
            }
        },
    });

    useEffect(() => {
        if (isEditMode && modelData) {
            formik.setValues({
                ...formik.values,
                workId: modelData?.work?.id || '',
                workArId: modelData?.work2?.id || '',
                workIcon: modelData?.work?.workIcon || '',
                workTitleEn: modelData?.work?.title || '',
                workTitleAr: modelData?.work2?.title || '',
                workDescriptionEn: modelData?.work?.description || '',
                workDescriptionAr: modelData?.work2?.description || '',
            });
        } else {
            formik.resetForm();
        }
    }, [isEditMode, modelData]);

    // Handling file input
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.currentTarget.files?.[0];
        if (file) {
            // Set the file in Formik state
            formik.setFieldValue('workIcon', file);

            // Use FileReader to read the file and create a data URL for the preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string); // Set the result (base64 data URL) for the preview
            };
            reader.readAsDataURL(file); // Read the file as a data URL
        }
    };

    const handleDeletemodal = async () => {
        try {
            const result = await deleteServiceData(workId, arWorkId);

            toast.success(result.message);
            setOpenDel(false);
            fetchData();
            window.location.reload()

        } catch (error) {
            setOpenDel(false);
            toast.error('Failed to delete Work Item');
            console.error('Deletion error:', error);
        }
    };

    return (
        <div>
            <div>
                <button
                    type="button"
                    className="btn btn-primary my-2 ml-auto"
                    onClick={() => {
                        setIsEditMode(false);
                        setPreview(null);
                        handleOpen();
                    }}
                >
                    Add
                </button>
            </div>
            <div className="w-full overflow-x-scroll">
                <table id="workTable">
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
                        {workdata?.map((work: any, index: number) => {
                            // Get the maximum length of enData and arData
                            const maxLength = Math.max(work.enData?.length || 0, work.arData?.length || 0);

                            // Create an array with the maximum length to ensure all rows are covered
                            return Array.from({ length: maxLength }).map((_, index: number) => {
                                const enItem = work.enData ? work.enData[index] : null;
                                const arItem = work.arData ? work.arData[index] : null;

                                const handleEdit = (work: any, work2: any) => {
                                    // setSelectedRowData(work);
                                    console.log('work', work);
                                    console.log('work', work2);
                                    setIsEditMode(true);
                                    setModelData({ work, work2 });

                                    setOpen(true); // Open the dialog
                                    // setCurrentIndex(index);
                                };

                                const handleDelete = async (data: any, data2: any) => {
                                    setOpenDel(true);
                                    setWorkId(data);
                                    setArworkId(data2);
                                };
                                return (
                                    <tr key={index}>
                                        <td>{enItem ? <Image width={1000} height={1000} src={enItem.icon} alt={enItem.title} className="h-12 w-12 rounded-full object-cover" /> : null}</td>
                                        <td>{enItem ? enItem.title : null}</td>
                                        <td>{arItem ? arItem.title : null}</td>
                                        <td>{enItem ? enItem.description : null}</td>
                                        <td>{arItem ? arItem.description : null}</td>

                                        <td>
                                            <div className="flex items-center justify-center">
                                                <div onClick={() => handleEdit(enItem, arItem)} className="cursor-pointer">
                                                    <IconPencil />
                                                </div>

                                                <div onClick={() => handleDelete(enItem?.id, arItem?.id)} className="cursor-pointer">
                                                    <IconTrash />
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            });
                        })}
                    </tbody>
                </table>
            </div>

            <Dialog open={open} handler={() => setOpen(false)} className="h-fit dark:bg-[#060818]">
                <DialogHeader>{isEditMode ? 'Edit Work' : 'Add Work'}</DialogHeader>
                <DialogBody>
                    <form onSubmit={formik.handleSubmit}>
                        <div>
                            <label htmlFor="workIcon">Icon</label>
                            {/* Preview the uploaded or current image */}
                            {preview && (
                                <div className="mt-2">
                                    <Image width={1000} height={1000} src={preview} alt="Preview" className="h-16 w-16 object-cover" />
                                </div>
                            )}
                            {/* In Edit mode, show the existing image if no new image is uploaded */}
                            {isEditMode && !preview && modelData?.work?.icon && (
                                <div className="mt-2">
                                    <Image width={1000} height={1000}
                                        src={modelData.work.icon} // Existing image from the server
                                        alt="Current Icon"
                                        className="h-16 w-16 object-cover"
                                    />
                                </div>
                            )}
                            <label htmlFor="workIcon" className="btn btn-primary mt-2 w-fit" style={{ cursor: 'pointer' }}>
                                Choose Image
                                <input type="file" id="workIcon" name="workIcon" accept="image/*" className="form-input" onChange={(event) => handleFileChange(event)} style={{ display: 'none' }} />
                            </label>
                        </div>
                        <input className="form-input" readOnly disabled name="type" value={type.type} placeholder="Type" />

                        {formik.touched.workIcon && formik.errors.workIcon ? <p className="text-xs text-red-800">{formik.errors.workIcon}</p> : null}
                        <input type="text" className="hidden" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.workId} />
                        <input type="text" className="hidden" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.workArId} />
                        <div>
                            <label htmlFor="workTitleEn">Title (EN)</label>
                            <input
                                type="text"
                                id="workTitleEn"
                                name="workTitleEn"
                                className="form-input"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.workTitleEn} // Always use formik.values
                            />
                            {formik.touched.workTitleEn && formik.errors.workTitleEn ? <p className="text-xs text-red-800">{formik.errors.workTitleEn}</p> : null}
                        </div>

                        <div>
                            <label htmlFor="workTitleAr">Title (AR)</label>
                            <input
                                type="text"
                                id="workTitleAr"
                                name="workTitleAr"
                                className="form-input"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.workTitleAr} // Always use formik.values
                            />
                            {formik.touched.workTitleAr && formik.errors.workTitleAr ? <p className="text-xs text-red-800">{formik.errors.workTitleAr}</p> : null}
                        </div>

                        <div>
                            <label htmlFor="workDescriptionEn">Description (EN)</label>
                            <textarea
                                id="workDescriptionEn"
                                name="workDescriptionEn"
                                className="form-input"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.workDescriptionEn} // Always use formik.values
                            />
                            {formik.touched.workDescriptionEn && formik.errors.workDescriptionEn ? <p className="text-xs text-red-800">{formik.errors.workDescriptionEn}</p> : null}
                        </div>

                        <div>
                            <label htmlFor="workDescriptionAr">Description (AR)</label>
                            <textarea
                                id="workDescriptionAr"
                                name="workDescriptionAr"
                                className="form-input"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.workDescriptionAr} // Always use formik.values
                            />
                            {formik.touched.workDescriptionAr && formik.errors.workDescriptionAr ? <p className="text-xs text-red-800">{formik.errors.workDescriptionAr}</p> : null}
                        </div>
                        <DialogFooter>
                            <Button color="red" onClick={() => setOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" className="ms-2" color="green">
                                {isEditMode ? 'Update' : 'Add'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogBody>
            </Dialog>

            {openDel && <DeleteModal open={openDel} onClose={() => setOpenDel(false)} onDelete={() => handleDeletemodal()} message="Are you sure you want to delete this Work Item?" />}
        </div>
    );
};

export default Workdata;
