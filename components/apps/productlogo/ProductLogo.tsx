'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button, Dialog, DialogHeader, DialogBody, DialogFooter } from '@material-tailwind/react';
import { useFormik, FormikErrors } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-hot-toast';
import DeleteModal from '@/components/Modals/DeleteModal';
import $ from 'jquery';
import 'datatables.net';
import IconTrash from '@/components/icon/icon-trash';
import IconPencil from '@/components/icon/icon-pencil';
import Loading from '@/components/layouts/loading';
import { addLogos, deleteProductLogos, fetchLogoWithToken, updateLogos } from '@/components/utils/Helper';

interface FormValues {
    darkLogo: File | null;
    lightLogo: File | null;
}

interface HeaderData {
    title: string;
}

function ProductLogo() {
    const [open, setOpen] = useState(false);
    const [openDel, setOpenDel] = useState(false);
    const [logos, setLogos] = useState<any[]>([]);
    const [selectedLogo, setSelectedLogo] = useState<any>(null);
    const [header, setHeader] = useState<HeaderData>({
        title: '',
    });
    const [previewUrlDark, setPreviewUrlDark] = useState<string | null>(null);
    const [previewUrlLight, setPreviewUrlLight] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEditMode, setIsEditMode] = useState(false);

    // Fetch logos on component mount
    const getLogos = async () => {
        try {
            const data = await fetchLogoWithToken();
            console.log('LogoData=>', data);
            setLogos(data.data);

            setHeader({
                title: data[0].title || '',
            });
        } catch (error) {
            console.error('Error fetching logos:', error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        getLogos();
    }, []);

    useEffect(() => {
        if (!loading && logos.length > 0) {
            // Ensure DataTables is initialized after the table is rendered
            if ($.fn.dataTable.isDataTable('#testimonialsTable')) {
                $('#testimonialsTable').DataTable().destroy(); // Destroy previous instance
            }
            // Initialize DataTables only if the table is present in the DOM
            if ($('#testimonialsTable').length) {
                $('#testimonialsTable').DataTable({
                    paging: true,
                    searching: true,
                    ordering: false,
                    info: false,
                });
            }
        }
    }, [logos, loading]);

    // const formik = useFormik<FormValues>({
    //     initialValues: {
    //         darkLogo: null,
    //         lightLogo: null,
    //     },
    //     enableReinitialize: true,
    //     validationSchema: Yup.object({
    //         darkLogo: Yup.mixed().required('Dark logo is required'),
    //         lightLogo: Yup.mixed().required('Light logo is required'),
    //     }),
    //     onSubmit: async (values: FormValues) => {
    //         try {
    //             setLoading(true);
    //             let result;
    //             if (isEditMode) {
    //                 console.log('enter in update  ');
    //                 console.log('Selected Logos=>', selectedLogo);
    //                 result = await updateLogos(values.darkLogo, values.lightLogo, selectedLogo._id);
    //                 toast.success('Updae Logo  successfully');
    //                 setOpen(false);
    //                 setLoading(false);
    //                 getLogos();
    //             } else {
    //                 // Adding new logo
    //                 result = await addLogos(values.darkLogo, values.lightLogo);
    //                 if (result) {
    //                     toast.success('New Logo Add successfully');
    //                     setLogos((prevLogos) => prevLogos.map((logo) => (logo?._id === selectedLogo?._id ? { ...logo, ...values } : logo)));
    //                     setOpen(false);
    //                     formik.resetForm();
    //                     setPreviewUrlDark(null);
    //                     setPreviewUrlLight(null);
    //                     getLogos();
    //                 } else {
    //                     toast.error('Failed to update logo');
    //                 }
    //             }
    //         } catch (error) {
    //             console.error('Error saving logo:', error);
    //             toast.error('Failed to save logo');
    //         } finally {
    //             setLoading(false);
    //         }
    //     },
    // });

    const formik = useFormik<FormValues>({
        initialValues: {
            darkLogo: null,
            lightLogo: null,
        },
        enableReinitialize: true,
        validationSchema: Yup.object().shape({
            darkLogo: isEditMode
                ? Yup.mixed().nullable() // Make it optional in edit mode
                : Yup.mixed().required('Dark logo is required'),
            lightLogo: isEditMode
                ? Yup.mixed().nullable() // Make it optional in edit mode
                : Yup.mixed().required('Light logo is required'),
        }),
        onSubmit: async (values: FormValues) => {
            try {
                setLoading(true);
                let result;

                if (isEditMode && selectedLogo) {
                    // Only update the selected fields
                    const formData = new FormData();
                    if (values.darkLogo) {
                        formData.append('darkLogo', values.darkLogo);
                    }
                    if (values.lightLogo) {
                        formData.append('lightLogo', values.lightLogo);
                    }

                    result = await updateLogos(formData, selectedLogo._id);

                    if (result) {
                        toast.success('Logo updated successfully');
                        setOpen(false);
                        setLoading(false);
                        getLogos();
                    } else {
                        toast.error('Failed to update logo');
                    }
                } else {
                    // Add new logo logic
                    result = await addLogos(values.darkLogo, values.lightLogo);
                    if (result) {
                        toast.success('New Logo added successfully');
                        getLogos();
                        setOpen(false);
                        formik.resetForm();
                        setPreviewUrlDark(null);
                        setPreviewUrlLight(null);
                    } else {
                        toast.error('Failed to add logo');
                    }
                }
            } catch (error) {
                console.error('Error saving logo:', error);
                toast.error('Failed to save logo');
            } finally {
                setLoading(false);
            }
        },
    });

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: 'dark' | 'light') => {
        const file = e.target.files?.[0];

        if (file) {
            if (type === 'dark') {
                setPreviewUrlDark(URL.createObjectURL(file));
                formik.setFieldValue('darkLogo', file);
            } else {
                setPreviewUrlLight(URL.createObjectURL(file));
                formik.setFieldValue('lightLogo', file);
            }
        }
    };

    const handleOpen = (logo: any = null) => {
        console.log('Single Logo Data', logo);
        setSelectedLogo(logo);
        setIsEditMode(!!logo);

        if (logo) {
            formik.setValues({
                darkLogo: logo.darkLogo,
                lightLogo: logo.lightLogo,
            });
            setPreviewUrlDark(logo.darkModeLogo?.imagePath || null);
            setPreviewUrlLight(logo.lightModeLogo?.imagePath || null);
        } else {
            formik.resetForm();
            setPreviewUrlDark(null);
            setPreviewUrlLight(null);
        }
        setOpen(true);
    };

    const handleDelete = async (id: string) => {
        try {
            const result = await deleteProductLogos(id);
            toast.success('Logo deleted successfully');
            setLogos((prevLogos) => prevLogos.filter((logo) => logo._id !== id));
            setOpenDel(false);
            getLogos();
        } catch (error) {
            console.error('Error deleting logo:', error);
            toast.error('Failed to delete logo');
        }
    };

    const [logoId, setLogoId] = useState<any>();

    const handleDeleteClick = (id: string) => {
        setOpenDel(true);
        setLogoId(id);
    };
    console.log('StateData=>', logos);

    return (
        <>
            {loading ? (
                <Loading />
            ) : (
                <div>
                    <h2 className="mb-1 flex items-center px-2 py-3 font-extrabold uppercase ">
                        <span>Logo Manager</span>
                    </h2>
                    <div className="panel border-white-light px-3 dark:border-[#1b2e4b]">
                        <div className="py-3">
                            <button type="button" onClick={() => handleOpen()} className="btn btn-primary ml-auto">
                                Add
                            </button>
                        </div>

                        <div className="w-full overflow-x-scroll">
                            <table id="logosTable" className="display max-sm:overflow-x-scroll">
                                <thead>
                                    <tr>
                                        <th>Dark Logo</th>
                                        <th>Light Logo</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {logos?.map((logo, index) => (
                                        <tr key={index}>
                                            <td>
                                                {logo.darkModeLogo && (
                                                    <Image src={logo?.darkModeLogo?.imagePath} alt="dark logo" className="h-14 w-14 rounded-full object-cover" width={50} height={50} />
                                                )}
                                            </td>
                                            <td>
                                                {logo.lightModeLogo && (
                                                    <Image src={logo?.lightModeLogo?.imagePath} alt="light logo" className="h-14 w-14 rounded-full object-cover" width={50} height={50} />
                                                )}
                                            </td>
                                            <td className="h-full items-center">
                                                <button onClick={() => handleOpen(logo)}>
                                                    <IconPencil />
                                                </button>
                                                <button onClick={() => handleDeleteClick(logo._id)} className="ms-2">
                                                    <IconTrash />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <Dialog open={open} className="h-[90svh] overflow-y-scroll  dark:bg-[#060818] " handler={() => setOpen(false)}>
                            <DialogHeader>{isEditMode ? 'Edit Logo' : 'Add Logo'}</DialogHeader>
                            <DialogBody>
                                <form onSubmit={formik.handleSubmit}>
                                    <div>
                                        <label htmlFor="darkLogo">Dark Logo</label>
                                        {previewUrlDark && (
                                            <div className="my-2">
                                                <img src={previewUrlDark} className="h-20 w-20 object-cover" alt=".." />
                                            </div>
                                        )}
                                        <label htmlFor="darkLogo" className="btn btn btn-primary w-fit" style={{ cursor: 'pointer' }}>
                                            Choose Dark Logo
                                            <input type="file" id="darkLogo" accept="image/*" className="form-input" onChange={(e) => handleFileSelect(e, 'dark')} style={{ display: 'none' }} />
                                        </label>
                                        {formik.errors.darkLogo && formik.touched.darkLogo && <div className="text-xs text-red-800">{formik.errors.darkLogo}</div>}
                                    </div>
                                    <div>
                                        <label htmlFor="lightLogo">Light Logo</label>
                                        {previewUrlLight && (
                                            <div className="my-2">
                                                <img src={previewUrlLight} className="h-20 w-20 object-cover" alt=".." />
                                            </div>
                                        )}
                                        <label htmlFor="lightLogo" className="btn btn btn-primary w-fit" style={{ cursor: 'pointer' }}>
                                            Choose Light Logo
                                            <input type="file" id="lightLogo" accept="image/*" className="form-input" onChange={(e) => handleFileSelect(e, 'light')} style={{ display: 'none' }} />
                                        </label>
                                        {formik.errors.lightLogo && formik.touched.lightLogo && <div className="text-xs text-red-800">{formik.errors.lightLogo} </div>}{' '}
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

                        {openDel && <DeleteModal open={openDel} onClose={() => setOpenDel(false)} onDelete={() => handleDelete(logoId)} message="Are you sure you want to delete this logo?" />}
                    </div>
                </div>
            )}
        </>
    );
}

export default ProductLogo;
