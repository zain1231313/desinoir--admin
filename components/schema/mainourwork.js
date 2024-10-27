import * as Yup from 'yup';

export const MainOurWork = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    arTitle: Yup.string().required('Arabic title is required'),
    subtitle: Yup.string().required('Subtitle is required'),
    arSubtitle: Yup.string().required('Arabic subtitle is required'),
    description: Yup.string().required('Description is required'),
    arDescription: Yup.string().required('Arabic description is required'),
    primaryImage: Yup.mixed().required('Primary Image is required'),
    descriptionImage: Yup.mixed().required('Description Image is required'),
});
export const ProblemSchema = Yup.object().shape({
    ProblemStatementTitle: Yup.string().required('Problem Statement Title is required'),
    arProblemStatementTitle: Yup.string().required('Arabic Problem Statement Title is required'),
    ProblemStatementDescription: Yup.string().required('Problem Statement Description is required'),
    arProblemStatementDescription: Yup.string().required('Arabic Problem Statement Description is required'),
    ProblemStatementImage: Yup.mixed().required('Problem Statement Image is required'),
});
export const ChallengeSchema = Yup.object().shape({
    challengesTitle: Yup.string().required('Problem Statement Title is required'),
    arChallengesTitle: Yup.string().required('Arabic Problem Statement Title is required'),
    challengesDescription: Yup.string().required('Problem Statement Description is required'),
    arChallengesDescription: Yup.string().required('Arabic Problem Statement Description is required'),
    challengeImage: Yup.mixed().required('Problem Statement Image is required'),
});
export const SolutionSchema = Yup.object().shape({
    SolutionTitle: Yup.string().required('Problem Statement Title is required'),
    arSolutionTitle: Yup.string().required('Arabic Problem Statement Title is required'),
    SolutionDescription: Yup.string().required('Problem Statement Description is required'),
    arSolutionDescription: Yup.string().required('Arabic Problem Statement Description is required'),
    SolutionImage: Yup.mixed().required('Problem Statement Image is required'),
});
export const MajorScreenSchema = Yup.object().shape({
    description2: Yup.string().required('Second Description is required'),
    arDescription2: Yup.string().required('Arabic Second Description is required'),
    description2Image: Yup.mixed().required('Second Description Image is required'),
    majorScreensImages: Yup.array().min(1, 'At least one major screen image is required'),
});