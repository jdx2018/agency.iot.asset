import { createSlice } from '@reduxjs/toolkit';

const clientService = require('api/clientService')

export const classSlice = createSlice({
  name: 'class',
  initialState: {
    list: [],
  },
  reducers: {
    addList: (state, action) => {
      state.list = action.payload
    },
    add: (state, action) => {
      state.list.length > 0 && state.list.push(action.payload);
    },
    removeById: (state, action) => {
      state.list.length > 0 && (state.list = state.list.filter(_ => _.classId !== action.payload))
    },
    update: (state, action) => {
      if (state.list.length > 0) {
        const row = state.list.filter(_ => _.classId === action.payload.classId)[0]
        state.list = state.list.filter(_ => _.classId !== action.payload.classId)
        row.className = action.payload.className
        row.parentId = action.payload.parentId
        state.list.push(row)
      }
    },
    empty: state => {
      state.list.length = 0
    }
  },
});

export const { addList, add, removeById, update, empty } = classSlice.actions;

export const fetchClassList = () => async dispatch => {
  const res = await clientService.assetClass.getAssetClass_list()
  if (res.code === 1) {
    dispatch(addList(res.data));
  }
};

export const classList = state => state.class.list;

export default classSlice.reducer;
