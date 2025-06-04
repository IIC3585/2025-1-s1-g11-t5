// ====================================
// src/lit/acordion-lit.js
// ====================================
import { LitElement, html, css } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

export class AcordionLit extends LitElement {
  static properties = {
    // Índice (en this.itemsData) de la sección que está abierta; -1 = none
    activeIndex: { type: Number }
  };

  static styles = css`
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
    .header.open .arrow {
      transform: rotate(90deg);
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
    }
  `;

  constructor() {
    super();
    this.itemsData = [];   // Array de { title, contentHTML }
    this.activeIndex = -1; // Ningún panel abierto inicialmente
  }

  // 1) Antes de renderizar por primera vez, recolectamos los hijos del Light DOM
  firstUpdated() {
    super.firstUpdated();
    this._collectItemsFromLightDOM();
    // Forzamos re-render
    this.requestUpdate();
  }

  // 2) Extrae los <div data-title="..."> del Light DOM y llena itemsData
  _collectItemsFromLightDOM() {
    const children = Array.from(this.children);
    children.forEach(child => {
      const title = child.getAttribute('data-title') || 'Sin título';
      const contentHTML = child.innerHTML;
      this.itemsData.push({ title, contentHTML });
    });
    // Luego borramos el contenido original
    this.innerHTML = '';
  }

  // 3) Método que maneja clic en cabecera: alterna activeIndex
  _onHeaderClick(idx) {
    this.activeIndex = (this.activeIndex === idx) ? -1 : idx;
  }

  // 4) Render: recorre itemsData y genera HTML
  render() {
    return html`
      <div class="acordion-container">
        ${this.itemsData.map((item, idx) => html`
          <div class="item">
            <div
              class="header ${this.activeIndex === idx ? 'open' : ''}"
              @click=${() => this._onHeaderClick(idx)}
            >
              <span class="title">${item.title}</span>
              <span class="arrow">▶</span>
            </div>
            <div class="body ${this.activeIndex === idx ? 'open' : ''}">
              ${unsafeHTML(item.contentHTML)}
            </div>
          </div>
        `)}
      </div>
    `;
  }
}

// 5) Registramos <acordion-lit>
customElements.define('acordion-lit', AcordionLit);
