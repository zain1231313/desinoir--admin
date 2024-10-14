'use client';
import MainProcess from '@/components/apps/reuseable/MainProcess';
import ProcessData from '@/components/apps/reuseable/ProcessData';
import React, { useState } from 'react';

function OurProcess() {
    const [edit, setEdit] = useState(false);
    const [type, setType] = useState('uiux');

    const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setType(event.target.value); // Select type and update state
    };
    return (
        <div>
            <div>
                {edit ? (
                    <input className="form-input" readOnly disabled name="type" value={type} placeholder="Type" />
                ) : (
                    <div>
                        <select className="form-select" value={type} onChange={handleTypeChange} name="type">
                            <option value="">Select type</option>
                            <option value="uiux">UI/UX</option>
                            <option value="branding">Branding</option>
                            <option value="motionGraphic">Motion Graphic</option>
                            <option value="graphicdesign">Graphic Design</option>
                        </select>
                    </div>
                )}
                <MainProcess type={type} />
                <ProcessData type={type} />
            </div>
        </div>
    );
}

export default OurProcess;
