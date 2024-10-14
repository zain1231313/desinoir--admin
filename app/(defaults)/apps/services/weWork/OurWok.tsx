'use client';
import MainWeWork from '@/components/apps/reuseable/MainWeWork';
import Workdata from '@/components/apps/reuseable/Workdata';
import React, { useState } from 'react';

function OurWok() {
    const [type, setType] = useState('uiux');
    const [edit, setEdit] = useState(false);
    const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setType(event.target.value); // Select type and update state
    };
    return (
        <>
            <div>OurWok</div>
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

                <MainWeWork type={type}/>
                <Workdata  type={type}/>
            </div>
        </>
    );
}

export default OurWok;
