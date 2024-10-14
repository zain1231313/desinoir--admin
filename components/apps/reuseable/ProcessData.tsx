'use client';
import IconPencil from '@/components/icon/icon-pencil';
import IconTrash from '@/components/icon/icon-trash';
import { addServiceData, addServiceData2, deleteServiceData, deleteServiceData2, GetServices, updateServiceData, updateServiceData2 } from '@/components/utils/Helper';
import { Button, Dialog, DialogBody, DialogFooter, DialogHeader } from '@material-tailwind/react';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import $ from 'jquery';
import 'datatables.net';
import { processDataSchema } from '@/components/schema/schema';
import DeleteModal from '@/components/Modals/DeleteModal';

const ProcessData = (type: any) => {
    const [open, setOpen] = useState(false);
    const [edit, setEdit] = useState(false); // Adjusted type if needed
    const [processdata, setProcessdata] = useState<any>();
    const [isEditMode, setIsEditMode] = useState<boolean>(false);
    const [preview, setPreview] = useState<any>();
    const [modelData, setModelData] = useState<any>();
    const [workId, setWorkId] = useState<any>();
    const [arworkId, setArworkId] = useState<any>();
    const [openDel, setOpenDel] = useState(false);

    const fetchData = async () => {
        try {
            const result = await GetServices(type);
            const datamap = result?.data?.map((item: any, index: number) => {
                const mapLanguageData = (langData: any, lang: string) => {
                    return langData?.map((item2: any) => {
                        const { process, explain, _id } = item2;
                        return {
                            id: _id,
                            title: process,
                            description: explain,
                            language: lang,
                        };
                    });
                };

                const arData = mapLanguageData(item?.data?.ar?.ourProcess?.data, 'ar');
                const enData = mapLanguageData(item?.data?.en?.ourProcess?.data, 'en');

                return {
                    arData,
                    enData,
                };
            });
            setProcessdata(datamap);
            console.log(datamap);
        } catch (error) {
            console.error('Failed to fetch data:', error);
        }
    };
    useEffect(() => {
        if (processdata) {
            if ($.fn.dataTable.isDataTable('#processTable')) {
                $('#processTable').DataTable().destroy();
            }

            $('#processTable').DataTable({
                paging: true,
                searching: true,
                ordering: false,
                info: false,
            });
        }
    }, [processdata]);

    useEffect(() => {
        fetchData();
    }, [type]);

    const handleOpen = () => {
        setOpen(true);
    };
    const formik = useFormik({
        initialValues: {
            type: type.type,
            processTitleEn: '',
            processTitleAr: '',
            processDescriptionEn: '',
            processDescriptionAr: '',
            processId: '',
            processArId: '',
        },
        validationSchema: processDataSchema,
        onSubmit: async (values) => {
            console.log('values =================', values);
            try {
                if (!isEditMode) {
                    console.log('edit mode is off');

                    const processData = [
                        {
                            process: values.processTitleEn,
                            explain: values.processDescriptionEn,
                        },
                    ];

                    const arProcessData = [
                        {
                            process: values.processTitleAr,
                            explain: values.processDescriptionAr,
                        },
                    ];

                    // Make the API call with helper function
                    const result = await addServiceData2(values.type, processData, arProcessData);
                    fetchData();
                    setOpen(false);
                    console.log('API response:', result);
                    if (result.success === true) {
                        toast.success(result.message);
                    } else {
                        toast.error(result.message);
                    }
                } else {
                    console.log('edit mode is on');
                    // Prepare data for update
                    const serviceData = {
                        processData: JSON.stringify({
                            process: values.processTitleEn,
                            explain: values.processDescriptionEn,
                        }),
                        arProcessData: JSON.stringify({
                            process: values.processTitleAr,
                            explain: values.processDescriptionAr,
                        }),
                        processId: values.processId,
                        processarId: values.processArId,
                        Type: values.type,
                        // whyChooseData: '',  // Include actual values if needed
                        // arWhyChooseData: '',
                    };
                    // Make the API call with the update helper function
                    const result = await updateServiceData2(serviceData);
                    fetchData();
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
                processId: modelData?.process?.id || '',
                processArId: modelData?.process2?.id || '',
                processTitleEn: modelData?.process?.title || '',
                processTitleAr: modelData?.process2?.title || '',
                processDescriptionEn: modelData?.process?.description || '',
                processDescriptionAr: modelData?.process2?.description || '',
            });
        } else {
            formik.resetForm();
        }
    }, [isEditMode, modelData]);

    const handleDeletemodal = async () => {
        try {
            const result = await deleteServiceData2(workId, arworkId);
            // const result2 = await deleteServiceData2(
            // );
            if (result.success === true) {
                toast.success('Work Item deleted successfully');
            }
            setOpenDel(false);
            fetchData();
            // processId: 'yourProcessId',
            // arprocessId: undefined,
            // whyChooseDesiniorId: undefined,
            // arwhyChooseDesiniorId: undefined,

            // console.log('Deleted successfully:', result);
        } catch (error) {
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
                        formik.resetForm();
                        handleOpen();
                    }}
                >
                    Add
                </button>
            </div>
            <div className="w-full overflow-x-scroll">
                <table id="processTable">
                    <thead>
                        <tr>
                            <th>Title (EN)</th>
                            <th>Title (AR)</th>
                            <th>Description (EN)</th>
                            <th>Description (AR)</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {processdata?.map((process: any, index: number) => {
                            // Get the maximum length of enData and arData
                            const maxLength = Math.max(process.enData?.length || 0, process.arData?.length || 0);

                            // Create an array with the maximum length to ensure all rows are covered
                            return Array.from({ length: maxLength }).map((_, index: number) => {
                                const enItem = process.enData ? process.enData[index] : null;
                                const arItem = process.arData ? process.arData[index] : null;

                                const handleEdit = (process: any, process2: any) => {
                                    // setSelectedRowData(process);
                                    console.log('process', process);
                                    console.log('process', process2);
                                    setIsEditMode(true);
                                    setModelData({ process, process2 });

                                    setOpen(true); // Open the dialog
                                    // setCurrentIndex(index);
                                };

                                const handleDelete = async (data: any, data2: any) => {
                                    console.log('data id  ------------', data);
                                    console.log('data2 id  ------------', data2);
                                    setOpenDel(true);
                                    setWorkId(data);
                                    setArworkId(data2);
                                    // processId: 'yourProcessId',
                                    // arprocessId: undefined,
                                    // whyChooseDesiniorId: undefined,
                                    // arwhyChooseDesiniorId: undefined,
                                    console.log('state id  ------------', workId);
                                    console.log('state id  ------------', arworkId);
                                };
                                return (
                                    <tr key={index}>
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
                <DialogHeader>{isEditMode ? 'Edit Process' : 'Add Process'}</DialogHeader>
                <DialogBody>
                    <div>
                        <input className="form-input" readOnly disabled name="type" value={type} placeholder="Type" />
                    </div>
                    <form onSubmit={formik.handleSubmit}>
                        <input className="form-input" readOnly disabled name="type" value={type.type} placeholder="Type" />

                        <input type="text" className="hidden" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.processId} />
                        <input type="text" className="hidden" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.processArId} />
                        <div>
                            <label htmlFor="processTitleEn">Title (EN)</label>
                            <input
                                type="text"
                                id="processTitleEn"
                                name="processTitleEn"
                                className="form-input"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.processTitleEn} // Always use formik.values
                            />
                            {formik.touched.processTitleEn && formik.errors.processTitleEn ? <p className="text-xs text-red-800">{formik.errors.processTitleEn}</p> : null}
                        </div>

                        <div>
                            <label htmlFor="processTitleAr">Title (AR)</label>
                            <input
                                type="text"
                                id="processTitleAr"
                                name="processTitleAr"
                                className="form-input"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.processTitleAr} // Always use formik.values
                            />
                            {formik.touched.processTitleAr && formik.errors.processTitleAr ? <p className="text-xs text-red-800">{formik.errors.processTitleAr}</p> : null}
                        </div>

                        <div>
                            <label htmlFor="processDescriptionEn">Description (EN)</label>
                            <textarea
                                id="processDescriptionEn"
                                name="processDescriptionEn"
                                className="form-input"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.processDescriptionEn} // Always use formik.values
                            />
                            {formik.touched.processDescriptionEn && formik.errors.processDescriptionEn ? <p className="text-xs text-red-800">{formik.errors.processDescriptionEn}</p> : null}
                        </div>

                        <div>
                            <label htmlFor="processDescriptionAr">Description (AR)</label>
                            <textarea
                                id="processDescriptionAr"
                                name="processDescriptionAr"
                                className="form-input"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.processDescriptionAr} // Always use formik.values
                            />
                            {formik.touched.processDescriptionAr && formik.errors.processDescriptionAr ? <p className="text-xs text-red-800">{formik.errors.processDescriptionAr}</p> : null}
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

export default ProcessData;
