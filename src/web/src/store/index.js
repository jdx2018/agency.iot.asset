import { configureStore } from '@reduxjs/toolkit';
import brandReducer from './slices/brand';
import classReducer from './slices/class';
import employeeReducer from './slices/employee';
import orgReducer from './slices/org';
import placeReducer from './slices/place';


export default configureStore({
  reducer: {
    brand: brandReducer,
    class: classReducer,
    employee: employeeReducer,
    org: orgReducer,
    place: placeReducer
  },
});
