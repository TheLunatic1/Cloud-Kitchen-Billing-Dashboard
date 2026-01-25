import { configureStore } from '@reduxjs/toolkit';
import billingReducer from '../features/billing/billingSlice.js';

const STORAGE_KEY = 'cloud-kitchen-billing-data';

const persistedState = (() => {
  try {
    const serializedState = localStorage.getItem(STORAGE_KEY);
    if (serializedState === null) return undefined;
    return JSON.parse(serializedState);
  } catch (err) {
    console.error('Failed to load persisted state:', err);
    return undefined;
  }
})();

export const store = configureStore({
  reducer: {
    billing: billingReducer,
  },
  preloadedState: persistedState ? { billing: persistedState.billing } : undefined,
});

store.subscribe(() => {
  try {
    const state = store.getState();
    const serializedState = JSON.stringify({
      billing: state.billing,
    });
    localStorage.setItem(STORAGE_KEY, serializedState);
  } catch (err) {
    console.error('Failed to save state to localStorage:', err);
  }
});