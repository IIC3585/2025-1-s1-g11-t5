// ================================
// src/vanilla/suscripcion-vanilla.js
// ================================

// 1) Definimos nuestro template HTML que luego clonaremos en cada instancia.
//    El <slot> servirá para la lista de <li> que el usuario pase dentro del componente.
const template = document.createElement('template');
template.innerHTML = `
  <style>
    :host {
      display: inline-block;
      font-family: 'Arial', sans-serif;
      margin: 1rem;
      --border-color: #e0e0e0;
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
  </style>

  <div class="card">
    <div class="plan-name" id="plan-name"></div>
    <div class="price-container">
      <div class="price" id="price"></div>
      <div class="price-vat" id="price-vat"></div>
    </div>
    <div class="description" id="description"></div>
    <!-- Aquí se pegarán las <li> pasadas por el usuario -->
    <ul class="features">
      <slot></slot>
    </ul>
    <button class="subscribe-btn" id="btnSubscribe"></button>
  </div>
`;

class SuscripcionVanilla extends HTMLElement {
  constructor() {
    super();
    // 2) Creamos el Shadow DOM y clonamos el template:
    this._shadowRoot = this.attachShadow({ mode: 'open' });
    this._shadowRoot.appendChild(template.content.cloneNode(true));

    // 3) Referencias a nodos internos:
    this.$planName    = this._shadowRoot.getElementById('plan-name');
    this.$price       = this._shadowRoot.getElementById('price');
    this.$priceVat    = this._shadowRoot.getElementById('price-vat');
    this.$description = this._shadowRoot.getElementById('description');
    this.$btn         = this._shadowRoot.getElementById('btnSubscribe');
    this.$cardDiv     = this._shadowRoot.querySelector('.card');

    // 4) Bind de función interna:
    this._onButtonClick = this._onButtonClick.bind(this);
  }

  // 5) Atributos que observamos
  static get observedAttributes() {
    return ['plan', 'price', 'price-vat', 'description', 'button-text', 'highlight'];
  }

  // 6) Cuando cambia un atributo, actualizamos la UI
  attributeChangedCallback(name, oldVal, newVal) {
    this._render(); 
  }

  // 7) Al conectarse al DOM, ponemos listeners y hacemos el primer render:
  connectedCallback() {
    this._shadowRoot
      .getElementById('btnSubscribe')
      .addEventListener('click', this._onButtonClick);

    // Permitir selección de tarjeta al hacer click en la tarjeta
    this.$cardDiv.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('card-selected', {
        bubbles: true,
        composed: true
      }));
    });
    this._render();
  }

  // 8) Al desconectarse, limpiamos listeners
  disconnectedCallback() {
    this._shadowRoot
      .getElementById('btnSubscribe')
      .removeEventListener('click', this._onButtonClick);
  }

  // 9) Lógica de render: lee atributos y actualiza texto/estilos
  _render() {
    const plan         = this.getAttribute('plan')        || 'Sin nombre de plan';
    const price        = this.getAttribute('price')       || '0';
    const priceVat     = this.getAttribute('price-vat')   || '';
    const description  = this.getAttribute('description') || '';
    const btnText      = this.getAttribute('button-text') || 'Suscribir';
    const highlightStr = this.getAttribute('highlight')   || 'false';
    const highlight    = highlightStr === 'true';

    // Asignar textos a elementos internos:
    this.$planName.textContent    = plan;
    this.$price.textContent       = price.charAt(0) === '$' ? price : '$' + price;
    this.$priceVat.textContent    = priceVat;
    this.$description.textContent = description;
    this.$btn.textContent         = btnText;

    // Si highlight="true", agregamos la clase .highlight
    if (highlight) {
      this.$cardDiv.classList.add('highlight');
    } else {
      this.$cardDiv.classList.remove('highlight');
    }
  }

  // 10) Al hacer clic en el botón, disparamos el evento "subscribe"
  _onButtonClick(event) {
    if (event) event.stopPropagation();
    const plan = this.getAttribute('plan') || '';
    this.dispatchEvent(new CustomEvent('subscribe', {
      detail: { plan },
      bubbles: true,
      composed: true
    }));
  }
}

// 11) Definimos el custom element para <suscripcion>
customElements.define('suscripcion-vanilla', SuscripcionVanilla);
