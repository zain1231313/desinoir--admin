'use client';
import React, { useEffect, useState } from 'react';
import { fetchAllHeaders, addHeader } from '@/components/utils/Helper'; // Ensure this points to your helper functions
import { Button, Dialog, DialogHeader, DialogBody, DialogFooter } from '@material-tailwind/react';
import toast from 'react-hot-toast';
import $ from 'jquery';
import 'datatables.net';

const AllHeader = () => {
    const [open, setOpen] = useState(false);
    const [headers, setHeaders] = useState<any[]>([]); // Fetch and store headers data
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        enHeaderTitle: '',
        arHeaderTitle: '',
        type: '',
    });

    const handleOpen = () => setOpen(!open);

    // Reinitialize DataTables whenever headers data changes
    useEffect(() => {
        if (headers.length > 0) {
            // Destroy and reinitialize DataTables to reflect updated data
            if ($.fn.dataTable.isDataTable('#headersTable')) {
                $('#headersTable').DataTable().destroy();
            }

            $('#headersTable').DataTable({
                paging: true,
                searching: true,
                ordering: false,
                info: false,
            });
        }
    }, [headers]);

    const getHeadersData = async () => {
        try {
            const data = await fetchAllHeaders();
            if (data && Array.isArray(data.data)) {
                setHeaders(data.data);
            } else {
                setHeaders([]);
            }
        } catch (error) {
            console.error('Failed to fetch headers:', error);
            setHeaders([]);
        }
    };

    useEffect(() => {
        getHeadersData();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const result = await addHeader(formData);
            if (result && result.success) {
                setOpen(false);
                getHeadersData();
                toast.success(result.message);
                window.location.reload();
            } else {
                toast.error(result.message);
            }
        } catch (error: any) {
            toast.error(error.message);
            console.error('Failed to add header:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <h2 className="mb-1 flex items-center px-2 py-3 font-extrabold uppercase">
                <span>All Headers</span>
            </h2>
            <div className="panel border-white-light px-3 dark:border-[#1b2e4b]">
                <div>
                    <div className="py-3">
                        <button type="button" onClick={handleOpen} className="btn btn-primary ml-auto">
                            Add
                        </button>
                    </div>

                    <div className="w-full overflow-x-scroll">
                        <table id="headersTable" className="display max-sm:overflow-x-scroll">
                            <thead>
                                <tr>
                                    <th>Page</th>
                                    <th>English Title</th>
                                    <th>Arabic Title</th>
                                </tr>
                            </thead>
                            <tbody>
                                {headers?.map((header) => (
                                    <tr key={header.id}>
                                        <td>{header?.type}</td>
                                        <td>{header.headerTitle?.en}</td>
                                        <td>{header.headerTitle?.ar}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Add Dialog */}
            <Dialog className="h-fit overflow-y-scroll dark:bg-[#060818]" open={open} handler={handleOpen}>
                <DialogHeader className=" dark:text-white">Add Header</DialogHeader>
                <DialogBody>
                    <div className="max-lg:gap-0 grid grid-cols-1 gap-3">
                        <div className="max-sm:my-2 lg:my-1">
                            <div>
                                <label>English Title</label>
                                <input
                                    type="text"
                                    name="enHeaderTitle"
                                    placeholder="Title English"
                                    value={formData.enHeaderTitle}
                                    onChange={handleInputChange}
                                    className="form-input ltr:rounded-l-none rtl:rounded-r-none"
                                />
                            </div>
                        </div>
                        <div className="max-sm:my-2 lg:my-1">
                            <div>
                                <label>Arabic Title</label>
                                <input
                                    type="text"
                                    name="arHeaderTitle"
                                    placeholder="Title Arabic"
                                    value={formData.arHeaderTitle}
                                    onChange={handleInputChange}
                                    className="form-input ltr:rounded-l-none rtl:rounded-r-none"
                                />
                            </div>
                        </div>
                        <div className="max-sm:my-2 lg:my-1">
                            <div>
                                <label>Type</label>
                                <select name="type" placeholder="Type" value={formData.type} onChange={handleInputChange} className="form-select">
                                    <option value="">Select a type</option>
                                    <option value="uiux">uiux</option>
                                    <option value="branding">branding</option>
                                    <option value="graphicdesign">graphicdesign</option>
                                    <option value="motionGraphic">motionGraphic</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </DialogBody>
                <DialogFooter>
                    <Button variant="text" color="red" onClick={handleOpen} className="mr-1">
                        <span>Cancel</span>
                    </Button>
                    <Button variant="gradient" color="green" onClick={handleSubmit} disabled={loading}>
                        <span>Confirm</span>
                    </Button>
                </DialogFooter>
            </Dialog>
        </>
    );
};

export default AllHeader;
