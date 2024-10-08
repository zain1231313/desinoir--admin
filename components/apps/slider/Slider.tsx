'use client';
import React, { useState, useEffect } from 'react';
import IconPencil from '@/components/icon/icon-pencil';
import IconTrash from '@/components/icon/icon-trash';
import { Button, Dialog, DialogHeader, DialogBody, DialogFooter } from '@material-tailwind/react';
import { addSliderData, updateSliderData, fetchSliderData, deleteRequest } from '@/components/utils/Helper';
import { useFormik } from 'formik';
import toast from 'react-hot-toast';
import Loading from '@/components/layouts/loading';
import $ from 'jquery';
import 'datatables.net';
import { sliderSchema } from '@/components/schema/schema';
import DeleteModal from '@/components/Modals/DeleteModal';

interface SliderItem {
    _id: string;
    page: string;
    text: {
        en: string;
        ar: string;
    };
    type: string;
}

const Slider = () => {
    const [open, setOpen] = useState(false);
    const [sliderData, setSliderData] = useState<SliderItem[]>([]);
    const [currentItem, setCurrentItem] = useState<SliderItem | null>(null);
    const [loading, setLoading] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [openDel, setOpenDel] = useState(false);
    const [edit, setEdit] = useState(false);

    const handleOpen = () => {
        setEdit(false);
        setOpen(!open);
    };

    const handleEdit = (item: SliderItem) => {
        setEdit(true);
        setIsEditMode(true);
        setCurrentItem(item);
        formik.setValues({
            titleEnglish: item.text.en,
            titleArabic: item.text.ar,
            type: item.type,
        });
        handleOpen();
    };

    const formik = useFormik({
        initialValues: {
            titleEnglish: '',
            titleArabic: '',
            type: '',
        },
        enableReinitialize: true,
        validationSchema: sliderSchema,
        onSubmit: async (values) => {
            setLoading(true);

            const sliderDataToSend = {
                enText: values.titleEnglish,
                arText: values.titleArabic,
                type: values.type,
            };

            try {
                const result = isEditMode && currentItem?._id
                    ? await updateSliderData(currentItem._id, sliderDataToSend)
                    : await addSliderData(sliderDataToSend);

                if (result) {
                    toast.success(result.message || (isEditMode ? 'Updated Successfully' : 'Added Successfully'));

                    setSliderData((prevData) =>
                        isEditMode
                            ? prevData.map((item) => (item._id === result._id ? result : item))
                            : [...prevData, result]
                    );

                    handleOpen(); // Close dialog
                }
            } catch (error: any) {
                toast.error(error.message || 'An error occurred');
                console.error(error);
            } finally {
                setLoading(false);
                getData();
            }
        },
    });


    // useEffect(() => {
    //     if (!loading && sliderData.length > 0) {

    //         if ($.fn.dataTable.isDataTable('#sliderTable')) {
    //             $('#sliderTable').DataTable().destroy();

    //         }

    //         // Initialize DataTables only if the table is present in the DOM
    //         if ($('#sliderTable').length) {
    //             $('#sliderTable').DataTable({
    //                 paging: true,
    //                 searching: true,
    //                 ordering: false,
    //                 info: false,
    //             });
    //         }
    //     }
    // }, [sliderData, loading]);
    const [sliderid, setSliderid] = useState<any>();

    const handleDelete = async (id: string) => {
        setOpenDel(true);
        setSliderid(id);
    };
    const handleModalDelete = async (id: string) => {
        setLoading(true);
        try {
            const result = await deleteRequest(id);
            setOpenDel(false);
            toast.success(result.message || 'Item deleted successfully');

            // Remove deleted item from state
            setSliderData((prevData) => prevData.filter((item) => item._id !== id));

            console.log('Delete successful:', result);
        } catch (error: any) {
            toast.error(error.message || 'An error occurred');
            console.error('Delete failed:', error);
        } finally {
            setLoading(false);
            getData();
        }
    };

    // Fetch data from API
    const getData = async () => {
        setLoading(true);
        try {
            const result = await fetchSliderData();
            setSliderData(result.data); // Set fetched data to state
        } catch (error) {
            console.error('Error fetching slider data:', error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        getData();
    }, []);
    return (
        <>
            {loading ? (
                <Loading />
            ) : (
                <div>
                    <h2 className="mb-1 flex items-center px-2 py-3 font-extrabold uppercase">
                        <span>Slider</span>
                    </h2>
                    <div className="panel overflow-hidden border-white-light px-3 dark:border-[#1b2e4b]">
                        <div className="py-3">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsEditMode(false);
                                    formik.resetForm();
                                    handleOpen();
                                }}
                                className="btn btn-primary ml-auto"
                            >
                                Add
                            </button>
                        </div>
                        <div className="w-full overflow-x-scroll">
                            <table id="sliderTable">
                                <thead>
                                    <tr>
                                        <th>Page</th>
                                        <th>English Text</th>
                                        <th>Arabic Text</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sliderData?.map((item) => (
                                        <tr key={item._id}>
                                            <td className="capitalize">{item.type}</td>
                                            <td className="capitalize">{item.text?.en || 'Not Updated'}</td>
                                            <td className="capitalize">{item.text?.ar || 'Not Updated'}</td>
                                            <td className="flex items-center gap-3">
                                                <div>
                                                    <button onClick={() => handleEdit(item)}>
                                                        <IconPencil />
                                                    </button>
                                                </div>
                                                <div>
                                                    <button onClick={() => handleDelete(item._id)}>
                                                        <IconTrash />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <Dialog className="h-fit dark:bg-[#060818]" open={open} handler={handleOpen}>
                        <DialogHeader className="">{isEditMode ? 'Update Slider ' : 'Add Slider'}</DialogHeader>
                        <DialogBody>
                            <h2 className="mb-1 flex items-center px-2 py-3 font-semibold text-[#0e1726] dark:text-[#888EA8]">
                                <span>Text English</span>
                            </h2>
                            <input type="text" className="form-input" value={formik.values.titleEnglish} onChange={formik.handleChange} name="titleEnglish" />
                            {formik.touched.titleEnglish && formik.errors.titleEnglish ? <div>{formik.errors.titleEnglish}</div> : null}
                            <h2 className="mb-1 flex items-center px-2 py-3 font-semibold text-[#0e1726] dark:text-[#888EA8]">
                                <span>Text Arabic</span>
                            </h2>
                            <input type="text" className="form-input" value={formik.values.titleArabic} onChange={formik.handleChange} name="titleArabic" />
                            {formik.touched.titleArabic && formik.errors.titleArabic ? <div>{formik.errors.titleArabic}</div> : null}
                            <h2 className="mb-1 flex items-center px-2 py-3 font-semibold text-[#0e1726] dark:text-[#888EA8]">
                                <span>Page Name</span>
                            </h2>
                            {edit ? (
                                <input className="form-input" readOnly disabled name="type" value={formik.values.type} placeholder="Type" />
                            ) : (
                                <select className="form-select" value={formik.values.type} onChange={formik.handleChange} name="type">
                                    <option value="">Select type</option>
                                    <option value="uiux">Ui/Ux</option>
                                    <option value="branding">Branding</option>
                                    <option value="motionGraphic">Motion Graphic</option>
                                    <option value="graphicdesign">Graphic Design</option>
                                </select>
                            )}

                            {formik.touched.type && formik.errors.type ? <div>{formik.errors.type}</div> : null}
                        </DialogBody>
                        <DialogFooter>
                            <Button variant="text" color="red" onClick={handleOpen} className="mr-1">
                                <span>Cancel</span>
                            </Button>
                            <Button variant="gradient" color="green" onClick={() => formik.handleSubmit()}>
                                <span>Confirm</span>
                            </Button>
                        </DialogFooter>
                    </Dialog>
                    {openDel && <DeleteModal open={openDel} onClose={() => setOpenDel(false)} onDelete={() => handleModalDelete(sliderid)} message="Are you sure you want to delete this work?" />}
                </div>
            )}
        </>
    );
};

export default Slider;
