// src/store/store.ts
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import themeConfigSlice from '@/store/themeConfigSlice';
import dataSlice from '@/store/HomeSlice'; // Import the new data slice
import selectedWorkReducer from '@/store/WorkSlice'; // Import the selected work slice
import articleReducer from './AricleSlice';
import UiStoreSlice from '@/store/UiStoreSlice';

// Combine your reducers
const rootReducer = combineReducers({
    themeConfig: themeConfigSlice,
    data: dataSlice, // Add the data slice here
    selectedWork: selectedWorkReducer, // Add the selected work slice here
    articles: articleReducer,
    uiStore: UiStoreSlice,
});

// Create and export the Redux store
const store = configureStore({
    reducer: rootReducer,
});

// Define types for RootState and AppDispatch
export type IRootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
