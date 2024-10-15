'use client';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useDispatch } from 'react-redux';
// import { useSelector } from 'react-redux';
// import { IRootState } from "@/store/index"
import { fetchAllOurWork, updateWorkData } from '@/components/utils/Helper';
import { useRouter, useSearchParams } from 'next/navigation';
import API_ENDPOINT from '@/components/apiRoutes/ApiRoutes';
import Image from 'next/image';

const EditWorkForm = () => {
const router = useRouter();
const searchParams = useSearchParams();
const id = searchParams.get('id');
console.log('ID==>', id);
// const dispatch = useDispatch();
// const workData = useSelector((state: IRootState) => state.selectedWork.selectedWork);

// Initialize state with default empty string to avoid TypeScript errors
const [data, setData] = useState<any>();
const [engDescrip, setEngDescrip] = useState<string>('');
const [arDescrip, setArDescrip] = useState<string>('');
const [engProblemDescrip, setEngProblemDescrip] = useState<string>('');
const [arProblemDescrip, setArProblemDescrip] = useState<string>('');
const [engchallengesDescrip, setEngchallengesDescrip] = useState<string>('');
const [arChallengesDescrip, setArChallengesDescrip] = useState<string>('');
const [engSolutionDescrip, setEngSolutionDescrip] = useState<string>('');
const [arSolutionDescrip, setArSolutionDescrip] = useState<string>('');
const [engdescription2, setEngdescription2] = useState<string>('');
const [ardescription2, setArdescription2] = useState<string>('');

const [imagePreview, setImagePreview] = useState<string | null>(null);
const [problemPreview, setProblemPreview] = useState<string | null>(null);
const [challengePreview, setChallengePreview] = useState<string | null>(null);
const [solutionPreview, setSolutionPreview] = useState<string | null>(null);
const [description2Preview, setDescription2Preview] = useState<string | null>(null);
const [descriptionPreview, setDescriptionPreview] = useState<string | null>(null);
const [majorScreensPreviews, setMajorScreensPreviews] = useState<string[]>([]);

useEffect(() => {
const requestOptions: any = {
method: 'GET',
redirect: 'follow',
};

// fetch(`https://desinoir.com/backend/api/our-work/getWorkById/${id}`, requestOptions)
fetch(`${API_ENDPOINT.OUR_WORK_BY_ID}${id}`, requestOptions)
.then((response) => response.json())
.then((result) => {
return setData(result.data);
})
.catch((error) => console.error(error));
}, []);

const [fileName, setFileName] = useState<string | null>(null);
////////////////////////////

const navigate = useRouter();
const formik = useFormik({
initialValues: {
_id: id,
title: data?.title?.en || '',
arTitle: data?.title?.ar || '',
subtitle: data?.subtitle?.en || '',
arSubtitle: data?.subtitle?.ar || '',
types: data?.types || '',
description: data?.description?.en || '',
arDescription: data?.description?.ar || '',

primaryImage: data?.primaryImage || '',
descriptionImage: data?.descriptionImage || '',
},
enableReinitialize: true,
onSubmit: async (values) => {
const formData = new FormData();
formData.append('subtitle', values.subtitle);
formData.append('arSubtitle', values.arSubtitle);
formData.append('title', values.title);
formData.append('arTitle', values.arTitle);
formData.append('types', values.types);
formData.append('description', engDescrip);
formData.append('arDescription', arDescrip);
// Append Primary Image
if (values.primaryImage) {
formData.append('primaryImage', values.primaryImage);
}

if (values.descriptionImage) formData.append('descriptionImage', values.descriptionImage);

try {
if (id) {
const result = await updateWorkData(id, formData);
console.log(result);
setEngDescrip(result?.description?.en || '');
setArDescrip(result?.description?.ar || '');

if (result.success === true) {
toast.success(result.message);
navigate.push('/apps/our-work');
} else {
toast.error(result.message);
}
}
} catch (error: any) {
toast.error(error.message);
console.error('Failed to update work data:', error);
}
},
});

useEffect(() => {
setEngDescrip(data?.description?.en || '');
setArDescrip(data?.description?.ar || '');

// Set image previews
if (data?.primaryImage) {
setImagePreview(data?.primaryImage);
}

if (data?.descriptionImage) {
setDescriptionPreview(data?.descriptionImage);
}
}, [data]);

// Primary Image Handler
const handleDescriptionImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
const file = event.target.files?.[0];
if (file) {
const reader = new FileReader();
reader.onload = () => {
const previewUrl = reader.result as string;
setDescriptionPreview(previewUrl);
formik.setFieldValue('descriptionImage', file); // Store file in Formik
};
reader.readAsDataURL(file);
}
};
const handlePrimaryImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
const file = event.target.files?.[0];
if (file) {
const reader = new FileReader();
reader.onload = () => {
const previewUrl = reader.result as string;
setImagePreview(previewUrl);
formik.setFieldValue('primaryImage', file); // Store file in Formik
};
reader.readAsDataURL(file);
}
};

// Major Screens Images Handler
// const handleMajorScreensImagesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
// const files = event.target.files;
// if (files) {
// const filesArray = Array.from(files);
// const filePreviews = filesArray.map((file) => {
// const reader = new FileReader();
// reader.readAsDataURL(file);
// return new Promise<string>((resolve) => {
// reader.onload = () => resolve(reader.result as string);
// });
// });

