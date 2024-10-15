'use client';
import IconPencil from '@/components/icon/icon-pencil';
import IconTrash from '@/components/icon/icon-trash';
import Loading from '@/components/layouts/loading';
import { Button, Dialog, DialogBody, DialogFooter, DialogHeader } from '@material-tailwind/react';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import DeleteModal from '@/components/Modals/DeleteModal';
import { getMetaData, addMetaTags, deleteMeta } from '@/components/utils/Helper';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import $ from 'jquery';
import 'datatables.net';

const MetaTags = () => {
    const [loading, setLoading] = useState(true);
    const [metaTags, setMetaTags] = useState<any>([]);
    const [open, setOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<any>();
    const [openDel, setOpenDel] = useState(false);
    const [metaId, setMetaId] = useState('');

    // Fetch meta tags data
    const fetchMetaTags = async () => {
        try {
            const data = await getMetaData();
            setMetaTags(data.data);
            setLoading(false);
        } catch (error) {
            // console.error('Failed to fetch meta tags:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!loading && metaTags.length > 0) {
            // Ensure DataTables is initialized after the table is rendered
            if ($.fn.dataTable.isDataTable('#MetaTable')) {
                $('#MetaTable').DataTable().destroy(); // Destroy previous instance
            }
            // Initialize DataTables only if the table is present in the DOM
            if ($('#MetaTable').length) {
                $('#MetaTable').DataTable({
                    paging: true,
                    searching: true,
                    ordering: false,
                    info: false,
                });
            }
        }
    }, [metaTags, loading]);
    useEffect(() => {
        fetchMetaTags();
    }, []);

    // Formik setup
    const formik = useFormik({
        initialValues: {
            title: '',
            description: '',
            image: null,
            type: '',
        },
        validationSchema: Yup.object({
            title: Yup.string().required('Title is required'),
            description: Yup.string().required('Description is required'),
            image: Yup.mixed().required('Image is required'),
            type: Yup.string().required('Type is required'),
        }),
        enableReinitialize: true,
        onSubmit: async (values) => {
            try {
                const result = await addMetaTags(values.title, values.description, values.type, values.image);
                toast.success(result.message);
                setOpen(false);
                window.location.reload();
                fetchMetaTags();
            } catch (error: any) {
                setOpen(false);
                toast.error(error.message);
                // console.error('Error adding/updating meta tag:', error);
            }
        },
    });

    // Handle file selection for image preview
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPreviewUrl(URL.createObjectURL(file));
            formik.setFieldValue('image', file); // Update image field in Formik state
        }
    };

    // Edit meta tag handler
    const handleEdit = (metaTag: any) => {
        // console.log(metaTag);
        setIsEditMode(true);
        setPreviewUrl(metaTag.image); // Set the image for preview
        formik.setValues({
            title: metaTag.title,
            description: metaTag.description,
            type: metaTag.type,
            image: previewUrl, // Reset image in Formik state
        });
        handleOpen(); // Open the modal
    };

    const handleOpen = () => {
        setOpen(true);
    };
    const handleDelmodal = async () => {
        try {
            const result = await deleteMeta(metaId);
            setOpenDel(false);
            toast.success(result.message);
            setLoading(true);
            window.location.reload();
        } catch (error: any) {
            setOpenDel(false);
            toast.error(error.message);
            // console.error('Delete failed:', error);
        }
    };

    return (
        <>
            {loading ? (
                <Loading />
            ) : (
                <div>
                    <h2 className="mb-1 flex items-center px-2 py-3 font-extrabold uppercase">
                        <span>Meta Tags</span>
                    </h2>
                    <div className="panel border-white-light px-3 dark:border-[#1b2e4b]">
                        <div className="py-3">
                            <button
                                type="button"
                                onClick={() => {
                                    formik.resetForm();
                                    setIsEditMode(false);
                                    setPreviewUrl(null);
                                    handleOpen();
                                }}
                                className="btn btn-primary ml-auto"
                            >
                                Add
                            </button>
                        </div>

                        <div className="w-full overflow-x-scroll">
                            <table id="MetaTable" className="display max-sm:overflow-x-scroll">
                                <thead>
                                    <tr>
                                        <th>Image</th>
                                        <th>Type</th>
                                        <th>Title</th>
                                        <th>Description</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {metaTags.map((metaTag: any) => (
                                        <tr key={metaTag?._id}>
                                            <td>{metaTag?.image && <Image src={metaTag?.image} alt="metaTag" className="h-14 w-14 rounded-full object-cover" width={50} height={50} />}</td>
                                            <td>{metaTag?.type}</td>
                                            <td>{metaTag?.title}</td>
                                            <td>{metaTag?.description}</td>
                                            <td className="h-full items-center">
                                                <div>
                                                    <button onClick={() => handleEdit(metaTag)}>
                                                        <IconPencil />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setOpenDel(true);
                                                            setMetaId(metaTag._id);
                                                        }}
                                                        className="ms-2"
                                                    >
                                                        <IconTrash />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <Dialog open={open} className="h-fit overflow-y-scroll dark:bg-[#060818]" handler={() => setOpen(false)}>
                            <DialogHeader>{isEditMode ? 'Edit Meta Tag' : 'Add Meta Tag'}</DialogHeader>
                            <DialogBody>
                                <form onSubmit={formik.handleSubmit}>
                                    <div>
                                        <label htmlFor="title">Title</label>
                                        <input type="text" id="title" name="title" className="form-input" onChange={formik.handleChange} value={formik.values.title} />
                                        {formik.errors.title && formik.touched.title && <p className="text-sm text-red-500">{formik.errors.title}</p>}
                                    </div>
                                    <div>
                                        <label htmlFor="description">Description</label>
                                        <input type="text" id="description" name="description" className="form-input" onChange={formik.handleChange} value={formik.values.description} />
                                        {formik.errors.description && formik.touched.description && <p className="text-sm text-red-500">{formik.errors.description}</p>}
                                    </div>
                                    <div>
                                        <label htmlFor="image">Image</label>
                                        {previewUrl && (
                                            <div className="my-2  ">
                                                <Image width={1000} height={1000} src={previewUrl} className="h-20 w-20 object-cover" alt="Preview" />
                                            </div>
                                        )}
                                        <label htmlFor="image" className="btn btn-primary w-fit" style={{ cursor: 'pointer' }}>
                                            Choose Image
                                            <input type="file" id="image" accept="image/*" className="form-input" onChange={handleFileSelect} style={{ display: 'none' }} />
                                        </label>
                                        {formik.errors.image && formik.touched.image && <p className="text-sm text-red-500">{formik.errors.image}</p>}
                                    </div>
                                    <div>
                                        <label htmlFor="type">Type</label>
                                        {isEditMode ? (
                                            <p className="py-2 font-extrabold">{formik.values.type}</p>
                                        ) : (
                                            <select id="type" name="type" className="form-select" onChange={formik.handleChange} value={formik.values.type}>
                                                <option value=""></option>
                                                <option value="home">Home</option>
                                                <option value="about">About</option>
                                                <option value="services">Services</option>
                                                <option value="uiux">UI/UX Service</option>
                                                <option value="branding">Branding</option>
                                                <option value="motionGraphic">Motion Graphic Service</option>
                                                <option value="graphicdesign">Graphic Design Service</option>
                                                <option value="ourWork">Our Work</option>
                                                <option value="ourWorkDetail">Our Work Detail</option>
                                                <option value="article">Article</option>
                                                <option value="articleDeatil">Article Deatil</option>
                                                <option value="uiStore">Ui Store</option>
                                                <option value="uiStoreDetail">Ui Store Detail</option>
                                                <option value="contactUs">Contact Us</option>
                                                <option value="ourTeam">Our Team</option>
                                            </select>
                                        )}
                                        {formik.errors.type && formik.touched.type && <p className="text-sm text-red-500">{formik.errors.type}</p>}
                                    </div>
                                    <DialogFooter>
                                        <Button type="submit" onClick={() => formik.submitForm} className="btn btn-primary" color="green">
                                            {isEditMode ? 'Update' : 'Add'}
                                        </Button>
                                        <Button type="button" className="ms-2" onClick={() => setOpen(false)} variant="text" color="red">
                                            Cancel
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogBody>
                        </Dialog>

                        {openDel && <DeleteModal open={openDel} onClose={() => setOpenDel(false)} onDelete={() => handleDelmodal()} message="Are you sure you want to delete this meta tag?" />}
                    </div>
                </div>
            )}
        </>
    );
};

export default MetaTags;
