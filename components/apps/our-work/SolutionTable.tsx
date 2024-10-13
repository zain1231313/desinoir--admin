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

function SolutionTable() {
    const [open, setOpen] = useState<boolean>(false);
    const [works, setWorks] = useState<any[]>([]);
    const [workId, setWorkId] = useState<string>('');
    const dispatch = useDispatch();

    const getWorksData = async () => {
        const data = await fetchAllOurWork();
        setWorks(data.data);
    };

    useEffect(() => {
        getWorksData();
    }, []);

    useEffect(() => {
        if (works.length > 0) {
            if ($.fn.dataTable.isDataTable('#WorkSolution')) {
                $('#WorkSolution').DataTable().destroy();
            }

            $('#WorkSolution').DataTable({
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

    console.log('Works ==>', works);

    return (
        <>
            <h2 className="mb-1 flex items-center px-2 py-3 font-extrabold uppercase">
                <span>Solution Section </span>
            </h2>
            <div className="panel border-white-light px-3 dark:border-[#1b2e4b]">
                <div className="w-full overflow-x-scroll">
                    <table id="WorkTable" className="display overflow-x-scroll">
                        <thead>
                            <tr>
                                <th>Solution Image</th>
                                <th>Solution Title</th>
                                <th>Solution Title (AR)</th>
                                <th>Solution Description</th>
                                <th>Solution Description (AR)</th>
                                <th>Created at</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {works?.map((work) => (
                                <tr key={work._id} onClick={() => handleRowClick(work)}>
                                    <td>
                                        <Image className="h-10 w-10 rounded-full" src={work?.SolutionImage} alt={work?.title?.en} width={40} height={40} />
                                    </td>
                                    {/* <td className="capitalize">{work?.types}</td> */}
                                    <td>{work?.SolutionTitle?.en}</td>
                                    <td>{work?.SolutionTitle?.ar}</td>
                                    <td>{work?.SolutionDescription?.en?.slice(0, 20) + '...'}</td>
                                    <td>{work?.SolutionDescription?.ar?.slice(0, 20) + '...'}</td>
                                    <td>{new Date(work?.createdAt).toLocaleDateString()}</td>
                                    <td>
                                        <div className="flex items-center justify-center gap-3">
                                            <button>
                                                <Link href={`/apps/our-work/edit-solution?id=${work._id}`}>
                                                    <IconPencil />
                                                </Link>
                                            </button>
                                            {/* <button onClick={() => handleDeleteClick(work._id)}>
                                                <IconTrash />
                                            </button> */}
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

export default SolutionTable;
