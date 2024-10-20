'use client';
import MainWeWork from '@/components/apps/reuseable/MainWeWork';
import Workdata from '@/components/apps/reuseable/Workdata';
import { fetchType } from '@/components/utils/Helper';
import React, { useEffect, useState } from 'react';
interface OptionType {
    _id: string;
    type: string;
}
function OurWok() {
    const [type, setType] = useState();
    const [edit, setEdit] = useState(false);
    const [types, setTypes] = useState<[]>([]);
    const [selecttype, setSelectType] = useState<OptionType | undefined>();


    const fetchData = async () => {
        try {
            const typeData = await fetchType();
            console.log("Our typeData=>", typeData)
            setType(typeData?.data[2]);
            setTypes(typeData?.data);

        } catch (error) {
            console.error('Failed to fetch data:', error);
        }
    };
    console.log(type)
    useEffect(() => {
        fetchData();
    }, []);


    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = e.target.value;
        // console.log("Selected value->", selectedValue);
        const selectedObj = types.find((option: any) => option.type === selectedValue);
        // console.log("Our Work=>", selectedObj)
        if (selectedObj) {

            //@ts-ignore
            setType(selectedObj);
            setSelectType(selectedObj);
        } else {
            setSelectType(undefined);
        }
    };
    return (
        <>
            <div>OurWok</div>
            <div>
                {edit ? (
                    <input className="form-input" readOnly disabled name="type" value={selecttype?.type || ''} placeholder="Type" />
                ) : (
                    <div>
                        <select
                            className="form-select"
                            value={selecttype?.type || ''}
                            onChange={handleSelectChange}
                        >
                            {types.map((option: any, index: number) => (
                                <option key={index} value={option.type}>
                                    {option.type}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                <MainWeWork type={type} />
                <Workdata type={type} />
            </div>
        </>
    );
}

export default OurWok;
