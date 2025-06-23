# Films Vault

**Grupo 11**

**Integrantes:**
- Manuel Espinoza
- Pedro del Río

Sitio web de catálogo y exploración de películas, construido con **Astro** y generación estática (SSG), integrando componentes interactivos (islas) con **React** y **Svelte**.

## Estructura del Proyecto

```
films-vault/
├── public/                  # Archivos estáticos (favicon, imágenes)
├── scripts/
│   └── generate-content.mjs # Script para poblar el contenido desde la API de TMDB
├── src/
│   ├── assets/              # Recursos estáticos (imágenes, fuentes, etc.)
│   ├── components/
│   │   ├── layout/          # Layouts y cabeceras (Astro)
│   │   ├── react/           # Componentes React (islas)
│   │   ├── svelte/          # Componentes Svelte (islas)
│   │   └── ui/              # Componentes UI compartidos (Astro)
│   ├── content/
│   │   ├── config.ts        # Definición de colecciones (movies, genres)
│   │   ├── genres/          # Archivos JSON de géneros
│   │   └── movies/          # Archivos JSON de películas
│   ├── layouts/             # Layouts principales (Astro)
│   ├── pages/               # Páginas del sitio (Astro)
│   │   ├── genres/          # Páginas de géneros
│   │   ├── movies/          # Páginas de películas
│   │   ├── search.astro     # Búsqueda avanzada (Svelte)
│   │   └── watchlist.astro  # Watchlist (Svelte)
│   ├── services/            # Servicios para consumo de API
│   ├── styles/              # Estilos globales (Tailwind)
│   ├── types/               # Tipos TypeScript
│   └── utils/               # Utilidades
├── tailwind.config.mjs      # Configuración de TailwindCSS
├── package.json             # Dependencias y scripts
└── tsconfig.json            # Configuración TypeScript
```

## Requerimientos de la Tarea y Cómo se Cumplen

### 1. **Islas (Islands Architecture)**
- El proyecto utiliza **al menos dos islas** con frameworks distintos:
  - **React**:  
    - `SearchComponent.jsx` y `MovieCarousel.jsx` en la página principal (`index.astro`).
    - Se montan usando directivas como `client:load` y `client:visible`.
  - **Svelte**:  
    - `AdvancedSearch.svelte` en `/search.astro` (búsqueda avanzada).
    - `WatchlistManager.svelte` y `WatchlistViewer.svelte` en `/watchlist.astro`.
    - Se montan usando directivas como `client:load` y `client:visible`.

### 2. **Directivas client**
- Se utilizan directivas como:
  - `client:load`: Monta el componente en el cliente al cargar la página.
  - `client:visible`: Monta el componente cuando es visible en el viewport.
- Ejemplo en `index.astro`:
  ```astro
  <SearchComponent client:load />
  <MovieCarousel client:visible ... />
  ```
- Ejemplo en `search.astro`:
  ```astro
  <AdvancedSearch client:visible genres={...} />
  ```
- Ejemplo en `watchlist.astro`:
  ```astro
  <WatchlistManager client:load ... />
  <WatchlistViewer client:load />
  ```

### 3. **Generación Estática (SSG) y Content Collections**
- Se usa la API de **content collections** de Astro para definir y validar los datos de películas y géneros (`src/content/config.ts`).
- Los archivos JSON de películas y géneros se generan automáticamente y se almacenan en `src/content/movies/` y `src/content/genres/`.
- Las páginas se generan estáticamente a partir de estos datos usando `getCollection` de Astro.
- Ejemplo de definición de colección:
  ```ts
  // src/content/config.ts
  export const collections = {
    movies: movieCollection,
    genres: genreCollection
  };
  ```

### 4. **Obtención de datos desde una API**
- El script `scripts/generate-content.mjs` obtiene los datos de películas y géneros desde la **API de TMDB** y los guarda como archivos JSON.
- El comando para poblar el contenido es:
  ```sh
  npm run generate:content
  ```
- Esto permite que la generación estática use datos frescos de la API.

## Scripts útiles

- `npm install` — Instala dependencias.
- `npm run dev` — Servidor de desarrollo.
- `npm run build` — Genera el sitio estático.
- `npm run preview` — Previsualiza el sitio generado.
- `npm run generate:content` — Pobla el contenido desde la API de TMDB.

## Tecnologías principales

- **Astro** (SSG, content collections)
- **React** y **Svelte** (islas interactivas)
- **TailwindCSS** (estilos)
- **TMDB API** (fuente de datos)

## Enlaces útiles

- [Astro Islands](https://docs.astro.build/en/guides/framework-components/)
- [Directivas client](https://docs.astro.build/en/reference/directives-reference/#client-directives)
- [Content Collections](https://docs.astro.build/en/guides/content-collections/)
- [TMDB API](https://www.themoviedb.org/documentation/api)
