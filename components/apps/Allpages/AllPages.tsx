'use client'
import IconPencil from '@/components/icon/icon-pencil';
import IconTrash from '@/components/icon/icon-trash';
import DeleteModal from '@/components/Modals/DeleteModal';
import { addPage, deletePage, fetchPageData, updatePage } from '@/components/utils/Helper';
import { Button, Dialog, DialogBody, DialogFooter, DialogHeader } from '@material-tailwind/react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import $ from 'jquery';
import 'datatables.net';
import Loading from '@/components/layouts/loading';

const AllPages = () => {
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [openDel, setOpenDel] = useState(false);
    const [pageData, setPageData] = useState<any>();
    const [page, setPage] = useState<any>();
    const [pageId, setPageId] = useState<any>();
    const fetchPage = async () => {
        try {
            const data = await fetchPageData();
            setLoading(false)
            setPageData(data.data)
        } catch (error) {
            // console.error('Failed to fetch meta tags:', error);
            setLoading(false);
        }
    };


    useEffect(() => {
        if (!loading && pageData.length > 0) {
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
    }, [pageData, loading]);
    useEffect(() => {
        fetchPage()
    }, []);

    // Formik setup
    const formik = useFormik({
        initialValues: {
            page: '',
        },
        validationSchema: Yup.object({
            page: Yup.string().required('Page is required'),
        }),
        enableReinitialize: true,
        onSubmit: async (values) => {
            try {
                if (isEditMode) {
                    const result = await updatePage(pageId, values.page);
                    toast.success(result.message);
                } else {
                    const result = await addPage(values.page);
                    toast.success(result.message);
                }
                setOpen(false);
                fetchPage();
            } catch (error: any) {
                toast.error(error.message);
                setOpen(false);
            }
        },
    });
    const handleEdit = (page: any) => {
        setIsEditMode(true);
        setPageId(page._id);
        formik.setValues({ page: page.pages });
        handleOpen();
    };

    //  const handleSubmit = async () => {
    //         console.log(page);
    //         setIsEditMode(true);
    //         const result = await updatePage(page, pageId)
    //         toast.success(result.message)
    //     };

    const handleOpen = () => {
        setOpen(true);
    };
    const handleDelmodal = async () => {
        try {
            const result = await deletePage(pageId);
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
                        <span>Pages</span>
                    </h2>
                    <div className="panel border-white-light px-3 dark:border-[#1b2e4b]">
                        <div className="py-3">
                            <button
                                type="button"
                                onClick={() => {
                                    formik.resetForm();
                                    setIsEditMode(false);
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
                                        <th>Pages</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pageData?.map((page: any) => (
                                        <tr key={page?._id}>
                                            <td>{page?.pages}</td>
                                            <td className="h-full items-center">
                                                <div>
                                                    <button onClick={() => handleEdit(page)}>
                                                <IconPencil />
                                            </button>
                                                    <button
                                                        onClick={() => {
                                                            setOpenDel(true);
                                                            setPageId(page._id);
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

                        <Dialog open={open} className="h-fit dark:bg-[#060818]" handler={() => setOpen(false)}>
                            <DialogHeader>{isEditMode ? 'Edit Page' : 'Add Page'}</DialogHeader>
                            <DialogBody>
                                <form onSubmit={formik.handleSubmit}>
                                    <div>
                                        <label htmlFor="page">Page</label>
                                        <input
                                            type="text"
                                            id="page"
                                            name="page"
                                            className="form-input"
                                            onChange={formik.handleChange}
                                            value={formik.values.page}
                                        />
                                        {formik.errors.page && formik.touched.page && (
                                            <p className="text-sm text-red-500">{formik.errors.page}</p>
                                        )}
                                    </div>

                                    <DialogFooter>
                                        <Button type="submit" className="btn btn-primary" color="green">
                                            {isEditMode ? 'Update' : 'Add'}
                                        </Button>
                                        <Button type="button" className="ms-2" onClick={() => setOpen(false)} variant="text" color="red">
                                            Cancel
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogBody>
                        </Dialog>

                        {openDel && <DeleteModal open={openDel} onClose={() => setOpenDel(false)}
                            onDelete={
                                () => handleDelmodal()
                            }
                            message="Are you sure you want to delete this page?" />}
                    </div>
                </div >
            )}
        </>
    )
}

export default AllPages
