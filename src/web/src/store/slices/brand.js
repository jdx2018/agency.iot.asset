import { createSlice } from '@reduxjs/toolkit';

const clientService = require('api/clientService')

export const brandSlice = createSlice({
  name: 'brand',
  initialState: {
    list: [],
  },
  reducers: {
    addList: (state, action) => {
      state.list = action.payload
    },
    add: (state, action) => {
      state.list.length > 0 && (action.payload.value && !state.list.map(_ => _.value).includes(action.payload.value)) && state.list.push(action.payload)
    },
    empty: state => {
      state.list.length = 0
    }
  },
});

export const { addList, add, empty } = brandSlice.actions;

export const fetchBrandList = () => async dispatch => {
  const res = await clientService.assetBrand.getBrand()
  if (res.code === 1) {
    dispatch(addList(res.data));
  }
};

export const brandList = state => state.brand.list

export default brandSlice.reducer;
