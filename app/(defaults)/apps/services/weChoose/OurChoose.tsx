'use client';
import MainChoose from '@/components/apps/reuseable/Choose';
import WhychooseData from '@/components/apps/reuseable/WhychooseData';
import { fetchType } from '@/components/utils/Helper';
import React, { useEffect, useState } from 'react';

function OurChoose() {
    const [type, setType] = useState();
    const [edit, setEdit] = useState(false);
    const [types, setTypes] = useState<[]>([]);
    const [selecttype, setSelectType] = useState<OptionType | undefined>();

    interface OptionType {
        _id: string;
        type: string;
    }
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
        <div>
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

                <MainChoose type={type} />
                <WhychooseData type={type} />
            </div>
        </div>
    );
}

export default OurChoose;
