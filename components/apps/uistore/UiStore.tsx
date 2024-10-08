'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Loading from '@/components/layouts/loading';
import { deleteUiStore, fetchUIStoreData } from '@/components/utils/Helper'; // Path to your helper function
import IconPencil from '@/components/icon/icon-pencil';
import IconTrash from '@/components/icon/icon-trash';
import { useDispatch } from 'react-redux';
import { setSelectedItem } from '@/store/UiStoreSlice';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import $ from 'jquery';
import 'datatables.net';
import toast from 'react-hot-toast';
import DeleteModal from '@/components/Modals/DeleteModal';

const UiStore = () => {
    const [loading, setLoading] = useState(true);
    const [uiId, setUiId] = useState<string>('');
    const [testimonials, setTestimonials] = useState<any[]>([]); // Use appropriate type if needed
    const [open, setOpen] = useState<boolean>(false);
    const dispatch = useDispatch();
    const navigate = useRouter();
    useEffect(() => {
        if (!loading && testimonials.length > 0) {
            if ($.fn.dataTable.isDataTable('#uistoreTable')) {
                $('#uistoreTable').DataTable().destroy();
            }

            // Initialize DataTables only if the table is present in the DOM
            if ($('#uistoreTable').length) {
                $('#uistoreTable').DataTable({
                    paging: true,
                    searching: true,
                    ordering: false,
                    info: false,
                });
            }
        }
    }, [testimonials, loading]);

    const loadData = async () => {
        const data = await fetchUIStoreData();
        setTestimonials(data);
        setLoading(false);
    };
    useEffect(() => {
        loadData();
    }, []);

    const handleDeleteClick = async (id: string) => {
        setOpen(true);
        setUiId(id);
    };

    const handleConfirmDelete = async (id: string) => {
        try {
            setLoading(true);
            await deleteUiStore(id);
            loadData();
            setOpen(false);
            toast.success('Deleted successfully');
        } catch (error) {
            toast.error('Deleted Succesfully');
            // Handle the error, e.g., show a notification
            console.error('Failed to delete:', error);
        }
    };

    return (
        <>
            {loading ? (
                <Loading />
            ) : (
                <div>
                    <h2 className="mb-1 flex items-center px-2 py-3 font-extrabold uppercase">
                        <span>UI Store</span>
                    </h2>
                    <div className="panel border-white-light px-3 dark:border-[#1b2e4b]">
                        <Link href={'/apps/ui-store/add-uistore'} className="">
                            <button className="btn btn-primary my-3 ml-auto">Add</button>
                        </Link>
                        {/* Display testimonials in table */}
                        <div className="w-full overflow-x-scroll">
                            <table className="display max-sm:overflow-x-scroll" id="uistoreTable">
                                <thead>
                                    <tr>
                                        <th>Image</th>
                                        <th>Title (EN)</th>
                                        <th>Title (AR)</th>
                                        <th>Price</th>
                                        <th>Type</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {testimonials?.map((item, index) => (
                                        <tr key={index}>
                                            <td>
                                                <Image className="h-10 w-10 rounded-full object-cover" src={item.primaryImage} width={40} height={40} alt="UI Store Image" />
                                            </td>
                                            <td>{item.title?.en}</td>
                                            <td>{item.title?.ar}</td>
                                            <td>{item.priceOrFree}</td>
                                            <td>{item.types}</td>
                                            <td>
                                                <Link
                                                    href={{
                                                        pathname: '/apps/ui-store/edit-uistore',
                                                        query: { id: item._id },
                                                    }}
                                                >
                                                    <button>
                                                        <IconPencil />
                                                    </button>
                                                </Link>
                                                <button onClick={() => handleDeleteClick(item._id)} className="ms-2">
                                                    <IconTrash />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
            {open && <DeleteModal open={open} onClose={() => setOpen(false)} onDelete={() => handleConfirmDelete(uiId)} message="Are you sure you want to delete this UI Item?" />}
        </>
    );
};

export default UiStore;
