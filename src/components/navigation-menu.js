import { LitElement, html, css } from 'lit';
import { Router } from '@vaadin/router';  // Assuming you are using Vaadin Router for navigation
import { getLocalizedMessage } from '../localization/localization.js';  // Localization utility

class NavigationMenu extends LitElement {
  static styles = css`
    :host {
      display: block;
    }
    nav {
      background-color: #333;
      padding: 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    ul {
      list-style-type: none;
      margin: 0;
      padding: 0;
      display: flex;
    }
    li {
      margin: 0 1rem;
    }
    a {
      color: white;
      text-decoration: none;
      font-size: 1.2rem;
    }
    a:hover {
      text-decoration: underline;
    }
    .language-switch {
      margin-left: auto;
      display: flex;
      gap: 10px;
    }
    button {
      background-color: #444;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      cursor: pointer;
    }
    button:hover {
      background-color: #555;
    }
    
    /* Responsive adjustments */
    @media (max-width: 768px) {
      nav {
        flex-direction: column;
        align-items: flex-start;
      }
      ul {
        flex-direction: column;
        width: 100%;
      }
      li {
        margin-bottom: 1rem;
      }
      .language-switch {
        margin-left: 0;
      }
    }
  `;

  constructor() {
    super();
    this.currentLang = document.documentElement.lang || 'en'; // Set initial language based on HTML lang attribute
  }

  changeLanguage(lang) {
    document.documentElement.lang = lang;  // Update the root HTML element's lang attribute
    this.currentLang = lang;  // Update current language in the component
    this.requestUpdate();  // Trigger a re-render
  }

  render() {
    return html`
      <nav>
        <!-- Application title or logo can go here -->
        <div>
          <a href="/employees" @click="${this.navigate}">${getLocalizedMessage('employeeList')}</a>
          <a href="/add" @click="${this.navigate}">${getLocalizedMessage('addEmployee')}</a>
        </div>

        <!-- Language switcher -->
        <div class="language-switch">
          <button @click="${() => this.changeLanguage('en')}" ?disabled="${this.currentLang === 'en'}">English</button>
          <button @click="${() => this.changeLanguage('tr')}" ?disabled="${this.currentLang === 'tr'}">Türkçe</button>
        </div>
      </nav>
    `;
  }

  // Handle the navigation to prevent full page reload
  navigate(event) {
    event.preventDefault();
    const href = event.target.getAttribute('href');
    Router.go(href);  // Use Vaadin Router to navigate without reloading the page
  }
}

customElements.define('navigation-menu', NavigationMenu);
