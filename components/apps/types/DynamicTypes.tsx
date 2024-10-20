'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import IconPencil from '@/components/icon/icon-pencil';
import IconTrash from '@/components/icon/icon-trash';
import { Button, Dialog, DialogHeader, DialogBody, DialogFooter } from '@material-tailwind/react';
import { useFormik } from 'formik';
import { updateType, deleteType, fetchType, addType } from '@/components/utils/Helper';
import Loading from '@/components/layouts/loading';
import { toast } from 'react-hot-toast';
import $ from 'jquery';
import 'datatables.net';
import { teamSchema } from '@/components/schema/schema';
import DeleteModal from '@/components/Modals/DeleteModal';
import TeamHeader from '../reuseable/TeamHeader';
type TeamMember = {
    _id: string;
    type: string | null;
};

const DynamicTypes = () => {
    const [open, setOpen] = useState(false);
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
    const [loading, setLoading] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentItem, setCurrentItem] = useState<TeamMember | null>(null);
    const [openDel, setOpenDel] = useState(false); // To control the delete modal
    const [memberIdToDelete, setMemberIdToDelete] = useState<string | null>(null);
    const handleOpen = (member?: TeamMember) => {
        if (member) {
            setCurrentItem(member);
            setIsEditMode(true);
        } else {
            setCurrentItem(null);
            setIsEditMode(false);
        }
        setOpen(!open);
    };

    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        if (!loading && teamMembers?.length > 0) {
            if ($.fn.dataTable.isDataTable('#TypeTable')) {
                $('#TypeTable').DataTable().destroy();
            }
            if ($('#TypeTable').length) {
                $('#TypeTable').DataTable({
                    paging: true,
                    searching: true,
                    ordering: false,
                    info: false,
                });
            }
        }
    }, [teamMembers, loading]);

    const formik = useFormik({
        initialValues: {
            type: currentItem?.type,
        },
        enableReinitialize: true,
        // Inside formik submission logic
        onSubmit: async (values) => {
            try {
                const typeValue: any = values.type || ''; // Provide a fallback for undefined or null

                // Call the correct function based on whether it's edit mode or not
                const result = isEditMode && currentItem?._id
                    ? await updateType(currentItem._id, typeValue) // Ensure typeValue is always a string
                    : await addType(typeValue); // Ensure typeValue is always a string

                if (result) {

                    toast.success(result.message);
                    getTeamMembers();
                    setTeamMembers((prevData) =>
                        isEditMode
                            ? prevData.map((item) => (item._id === result._id ? result : item))
                            : [...prevData, result]
                    );
                    if (!isEditMode) {
                        formik.resetForm(); // Reset the form only after adding a new type
                    }
                    handleClose(); // Close the modal
                }
            } catch (error: any) {
                toast.error(error.message);
            }
        }


    });

    const getTeamMembers = async () => {
        setLoading(true);
        try {
            const result = await fetchType();
            setTeamMembers(result?.data);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.error('Error fetching team members:', error);
        }
    };

    useEffect(() => {
        getTeamMembers();
    }, []);


    const handleDelete = async (id: string | null) => {
        if (!id) return; // If no ID is provided, return early
        try {
            const result = await deleteType(id); // Call the delete function
            toast.success('Deleted Successfully');
            setTeamMembers((prevData) => prevData.filter((member) => member._id !== id)); // Remove from state
            getTeamMembers(); // Re-fetch team members
            setOpenDel(false); // Close the modal after successful deletion
        } catch (error) {
            toast.error('An error occurred');
            console.error('Error deleting team member:', error);
        }
    };
    return (
        <>
            {loading ? (
                <Loading />
            ) : (
                <div>
                    <h2 className="mb-1 flex items-center px-2 py-3 font-extrabold uppercase ">
                        <span>Type Dynamic</span>
                    </h2>
                    <div className="panel overflow-hidden border-white-light px-3 dark:border-[#1b2e4b]">
                        <div className="py-3">
                            <button type="button" onClick={() => handleOpen()} className="btn btn-primary ml-auto">
                                Add
                            </button>
                        </div>
                        <div className="w-full overflow-x-scroll">
                            <table className=" " id="TeamTable">
                                <thead>
                                    <tr>
                                        <th>Created</th>
                                        <th>Type</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {teamMembers?.map((member) => (
                                        <tr key={member._id}>

                                            <td>{member.type}</td>
                                            <td>{member.type}</td>
                                            <td>
                                                <div className="flex items-center gap-3">
                                                    <button onClick={() => handleOpen(member)}>
                                                        <IconPencil />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setOpenDel(true);
                                                            setMemberIdToDelete(member._id);
                                                        }}
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
                    </div>
                    {openDel && (
                        <DeleteModal open={openDel} onClose={() => setOpenDel(false)} onDelete={() => handleDelete(memberIdToDelete)} message="Are you sure you want to delete this team member?" />
                    )}

                    <Dialog className="h-fit overflow-y-scroll dark:bg-[#060818] " open={open} handler={handleClose}>
                        <DialogHeader className=" dark:text-white">{isEditMode ? 'Edit Team Member' : 'Add Team Member'}</DialogHeader>
                        <form onSubmit={formik.handleSubmit}>
                            <DialogBody>
                                <h2 className="mb-1 flex items-center px-2 py-3 font-semibold text-[#0e1726] dark:text-[#888EA8] ">
                                    <span>Type</span>
                                </h2>
                                <input type="text" name="type" value={formik.values.type || ''} onChange={formik.handleChange} className="form-input" />
                                {formik.touched.type && formik.errors.type ? <p className="m-0 p-0 text-xs text-red-800">{formik.errors.type}</p> : null}

                            </DialogBody>
                            <DialogFooter>
                                <Button type="button" variant="text" color="red" onClick={handleClose} className="mr-1">
                                    <span>Cancel</span>
                                </Button>
                                <Button type="submit" variant="gradient" color="green">
                                    <span>{isEditMode ? 'Update' : 'Add'} Member</span>
                                </Button>
                            </DialogFooter>
                        </form>
                    </Dialog>
                </div>
            )}
        </>
    );
};

export default DynamicTypes;
