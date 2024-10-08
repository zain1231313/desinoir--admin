import { useState, useEffect } from 'react';

interface AccordionItem {
    id: number;
    titleEn: string;
    titleAr: string;
    contentEn: string;
    contentAr: string;
}

interface DynamicAccordionProps {
    initialAccordions: AccordionItem[];
    onAccordionsChange: (accordions: AccordionItem[]) => void;
}

const DynamicAccordion = ({
    initialAccordions = [],
    onAccordionsChange,
}: DynamicAccordionProps) => {
    const [accordions, setAccordions] = useState<AccordionItem[]>(initialAccordions);
    const [formData, setFormData] = useState({ titleEn: '', titleAr: '', contentEn: '', contentAr: '' });
    const [activeAccordionId, setActiveAccordionId] = useState<number | null>(null);

    // Effect to notify parent component when accordions change
    useEffect(() => {
        if (onAccordionsChange) {
            onAccordionsChange(accordions);
        }
    }, [accordions, onAccordionsChange]);

    // Handle adding a new accordion item
    const handleAddAccordion = (e: any) => {
        e.preventDefault();
        const { titleEn, titleAr, contentEn, contentAr } = formData;
        if (titleEn && titleAr && contentEn && contentAr) {
            const newAccordion: AccordionItem = {
                id: Date.now(), // Temporary ID
                titleEn,
                titleAr,
                contentEn,
                contentAr,
            };

            setAccordions([...accordions, newAccordion]);
            setFormData({ titleEn: '', titleAr: '', contentEn: '', contentAr: '' });
        }
    };

    // Handle toggling an accordion item
    const handleToggleAccordion = (id: number) => {
        setActiveAccordionId((prevId) => (prevId === id ? null : id));
    };

    // Handle deleting an accordion item
    const handleDeleteAccordion = (id: number) => {
        const updatedAccordions = accordions.filter((accordion) => accordion.id !== id);
        setAccordions(updatedAccordions);
    };

    return (
        <div>
            <div>
                {accordions.map((accordion) => (
                    <div key={accordion.id} className="accordion-item my-2">
                        <div >
                            <h3
                                className="border-[1px] border-solid border-[#E9F2F6] rounded-[18px]  py-2 px-4 cursor-pointer bg-[#eeeeee] flex justify-between items-center text-xl "
                                onClick={() => handleToggleAccordion(accordion.id)}
                            >
                                {accordion.titleEn}
                                <button
                                    className="btn btn-danger ml-4"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteAccordion(accordion.id);
                                    }}
                                >
                                    Delete
                                </button>
                            </h3>
                            <p
                                className={`${activeAccordionId === accordion.id ? 'block' : 'hidden'
                                    } py-3 mb-1 mx-2 px-2 flex border-[1px] shadow-lg rounded-b-[18px] rounded-t-[0px]  border-t-0 border-solid border-[#E9F2F6]`}
                            >

                                <div className='w-1/2 max-lg:w-full'>

                                    <h2 className='text-xl font-semibold'>
                                        Question
                                    </h2>

                                    <div className='px-6'>
                                        <div>
                                            {accordion.titleEn}
                                        </div>
                                        <div>
                                            {accordion.titleAr}
                                        </div>
                                    </div>
                                </div>


                                <div className='w-1/2 max-lg:w-full'>

                                    <h2 className='text-xl font-semibold'>
                                        Answer
                                    </h2>

                                    <div className='px-6'>
                                        <div>
                                            {accordion.contentEn} <br />
                                        </div>
                                        <div>
                                            {accordion.contentAr}
                                        </div>
                                    </div>
                                </div>

                            </p>
                        </div>

                    </div>
                ))}
            </div>
            <div className="mt-4">
                <input
                    type="text"
                    placeholder="Accordian Question English"
                    value={formData.titleEn}
                    onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                    className="block mb-2 w-full py-2 px-4 bg-[#f1f0f0] rounded-[12px]"
                />
                <input
                    type="text"
                    placeholder="Accordian Question Arabic"
                    value={formData.titleAr}
                    onChange={(e) => setFormData({ ...formData, titleAr: e.target.value })}
                    className="block mb-2 w-full py-2 px-4 bg-[#f1f0f0] rounded-[12px]"
                />
                <textarea
                    placeholder="Accordian Answer English"
                    value={formData.contentEn}
                    onChange={(e) => setFormData({ ...formData, contentEn: e.target.value })}
                    className="block mb-2 w-full py-2 px-4 bg-[#f1f0f0] rounded-[12px]"
                />
                <textarea
                    placeholder="Accordian Answer English"
                    value={formData.contentAr}
                    onChange={(e) => setFormData({ ...formData, contentAr: e.target.value })}
                    className="block mb-2 w-full py-2 px-4 bg-[#f1f0f0] rounded-[12px]"
                />
                <button className="btn btn-primary" onClick={handleAddAccordion}>
                    Add Accordion
                </button>
            </div>
        </div>
    );
};

export default DynamicAccordion;
