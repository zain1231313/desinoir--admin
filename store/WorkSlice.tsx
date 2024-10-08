import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define an interface for the work object (adjust as needed)
interface Work {
    _id: string;
    subtitle: { en: string; ar: string };
    title: { en: string; ar: string };
    types: string;
    description: { en: string; ar: string };
    ProblemStatementTitle: { en: string; ar: string };
    ProblemStatementDescription: { en: string; ar: string };
    challengesTitle: { en: string; ar: string };
    challengesDescription: { en: string; ar: string };
    SolutionTitle: { en: string; ar: string };
    SolutionDescription: { en: string; ar: string };
    description2: { en: string; ar: string };
    primaryImage: string;
    descriptionImage: string;
    ProblemStatementImage: string;
    challengeImage: string;
    SolutionImage: string;
    description2Image: string;
    MajorScreensImages: string[];
}

// Define the state interface
interface SelectedWorkState {
    selectedWork: Work | null; // Use the Work type or null
}

const initialState: SelectedWorkState = {
    selectedWork: null, // Initialize with default value
};

const selectedWorkSlice = createSlice({
    name: 'selectedWork',
    initialState,
    reducers: {
        setSelectedWork: (state, action: PayloadAction<Work>) => {
            state.selectedWork = action.payload;
        },
        clearSelectedWork: (state) => {
            state.selectedWork = null;
        },
    },
});

export const { setSelectedWork, clearSelectedWork } = selectedWorkSlice.actions;
export default selectedWorkSlice.reducer;
