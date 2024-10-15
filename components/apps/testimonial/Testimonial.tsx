'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import IconPencil from '@/components/icon/icon-pencil';
import IconTrash from '@/components/icon/icon-trash';
import { Button, Dialog, DialogHeader, DialogBody, DialogFooter } from '@material-tailwind/react';
import { fetchDataWithToken, addClientVoice, updateClientVoice, deleteClientVoice } from '../../utils/Helper';
import Loading from '@/components/layouts/loading';
import { useFormik, FormikErrors } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-hot-toast';
import DeleteModal from '@/components/Modals/DeleteModal';
// import 'datatables.net-dt/css/jquery.dataTables.min.css';
import $ from 'jquery';
import 'datatables.net';

// Define types for form values
interface FormValues {
    name: string;
    clientInfo: string;
    reviews: string;
    enTitle: string;
    arTitle: string;
    enSubtitle: string;
    arSubtitle: string;
}
interface HeaderData {
    titleEn: string;
    titleAr: string;
    subtitleEn: string;
    subtitleAr: string;
}

function Testimonial() {
    const [open, setOpen] = useState(false);
    const [openDel, setOpenDel] = useState(false);
    const [image, setImage] = useState<File | null>(null);
    const [testimonials, setTestimonials] = useState<any[]>([]);
    const [selectedTestimonial, setSelectedTestimonial] = useState<any>(null);
    const [header, setHeader] = useState<HeaderData>({
        titleEn: '',
        titleAr: '',
        subtitleEn: '',
        subtitleAr: '',
    });
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEditMode, setIsEditMode] = useState(false);

    // Fetch testimonials on component mount
    const getTestimonials = async () => {
        try {
            const data = await fetchDataWithToken();
            console.log(data);
            setTestimonials(data?.data[0]?.data?.en?.testimonials?.voices);
            setHeader({
                titleEn: data?.data[0]?.data?.en?.testimonials?.title || '',
                titleAr: data?.data[0]?.data?.en?.testimonials?.arTitle || '',
                subtitleEn: data?.data[0]?.data?.en?.testimonials?.subtitle || '',
                subtitleAr: data?.data[0]?.data?.en?.testimonials?.arSubtitle || '',
            });
        } catch (error) {
            console.error('Error fetching testimonials:', error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        getTestimonials();
    }, []);

    useEffect(() => {
        if (!loading && testimonials.length > 0) {
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
    }, [testimonials, loading]);

    const formik = useFormik<FormValues>({
        initialValues: {
            name: '',
            clientInfo: '',
            reviews: '',
            enTitle: header.titleEn || '',
            arTitle: header.titleAr || '',
            enSubtitle: header.subtitleEn || '',
            arSubtitle: header.subtitleAr || '',
        },
        enableReinitialize: true,
        validationSchema: Yup.object({
            name: Yup.string().required('Name is required'),
            clientInfo: Yup.string().required('Position is required'),
            reviews: Yup.string().required('Review is required'),
        }),
        onSubmit: async (values: FormValues) => {
            console.log('Testimonail==>', values);
            try {
                setLoading(true);
                let result;

                if (isEditMode) {
                    console.log("Yes Im in")
                    // Updating existing testimonial
                    result = await updateClientVoice(
                        values.enTitle,
                        values.enSubtitle,
                        values.arTitle,
                        values.arSubtitle,
                        [{ name: values.name, clientInfo: values.clientInfo, reviews: values.reviews }],
                        selectedTestimonial._id
                    );
                    console.log("Another")

                    if (result && result.message) {
                        toast.success(result.message);
                        setTestimonials((prevTestimonials) =>
                            prevTestimonials.map((testimonial) => (testimonial._id === selectedTestimonial._id ? { ...testimonial, ...values, image: previewUrl || testimonial.image } : testimonial))
                        );
                        setOpen(false);
                        formik.resetForm();
                        setPreviewUrl(null);
                    } else {
                        setOpen(false);
                        toast.error('Failed to update testimonial');
                    }
                } else {
                    // Adding new testimonial
                    result = await addClientVoice(
                        values.enTitle,
                        values.enSubtitle,
                        values.arTitle,
                        values.arSubtitle,
                        [{ name: values.name, clientInfo: values.clientInfo, reviews: values.reviews }],
                        image
                    );

                    if (result && result.message) {
                        toast.success(result.message);
                        setTestimonials((prevTestimonials) => [...prevTestimonials, { ...values, image: previewUrl }]);
                        setOpen(false);
                        formik.resetForm();
                        setPreviewUrl(null);
                    } else {
                        toast.error('Failed to add testimonial');
                    }
                }
            } catch (error) {
                console.error('Error saving testimonial:', error);
                toast.error('Failed to save testimonial');
            } finally {
                setLoading(false);
            }
        },
    });

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            setImage(file); // Store the file in state

            // Read the file as a Base64 string
            const reader = new FileReader();
            reader.readAsDataURL(file);

            reader.onloadend = () => {
                setPreviewUrl(reader.result as string); // Set the Base64 string as the preview URL
            };
        }
    };
    const handleOpen = (testimonial: any = null) => {
        setSelectedTestimonial(testimonial);
        setIsEditMode(!!testimonial); // Check if in edit mode

        if (testimonial) {
            formik.setValues({
                name: testimonial?.name || '',
                clientInfo: testimonial?.clientInfo || '',
                reviews: testimonial?.reviews || '',
                enTitle: header.titleEn || '',
                arTitle: header.titleAr || '',
                enSubtitle: header.subtitleEn || '',
                arSubtitle: header.subtitleAr || '',
            });
        } else {
            formik.resetForm();
        }

        // Always setOpen(true) after preparing form data
        setOpen(true);
    };
    const handleDelete = async (id: string) => {
        console.log('ID===>', id);
        try {
            const result = await deleteClientVoice(id);
            console.log('first===>', result);
            setOpenDel(false);
            toast.success('Testimonial deleted successfully');
            getTestimonials();
            window.location.reload();
        } catch (error) {
            toast.error('Failed to delete testimonial');
        }
    };

    const [testimonialId, setTestimonialId] = useState<any>();

    const handleDeleteClick = (id: string) => {
        setOpenDel(true);
        setTestimonialId(id);
    };

    return (
        <>
            {loading ? (
                <Loading />
            ) : (
                <div>
                    <h2 className="mb-1 flex items-center px-2 py-3 font-extrabold uppercase ">
                        <span>Testimonial</span>
                    </h2>
                    <div className="panel border-white-light px-3 dark:border-[#1b2e4b]">
                        <div className="py-3">
                            <button type="button" onClick={() => handleOpen()} className="btn btn-primary ml-auto">
                                Add
                            </button>
                        </div>

                        <div className="w-full overflow-x-scroll">
                            <table id="testimonialsTable" className="display max-sm:overflow-x-scroll">
                                <thead>
                                    <tr>
                                        <th>Image</th>
                                        <th>Name</th>
                                        <th>Position</th>
                                        <th>Client Reviews</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {testimonials.map((testimonial, index) => (
                                        <tr key={index}>
                                            <td>{testimonial.image && <Image src={testimonial.image} alt="testimonial" className="h-14 w-14 rounded-full object-cover" width={50} height={50} />}</td>
                                            <td>{testimonial.name}</td>
                                            <td>{testimonial.clientInfo}</td>
                                            <td>{testimonial.reviews}</td>
                                            <td className="h-full items-center">
                                                <button onClick={() => handleOpen(testimonial)}>
                                                    <IconPencil />
                                                </button>
                                                <button onClick={() => handleDeleteClick(testimonial._id)} className="ms-2">
                                                    <IconTrash />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <Dialog open={open} className="h-[90svh] overflow-y-scroll  dark:bg-[#060818] " handler={() => setOpen(false)}>
                            <DialogHeader>{isEditMode ? 'Edit Testimonial' : 'Add Testimonial'}</DialogHeader>
                            <DialogBody>
                                <form onSubmit={formik.handleSubmit}>
                                    <div>
                                        <label htmlFor="enTitle">Title (EN)</label>
                                        <input type="text" id="enTitle" name="enTitle" className="form-input" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.enTitle} />
                                        {formik.errors.enTitle && formik.touched.enTitle && <div className="text-xs text-red-800">{formik.errors.enTitle}</div>}
                                    </div>
                                    <div>
                                        <label htmlFor="arTitle">Title (AR)</label>
                                        <input type="text" id="arTitle" name="arTitle" className="form-input" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.arTitle} />
                                        {formik.errors.arTitle && formik.touched.arTitle && <div className="text-xs text-red-800">{formik.errors.arTitle}</div>}
                                    </div>
                                    <div>
                                        <label htmlFor="enSubtitle">Subtitle (EN)</label>
                                        <input
                                            type="text"
                                            id="enSubtitle"
                                            name="enSubtitle"
                                            className="form-input"
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.enSubtitle}
                                        />
                                        {formik.errors.enSubtitle && formik.touched.enSubtitle && <div className="text-xs text-red-800">{formik.errors.enSubtitle}</div>}
                                    </div>
                                    <div>
                                        <label htmlFor="arSubtitle">Subtitle (EN)</label>
                                        <input
                                            type="text"
                                            id="arSubtitle"
                                            name="arSubtitle"
                                            className="form-input"
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.arSubtitle}
                                        />
                                        {formik.errors.arSubtitle && formik.touched.arSubtitle && <div className="text-xs text-red-800">{formik.errors.arSubtitle}</div>}
                                    </div>
                                    <div>
                                        <label htmlFor="name">Name</label>
                                        <input type="text" id="name" name="name" className="form-input" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.name} />
                                        {formik.errors.name && formik.touched.name && <div className="text-xs text-red-800">{formik.errors.name}</div>}
                                    </div>
                                    <div>
                                        <label htmlFor="clientInfo">Client Info</label>
                                        <input
                                            type="text"
                                            id="clientInfo"
                                            name="clientInfo"
                                            className="form-input"
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.clientInfo}
                                        />
                                        {formik.errors.clientInfo && formik.touched.clientInfo && <div className="text-xs text-red-800">{formik.errors.clientInfo}</div>}
                                    </div>
                                    <div>
                                        <label htmlFor="reviews">Reviews</label>
                                        <textarea id="reviews" name="reviews" className="form-input" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.reviews} />
                                        {formik.errors.reviews && formik.touched.reviews && <div className="text-xs text-red-800">{formik.errors.reviews}</div>}
                                    </div>
                                    <div>
                                        <label htmlFor="image">Image</label>
                                        {previewUrl && (
                                            <div className="my-2">
                                                <Image width={1000} height={1000} src={previewUrl} className="h-20 w-20 object-cover" alt=".." />
                                            </div>
                                        )}
                                        <label htmlFor="image" className="btn btn btn-primary w-fit" style={{ cursor: 'pointer' }}>
                                            Choose Image
                                            <input type="file" id="image" accept="image/*" className="form-input" onChange={handleFileSelect} style={{ display: 'none' }} />
                                        </label>
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

                        {openDel && <DeleteModal open={openDel} onClose={() => setOpenDel(false)} onDelete={() => handleDelete(testimonialId)} message="Are you sure you want to delete this work?" />}
                    </div>
                </div>
            )}
        </>
    );
}

export default Testimonial;
