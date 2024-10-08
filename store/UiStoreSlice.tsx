import { createSlice, PayloadAction } from '@reduxjs/toolkit';
interface TranslatableField {
    en: string;
    ar: string;
}

interface UiStoreItem {
    _id: string;
    primaryImage: string;
    title: TranslatableField;
    description: TranslatableField;
    licenseTitle: TranslatableField;
    licenseDescription: TranslatableField;
    priceOrFree: string;
    sliderImages: string[]; // Assuming these are URLs
    subtitle: TranslatableField;
    types: string;
    uIKitrecommendedDescription: TranslatableField;
    uIKitrecommendedTitle: TranslatableField;
    updatedAt: string; // Assuming this is an ISO date string
    whatinsideDescription: TranslatableField;
    whatinsideTitle: TranslatableField;
}


interface UiStoreItem {
    _id: string;
    primaryImage: string;
    title: {
        en: string;
        ar: string;
    };
    priceOrFree: string;
    types: string;
}

interface UiStoreState {
    selectedItem: UiStoreItem | null;
}

const initialState: UiStoreState = {
    selectedItem: null,
};

const uiStoreSlice = createSlice({
    name: 'uiStore',
    initialState,
    reducers: {
        setSelectedItem: (state, action: PayloadAction<UiStoreItem>) => {
            state.selectedItem = action.payload;
        },
        clearSelectedItem: (state) => {
            state.selectedItem = null;
        },
    },
});

export const { setSelectedItem, clearSelectedItem } = uiStoreSlice.actions;
export default uiStoreSlice.reducer;