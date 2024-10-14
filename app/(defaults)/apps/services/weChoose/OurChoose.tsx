'use client';
import MainChoose from '@/components/apps/reuseable/Choose';
import WhychooseData from '@/components/apps/reuseable/WhychooseData';
import React, { useState } from 'react';

function OurChoose() {
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
                <MainChoose type={type} />
                <WhychooseData type={type} />
            </div>
        </div>
    );
}

export default OurChoose;
