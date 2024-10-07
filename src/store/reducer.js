const initialState = {
    employees: []
  };
  
  function employeeReducer(state = initialState, action) {
    switch (action.type) {
      case 'ADD_EMPLOYEE':
        console.log('Reducer - Add Employee:', action.payload);
        return { ...state, employees: [...state.employees, action.payload] };        
      case 'EDIT_EMPLOYEE':
        return {
          ...state,
          employees: state.employees.map(emp =>
            emp.id === action.payload.id ? action.payload : emp
          )
        };
      case 'DELETE_EMPLOYEE':
        return {
          ...state,
          employees: state.employees.filter(emp => emp.id !== action.payload)
        };
      default:
        return state;
    }
  }
  
  export default employeeReducer;


  