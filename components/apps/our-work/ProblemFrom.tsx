import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { updateProblemStatement } from '@/components/utils/Helper';

const ProblemStatementForm = ({ id, data }: any) => {
    console.log('Problem=>', data);
    const [problemPreview, setProblemPreview] = useState(data?.ProblemStatementImage || null);

    const formik = useFormik({
        initialValues: {
            ProblemStatementTitle: data?.ProblemStatementTitle?.en || '',
            arProblemStatementTitle: data?.ProblemStatementTitle?.ar || '',
            ProblemStatementDescription: data?.ProblemStatementDescription?.en || '',
            arProblemStatementDescription: data?.ProblemStatementDescription?.ar || '',
            ProblemStatementImage: null,
        },
        onSubmit: async (values) => {
            const formData = new FormData();
            formData.append('ProblemStatementTitle', JSON.stringify({ en: values.ProblemStatementTitle, ar: values.arProblemStatementTitle }));
            formData.append('ProblemStatementDescription', JSON.stringify({ en: values.ProblemStatementDescription, ar: values.arProblemStatementDescription }));

            if (values.ProblemStatementImage) {
                formData.append('ProblemStatementImage', values.ProblemStatementImage);
            }

            try {
                const result = await updateProblemStatement(id, formData);
                console.log('Update result:', result);
                // Handle success or error response accordingly
            } catch (error) {
                console.error('Update failed:', error);
            }
        },
    });

    const handleProblemImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                const previewUrl: string = reader.result as string;
                setProblemPreview(previewUrl);
                formik.setFieldValue('ProblemStatementImage', file); // Store file in Formik
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <form onSubmit={formik.handleSubmit} className="max-md:gap-2 max-sm:grid-cols-1 mb-2 grid grid-cols-2 gap-4 gap-y-0">
            <div>
                <label>Problem Statement Title</label>
                <input
                    type="text"
                    name="ProblemStatementTitle"
                    className="w-full border-[1px] px-2 py-2 dark:border-[#17263C] dark:bg-[#121E32]"
                    value={formik.values.ProblemStatementTitle}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />
            </div>

            <div>
                <label>Arabic Problem Statement Title</label>
                <input
                    type="text"
                    name="arProblemStatementTitle"
                    className="w-full border-[1px] px-2 py-2 dark:border-[#17263C] dark:bg-[#121E32]"
                    value={formik.values.arProblemStatementTitle}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />
            </div>

            <div className="mt-4">
                <label>Problem Statement Description</label>
                <div className="relative rounded bg-gray-50 dark:bg-[#0E1726]">
                    <ReactQuill
                        theme="snow"
                        value={formik.values.ProblemStatementDescription}
                        onChange={(content) => formik.setFieldValue('ProblemStatementDescription', content)}
                        placeholder="Description English"
                    />
                </div>
            </div>

            <div className="mt-4">
                <label>Arabic Problem Statement Description</label>
                <div className="relative rounded bg-gray-50 dark:bg-[#0E1726]">
                    <ReactQuill
                        theme="snow"
                        value={formik.values.arProblemStatementDescription}
                        onChange={(content) => formik.setFieldValue('arProblemStatementDescription', content)}
                        placeholder="Description Arabic"
                    />
                </div>
            </div>

            <div>
                <label>Problem Statement Image</label>
                {problemPreview && (
                    <div className="my-2">
                        <img src={problemPreview} alt="Problem Statement Image" className="h-20 w-20 rounded-lg object-cover" />
                    </div>
                )}
                <label htmlFor="problemImage" className="btn btn-primary w-fit" style={{ cursor: 'pointer' }}>
                    Choose Image
                    <input type="file" name="problemImage" id="problemImage" accept="image/*" onChange={handleProblemImageChange} className="form-input" style={{ display: 'none' }} />
                </label>
            </div>

            <button type="submit" className="btn btn-primary mt-4">
                Update
            </button>
        </form>
    );
};

export default ProblemStatementForm;
