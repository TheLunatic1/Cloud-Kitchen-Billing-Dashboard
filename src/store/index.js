import { configureStore } from '@reduxjs/toolkit'
import billingReducer from '../features/billing/billingSlice.js'

export const store = configureStore({
  reducer: {
    billing: billingReducer,
  },
})