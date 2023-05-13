import { createSlice } from '@reduxjs/toolkit';

const clientService = require('api/clientService')

export const employeeSlice = createSlice({
  name: 'employee',
  initialState: {
    list: [],
  },
  reducers: {
    addList: (state, action) => {
      state.list = action.payload
    },
    add: (state, action) => {
      state.list.length > 0 &&
        state.list.push(action.payload);
    },
    removeById: (state, action) => {
      state.list.length > 0 &&
        (state.list = state.list.filter(_ => _.employeeId !== action.payload))
    },
    update: (state, action) => {
      if (state.list.length > 0) {
        const row = state.list.filter(_ => _.employeeId === action.payload.employeeId)[0]
        state.list = state.list.filter(_ => _.employeeId !== action.payload.employeeId)
        row.employeeName = action.payload.employeeName
        state.list.push(row)
      }
    },
    empty: state => {
      state.list.length = 0
    }
  },
});

export const { addList, add, removeById, update, empty } = employeeSlice.actions;

export const fetchEmployeeList = () => async dispatch => {
  const res = await clientService.employee.getEmployeeList_list()
  if (res.code === 1) {
    dispatch(addList(res.data));
  }
};

export const employeeList = state => state.employee.list;

export default employeeSlice.reducer;
