# React Components for Films Vault

Esta carpeta contiene los componentes React interactivos para Films Vault, implementados como "islas" de Astro con diferentes estrategias de hidratación para optimizar el rendimiento.

## 📁 Estructura

```
src/components/react/
├── SearchComponent.jsx      # Búsqueda de películas (client:load)
├── FavoriteButton.jsx       # Botón de favoritos (client:idle)
├── MovieCarousel.jsx        # Carrusel de películas (client:visible)
├── FilterBar.jsx           # Barra de filtros (client:load)
└── README.md               # Esta documentación
```

## 🚀 Componentes

### 1. SearchComponent.jsx
**Client Directive:** `client:load`

Componente de búsqueda en tiempo real que permite buscar películas por título, actores o directores.

**Características:**
- Búsqueda con debounce (300ms)
- Resultados en dropdown con imágenes
- Navegación automática a páginas de películas
- Loading states y manejo de errores
- Diseño responsive

**Uso:**
```astro
---
import SearchComponent from '../components/react/SearchComponent.jsx';
---

<SearchComponent client:load />
```

### 2. FavoriteButton.jsx
**Client Directive:** `client:idle`

Botón para marcar/desmarcar películas como favoritas con persistencia en localStorage.

**Características:**
- Persistencia local con localStorage
- Estados de loading y éxito
- Animaciones y feedback visual
- Carga diferida (client:idle)

**Props:**
- `movieId`: ID de la película
- `movieTitle`: Título de la película
- `moviePoster`: URL del poster

**Uso:**
```astro
---
import FavoriteButton from '../components/react/FavoriteButton.jsx';
---

<FavoriteButton 
  client:idle 
  movieId={123}
  movieTitle="Movie Title"
  moviePoster="/path/to/poster.jpg"
/>
```

### 3. MovieCarousel.jsx
**Client Directive:** `client:visible`

Carrusel horizontal de películas que se carga cuando entra en el viewport.

**Características:**
- Navegación con flechas y dots
- Grid responsive (1-4 columnas)
- Lazy loading de imágenes
- Intersection Observer para carga diferida
- Animaciones suaves

**Props:**
- `movies`: Array de objetos de películas
- `title`: Título del carrusel
- `showViewAll`: Mostrar enlace "Ver todas"

**Uso:**
```astro
---
import MovieCarousel from '../components/react/MovieCarousel.jsx';

const movies = [
  {
    id: 1,
    title: "Movie Title",
    poster_path: "/path/to/poster.jpg",
    release_date: "2024-01-01",
    vote_average: 8.5,
    overview: "Movie description..."
  }
];
---

<MovieCarousel 
  client:visible 
  movies={movies}
  title="Featured Movies"
  showViewAll={true}
/>
```

### 4. FilterBar.jsx
**Client Directive:** `client:load`

Barra de filtros expandible para filtrar películas por género, año, rating y ordenamiento.

**Características:**
- Filtros por género, año, rating mínimo
- Ordenamiento por popularidad, rating, fecha, título
- Filtros activos visibles con opción de eliminar
- Acciones rápidas (Top Rated, This Year, etc.)
- Diseño colapsable

**Props:**
- `genres`: Array de géneros disponibles
- `onFiltersChange`: Callback cuando cambian los filtros

**Uso:**
```astro
---
import FilterBar from '../components/react/FilterBar.jsx';

const genres = [
  { id: 28, name: "Action" },
  { id: 12, name: "Adventure" }
];
---

<FilterBar 
  client:load 
  genres={genres}
  onFiltersChange={(filters) => console.log(filters)}
/>
```

## 🎯 Client Directives

### client:load
- **Cuándo usar:** Componentes críticos que necesitan interactividad inmediata
- **Ejemplos:** SearchComponent, FilterBar
- **Comportamiento:** Se carga y hidrata inmediatamente al cargar la página

### client:idle
- **Cuándo usar:** Componentes no críticos que pueden cargar cuando el navegador esté inactivo
- **Ejemplos:** FavoriteButton
- **Comportamiento:** Se carga cuando el navegador está inactivo

### client:visible
- **Cuándo usar:** Componentes pesados que están fuera del viewport inicial
- **Ejemplos:** MovieCarousel
- **Comportamiento:** Se carga cuando el componente entra en el viewport

### client:media
- **Cuándo usar:** Componentes que solo necesitan ser interactivos en ciertos tamaños de pantalla
- **Ejemplos:** Menús móviles, componentes responsive
- **Comportamiento:** Se carga basado en media queries

## 🎨 Diseño

Todos los componentes siguen el sistema de diseño de Films Vault:

**Colores:**
- `vault-dark`: #213448
- `vault-medium`: #547792
- `vault-light`: #94B4C1
- `vault-cream`: #ECEFCA

**Clases CSS:**
- Bordes: `border-vault-light/20`
- Fondos: `bg-vault-dark/80`
- Textos: `text-vault-cream`, `text-vault-light`
- Sombras: `shadow-vault`, `shadow-vault-lg`

## 🔧 Integración con TMDB

Los componentes están diseñados para trabajar con la API de TMDB:

- **SearchComponent:** Usa `tmdbService.searchMovies()`
- **MovieCarousel:** Espera objetos con estructura de TMDB
- **FilterBar:** Usa géneros de TMDB
- **FavoriteButton:** Persiste datos localmente

## 📱 Responsive Design

Todos los componentes son completamente responsive:

- **Mobile:** 1 columna
- **Tablet:** 2 columnas
- **Desktop:** 4 columnas (donde aplique)

## 🚀 Performance

**Optimizaciones implementadas:**
- Lazy loading de imágenes
- Debounce en búsquedas
- Intersection Observer para carga diferida
- LocalStorage para persistencia
- Animaciones CSS optimizadas

## 🧪 Testing

Para probar los componentes:

1. **Página de demo:** `/components-demo`
2. **Desarrollo:** `npm run dev`
3. **Build:** `npm run build`

## 📝 Notas de Desarrollo

- Todos los componentes usan hooks de React
- Manejo de errores implementado
- Estados de loading incluidos
- Accesibilidad considerada
- TypeScript ready (aunque escritos en JSX)

## 🔄 Actualizaciones Futuras

**Funcionalidades planificadas:**
- [ ] Integración con backend para favoritos
- [ ] Búsqueda avanzada con filtros
- [ ] Paginación en carruseles
- [ ] Modo oscuro/claro
- [ ] Tests unitarios
- [ ] Animaciones más avanzadas 