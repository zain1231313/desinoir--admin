import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IRootState } from '../store'; // adjust the path to your store

interface LanguageText {
    en: string;
    ar: string;
}

interface AdminFeedback {
    name: LanguageText;
    feedback: LanguageText;
    adminImage: string;
}

interface CategoryCounts {
    branding: Category;
    uiux: Category;
    motionGraphic: Category;
    graphicDesign: Category;
}

interface Category {
    text: LanguageText;
    count: number;
}

interface Article {
    mainTitle: LanguageText;
    title: LanguageText;
    name: LanguageText;
    content: LanguageText;
    conclusion: LanguageText;
    adminFeedback: AdminFeedback;
    categoryCounts: CategoryCounts;
    _id: string;
    primaryImage: string;
    secondaryImage: string;
    types: string;
    relatedPosts: string[];
    createdAt: string;
    updatedAt: string;
    __v: number;
}

interface ArticlesState {
    selectedArticle: Article | null;
}

const initialState: ArticlesState = {
    selectedArticle: null,
};

export const articlesSlice = createSlice({
    name: 'articles',
    initialState,
    reducers: {
        setSelectedArticle: (state, action: PayloadAction<Article>) => {
            state.selectedArticle = action.payload;
        },
        clearSelectedArticle: (state) => {
            state.selectedArticle = null;
        },
    },
});

export const { setSelectedArticle, clearSelectedArticle } = articlesSlice.actions;
export const selectSelectedArticle = (state: IRootState) => state.articles.selectedArticle;
export default articlesSlice.reducer;