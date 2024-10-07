import { LitElement, html, css } from 'lit';
import  store  from '../store/store'; // Import Redux store or your state management
import { Router } from '@vaadin/router';
import { addEmployee, editEmployee } from '../store/actions';
// import reducer from '../store/store.js'

class EmployeeForm extends LitElement {
  static properties = {
    employeeId: { type: String },
    employee: { type: Object },  // The employee object for editing, will be empty for adding
    isEditMode: { type: Boolean }  // Flag to determine if it's an edit or add mode
  };

  constructor() {
    super();
    this.employeeId = null;
    this.employee = {
      firstName: '',
      lastName: '',
      employmentDate: '',
      dateOfBirth: '',
      phoneNumber: '',
      email: '',
      department: 'Tech',  // Default selection
      position: 'Junior'  // Default selection
    };
    this.isEditMode = false;
  }

    // Use connectedCallback to get employee ID from URL and populate form in edit mode
    connectedCallback() {
      super.connectedCallback();
  
      const url = window.location.pathname;
      const match = url.match(/\/edit\/(\d+)/); // Assuming ID is a number
  
      if (match) {
        this.employeeId = match[1];
        this.isEditMode = true;
  
        // Get the employee data from the store and populate form
        const state = store.getState();
        const employeeToEdit = state.employees.find(emp => emp.id == this.employeeId)||{};
  
        if (employeeToEdit) {
          this.employee = { ...employeeToEdit };
        }
      }
    }

  static styles = css`
    form {
      display: flex;
      flex-direction: column;
      max-width: 400px;
      margin: auto;
    }
    label {
      margin-top: 10px;
    }
    input, select {
      padding: 8px;
      margin-top: 5px;
    }
    button {
      margin-top: 15px;
      padding: 10px;
      background-color: blue;
      color: white;
      border: none;
      cursor: pointer;
    }
    button:hover {
      background-color: darkblue;
    }
  `;

  // Handle input changes and bind them to employee properties
  _handleInputChange(e) {
    const { name, value } = e.target;
    this.employee = { ...this.employee, [name]: value };
  }

  // Validation to ensure data is correct
  _validateForm() {
    if (!this.employee.firstName || !this.employee.lastName) {
      alert('First Name and Last Name are required.');
      return false;
    }
    // Add other validation logic as needed
    return true;
  }

  // Handle form submission
  _handleSubmit(e) {
    e.preventDefault();
    if (!this._validateForm()) return;  // Return if validation fails
    const formData = new FormData(e.target);
    const employeeData = {
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      dob: formData.get('dateOfBirth'),
      dateOfEmployment: formData.get('employmentDate'),
      phoneNumber: formData.get('phoneNumber'),
      email: formData.get('email'),
      department: formData.get('department'),
      position: formData.get('position'),
    };

    if (this.isEditMode) {
      // Dispatch an edit action
       store.dispatch(editEmployee( this.employee, this.employeeId  ));
       Router.go('/employees');
    } else {
      console.log('Employee Data:', employeeData);
      const employeeId = Date.now();  // Using timestamp as a unique ID for simplicity

      const newEmployee = {
        ...employeeData,
        id: employeeId  // Assign the generated employeeId
      };
      // Dispatch an add action
      store.dispatch(addEmployee(newEmployee));
      console.log('Updated Store:', store.getState());
      console.log('Store state after adding employee:', store.getState());

  // Navigate to the employee list page (using Vaadin Router)
      Router.go('/employees');
    }    
  }

  render() {
    return html`
      <h2>${this.isEditMode ? 'Edit Employee' : 'Add Employee'}</h2>
      <form @submit=${this._handleSubmit}>
        <label for="firstName">First Name</label>
        <input type="text" name="firstName" .value=${this.employee.firstName} @input=${this._handleInputChange} required />

        <label for="lastName">Last Name</label>
        <input type="text" name="lastName" .value=${this.employee.lastName} @input=${this._handleInputChange} required />

        <label for="employmentDate">Date of Employment</label>
        <input type="date" name="employmentDate" .value=${this.employee.employmentDate} @input=${this._handleInputChange} />

        <label for="dateOfBirth">Date of Birth</label>
        <input type="date" name="dateOfBirth" .value=${this.employee.dateOfBirth} @input=${this._handleInputChange}  />

        <label for="phoneNumber">Phone Number</label>
        <input type="tel" name="phoneNumber" .value=${this.employee.phoneNumber} @input=${this._handleInputChange}  />

        <label for="email">Email</label>
        <input type="email" name="email" .value=${this.employee.email} @input=${this._handleInputChange}  />

        <label for="department">Department</label>
        <select name="department" .value=${this.employee.department} @input=${this._handleInputChange}>
          <option value="Tech">Tech</option>
          <option value="Analytics">Analytics</option>
        </select>

        <label for="position">Position</label>
        <select name="position" .value=${this.employee.position} @input=${this._handleInputChange}>
          <option value="Junior">Junior</option>
          <option value="Medior">Medior</option>
          <option value="Senior">Senior</option>
        </select>

        <button type="submit">${this.isEditMode ? 'Update Employee' : 'Add Employee'}</button>
      </form>
    `;
  }
}

customElements.define('employee-form', EmployeeForm);
