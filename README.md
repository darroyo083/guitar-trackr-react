# Guitar Trackr 🎸

Una aplicación web para gestionar y organizar tu repertorio de canciones de guitarra.

## 🚀 Características principales

- **Gestión de canciones**: Añade, edita y elimina canciones de tu repertorio personal
- **Catálogo de canciones**: Explora nuevas canciones organizadas por dificultad, artista y afinación
- **Perfil de usuario**: Acceso personalizado a tu colección de canciones
- **Sistema de roles**: Funcionalidades específicas para usuarios y administradores
- **Tema claro/oscuro**: Personaliza la apariencia de la aplicación según tus preferencias
- **Diseño responsive**: Experiencia optimizada para dispositivos móviles, tablets y escritorio

## 🛠️ Tecnologías utilizadas

- **React 19**: Componentes funcionales y hooks
- **Context API**: Gestión del estado global (autenticación, temas, etc.)
- **CSS personalizado**: Variables CSS para temas, animaciones y transiciones
- **Animaciones**: Efectos visuales con AOS (Animate on Scroll)
- **Fetch API**: Comunicación con el backend
- **Vite**: Bundler y servidor de desarrollo

## 📋 Requisitos previos

- Node.js 18.x o superior
- npm 9.x o superior

## 🚀 Instalación

1. Clona este repositorio
   ```bash
   git clone https://github.com/yourusername/guitar-trackr-react.git
   cd guitar-trackr-react
   ```

2. Instala las dependencias
   ```bash
   npm install
   ```

3. Inicia el servidor de desarrollo
   ```bash
   npm run dev
   ```

4. Abre tu navegador en `http://localhost:5173`

## 🔧 Configuración

La aplicación está configurada para conectarse a un backend en `http://localhost:3020`. Si necesitas cambiar esta URL, edita las rutas de fetch en los componentes correspondientes.

## 📁 Estructura del proyecto

```
src/
├── App.jsx              # Componente principal
├── App.css              # Estilos para App
├── main.jsx             # Punto de entrada
├── index.css            # Estilos globales
├── components/          # Componentes reutilizables
│   ├── footer/          # Componente de pie de página
│   ├── header/          # Componente de encabezado
│   ├── mySongs/         # Gestión de canciones del usuario
│   ├── navbar/          # Barra de navegación
│   ├── profile/         # Perfil de usuario
│   ├── songDetails/     # Detalles de canción
│   ├── songList/        # Lista de canciones
│   └── themeToggle/     # Selector de tema
└── context/             # Contexto global
    └── AppContext.jsx   # Estado global de la aplicación
```

## 🔑 Funcionalidades principales

### Sistema de autenticación
La aplicación permite iniciar sesión y mantener la sesión activa entre visitas utilizando localStorage.

### Gestión de temas
Se implementa un sistema de temas claro/oscuro que respeta las preferencias del sistema y permite al usuario cambiarlo manualmente.

### Navegación
La navegación entre secciones se conserva incluso al recargar la página, mejorando la experiencia de usuario.

### Experiencia móvil
En dispositivos móviles, se implementa una vista específica para detalles de canción, facilitando la navegación.

## 🔍 Características adicionales

- **Animaciones**: Transiciones y efectos visuales para mejorar la experiencia de usuario
- **Filtros**: Sistema de filtrado para buscar canciones por dificultad, artista o afinación
- **Gestión de errores**: Manejo de errores en peticiones al servidor
- **Persistencia de datos**: Almacenamiento local para preferencias y sesión

## 📄 Licencia

MIT

## 📧 Contacto

Proyecto creado por [Daniel Arroyo] - [darroyo083@gmail.com]

---