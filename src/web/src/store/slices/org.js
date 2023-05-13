import { createSlice } from '@reduxjs/toolkit';

const clientService = require('api/clientService')

export const orgSlice = createSlice({
  name: 'org',
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
      state.list.length > 0 && (state.list = state.list.filter(_ => _.orgId !== action.payload))
    },
    update: (state, action) => {
      if (state.list.length > 0) {
        const row = state.list.filter(_ => _.orgId === action.payload.orgId)[0]
        state.list = state.list.filter(_ => _.orgId !== action.payload.orgId)
        row.orgName = action.payload.orgName
        row.parentId = action.payload.parentId
        state.list.push(row)
      }
    },
    empty: state => {
      state.list.length = 0
    }
  },
});

export const { addList, add, removeById, update, empty } = orgSlice.actions;

export const fetchOrgList = () => async dispatch => {
  const res = await clientService.org.getOrgList_list()
  if (res.code === 1) {
    dispatch(addList(res.data));
  }
};


export const orgList = state => state.org.list;

export default orgSlice.reducer;
