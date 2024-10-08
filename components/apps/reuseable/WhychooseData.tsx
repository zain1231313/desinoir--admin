'use client'
import IconPencil from '@/components/icon/icon-pencil';
import IconTrash from '@/components/icon/icon-trash';
import { WhyChooseSchema } from '@/components/schema/schema';
import { addServiceData3, deleteServiceData3, GetServices, updateServiceData3 } from '@/components/utils/Helper';
import { Button, Dialog, DialogBody, DialogFooter, DialogHeader } from '@material-tailwind/react';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import $ from 'jquery';
import 'datatables.net';
import DeleteModal from '@/components/Modals/DeleteModal';
const WhychooseData = (type: any) => {
    const [tableData, setTableData] = useState<any>(''); // Adjusted type if needed
    const [open, setOpen] = useState(false);
    const [workdata, setWorkdata] = useState<any>();
    const [isEditMode, setIsEditMode] = useState<boolean>(false);
    const [preview, setPreview] = useState<any>();
    const [modelData, setModelData] = useState<any>()
    const [workId, setWorkId] = useState<any>()
    const [arworkId, setArworkId] = useState<any>()
    const [openDel, setOpenDel] = useState(false)


    const fetchData = async () => {
        try {

            const result = await GetServices(type.type);
            console.log('reesult', result)
            const datamap = result?.data?.map((item: any, index: number) => {
                const mapLanguageData = (langData: any, lang: string) => {
                    return langData?.map((item2: any) => {
                        const { icon, title, description, _id } = item2;
                        console.log('item2-------', item2)
                        return {
                            id: _id,
                            icon,
                            title: title,
                            description: description,
                            language: lang
                        };
                    });
                };

                const arData = mapLanguageData(item?.data?.ar?.whyChooseDesinior?.data, 'ar');
                console.log('item2-------', arData)
                const enData = mapLanguageData(item?.data?.en?.whyChooseDesinior?.data, 'en');
                console.log('item2-------', enData)

                return {
                    arData,
                    enData,
                };
            });
            setWorkdata(datamap)
            console.log(datamap)
            setTableData(result.data[0].data);
        } catch (error) {
            console.error('Failed to fetch data:', error);
        }
    };


    useEffect(() => {
        if (workdata) {
            if ($.fn.dataTable.isDataTable('#WhychooseTable')) {
                $('#WhychooseTable').DataTable().destroy();
            }

            $('#WhychooseTable').DataTable({
                paging: true,
                searching: true,
                ordering: false,
                info: false,
            });
        }
    }, [workdata]);

    useEffect(() => {
        fetchData();
    }, []);

    const handleOpen = () => {
        setOpen(true);
    }
    const formik = useFormik({
        initialValues: {
            workIcon: null,
            titleEn: '',
            titleAr: '',
            descriptionEn: '',
            descriptionAr: '',
            whyChooseDesiniorId: '',
            arwhyChooseDesiniorId: '',
        },
        validationSchema: WhyChooseSchema,
        onSubmit: async (values) => {
            console.log("values =================", values)
            try {
                if (!isEditMode) {
                    console.log("edit mode is off");

                    const whyChooseData = JSON.stringify([
                        {
                            title: values.titleEn,
                            description: values.descriptionEn,
                        }
                    ]);

                    const arWhyChooseData = JSON.stringify([
                        {
                            title: values.titleAr,
                            description: values.descriptionAr,
                        }
                    ]);
                    const Type = type.type
                    // Make the API call with helper function
                    const result = await addServiceData3(
                        values,
                        Type,
                        whyChooseData,
                        arWhyChooseData,
                    );
                    fetchData();
                    setOpen(false);
                    console.log("API response:", result);
                    if (result.success === true) {
                        toast.success(result.message);
                        fetchData();
                    } else {
                        toast.error(result.message);
                    }
                } else {
                    console.log("edit mode is on");

                    // Prepare data for update
                    const serviceData = {
                        whyChooseData: JSON.stringify(
                            {
                                title: values.titleAr,
                                description: values.descriptionAr,
                            }
                        ),
                        arWhyChooseData: JSON.stringify(
                            {
                                title: values.titleAr,
                                description: values.descriptionAr,
                            }
                        ),
                        whyChooseDesiniorId: values.whyChooseDesiniorId,
                        arwhyChooseDesiniorId: values.arwhyChooseDesiniorId,
                        workIcon: values.workIcon,
                        Type: type.type
                        // processData: '',  // Include actual values if needed
                        // arProcessData: '',
                        // whyChooseData: '',  // Include actual values if needed
                        // arWhyChooseData: '',
                        // processId: '', // Include actual values if needed
                    };

                    // Make the API call with the update helper function
                    const result = await updateServiceData3(serviceData);
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
                console.error("Error submitting the form:", error);
            }
        },
    });

    useEffect(() => {
        if (!isEditMode) {
            formik.resetForm();
        }
        if (isEditMode && modelData) {
            formik.setValues({
                ...formik.values,
                whyChooseDesiniorId: modelData?.work?.id || '',
                arwhyChooseDesiniorId: modelData?.work2?.id || '',
                workIcon: modelData?.work?.workIcon || '',
                titleEn: modelData?.work?.title || '',
                titleAr: modelData?.work2?.title || '',
                descriptionEn: modelData?.work?.description || '',
                descriptionAr: modelData?.work2?.description || '',
            });
        }
        if (!isEditMode) {
            formik.resetForm()
        }
    }, [isEditMode, modelData]);


    // Handling file input
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.currentTarget.files?.[0];
        if (file) {
            // Set the file in Formik state
            formik.setFieldValue("workIcon", file);

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
            const result = await deleteServiceData3(
                workId,
                arworkId,
            );
            // const result2 = await deleteServiceData2(
            // );
            if (result.success === true) {
                toast.success('Work Item deleted successfully');
            }
            setOpenDel(false);
            fetchData()
            // processId: 'yourProcessId',
            // arprocessId: undefined,
            // whyChooseDesiniorId: undefined,
            // arwhyChooseDesiniorId: undefined,

            // console.log('Deleted successfully:', result);
        } catch (error) {
            toast.error('Failed to delete Work Item')
            console.error('Deletion error:', error);
        }
    };

    return (
        <div>
            <div>
                <button type='button' className='ml-auto my-2 btn btn-primary' onClick={() => {
                    setIsEditMode(false);
                    setPreview(null)
                    formik.resetForm();
                    handleOpen();
                }}>
                    Add
                </button>
            </div>
            <div className='w-full overflow-x-scroll'>

                <table id="WhychooseTable">
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
                                    setPreview(work.icon)
                                    console.log("work", work)
                                    console.log("work", work2)
                                    setIsEditMode(true);
                                    setModelData({ work, work2 })

                                    setOpen(true); // Open the dialog
                                    // setCurrentIndex(index);
                                };

                                const handleDelete = async (data: any, data2: any) => {
                                    console.log("data id  ------------", data)
                                    console.log("data2 id  ------------", data2)
                                    setOpenDel(true);
                                    setWorkId(data);
                                    setArworkId(data2);
                                    // processId: 'yourProcessId',
                                    // arprocessId: undefined,
                                    // whyChooseDesiniorId: undefined,
                                    // arwhyChooseDesiniorId: undefined,
                                    console.log("state id  ------------", workId)
                                    console.log("state id  ------------", arworkId)
                                };
                                return (
                                    <tr key={index}>
                                        <td>
                                            {enItem ? <img src={enItem.icon} className='w-12 h-12 object-cover rounded-full' alt={enItem.title} width={50} /> : null}
                                        </td>
                                        <td>
                                            {enItem ? enItem.title : null}
                                        </td>
                                        <td>
                                            {arItem ? arItem.title : null}
                                        </td>
                                        <td>
                                            {enItem ? enItem.description : null}
                                        </td>
                                        <td>
                                            {arItem ? arItem.description : null}
                                        </td>

                                        <td>
                                            <div className="flex items-center justify-center">
                                                <div onClick={() => handleEdit(enItem, arItem)} className='cursor-pointer'>
                                                    <IconPencil />
                                                </div>

                                                <div onClick={() => handleDelete(enItem?.id, arItem?.id)} className='cursor-pointer'>
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
                <DialogHeader>{isEditMode ? 'Edit why choose desinoir' : 'Add why choose desinoir'}</DialogHeader>
                <DialogBody>
                    <form onSubmit={formik.handleSubmit}>
                        <div>
                            <label htmlFor="workIcon">Icon</label>
                            {/* Preview the uploaded or current image */}
                            {preview && (
                                <div className="mt-2">
                                    <img
                                        src={preview} 
                                        alt="Preview"
                                        className="h-16 w-16 object-cover"
                                    />
                                </div>
                            )}
                            <label htmlFor="workIcon" className='btn btn-primary w-fit'  style={{ cursor: 'pointer' }}>
                                Choose Image
                                <input
                                    type="file"
                                    id="workIcon"
                                    name="workIcon"
                                    accept='image/*'
                                    className="form-input"
                                    onChange={(event) => handleFileChange(event)}
                                    style={{display: 'none'}}
                                />

                            </label>
                            
                            {formik.touched.workIcon && formik.errors.workIcon ? (
                                <p className='text-red-800 text-xs'>{formik.errors.workIcon}</p>
                            ) : null}

                            {/* In Edit mode, show the existing image if no new image is uploaded */}
                            {/* {isEditMode && modelData?.work?.icon && (
                                <div className="mt-2">
                                    <img
                                        src={modelData.work.icon} // Existing image from the server
                                        alt="Current Icon"
                                        className="h-16 w-16 object-cover"
                                    />
                                </div>
                            )} */}
                        </div>
                        <input
                            type="text"
                            className="hidden"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.whyChooseDesiniorId}
                        />
                        <input
                            type="text"
                            className="hidden"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.arwhyChooseDesiniorId}
                        />
                        <div>
                            <label htmlFor="titleEn">Title (EN)</label>
                            <input
                                type="text"
                                id="titleEn"
                                name="titleEn"
                                className="form-input"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.titleEn} // Always use formik.values
                            />
                        </div>
                        {formik.touched.titleEn && formik.errors.titleEn ? (
                            <p className='text-red-800 text-xs'>{formik.errors.titleEn}</p>
                        ) : null}

                        <div>
                            <label htmlFor="titleAr">Title (AR)</label>
                            <input
                                type="text"
                                id="titleAr"
                                name="titleAr"
                                className="form-input"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.titleAr} // Always use formik.values
                            />
                            {formik.touched.titleAr && formik.errors.titleAr ? (
                                <p className='text-red-800 text-xs'>{formik.errors.titleAr}</p>
                            ) : null}
                        </div>

                        <div>
                            <label htmlFor="descriptionEn">Description (EN)</label>
                            <textarea
                                id="descriptionEn"
                                name="descriptionEn"
                                className="form-input"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.descriptionEn} // Always use formik.values
                            />
                            {formik.touched.descriptionEn && formik.errors.descriptionEn ? (
                                <p className='text-red-800 text-xs'>{formik.errors.descriptionEn}</p>
                            ) : null}
                        </div>

                        <div>
                            <label htmlFor="descriptionAr">Description (AR)</label>
                            <textarea
                                id="descriptionAr"
                                name="descriptionAr"
                                className="form-input"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.descriptionAr} // Always use formik.values
                            />
                            {formik.touched.descriptionAr && formik.errors.descriptionAr ? (
                                <p className='text-red-800 text-xs'>{formik.errors.descriptionAr}</p>
                            ) : null}
                        </div>
                        <DialogFooter>
                            <Button color="red" onClick={() => setOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" className='ms-2' color="green">
                                {isEditMode ? 'Update' : 'Add'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogBody>
            </Dialog>


            {openDel &&
                <DeleteModal
                    open={openDel}
                    onClose={() => setOpenDel(false)}
                    onDelete={() => handleDeletemodal()}
                    message="Are you sure you want to delete this Work Item?"
                />
            }
        </div>
    )
}

export default WhychooseData
