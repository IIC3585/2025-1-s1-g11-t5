# Svelte Components - Films Vault

Este documento describe los componentes Svelte implementados en Films Vault con diferentes directivas de cliente de Astro.

## Componentes Implementados

### 1. MovieModal.svelte
**Directiva:** `client:visible`
**Ubicación:** `src/components/svelte/MovieModal.svelte`

**Características:**
- Modal completo para mostrar detalles de películas
- Carga cuando se hace visible en el viewport
- Incluye información completa: poster, backdrop, cast, crew, detalles financieros
- Navegación con teclado (ESC para cerrar)
- Scroll interno para contenido largo
- Diseño responsive

**Props:**
```javascript
{
  movie: Object, // Datos de la película
  isOpen: Boolean // Estado del modal
}
```

**Eventos:**
- `close` - Disparado al cerrar el modal

### 2. WatchlistManager.svelte
**Directiva:** `client:idle`
**Ubicación:** `src/components/svelte/WatchlistManager.svelte`

**Características:**
- Gestión de múltiples listas de películas
- Persistencia en localStorage
- Creación y eliminación de listas personalizadas
- Vista previa de películas recientes
- Animaciones de carga
- Listas por defecto: "My Watchlist" y "Favorites"

**Props:**
```javascript
{
  movie: Object // Película seleccionada para agregar/quitar
}
```

**Eventos:**
- `added` - Película agregada a una lista
- `removed` - Película removida de una lista
- `created` - Nueva lista creada
- `deleted` - Lista eliminada
- `viewAll` - Ver todas las listas

### 3. AdvancedSearch.svelte
**Directiva:** `client:visible`
**Ubicación:** `src/components/svelte/AdvancedSearch.svelte`

**Características:**
- Búsqueda avanzada con múltiples filtros
- Filtros por género, año, rating, ordenamiento
- Búsqueda en tiempo real con debounce
- Paginación de resultados
- Integración con API de TMDB
- Interfaz intuitiva con estados de carga

**Props:**
```javascript
{
  genres: Array // Lista de géneros disponibles
}
```

**Eventos:**
- `results` - Resultados de búsqueda obtenidos
- `cleared` - Filtros limpiados

### 4. DarkModeToggle.svelte
**Directiva:** `client:only="svelte"`
**Ubicación:** `src/components/svelte/DarkModeToggle.svelte`

**Características:**
- Alternancia entre modo claro y oscuro
- Persistencia de preferencia en localStorage
- Animaciones suaves de transición
- Iconos dinámicos (luna/sol)
- Efecto de ripple en hover
- Integrado en el header de la aplicación

**Props:** Ninguna

**Eventos:** Ninguno

## Directivas de Cliente Utilizadas

### client:visible
- **Uso:** MovieModal, AdvancedSearch
- **Propósito:** Carga el componente cuando se hace visible en el viewport
- **Ventajas:** Optimización de rendimiento, carga bajo demanda
- **Casos de uso:** Modales, componentes de búsqueda, contenido que requiere interacción

### client:idle
- **Uso:** WatchlistManager
- **Propósito:** Carga cuando el navegador está inactivo
- **Ventajas:** No interfiere con la experiencia principal del usuario
- **Casos de uso:** Funcionalidades secundarias, características opcionales

### client:only="svelte"
- **Uso:** DarkModeToggle
- **Propósito:** Renderiza únicamente en el cliente, sin SSR
- **Ventajas:** Acceso inmediato a APIs del navegador
- **Casos de uso:** Toggles de tema, componentes que requieren localStorage

## Integración en la Aplicación

### Header
El `DarkModeToggle` está integrado en el header principal:
```astro
---
import DarkModeToggle from '../svelte/DarkModeToggle.svelte';
---

<DarkModeToggle client:only="svelte" />
```

### Página de Demostración
Todos los componentes están disponibles en `/svelte-demo` para pruebas y demostración.

## Estructura de Archivos

```
src/
├── components/
│   └── svelte/
│       ├── MovieModal.svelte
│       ├── WatchlistManager.svelte
│       ├── AdvancedSearch.svelte
│       └── DarkModeToggle.svelte
├── pages/
│   └── svelte-demo.astro
└── layouts/
    └── Header.astro (actualizado con DarkModeToggle)
```

## Uso de los Componentes

### MovieModal
```astro
---
import MovieModal from '../components/svelte/MovieModal.svelte';
---

<MovieModal 
  client:visible
  movie={movieData}
  isOpen={false}
/>
```

### WatchlistManager
```astro
---
import WatchlistManager from '../components/svelte/WatchlistManager.svelte';
---

<WatchlistManager 
  client:idle
  movie={selectedMovie}
/>
```

### AdvancedSearch
```astro
---
import AdvancedSearch from '../components/svelte/AdvancedSearch.svelte';
---

<AdvancedSearch 
  client:visible
  genres={genresList}
/>
```

### DarkModeToggle
```astro
---
import DarkModeToggle from '../components/svelte/DarkModeToggle.svelte';
---

<DarkModeToggle client:only="svelte" />
```

## Características del Diseño

Todos los componentes siguen el sistema de diseño Vault:

- **Colores:** Paleta oscura con acentos en azul-gris
- **Tipografía:** Jerarquía clara con pesos variables
- **Espaciado:** Sistema consistente de padding y margins
- **Bordes:** Bordes redondeados y sutiles
- **Transiciones:** Animaciones suaves de 200-300ms
- **Responsive:** Diseño adaptativo para móviles y desktop

## Optimizaciones de Rendimiento

1. **Lazy Loading:** Componentes cargan solo cuando son necesarios
2. **Debounce:** Búsquedas optimizadas con delays
3. **Intersection Observer:** Detección eficiente de visibilidad
4. **LocalStorage:** Persistencia local sin llamadas al servidor
5. **Event Delegation:** Manejo eficiente de eventos

## Próximos Pasos

1. **Integración con API:** Conectar WatchlistManager con backend
2. **Sincronización:** Sincronizar preferencias entre dispositivos
3. **Accesibilidad:** Mejorar navegación por teclado y lectores de pantalla
4. **Testing:** Implementar tests unitarios para componentes
5. **Performance:** Optimizar bundle size y carga inicial

## Notas de Desarrollo

- Todos los componentes son completamente funcionales
- El diseño es consistente con el tema Vault existente
- Las directivas de cliente están optimizadas para cada caso de uso
- Los componentes incluyen manejo de errores y estados de carga
- La documentación está actualizada con ejemplos de uso 