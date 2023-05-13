import { createSlice } from '@reduxjs/toolkit';

const clientService = require('api/clientService')

export const placeSlice = createSlice({
  name: 'place',
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
      state.list.length > 0 && (state.list = state.list.filter(_ => _.placeId !== action.payload))
    },
    update: (state, action) => {
      if (state.list.length > 0) {
        const row = state.list.filter(_ => _.placeId === action.payload.placeId)[0]
        state.list = state.list.filter(_ => _.placeId !== action.payload.placeId)
        row.placeName = action.payload.placeName
        row.parentId = action.payload.parentId
        state.list.push(row)
      }
    },
    empty: state => {
      state.list.length = 0
    }
  },
});

export const { addList, add, removeById, update, empty } = placeSlice.actions;

export const fetchPlaceList = () => async dispatch => {
  const res = await clientService.assetPlace.getPlaceList_list()
  if (res.code === 1) {
    dispatch(addList(res.data));
  }
};

export const placeList = state => state.place.list;

export default placeSlice.reducer;
