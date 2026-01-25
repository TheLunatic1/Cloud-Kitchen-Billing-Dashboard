import { createSlice, nanoid } from '@reduxjs/toolkit'

const initialState = {
  corporateBills: [],
  eventBills: [],
}

const billingSlice = createSlice({
  name: 'billing',
  initialState,
  reducers: {
    addCorporateBill: {
      reducer(state, action) {
        state.corporateBills.push(action.payload)
      },
      prepare(data) {
        return {
          payload: {
            id: nanoid(),
            type: 'corporate',
            createdAt: new Date().toISOString(),
            ...data,
            lineItems: data.lineItems || [],
            total: 0,
            amountInWords: '',
          }
        }
      }
    },
  },
})

export const { addCorporateBill } = billingSlice.actions

export default billingSlice.reducer