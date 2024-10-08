'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import IconPencil from '@/components/icon/icon-pencil';
import IconTrash from '@/components/icon/icon-trash';
import Link from 'next/link';
import { fetchAllOurWork, deleteWorkById } from '@/components/utils/Helper';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedWork } from '@/store/WorkSlice';
import { IRootState } from '@/store/index';
import DeleteModal from '@/components/Modals/DeleteModal';
import toast from 'react-hot-toast';
import $ from 'jquery';
import 'datatables.net';

function OurWork() {
    const [open, setOpen] = useState<boolean>(false);
    const [works, setWorks] = useState<any[]>([]);
    const [workId, setWorkId] = useState<string>('');
    const dispatch = useDispatch();
    const selectedWork = useSelector((state: IRootState) => state.selectedWork.selectedWork);
    const [loading, setLoading] = useState(false);

    const handleOpen = () => setOpen(!open);

    const getWorksData = async () => {
        const data = await fetchAllOurWork();
        setWorks(data.data);
    };

    useEffect(() => {
        getWorksData();
    }, []);

    useEffect(() => {
        if (works.length > 0) {
            if ($.fn.dataTable.isDataTable('#WorkTable')) {
                $('#WorkTable').DataTable().destroy();
            }

            $('#WorkTable').DataTable({
                paging: true,
                searching: true,
                ordering: false,
                info: false,
            });
        }
    }, [works]);

    const handleRowClick = (work: any) => {
        dispatch(setSelectedWork(work));
    };

    const handleDeleteClick = (id: string) => {
        setOpen(true);
        setWorkId(id);
    };

    const handleConfirmDelete = async (id: string) => {
        try {
            const result = await deleteWorkById(id);
            if (result && result.success) {
                setWorks(works.filter((work) => work?._id !== id));
                setOpen(false);
                toast.success(result.message);
            } else {
                setOpen(false);
                toast.error(result.message);
            }
        } catch (error) {
            console.error('Error deleting work:', error);
        }
    };

    return (
        <>
            <h2 className="mb-1 flex items-center px-2 py-3 font-extrabold uppercase">
                <span>Our Work</span>
            </h2>
            <div className="panel border-white-light px-3 dark:border-[#1b2e4b]">
                <div className="py-3">
                    <Link href={'/apps/our-work/add-work'}>
                        <button type="button" className="btn btn-primary ml-auto">
                            Add
                        </button>
                    </Link>
                </div>

                <div className="w-full overflow-x-scroll">
                    <table id="WorkTable" className="display overflow-x-scroll">
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Category</th>
                                <th>Title (EN)</th>
                                <th>Title (AR)</th>
                                <th>Subtitle (EN)</th>
                                <th>Subtitle (AR)</th>
                                <th>Created at</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {works?.map((work) => (
                                <tr key={work._id} onClick={() => handleRowClick(work)}>
                                    <td>
                                        <Image className="h-10 w-10 rounded-full" src={work?.primaryImage} alt={work?.title?.en} width={40} height={40} />
                                    </td>
                                    <td className='capitalize'>{work?.types}</td>
                                    <td>{work?.title?.en}</td>
                                    <td>{work?.title?.ar}</td>
                                    <td>{work?.subtitle?.en}</td>
                                    <td>{work?.subtitle?.ar}</td>
                                    <td>{new Date(work?.createdAt).toLocaleDateString()}</td>
                                    <td>
                                        <div className="flex items-center justify-center gap-3">
                                            <button>
                                                <Link href={`/apps/our-work/edit-works?id=${work._id}`}>
                                                    <IconPencil />
                                                </Link>
                                            </button>
                                            <button onClick={() => handleDeleteClick(work._id)}>
                                                <IconTrash />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {open && <DeleteModal open={open} onClose={() => setOpen(false)} onDelete={() => handleConfirmDelete(workId)} message="Are you sure you want to delete this work?" />}
            </div>
        </>
    );
}

export default OurWork;
