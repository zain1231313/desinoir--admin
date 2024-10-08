// src/store/dataSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DataState, Data } from '@/types/dataTypes'; // Adjust the import path as needed

const initialState: DataState = {
  data: {
    en: {
      mainBanner: {
        title: '',
        count: 0,
        image: '',
      },
      serviceSection: {
        mainServiceTitle: '',
        mainServiceSubTitle: '',
        uiuxTitle: '',
        uiuxDescription: '',
        uiuxIcon: '',
        brandingTitle: '',
        brandingDescription: '',
        brandingIcon: '',
        graphicDesignTitle: '',
        graphicDesignDescription: '',
        graphicDesignIcon: '',
        motionGraphicDesignTitle: '',
        motionGraphicDesignDescription: '',
        motionGraphicDesignIcon: '',
      },
      creativitySection: {
        creativityTitle: '',
        creativitySubtitle: '',
        creativityDescription: '',
        creativityYearsOfExperience: 0,
        creativityImage: '',
      },
      ourExpertise: {
        expertiseTitle: '',
        expertiseSubTitle: '',
      },
    },
    ar: {
      mainBanner: {
        title: '',
        count: 0,
        image: '',
      },
      serviceSection: {
        mainServiceTitle: '',
        mainServiceSubTitle: '',
        uiuxTitle: '',
        uiuxDescription: '',
        uiuxIcon: '',
        brandingTitle: '',
        brandingDescription: '',
        brandingIcon: '',
        graphicDesignTitle: '',
        graphicDesignDescription: '',
        graphicDesignIcon: '',
        motionGraphicDesignTitle: '',
        motionGraphicDesignDescription: '',
        motionGraphicDesignIcon: '',
      },
      creativitySection: {
        creativityTitle: '',
        creativitySubtitle: '',
        creativityDescription: '',
        creativityYearsOfExperience: 0,
        creativityImage: '',
      },
      ourExpertise: {
        expertiseTitle: '',
        expertiseSubTitle: '',
      },
    },
  },
  loading: false,
  error: null,
};

const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    setData: (state, action: PayloadAction<Data>) => {
      state.data = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setData, setLoading, setError } = dataSlice.actions;
export default dataSlice.reducer;
