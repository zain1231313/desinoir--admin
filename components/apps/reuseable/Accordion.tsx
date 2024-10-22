// components/AccordionCustom.js
import IconPencil from '@/components/icon/icon-pencil';
import IconTrash from '@/components/icon/icon-trash';
import DeleteModal from '@/components/Modals/DeleteModal';
import { deleteWorkById, fetchAllOurWork } from '@/components/utils/Helper';

import toast from 'react-hot-toast';
import $ from 'jquery';
import 'datatables.net';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const Accordion = ({ tables }: any) => {
    const [openIndex, setOpenIndex] = useState(null);
    const [open, setOpen] = useState<boolean>(false);
    const [works, setWorks] = useState<any[]>([]);
    const [workId, setWorkId] = useState<string>('');

    const handleToggle = (index: any) => {
        setOpenIndex(openIndex === index ? null : index);
    };
    const getWorksData = async () => {
        const data = await fetchAllOurWork();
        setWorks(data.data);
    };

    useEffect(() => {
        getWorksData();
    }, []);

    useEffect(() => {
        if (works?.length > 0) {
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
            <div className="relative z-30 w-full px-4">
                {tables?.length
                    ? tables?.map((table: any, index: any) => (
                          <div key={index} className="pb-[20px] lg:pb-[40px]">
                              <div
                                  className="flex cursor-pointer items-center justify-between rounded-md bg-white-light/30 px-4 py-4 dark:bg-dark dark:bg-opacity-[0.08]"
                                  onClick={() => handleToggle(index)}
                              >
                                  <div className={`text-[18px]  ${openIndex === index ? 'text-black dark:text-white' : 'text-gray-500 dark:text-gray-600'}   lg:text-[22px]`}>{table.title}</div>
                                  <div>
                                      {openIndex === index ? (
                                          <svg width="27" height="16" viewBox="0 0 27 16" className="h-[12px] w-[20px]  fill-black dark:fill-white" xmlns="http://www.w3.org/2000/svg">
                                              <path d="M24.1999 14.1591L12.8668 3.52069L2.22838 14.8538C1.75593 15.3571 0.96507 15.3821 0.461764 14.9096C-0.0415416 14.4372 -0.0665448 13.6463 0.405912 13.143L11.8997 0.898694C12.1363 0.646719 12.4516 0.514813 12.7715 0.504701C13.0913 0.494589 13.4144 0.60631 13.6664 0.842841L25.9107 12.3367C26.414 12.8091 26.439 13.6 25.9665 14.1033C25.4941 14.6066 24.7032 14.6316 24.1999 14.1591Z" />
                                          </svg>
                                      ) : (
                                          <svg width="28" height="15" viewBox="0 0 28 15" className="h-[12px] w-[20px] fill-black dark:fill-white" xmlns="http://www.w3.org/2000/svg">
                                              <path d="M24.9911 0.366094L13.9998 11.3573L3.00859 0.366094C2.52047 -0.122031 1.72922 -0.122031 1.24109 0.366094C0.752969 0.854219 0.752969 1.64547 1.24109 2.13359L13.1161 14.0086C13.3605 14.253 13.6798 14.3748 13.9998 14.3748C14.3198 14.3748 14.6392 14.253 14.8836 14.0086L26.7586 2.13359C27.2467 1.64547 27.2467 0.854219 26.7586 0.366094C26.2705 -0.122031 25.4792 -0.122031 24.9911 0.366094Z" />
                                          </svg>
                                      )}
                                  </div>
                              </div>
                              <div className={`overflow-y-scroll transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-[400px] py-2' : 'max-h-0 py-0'}`}>
                                  {openIndex === index && (
                                      <div className="">
                                          <table id="WorkTable" className="display overflow-x-scroll">
                                              <thead>
                                                  <tr>
                                                      <th>Image</th>
                                                      <th>Title (EN)</th>
                                                      <th>Title (AR)</th>
                                                      {table?.data?.some((item: any) => item?.subtitle) && <th>Subtitle (EN)</th>}
                                                      {table?.data?.some((item: any) => item?.subtitle) && <th>Subtitle (AR)</th>}
                                                      <th>Description</th>
                                                      <th>Action</th>
                                                  </tr>
                                              </thead>
                                              <tbody className="h-fit">
                                                  {table?.data?.map((item: any, itemIndex: any) => (
                                                      <tr key={itemIndex}>
                                                          <td>{item?.primaryImage && <img src={item?.primaryImage} alt={item?.title?.en} className="h-8 w-8 rounded-full object-cover" />}</td>
                                                          <td>{item?.title?.en}</td>
                                                          <td>{item?.title?.ar}</td>
                                                          {item?.subtitle && (
                                                              <td>
                                                                  <div dangerouslySetInnerHTML={{ __html: item?.subtitle?.en.slice(0, 20) + '...' }} />
                                                              </td>
                                                          )}{' '}
                                                          {item?.subtitle && (
                                                              <td>
                                                                  <div dangerouslySetInnerHTML={{ __html: item?.subtitle?.ar.slice(0, 20) + '...' }} />
                                                              </td>
                                                          )}
                                                          <td>
                                                              <div dangerouslySetInnerHTML={{ __html: item?.description?.en.slice(0, 20) + '...' }} />
                                                          </td>
                                                          <td>
                                                              <div className="flex items-center justify-center gap-3">
                                                                  <button>
                                                                      <Link href={`/apps/our-work/${item?.linkUpdate}?id=${item.id}`}>
                                                                          <IconPencil />
                                                                      </Link>
                                                                  </button>
                                                                  <button onClick={() => handleDeleteClick(item.id)}>
                                                                      <IconTrash />
                                                                  </button>
                                                              </div>
                                                          </td>
                                                      </tr>
                                                  ))}
                                              </tbody>
                                          </table>
                                      </div>
                                  )}
                              </div>
                          </div>
                      ))
                    : ''}
            </div>
            {open && <DeleteModal open={open} onClose={() => setOpen(false)} onDelete={() => handleConfirmDelete(workId)} message="Are you sure you want to delete this work?" />}
        </>
    );
};

export default Accordion;
