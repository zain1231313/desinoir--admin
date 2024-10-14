'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import IconPencil from '@/components/icon/icon-pencil';
import IconTrash from '@/components/icon/icon-trash';
import { Button, Dialog, DialogHeader, DialogBody, DialogFooter } from '@material-tailwind/react';
import { useFormik } from 'formik';
import { fetchTeamMembers, addTeamMember, updateTeamMember, deleteTeamMember } from '@/components/utils/Helper';
import Loading from '@/components/layouts/loading';
import { toast } from 'react-hot-toast';
import $ from 'jquery';
import 'datatables.net';
import { teamSchema } from '@/components/schema/schema';
import DeleteModal from '@/components/Modals/DeleteModal';
import TeamHeader from '../reuseable/TeamHeader';
type TeamMember = {
    _id: string;
    name: {
        en: string;
        ar: string;
    };
    designation: {
        en: string;
        ar: string;
    };
    image: string;
};

const Teams = () => {
    const [open, setOpen] = useState(false);
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
    const [loading, setLoading] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentItem, setCurrentItem] = useState<TeamMember | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [selectedTeamMemberId, setSelectedTeamMemberId] = useState<string | null>(null); // To track which member to delete
    const [openDel, setOpenDel] = useState(false); // To control the delete modal
    const [memberIdToDelete, setMemberIdToDelete] = useState<string | null>(null);

    const handleOpen = (member?: TeamMember) => {
        if (member) {
            setCurrentItem(member);
            setIsEditMode(true);
            setPreviewUrl(member.image);
        } else {
            setCurrentItem(null);
            setIsEditMode(false);
            setPreviewUrl(null);
        }
        setOpen(!open);
    };

    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        if (!loading && teamMembers?.length > 0) {
            if ($.fn.dataTable.isDataTable('#TeamTable')) {
                $('#TeamTable').DataTable().destroy();
            }

            if ($('#TeamTable').length) {
                $('#TeamTable').DataTable({
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
          nameEnglish: currentItem?.name?.en || '',
          nameArabic: currentItem?.name?.ar || '',
          designationEnglish: currentItem?.designation?.en || '',
          designationArabic: currentItem?.designation?.ar || '',
          image: currentItem?.image,
        },
        validationSchema: teamSchema,
        enableReinitialize: true,
        onSubmit: async (values) => {
          setLoading(true);
          const teamMemberDataToSend = new FormData();
          teamMemberDataToSend.append('teamMemberName', values.nameEnglish || '');
          teamMemberDataToSend.append('arTeamMemberName', values.nameArabic || '');
          teamMemberDataToSend.append('designation', values.designationEnglish || '');
          teamMemberDataToSend.append('arDesignation', values.designationArabic || '');
      
          if (values.image) {
            teamMemberDataToSend.append('image', values.image);
          }
      
          try {
            const result = isEditMode && currentItem?._id
              ? await updateTeamMember(currentItem._id, teamMemberDataToSend)
              : await addTeamMember(teamMemberDataToSend);
      
            if (result) {
              toast.success(result.message);
      
              setTeamMembers((prevData) =>
                isEditMode
                  ? prevData.map((item) => (item._id === result._id ? result : item))
                  : [...prevData, result]
              );
      
              if (!isEditMode) {
                formik.resetForm(); // Reset the form only on add
              }
      
              handleClose(); // Close the dialog
            }
          } catch (error: any) {
            toast.error(error.message);
            console.error(error);
          } finally {
            setLoading(false);
            getTeamMembers(); // Refresh team members list
          }
        },
      });

    const getTeamMembers = async () => {
        setLoading(true);
        try {
            const result = await fetchTeamMembers();
            setTeamMembers(result.data);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.error('Error fetching team members:', error);
        }
    };

    useEffect(() => {
        getTeamMembers();
    }, []);

    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);
    const handleDelete = async (id: string | null) => {
        if (!id) return; // If no ID is provided, return early

        try {
            const result = await deleteTeamMember(id); // Call the delete function
            toast.success('Deleted Successfully');

            setTeamMembers((prevData) => prevData.filter((member) => member._id !== id)); // Remove from state
            getTeamMembers(); // Re-fetch team members
            setOpenDel(false); // Close the modal after successful deletion
        } catch (error) {
            toast.error('An error occurred');
            console.error('Error deleting team member:', error);
        }
    };

    // const handleDelete = async () => {
    //     if (selectedTeamMemberId) {
    //         try {
    //             await deleteTeamMember(selectedTeamMemberId);
    //             toast.success('Deleted Successfully');
    //             setTeamMembers((prevData) => prevData.filter((member) => member._id !== selectedTeamMemberId));
    //             getTeamMembers();
    //             setOpenDel(false); // Close delete modal after deletion
    //         } catch (error) {
    //             toast.error('An error occurred');
    //             console.error('Error deleting team member:', error);
    //         }
    //     }
    // };
    return (
        <>
            {loading ? (
                <Loading />
            ) : (
                <div>
                    <TeamHeader/>
                    <h2 className="mb-1 flex items-center px-2 py-3 font-extrabold uppercase ">
                        <span>Team</span>
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
                                        <th>Image</th>
                                        <th>Name English</th>
                                        <th>Name Arabic</th>
                                        <th>Designation English</th>
                                        <th>Designation Arabic</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {teamMembers?.map((member) => (
                                        <tr key={member._id}>
                                            <td>
                                                <Image className="h-10 w-10 rounded-full" src={member.image} alt={member.name.en} width={40} height={40} />
                                            </td>
                                            <td>{member.name?.en}</td>
                                            <td>{member.name?.ar}</td>
                                            <td>{member.designation?.en}</td>
                                            <td>{member.designation?.ar}</td>
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
                                <h2 className=" flex items-center px-2 py-3 font-semibold text-[#0e1726] dark:text-[#888EA8] ">
                                    <span>Image</span>
                                </h2>

                                {previewUrl && <Image className="my-2 h-10 w-10 rounded-full" src={previewUrl} alt="Selected Image" width={40} height={40} />}
                                <label htmlFor="file-input" className="btn btn-primary w-fit" style={{ cursor: 'pointer' }}>
                                    Upload image
                                    <input
                                        type="file"
                                        id="file-input"
                                        name="image"
                                        accept="image/*"
                                        onChange={(event) => {
                                            if (event.currentTarget.files && event.currentTarget.files[0]) {
                                                const file = event.currentTarget.files[0];
                                                formik.setFieldValue('image', file);

                                                const objectUrl = URL.createObjectURL(file);
                                                setPreviewUrl(objectUrl);
                                            }
                                        }}
                                        className="form-input"
                                        style={{ display: 'none' }}
                                    />
                                </label>

                                <input
                                    type="file"
                                    name="image"
                                    onChange={(event) => {
                                        if (event.currentTarget.files && event.currentTarget.files[0]) {
                                            const file = event.currentTarget.files[0];
                                            formik.setFieldValue('image', file);

                                            const objectUrl = URL.createObjectURL(file);
                                            setPreviewUrl(objectUrl);
                                        }
                                    }}
                                    className="form-input"
                                    style={{ display: 'none' }}
                                />
                                {formik.touched.image && formik.errors.image ? <p className="m-0 p-0 text-xs text-red-800">{formik.errors.image}</p> : null}

                                <h2 className="mb-1 flex items-center px-2 py-3 font-semibold text-[#0e1726] dark:text-[#888EA8] ">
                                    <span>Name (English)</span>
                                </h2>
                                <input type="text" name="nameEnglish" value={formik.values.nameEnglish} onChange={formik.handleChange} className="form-input" />
                                {formik.touched.nameEnglish && formik.errors.nameEnglish ? <p className="m-0 p-0 text-xs text-red-800">{formik.errors.nameEnglish}</p> : null}

                                <h2 className="mb-1 flex items-center px-2 py-3 font-semibold text-[#0e1726] dark:text-[#888EA8] ">
                                    <span>Name (Arabic)</span>
                                </h2>
                                <input type="text" name="nameArabic" value={formik.values.nameArabic} onChange={formik.handleChange} className="form-input" />
                                {formik.touched.nameArabic && formik.errors.nameArabic ? <p className="m-0 p-0 text-xs text-red-800">{formik.errors.nameArabic}</p> : null}

                                <h2 className="mb-1 flex items-center px-2 py-3 font-semibold text-[#0e1726] dark:text-[#888EA8] ">
                                    <span>Designation (English)</span>
                                </h2>
                                <input type="text" name="designationEnglish" value={formik.values.designationEnglish} onChange={formik.handleChange} className="form-input" />
                                {formik.touched.designationEnglish && formik.errors.designationEnglish ? <p className="m-0 p-0 text-xs text-red-800">{formik.errors.designationEnglish}</p> : null}

                                <h2 className="mb-1 flex items-center px-2 py-3 font-semibold text-[#0e1726] dark:text-[#888EA8] ">
                                    <span>Designation (Arabic)</span>
                                </h2>
                                <input type="text" name="designationArabic" value={formik.values.designationArabic} onChange={formik.handleChange} className="form-input" />
                                {formik.touched.designationArabic && formik.errors.designationArabic ? <p className="m-0 p-0 text-xs text-red-800">{formik.errors.designationArabic}</p> : null}
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

export default Teams;
