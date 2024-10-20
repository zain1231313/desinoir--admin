'use client';
import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button } from '@material-tailwind/react';
import IconPencil from '@/components/icon/icon-pencil';
import IconTrash from '@/components/icon/icon-trash';
import { getFaqs, updateFaq, createFaq, deleteFaq, fetchType } from '@/components/utils/Helper';
import toast from 'react-hot-toast';
import $ from 'jquery';
import 'datatables.net';
import { FaqSchema } from '@/components/schema/schema';
import DeleteModal from '@/components/Modals/DeleteModal';
import { useSelector } from 'react-redux';
import { IRootState } from '@/store';
import { selectTypeArr, setTypeArr } from '@/store/AricleSlice';
import { useDispatch } from 'react-redux';
interface OptionType {
    _id: string;
    type: string;
}
interface FAQ {
    _id: string;
    question: {
        en: string;
        ar: string;
    };
    answer: {
        en: string;
        ar: string;
    };
    typeId: string;
    createdAt: string;
    updatedAt: string;
}

const Faq = () => {
    const typeArr = useSelector((state: IRootState) => selectTypeArr(state));
    const [data, setData] = useState<FAQ[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [openDel, setOpenDel] = useState(false);
    const [selectedFaq, setSelectedFaq] = useState<FAQ | null>(null);
    const [edit, setEdit] = useState(false);
    const [types, setTypes] = useState<[]>(typeArr || []);
    const [selecttype, setSelectType] = useState<OptionType>();
    const dispatch = useDispatch();
    useEffect(() => {
        if (!loading && data?.length > 0) {
            if ($.fn.dataTable.isDataTable('#FaqTable')) {
                $('#FaqTable').DataTable().destroy();
            }
            // Initialize DataTables only if the table is present in the DOM
            if ($('#FaqTable').length) {
                $('#FaqTable').DataTable({
                    paging: true,
                    searching: true,
                    ordering: false,
                    info: false,
                });
            }
        }
    }, [data, loading]);

    const fetchData = async () => {
        const faqData = await getFaqs();
        setData(faqData.data);
        const result = await fetchType();
        setTypes(result.data)
        dispatch(setTypeArr(result.data));
        setLoading(false);
    };
    useEffect(() => {
        const interval = setInterval(() => {
            fetchData(); // Fetch headers data every X seconds
        }, 5000); // Refresh every 5 seconds (you can adjust the interval as needed)

        // Clean up the interval when the component unmounts
        return () => clearInterval(interval);
    }, []);
    useEffect(() => {
        fetchData();
    }, []);
    const handleDelete = async (id: string) => {
        setOpenDel(true);
        setFaqId(id);
    };
    const handleModalDelete = async (id: string) => {
        try {
            setLoading(true);
            await deleteFaq(id);
            window.location.reload();
            fetchData();
            setOpenDel(false);
            toast.success('FAQ deleted successfully');
        } catch (error) {
            // console.error('Failed to delete FAQ:', error);
            toast.error('Failed to delete FAQ');
        }
    };

    const formik = useFormik({
        initialValues: {
            enQuestion: '',
            arQuestion: '',
            enAnswer: '',
            arAnswer: '',
            typeId: '',
        },
        validationSchema: FaqSchema,
        enableReinitialize: true,
        onSubmit: async (values) => {
            console.log('Values Faqs==>', values);
            const faqData = {
                enQuestion: values.enQuestion,
                arQuestion: values.arQuestion,
                enAnswer: values.enAnswer,
                arAnswer: values.arAnswer,
                typeId: selecttype,
            };

            // console.log('FaqData being sent:', faqData);

            try {
                if (selectedFaq?._id) {
                    await updateFaq(selectedFaq._id, faqData);
                    window.location.reload();
                } else {
                    //@ts-ignore
                    await createFaq(faqData);
                    window.location.reload();
                }
                fetchData();
                setOpenDialog(false);
            } catch (error) {
                // console.error('Error during FAQ operation:', error);
                toast.error('Failed to process FAQ');
            }
        },
    });

    const handleEdit = (faq: FAQ) => {
        setEdit(true);
        setSelectedFaq(faq);
        formik.setValues({
            enQuestion: faq.question.en,
            arQuestion: faq.question.ar,
            enAnswer: faq.answer.en,
            arAnswer: faq.answer.ar,
            typeId: faq.typeId,
        });
        setOpenDialog(true);

    };
    const handleAdd = () => {
        setEdit(false);
        setSelectedFaq(null);
        formik.resetForm(); // Clear form fields
        setOpenDialog(true);
    };
    const [faqId, setFaqId] = useState<any>();
    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = e.target.value;
        formik.setFieldValue('typeId', selectedValue);
        //@ts-ignore
        const selectedObj = types.find(option => option.type === selectedValue);
        //@ts-ignore
        setSelectType(selectedObj?._id);

    };
    return (
        <div>
            <h2 className="mb-1 flex items-center px-2 py-3 font-extrabold uppercase">
                <span>FAQ</span>
            </h2>

            <div className="py-3">
                <button onClick={handleAdd} className="btn btn-primary ml-auto">
                    Add FAQ
                </button>
            </div>

            <div className="w-full overflow-x-scroll">
                <table id="FaqTable" className="display overflow-x-scroll">
                    <thead>
                        <tr>
                            <th>Question (EN)</th>
                            <th>Question (AR)</th>
                            <th>Answer (EN)</th>
                            <th>Answer (AR)</th>
                            <th>Type</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.map((faq: FAQ) => {
                            //@ts-ignore
                            const typeData: any = typeArr.find(type => type._id === faq.types);
                            console.log("first", faq)
                            return (<tr key={faq?._id}>
                                <td>{faq?.question?.en}</td>
                                <td>{faq?.question?.ar}</td>
                                <td className="text-ellipsis">{faq?.answer?.en}</td>
                                <td className="text-ellipsis">{faq?.answer?.ar}</td>

                                <td>{typeData ? typeData?.type : 'N/A'}</td>
                                <td>
                                    <div className="flex items-center">
                                        <button onClick={() => handleEdit(faq)} className="">
                                            <IconPencil />
                                        </button>
                                        <button onClick={() => handleDelete(faq._id)} className="ms-2">
                                            <IconTrash />
                                        </button>
                                    </div>
                                </td>
                            </tr>)

                        })}
                    </tbody>
                </table>
            </div>

            <Dialog open={openDialog} handler={() => setOpenDialog(false)} className="h-fit overflow-y-scroll dark:bg-[#060818]">
                <DialogHeader>{selectedFaq ? 'Edit FAQ' : 'Add FAQ'}</DialogHeader>
                <form onSubmit={formik.handleSubmit}>
                    <DialogBody>
                        <div className="flex flex-col gap-4">
                            <div>
                                <label>Question (EN)</label>
                                <input className="form-input" name="enQuestion" value={formik.values.enQuestion} onChange={formik.handleChange} placeholder="Enter question in English" />
                                {formik.touched.enQuestion && formik.errors.enQuestion && <p className="text-sm text-red-500">{formik.errors.enQuestion}</p>}
                            </div>
                            <div>
                                <label>Question (AR)</label>
                                <input className="form-input" name="arQuestion" value={formik.values.arQuestion} onChange={formik.handleChange} placeholder="Enter question in Arabic" />
                                {formik.touched.arQuestion && formik.errors.arQuestion && <p className="text-sm text-red-500">{formik.errors.arQuestion}</p>}
                            </div>
                            <div>
                                <label>Answer (EN)</label>
                                <input className="form-input" name="enAnswer" value={formik.values.enAnswer} onChange={formik.handleChange} placeholder="Enter answer in English" />
                                {formik.touched.enAnswer && formik.errors.enAnswer && <p className="text-sm text-red-500">{formik.errors.enAnswer}</p>}
                            </div>
                            <div>
                                <label>Answer (AR)</label>
                                <input className="form-input" name="arAnswer" value={formik.values.arAnswer} onChange={formik.handleChange} placeholder="Enter answer in Arabic" />
                                {formik.touched.arAnswer && formik.errors.arAnswer && <p className="text-sm text-red-500">{formik.errors.arAnswer}</p>}
                            </div>
                            <div>
                                <label>Type</label>
                                {edit ? (
                                    <input className="form-input" readOnly disabled name="typeId" value={formik.values.typeId} placeholder="Type" />
                                ) : (
                                    <select className="form-select" name="typeId" value={formik.values.typeId} onChange={handleSelectChange}>
                                        <option value="">Select Option</option>
                                        {types.map((option: any, index: number) => (
                                            <option key={index} value={option.type}>
                                                {option.type}
                                            </option>
                                        ))}
                                    </select>
                                )}

                                {formik.touched.typeId && formik.errors.typeId && <p className="text-sm text-red-500">{formik.errors.typeId}</p>}
                            </div>
                        </div>
                    </DialogBody>
                    <DialogFooter>
                        <Button type="button" color="red" onClick={() => setOpenDialog(false)} variant="outlined">
                            Cancel
                        </Button>
                        <Button type="submit" color="green" className="ms-3">
                            Save
                        </Button>
                    </DialogFooter>
                </form>
            </Dialog>

            {openDel && <DeleteModal open={openDel} onClose={() => setOpenDel(false)} onDelete={() => handleModalDelete(faqId)} message="Are you sure you want to delete this work?" />}
        </div>
    );
};

export default Faq;
