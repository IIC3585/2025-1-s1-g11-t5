// ======================================
// src/vanilla/acordion-vanilla.js
// ======================================

// 1) Creamos el template para cada ítem de acordeón
const templateAcordion = document.createElement('template');
templateAcordion.innerHTML = `
  <style>
    :host {
      display: block;
      --header-bg: #f5f5f5;
      --header-color: #333;
      --body-bg: #fff;
      --border-color: #ddd;
      --accent-color: #00796b;
      font-family: 'Arial', sans-serif;
      margin: 1rem 0;
    }
    .acordion-container {
      border: 1px solid var(--border-color);
      border-radius: 6px;
      overflow: hidden;
    }
    .item {
      border-bottom: 1px solid var(--border-color);
    }
    .item:last-child {
      border-bottom: none;
    }
    .header {
      background: var(--header-bg);
      color: var(--header-color);
      padding: 0.75rem 1rem;
      cursor: pointer;
      user-select: none;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 1rem;
    }
    .header:hover {
      background: var(--accent-color);
      color: white;
    }
    .body {
      background: var(--body-bg);
      padding: 0.75rem 1rem;
      display: none;
      font-size: 0.9rem;
      line-height: 1.4;
    }
    .body.open {
      display: block;
    }
    .arrow {
      transition: transform 0.2s ease;
      margin-left: auto;
    }
    .header.open .arrow {
      transform: rotate(90deg);
    }
  </style>
  <div class="acordion-container" id="container">
    <!-- Aquí irán los ítems generados dinámicamente -->
  </div>
`;

class AcordionVanilla extends HTMLElement {
  constructor() {
    super();
    // 2) Creamos el Shadow DOM y clonamos el template
    this._shadowRoot = this.attachShadow({ mode: 'open' });
    this._shadowRoot.appendChild(templateAcordion.content.cloneNode(true));

    this.$container = this._shadowRoot.getElementById('container');
    // Mantendremos en memoria los datos de cada item: { title, contentHTML }
    this.itemsData = [];
    // Guardaremos los elementos .item ya renderizados para gestionar eventos
    this.renderedItems = [];
  }

  connectedCallback() {
    // 3) Recoja todos los <div data-title="..."> hijos desde el Light DOM
    this._collectItemsFromLightDOM();

    // 4) Limpiar Light DOM (para que no haya duplicados)
    //    NOTA: esto evita que el contenido original aparezca abajo. Solo queda el shadow.
    while (this.firstElementChild) {
      this.removeChild(this.firstElementChild);
    }

    // 5) Renderizar los items dentro del Shadow DOM
    this._renderItems();

    // 6) Agregar listeners a cada cabecera
    this._attachEventListeners();
  }

  // 7) Método para recorrer hijos en Light DOM y extraer datos
  _collectItemsFromLightDOM() {
    const children = Array.from(this.children);
    children.forEach(child => {
      const title = child.getAttribute('data-title') || 'No title';
      const contentHTML = child.innerHTML;
      this.itemsData.push({ title, contentHTML });
    });
  }

  // 8) Método para agregar los <div class="item">…</div> en el Shadow
  _renderItems() {
    this.itemsData.forEach((itemData, index) => {
      const itemDiv = document.createElement('div');
      itemDiv.classList.add('item');
      itemDiv.setAttribute('data-index', index);

      // Cabecera
      const headerDiv = document.createElement('div');
      headerDiv.classList.add('header');
      headerDiv.innerHTML = `
        <span class="title">${itemData.title}</span>
        <span class="arrow">▶</span>
      `;
      // Cuerpo (oculto inicialmente)
      const bodyDiv = document.createElement('div');
      bodyDiv.classList.add('body');
      bodyDiv.innerHTML = itemData.contentHTML;

      itemDiv.appendChild(headerDiv);
      itemDiv.appendChild(bodyDiv);
      this.$container.appendChild(itemDiv);

      this.renderedItems.push({ 
        header: headerDiv, 
        body: bodyDiv 
      });
    });
  }

  // 9) Método para agregar `click` a cada cabecera
  _attachEventListeners() {
    this.renderedItems.forEach((itemObj, idx) => {
      itemObj.header.addEventListener('click', () => {
        this._toggleItem(idx);
      });
    });
  }

  // 10) Alterna (abre/cierra) el ítem en la posición idx y cierra los demás
  _toggleItem(idxToOpen) {
    this.renderedItems.forEach((itemObj, idx) => {
      const { header, body } = itemObj;
      if (idx === idxToOpen) {
        const isOpen = body.classList.contains('open');
        // Si ya estaba abierto, lo cerramos; si no, lo abrimos:
        if (isOpen) {
          body.classList.remove('open');
          header.classList.remove('open');
        } else {
          body.classList.add('open');
          header.classList.add('open');
        }
      } 
      else {
        // Cerrar cualquier otro que no sea el idxToOpen
        body.classList.remove('open');
        header.classList.remove('open');
      }
    });
  }
}

// 11) Registramos <acordion>
customElements.define('acordion-vanilla', AcordionVanilla);
