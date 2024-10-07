// store/store.js
import { createStore } from 'redux';
import  employeeReducer  from './reducer';

// Create the Redux store
const store = createStore(employeeReducer);

console.log('Redux Store Initialized:', store.getState());

export default store;
