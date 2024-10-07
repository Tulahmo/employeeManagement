import { LitElement, html } from 'lit';
import store from '../store/store';
import { deleteEmployee, addEmployee } from '../store/actions';

class EmployeeList extends LitElement {
  static properties = {
    employees: { type: Array },
  };

  static properties = {
        employees: { type: Array },
        searchQuery: { type: String },
        currentPage: { type: Number },
        viewMode: { type: String }, // "table" or "list"
        itemsPerPage: { type: Number }
  };
  constructor() {
    super();
    this.employees = [];
    this.searchQuery = '';
    this.currentPage = 1;
    this.itemsPerPage = 5;
    this.viewMode = 'table'; // Default view mode

    // Subscribe to store updates
    this.unsubscribe = store.subscribe(() => {
      const state = store.getState();
      console.log('Store state in subscription:', state);
      this.employees = state.employees || [];  // Ensure it's always an array
      this.requestUpdate();  // Re-render the component
      console.log('Employee List Updated:', this.employees);
    });
  }

  connectedCallback() {
    super.connectedCallback();
    console.log('Employee List component connected to DOM');
  
    store.subscribe(() => {
      const state = store.getState();
      this.employees = state.employees || [];
      this.requestUpdate();  // Trigger re-rendering
      console.log('Employee List Updated:', this.employees);
    });
  
    // Ensure you load the employees from the store immediately as well
    const state = store.getState();
    this.employees = state.employees || [];
    this.requestUpdate();
  }
  // Cleanup subscription when the component is removed
  disconnectedCallback() {
    super.disconnectedCallback();
    console.log('EmployeeList disconnected from DOM');
    this.unsubscribe(); // Unsubscribe from store updates
  }

  handleDelete(employeeId) {
    store.dispatch(deleteEmployee(employeeId)); // Dispatch delete action
    this.requestUpdate();
    console.log('Employee List End:', this.employees);
  }

    // Method to navigate to edit form with employee ID in URL
  handleEdit(employeeId) {
    Router.go(`/edit/${employeeId}`);
  }

    // Method for filtering employees based on search query
  get filteredEmployees() {
    return this.employees.filter(employee => 
      `${employee.firstName} ${employee.lastName}`.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  // Pagination logic
  get paginatedEmployees() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredEmployees.slice(start, start + this.itemsPerPage);
  }

    render() {
    return html`
      <input type="text" placeholder="Search" @input="${e => this.searchQuery = e.target.value}">
      <button @click="${() => this.viewMode = 'list'}">List View</button>
      <button @click="${() => this.viewMode = 'table'}">Table View</button>
      
      ${this.viewMode === 'list' ? html`
        <ul>
          ${this.paginatedEmployees.map(emp => html`
            <li>
              ${emp.firstName} ${emp.lastName} - ${emp.position}
              <button @click="${() => this.handleEdit(emp.id)}">Edit</button>
              <button @click="${() => this.handleDelete(emp.id)}">Delete</button>
            </li>
          `)}
        </ul>
      ` : html`
        <table>
          <tr>
            <th>Name</th><th>Position</th><th>Actions</th>
          </tr>
          ${this.paginatedEmployees.map(emp => html`
            <tr>
              <td>${emp.firstName} ${emp.lastName}</td>
              <td>${emp.position}</td>
              <td>
                <button @click="${() => this.editEmployee(emp)}">Edit</button>
                <button @click="${() => this.handleDelete(emp.id)}">Delete</button>
              </td>
            </tr>
          `)}
        </table>
      `}
      <!-- Pagination controls -->
      <button @click="${() => this.currentPage--}" ?disabled="${this.currentPage === 1}">Previous</button>
      <button @click="${() => this.currentPage++}" ?disabled="${this.currentPage * this.itemsPerPage >= this.filteredEmployees.length}">Next</button>
    `;
  }
}
customElements.define('employee-list', EmployeeList);
