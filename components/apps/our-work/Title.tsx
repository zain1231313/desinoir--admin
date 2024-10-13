// import React from 'react';
// import ReactQuill from 'react-quill';

// function Title() {




//     return (
//         <div>
//             <div className="max-md:gap-2 max-sm:grid-cols-1 mb-2 grid grid-cols-2 gap-4 gap-y-0">
//                 <div>
//                     <label>Title</label>
//                     <input
//                         type="text"
//                         name="title"
//                         className="w-full border-[1px] px-2 py-2 dark:border-[#17263C] dark:bg-[#121E32]"
//                         value={formik.values.title}
//                         onChange={formik.handleChange}
//                         onBlur={formik.handleBlur}
//                     />
//                 </div>
//                 <div>
//                     <label>Arabic Title</label>
//                     <input
//                         type="text"
//                         name="arTitle"
//                         className="w-full border-[1px] px-2 py-2 dark:border-[#17263C] dark:bg-[#121E32]"
//                         value={formik.values.arTitle}
//                         onChange={formik.handleChange}
//                         onBlur={formik.handleBlur}
//                     />
//                 </div>
//                 <div>
//                     <label>Subtitle</label>
//                     <input
//                         type="text"
//                         name="subtitle"
//                         className="w-full border-[1px] px-2 py-2 dark:border-[#17263C] dark:bg-[#121E32]"
//                         value={formik.values.subtitle}
//                         onBlur={formik.handleBlur}
//                         onChange={formik.handleChange}
//                     />
//                 </div>
//                 <div>
//                     <label>Arabic Subtitle</label>
//                     <input
//                         type="text"
//                         name="arSubtitle"
//                         className="w-full border-[1px] px-2 py-2 dark:border-[#17263C] dark:bg-[#121E32]"
//                         value={formik.values.arSubtitle}
//                         onChange={formik.handleChange}
//                         onBlur={formik.handleBlur}
//                     />
//                 </div>
//                 <div>
//                     <label>Types</label>
//                     <select name="types" className="form-select" value={formik.values.types} onChange={formik.handleChange} onBlur={formik.handleBlur}>
//                         <option value=""></option>
//                         <option value="uiux">UI/UX</option>
//                         <option value="branding">Branding</option>
//                         <option value="graphicdesign">Graphic Design</option>
//                         <option value="motiongraphic">Motion Graphic</option>
//                     </select>
//                 </div>
//             </div>
//             {/* Primary Image */}
//             <div className="my-2">
//                 <label>Primary Image</label>
//                 {imagePreview && (
//                     <div className="my-2">
//                         <img src={imagePreview} alt="Preview" className="h-20 w-20 rounded-lg object-cover" />
//                     </div>
//                 )}
//                 <label htmlFor="primaryImage" className="btn btn-primary w-fit" style={{ cursor: 'pointer' }}>
//                     Choose Image
//                     <input type="file" id="primaryImage" name="primaryImage" accept="image/*" onChange={handlePrimaryImageChange} className="form-input" style={{ display: 'none' }} />
//                 </label>
//             </div>

//             <div className="max-md:gap-2 max-sm:grid-cols-1 mb-2 grid grid-cols-2 gap-4 gap-y-0">
//                 <div className="mt-4">
//                     <h5 className="my-3 text-lg font-semibold dark:text-white-light">Description English</h5>
//                     <div className="relative rounded bg-gray-50 dark:bg-[#0E1726]">
//                         <ReactQuill
//                             theme="snow"
//                             value={formik.values.description}
//                             onChange={(content) => {
//                                 formik.setFieldValue('description', content);
//                             }}
//                             placeholder="Description English"
//                         />
//                     </div>
//                 </div>

//                 <div className="mt-4">
//                     <h5 className="my-3 text-lg font-semibold dark:text-white-light">Description Arabic</h5>
//                     <div className="relative rounded bg-gray-50 dark:bg-[#0E1726]">
//                         <ReactQuill
//                             theme="snow"
//                             value={formik.values.arDescription}
//                             onChange={(content) => {
//                                 formik.setFieldValue('arDescription', content);
//                             }}
//                             placeholder="Description Arabic"
//                         />
//                     </div>
//                 </div>
//             </div>

//             <div className="my-2">
//                 <label>Description Image</label>
//                 {descriptionPreview && (
//                     <div className="my-2">
//                         <img src={descriptionPreview} alt="Preview" className="h-20 w-20 rounded-lg object-cover" />
//                     </div>
//                 )}
//                 <label htmlFor="description" className="btn btn-primary w-fit" style={{ cursor: 'pointer' }}>
//                     Choose Image
//                     <input type="file" id="description" accept="image/*" name="description" onChange={handleDescriptionImageChange} className="form-input" style={{ display: 'none' }} />
//                 </label>
//             </div>
//         </div>
//     );
// }

// export default Title;
