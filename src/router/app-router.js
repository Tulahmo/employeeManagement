import { Router } from '@vaadin/router';
import '../components/employee-list.js';
import '../components/employee-form.js';  // Import EmployeeForm component

const outlet = document.getElementById('outlet');
const router = new Router(outlet);

// Define routes
router.setRoutes([
  { path: '/', component: 'employee-list' },  // Main employee list route
  { path: '/employees', component: 'employee-list' }, 
  { path: '/add', component: 'employee-form' },  // Route for adding an employee
  {
    path: '/edit/:id',  // Edit employee by id
    component: 'employee-form',  // Reuse the employee form for editing
  },
  {
    path: '(.*)',  // Catch-all for unknown routes
    action: () => {
      console.error('Page not found');
    },
  },
]);
