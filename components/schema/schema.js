import * as Yup from 'yup';

export const LoginSchema = Yup.object().shape({
    email: Yup.string()
        .email('Invalid email')
        .matches(/^[^\s@]+@[^\s@]+.[^\s@]+$/, 'Email should be valid')
        .required('Email is required'),

    password: Yup.string().required('Password is required'),
});

export const AddUISchema = Yup.object({
    title: Yup.string().required('Title is required'),
    arTitle: Yup.string().required('Arabic Title is required'),
    subtitle: Yup.string().required('Subtitle is required'),
    arSubtitle: Yup.string().required('Arabic Subtitle is required'),
    priceOrFree: Yup.string().required('Price or Free is required'),
    types: Yup.string().required('Type is required'),
    Description: Yup.string().required('Description is required'),
    DescriptionAr: Yup.string().required('Arabic Description is required'),
    uIKitrecommendedTitle: Yup.string().required('UI Kit Recommended Title is required'),
    arUIKitrecommendedTitle: Yup.string().required('Arabic UI Kit Recommended Title is required'),
    uIKitrecommendedDescription: Yup.string().required('UI Kit Recommended Description is required'),
    arUIKitrecommendedDescription: Yup.string().required('Arabic UI Kit Recommended Description is required'),
    whatinsideTitle: Yup.string().required('What’s Inside Title is required'),
    arWhatinsideTitle: Yup.string().required('Arabic What’s Inside Title is required'),
    whatinsideDescription: Yup.string().required('What’s Inside Description is required'),
    arWhatinsideDescription: Yup.string().required('Arabic What’s Inside Description is required'),
    licenseTitle: Yup.string().required('License Title is required'),
    arLicenseTitle: Yup.string().required('Arabic License Title is required'),
    licenseDescription: Yup.string().required('License Description is required'),
    arLicenseDescription: Yup.string().required('Arabic License Description is required'),
    primaryImage: Yup.mixed().nullable().required('Primary Image is required'),
    sliderImages: Yup.array().of(Yup.mixed().nullable()).min(1, 'At least one slider image is required'),
});

export const FaqSchema = Yup.object().shape({
    enQuestion: Yup.string().required('Question in English is required'),
    arQuestion: Yup.string().required('Question in Arabic is required'),
    enAnswer: Yup.string().required('Answer in English is required'),
    arAnswer: Yup.string().required('Answer in Arabic is required'),
    type: Yup.string().required('Type is required')
}); 

export const WorkSchema = Yup.object({
    subtitle: Yup.string().required('Subtitle is required'),
    arSubtitle: Yup.string().required('Arabic Subtitle is required'),
    title: Yup.string().required('Title is required'),
    arTitle: Yup.string().required('Arabic Title is required'),
    types: Yup.string().required('Type is required'),
    description: Yup.string().required('Description is required'),
    arDescription: Yup.string().required('Arabic Description is required'),
    ProblemStatementTitle: Yup.string().required('Problem Statement Title is required'),
    arProblemStatementTitle: Yup.string().required('Arabic Problem Statement Title is required'),
    ProblemStatementDescription: Yup.string().required('Problem Statement Description is required'),
    arProblemStatementDescription: Yup.string().required('Arabic Problem Statement Description is required'),
    challengesTitle: Yup.string().required('Challenges Title is required'),
    arChallengesTitle: Yup.string().required('Arabic Challenges Title is required'),
    challengesDescription: Yup.string().required('Challenges Description is required'),
    arChallengesDescription: Yup.string().required('Arabic Challenges Description is required'),
    SolutionTitle: Yup.string().required('Solution Title is required'),
    arSolutionTitle: Yup.string().required('Arabic Solution Title is required'),
    SolutionDescription: Yup.string().required('Solution Description is required'),
    arSolutionDescription: Yup.string().required('Arabic Solution Description is required'),
    description2: Yup.string().required('Second Description is required'),
    arDescription2: Yup.string().required('Arabic Second Description is required'),
    primaryImage: Yup.mixed().required('Primary Image is required'),
    problemImage: Yup.mixed().required('Problem Statement Image is required'),
    challengeImage: Yup.mixed().required('Challenge Image is required'),
    solutionImage: Yup.mixed().required('Solution Image is required'),
    description2Image: Yup.mixed().required('Second Description Image is required'),
    descriptionImage: Yup.mixed().required('Description Image is required'),
    majorScreensImages: Yup.array().min(1, 'At least one major screen image is required'),
});

export const sliderSchema = Yup.object({
    titleEnglish: Yup.string().required('English title is required').min(3, 'English title must be at least 3 characters'),
    titleArabic: Yup.string().required('Arabic title is required').min(3, 'Arabic title must be at least 3 characters'),
    type: Yup.string().required('Type is required'),
});

export const teamSchema = Yup.object({
    nameEnglish: Yup.string().required('Name (English) is required'),
    nameArabic: Yup.string().required('Name (Arabic) is required'),
    designationEnglish: Yup.string().required('Designation (English) is required'),
    designationArabic: Yup.string().required('Designation (Arabic) is required'),
    image: Yup.mixed().nullable().required('Image is required'),
});

export const ArticleSchema = Yup.object({
    titleEnglish: Yup.string().required('Title in English is required'),
    titleArabic: Yup.string().required('Title in Arabic is required'),
    arTitle: Yup.string().required('Arabic title is required'),
    name: Yup.string().required('Name in English is required'),
    arName: Yup.string().required('Name in Arabic is required'),
    types: Yup.string().required('Type is required'),
    primaryImage: Yup.mixed().nullable().required('Primary Image is required'),
    secondaryImage: Yup.mixed().nullable(),
    adminImage: Yup.mixed().nullable(),
});

export const WhyChooseSchema = Yup.object({
    titleEn: Yup.string().required('English title is required'),
    titleAr: Yup.string().required('Arabic title is required'),
    descriptionEn: Yup.string().required('English description is required'),
    descriptionAr: Yup.string().required('Arabic description is required'),
    workIcon: Yup.mixed()
        .required('An icon is required')
        .test('fileType', 'Only image files are allowed', (value) => value && ['image/jpeg', 'image/png'].includes(value.type)),
});

export const processDataSchema = Yup.object({
    processTitleEn: Yup.string().required('English title is required'),
    processTitleAr: Yup.string().required('Arabic title is required'),
    processDescriptionEn: Yup.string().required('English description is required'),
    processDescriptionAr: Yup.string().required('Arabic description is required'),
});

export const workDataSchema = Yup.object({
    workIcon: Yup.mixed().required('Work icon is required'),
    workTitleEn: Yup.string().required('English title is required'),
    workTitleAr: Yup.string().required('Arabic title is required'),
    workDescriptionEn: Yup.string().required('English description is required'),
    workDescriptionAr: Yup.string().required('Arabic description is required'),
});