// // Set previews and the actual files in Formik
// Promise.all(filePreviews).then((previews) => {
// setMajorScreensPreviews(previews); // Local state for previews
// formik.setFieldValue('MajorScreensImages', filesArray); // Store files in Formik
// });
// }
// };

// Description2 Image Handler
// const handleDescription2Image = (event: React.ChangeEvent<HTMLInputElement>) => {
// const file = event.target.files?.[0];
// if (file) {
// const reader = new FileReader();
// reader.onload = () => {
// const previewUrl = reader.result as string;
// setDescription2Preview(previewUrl); // Local state for preview
// formik.setFieldValue('description2Image', file); // Store file in Formik
// };
// reader.readAsDataURL(file);
// }
// };
const toolbarOptions = [
[{ font: [] }, { size: [] }],
['bold', 'italic', 'underline', 'strike'],
[{ color: [] }, { background: [] }],
[{ script: 'sub' }, { script: 'super' }],
[{ header: '1' }, { header: '2' }, 'blockquote', 'code-block'],
[{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
[{ align: [] }],
['link', 'image', 'video'],
['clean'],
];

const modules = {
toolbar: toolbarOptions,
};
return (
<form onSubmit={formik.handleSubmit}>
<h2 className="mb-1 flex items-center px-2 py-3 font-extrabold uppercase">
<span>Edit Work</span>
</h2>
<div className="panel border-white-light px-3 dark:border-[#1b2e4b]">
<div className="max-md:gap-2 max-sm:grid-cols-1 mb-2 grid grid-cols-2 gap-4 gap-y-0">
<div>
<label>Title</label>
<input
type="text"
name="title"
className="w-full border-[1px] px-2 py-2 dark:border-[#17263C] dark:bg-[#121E32]"
value={formik.values.title}
onChange={formik.handleChange}
onBlur={formik.handleBlur}
/>
</div>
<div>
<label>Arabic Title</label>
<input
type="text"
name="arTitle"
className="w-full border-[1px] px-2 py-2 dark:border-[#17263C] dark:bg-[#121E32]"
value={formik.values.arTitle}
onChange={formik.handleChange}
onBlur={formik.handleBlur}
/>
</div>
<div>
<label>Subtitle</label>
<input
type="text"
name="subtitle"
className="w-full border-[1px] px-2 py-2 dark:border-[#17263C] dark:bg-[#121E32]"
value={formik.values.subtitle}
onBlur={formik.handleBlur}
onChange={formik.handleChange}
/>
</div>
<div>
<label>Arabic Subtitle</label>
<input
type="text"
name="arSubtitle"
className="w-full border-[1px] px-2 py-2 dark:border-[#17263C] dark:bg-[#121E32]"
value={formik.values.arSubtitle}
onChange={formik.handleChange}
onBlur={formik.handleBlur}
/>
</div>
<div>
<label>Types</label>
<select name="types" className="form-select" value={formik.values.types} onChange={formik.handleChange} onBlur={formik.handleBlur}>
<option value=""></option>
<option value="uiux">UI/UX</option>
<option value="branding">Branding</option>
<option value="graphicdesign">Graphic Design</option>
<option value="motionGraphic">Motion Graphic</option>
</select>
</div>
</div>
{/* Primary Image */}
<div className="my-2">
<label>Primary Image</label>
{imagePreview && (
<div className="my-2">
<Image width={1000} height={1000} src={imagePreview} alt="Preview" className="h-20 w-20 rounded-lg object-cover" />
</div>
)}
<label htmlFor="primaryImage" className="btn btn-primary w-fit" style={{ cursor: 'pointer' }}>
Choose Image
<input type="file" id="primaryImage" name="primaryImage" accept="image/*" onChange={handlePrimaryImageChange} className="form-input" style={{ display: 'none' }} />
</label>
</div>

<div className="max-md:gap-2 max-sm:grid-cols-1 mb-2 grid grid-cols-2 gap-4 gap-y-0">
<div className="mt-4">
<h5 className="my-3 text-lg font-semibold dark:text-white-light">Description English</h5>
<div className="relative rounded bg-gray-50 dark:bg-[#0E1726]">
<ReactQuill
theme="snow"
modules={modules}
value={formik.values.description}
onChange={(content) => {
formik.setFieldValue('description', content);
}}
placeholder="Description English"
/>
</div>
</div>

<div className="mt-4">
<h5 className="my-3 text-lg font-semibold dark:text-white-light">Description Arabic</h5>
<div className="relative rounded bg-gray-50 dark:bg-[#0E1726]">
<ReactQuill
theme="snow"
modules={modules}
value={formik.values.arDescription}
onChange={(content) => {
formik.setFieldValue('arDescription', content);
}}
placeholder="Description Arabic"
/>
</div>
</div>
</div>

<div className="my-2">
<label>Description Image</label>
{descriptionPreview && (
<div className="my-2">
<Image width={1000} height={1000} src={descriptionPreview} alt="Preview" className="h-20 w-20 rounded-lg object-cover" />
</div>
)}
<label htmlFor="description" className="btn btn-primary w-fit" style={{ cursor: 'pointer' }}>
Choose Image
<input type="file" id="description" accept="image/*" name="description" onChange={handleDescriptionImageChange} className="form-input" style={{ display: 'none' }} />
</label>
</div>
<div className="mt-4">
<button type="submit" className="rounded bg-blue-500 px-4 py-2 text-white">
Submit
</button>
</div>
</div>
</form>
);
};

export default EditWorkForm;