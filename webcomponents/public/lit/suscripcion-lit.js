// ================================
// src/lit/suscripcion-lit.js
// ================================
import { LitElement, html, css } from 'lit';

export class SuscripcionLit extends LitElement {
  // 1) Declaramos las propiedades reactivas (atributos ↔ propiedades automáticas)
  static properties = {
    plan:        { type: String },
    price:       { type: String },
    priceVat:    { attribute: 'price-vat', type: String },
    description: { type: String },
    buttonText:  { attribute: 'button-text', type: String },
    highlight:   { type: Boolean }
  };

  // 2) Definimos estilos encapsulados
  static styles = css`
    :host {
      display: inline-block;
      font-family: 'Arial', sans-serif;
      margin: 1rem;
      --border-color: #cccccc;
      --highlight-border-color: #00bfa5;
      --bg-color: #ffffff;
      --accent-color: #00796b;
      --text-color: #333333;
      --button-bg: var(--accent-color);
      --button-text: white;
      --price-font-size: 2rem;
      --plan-font-size: 1.25rem;
      --desc-font-size: 0.9rem;
      --feature-font-size: 0.85rem;
      --content-padding: 1rem;
      border-radius: 8px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.1);
    }
    .card {
      border: 2px solid var(--border-color);
      background: var(--bg-color);
      border-radius: 8px;
      width: 260px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      padding: var(--content-padding);
    }
    .card.highlight {
      border-color: var(--highlight-border-color);
    }
    .plan-name {
      font-size: var(--plan-font-size);
      font-weight: bold;
      color: var(--accent-color);
      margin: 0 0 0.5rem 0;
    }
    .description {
      font-size: var(--desc-font-size);
      color: var(--text-color);
      margin-bottom: 1rem;
      min-height: 3em;
    }
    .price-container {
      display: flex;
      align-items: baseline;
      margin-bottom: 0.5rem;
    }
    .price {
      font-size: var(--price-font-size);
      font-weight: bold;
      color: var(--accent-color);
      margin-right: 0.25rem;
    }
    .price-vat {
      font-size: 0.75rem;
      color: #555;
    }
    ul.features {
      list-style: none;
      padding: 0;
      margin: 0.5rem 0 1rem 0;
    }
    ul.features li {
      font-size: var(--feature-font-size);
      color: var(--text-color);
      padding: 0.25rem 0;
      display: flex;
      align-items: center;
    }
    ul.features li::before {
      content: '✔';
      display: inline-block;
      margin-right: 0.5rem;
      color: var(--accent-color);
      font-size: 0.85rem;
    }
    button.subscribe-btn {
      margin-top: auto;
      padding: 0.5rem 0.75rem;
      background: white;
      color: var(--highlight-border-color);
      border: 2px solid var(--highlight-border-color);
      border-radius: 4px;
      font-size: 0.9rem;
      cursor: pointer;
      transition: all 0.2s;
    }
    button.subscribe-btn:hover {
      background: var(--highlight-border-color);
      color: white;
    }
  `;

  constructor() {
    super();
    // 3) Valores por defecto para las propiedades reactivas
    this.plan = 'SinPlan';
    this.price = '0';
    this.priceVat = '';
    this.description = '';
    this.buttonText = 'Suscribir';
    this.highlight = false;
    // Permitir selección de tarjeta al hacer click en la tarjeta
    this.addEventListener('click', (evt) => {
      if (evt.target.classList && evt.target.classList.contains('subscribe-btn')) return;
      this.dispatchEvent(new CustomEvent('card-selected', {
        bubbles: true,
        composed: true
      }));
    });
  }

  // 4) Al hacer clic, se dispara el evento
  _onButtonClick(event) {
    if (event) event.stopPropagation();
    this.dispatchEvent(new CustomEvent('subscribe', {
      detail: { plan: this.plan },
      bubbles: true,
      composed: true
    }));
  }

  // 5) Método que describe el HTML a renderizar (lit-html)
  render() {
    return html`
      <div class="card ${this.highlight ? 'highlight' : ''}">
        <div class="plan-name">${this.plan}</div>
        <div class="price-container">
          <div class="price">${this.price.startsWith('$') ? this.price : '$' + this.price}</div>
          <div class="price-vat">${this.priceVat}</div>
        </div>
        <div class="description">${this.description}</div>
        <ul class="features">
          <slot></slot>
        </ul>
        <button class="subscribe-btn" @click=${this._onButtonClick}>
          ${this.buttonText}
        </button>
      </div>
    `;
  }
}

// 6) Registramos nuestro custom element: <suscripcion-lit>
customElements.define('suscripcion-lit', SuscripcionLit);
