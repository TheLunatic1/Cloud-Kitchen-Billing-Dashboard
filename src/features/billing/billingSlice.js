import { createSlice, nanoid } from '@reduxjs/toolkit';

const initialState = {
  corporateBills: [],
  eventBills: [],
};

const billingSlice = createSlice({
  name: 'billing',
  initialState,
  reducers: {

    addCorporateBill: (state, action) => {
      const payload = action.payload;

      if (!payload || typeof payload !== 'object') {
        console.warn('Invalid corporate bill payload received:', payload);
        return;
      }

      const safeBill = {
        id: payload.id || nanoid(),
        type: 'corporate',
        createdAt: payload.createdAt || new Date().toISOString(),
        name: payload.name || '',
        contactPerson: payload.contactPerson || '',
        contactNo: payload.contactNo || '',
        date: payload.date || '',
        lineItems: Array.isArray(payload.lineItems) ? payload.lineItems : [],
        total: Number(payload.total) || 0,
        amountInWords: payload.amountInWords || '',
        updatedAt: payload.updatedAt || null,
      };

      state.corporateBills.push(safeBill);
    },

    updateCorporateBill: (state, action) => {
      const payload = action.payload;

      if (!payload || !payload.id) {
        console.warn('Invalid update payload for corporate bill:', payload);
        return;
      }

      const index = state.corporateBills.findIndex((bill) => bill.id === payload.id);
      if (index !== -1) {
        state.corporateBills[index] = {
          ...state.corporateBills[index],
          ...payload,
          updatedAt: new Date().toISOString(),
        };
      }
    },

    deleteCorporateBill: (state, action) => {
      const id = action.payload;
      if (!id) return;

      state.corporateBills = state.corporateBills.filter((bill) => bill.id !== id);
    },

    addEventBill: (state, action) => {
      const payload = action.payload;

      if (!payload || typeof payload !== 'object') {
        console.warn('Invalid event bill payload received:', payload);
        return;
      }

      const safeBill = {
        id: payload.id || nanoid(),
        type: 'event',
        createdAt: payload.createdAt || new Date().toISOString(),
        name: payload.name || '',
        contactPerson: payload.contactPerson || '',
        contactNo: payload.contactNo || '',
        date: payload.date || '',
        lineItems: Array.isArray(payload.lineItems) ? payload.lineItems : [],
        total: Number(payload.total) || 0,
        amountInWords: payload.amountInWords || '',
        updatedAt: payload.updatedAt || null,
      };

      state.eventBills.push(safeBill);
    },

    updateEventBill: (state, action) => {
      const payload = action.payload;

      if (!payload || !payload.id) {
        console.warn('Invalid update payload for event bill:', payload);
        return;
      }

      const index = state.eventBills.findIndex((bill) => bill.id === payload.id);
      if (index !== -1) {
        state.eventBills[index] = {
          ...state.eventBills[index],
          ...payload,
          updatedAt: new Date().toISOString(),
        };
      }
    },

    deleteEventBill: (state, action) => {
      const id = action.payload;
      if (!id) return;

      state.eventBills = state.eventBills.filter((bill) => bill.id !== id);
    },
  },
});

export const {
  addCorporateBill,
  updateCorporateBill,
  deleteCorporateBill,
  addEventBill,
  updateEventBill,
  deleteEventBill,
} = billingSlice.actions;

export default billingSlice.reducer;