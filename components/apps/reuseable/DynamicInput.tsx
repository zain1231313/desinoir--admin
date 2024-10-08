import React, { useState } from 'react';

interface DynamicInputProps {
    onChange: (fields: { id: number; value: string }[]) => void;
    fields: number;
    HeadText?: string;
}

const DynamicInput: React.FC<DynamicInputProps> = ({ onChange, fields, HeadText }) => {
    const [inputFields, setInputFields] = useState([{ id: 1, value: '' }]);

    const addInputField = () => {
        if (inputFields.length < fields) {
            const newField = { id: inputFields.length + 1, value: '' };
            setInputFields([...inputFields, newField]);
        }
    };

    const removeInputField = (index: number) => {
        if (inputFields.length > 1) {
            const updatedFields = inputFields.filter((_, i) => i !== index);
            setInputFields(updatedFields);
            onChange(updatedFields); // Send updated fields to the parent component
        }
    };

    const handleInputChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const updatedFields = inputFields.map((field, i) =>
            i === index ? { ...field, value: event.target.value } : field
        );
        setInputFields(updatedFields);
        onChange(updatedFields); // Send updated fields to the parent component
    };
    return (
        <div>
            <div className="w-full py-3 flex justify-between flex-col md:flex-row">
                <div>
                    <h5 className="text-lg font-semibold dark:text-white-light">{HeadText}</h5>
                </div>
                <button type="button" className="btn btn-primary" onClick={addInputField}>
                    Add Text Field
                </button>
            </div>
            <div className="grid lg:grid-cols-2 grid-col-1 gap-4 max-lg:gap-0">
                {inputFields.map((field, index) => (
                    <div key={field.id} className="flex gap-2">
                        <div className="form-input ltr:rounded-l-none rtl:rounded-r-none">
                            <input
                                type="text"
                                name={`input-${field.id}`}
                                value={field.value}
                                className="bg-transparent w-full outline-0"
                                onChange={(e) => handleInputChange(index, e)}
                                placeholder="Enter text"
                                required
                            />
                        </div>
                        <button
                            type="button"
                            className="delete-btn rounded-lg bg-red-800 px-2 py-2 text-white"
                            onClick={() => removeInputField(index)}
                        >
                            Delete
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DynamicInput;
