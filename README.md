# ☕ Origen Sierra Nevada - Café Premium

![Sierra Nevada de Santa Marta](https://img.shields.io/badge/Origen-Sierra%20Nevada-C8AA6E?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-En%20Desarrollo-green?style=for-the-badge)

Proyecto web para **Café Origen Sierra Nevada**, un café premium proveniente de la Sierra Nevada de Santa Marta, Colombia.

---

## 📋 Descripción del Proyecto

Plataforma digital completa para presentar y comercializar café de origen premium, cultivado en las alturas de la Sierra Nevada de Santa Marta. El proyecto incluye:

- 🌐 **Sitio Web Interactivo** con diseño moderno y experiencia inmersiva
- 📖 **Brandbook Digital** documentando la identidad visual de la marca
- 🔐 **Sistema de Autenticación** con Supabase para contenido administrativo
- 🎨 **Diseño Premium** con paleta de colores inspirada en la naturaleza

---

## 🎨 Identidad Visual

### Paleta de Colores
- **Verde Origen Profundo**: `#141E16` - Color principal, evoca la selva densa
- **Dorado Sierra**: `#C8AA6E` - Color de acento premium
- **Blanco Niebla**: `#F5F5F5` - Color neutro claro
- **Carbón Suave**: `#333333` - Color neutro oscuro

### Tipografías
- **Display** Playfair Display - Titulares elegantes y editoriales
- **Body**: Papyrus - Tipografía distintiva para subtítulo del logo (SIERRA NEVADA)

---

## 📁 Estructura del Proyecto

```
origen_sierranevada/
├── Documentation/
│   └── Brandbook Origen SNSM/    # Brandbook interactivo
│       ├── brandbook.html         # Página principal del brandbook
│       ├── brandbook.js           # Interactividad (menú, animaciones)
│       └── Brandbook Origen SNSM.pdf  # Versión PDF descargable
├── web-page/
│   ├── pages/                     # Aplicación React con Vite
│   │   ├── components/            # Componentes reutilizables
│   │   ├── contexts/              # Context API (AuthContext)
│   │   ├── pages/                 # Páginas de la aplicación
│   │   ├── services/              # Servicios (Supabase, Auth)
│   │   └── .env                   # Variables de entorno
│   └── database/                  # Scripts SQL de Supabase
│       └── setup.sql              # Configuración de base de datos
└── imagen_apoyo/                  # Assets y recursos gráficos
```

---

## 🚀 Tecnologías Utilizadas

### Frontend
- **HTML5** / **CSS3** / **JavaScript (ES6+)**
- **React 19** con **Vite**
- **Tailwind CSS** para estilos utility-first
- **React Router** para navegación

### Backend & Base de Datos
- **Supabase** - Backend as a Service
  - Autenticación de usuarios
  - Base de datos PostgreSQL
  - Row Level Security (RLS)
  - Storage para archivos

### Herramientas de Desarrollo
- **TypeScript** para tipado estático
- **Git** para control de versiones
- **npm** para gestión de paquetes

---

## 🔧 Instalación y Configuración

### Prerrequisitos
- Node.js 18+ y npm
- Git
- Cuenta de Supabase

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/tu-usuario/origen-sierra-nevada.git
cd origen-sierra-nevada
```

2. **Instalar dependencias**
```bash
cd web-page/pages
npm install
```

3. **Configurar variables de entorno**
- Copia el archivo `.env.example` a `.env`
- Completa las credenciales de Supabase:
  ```
  VITE_SUPABASE_URL=tu_project_url
  VITE_SUPABASE_ANON_KEY=tu_anon_key
  ```

4. **Configurar base de datos**
- Ve al dashboard de Supabase
- Ejecuta el script `web-page/database/setup.sql` en el SQL Editor
- Crea un usuario administrador en Authentication > Users

5. **Iniciar servidor de desarrollo**
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

---

## 📖 Brandbook

El brandbook interactivo está disponible en:
- **Web**: `Documentation/Brandbook Origen SNSM/brandbook.html`
- **PDF**: `Documentation/Brandbook Origen SNSM/Brandbook Origen SNSM.pdf`

### Funcionalidades del Brandbook
- ✅ Navegación suave entre secciones
- ✅ Menú móvil responsive
- ✅ Copiado de códigos de color al portapapeles
- ✅ Animaciones on-scroll
- ✅ Efecto parallax sutil
- ✅ Descarga de manual PDF

---

## 🔐 Sistema de Autenticación

El proyecto incluye autenticación completa con Supabase:

- **Login/Logout** con email y contraseña
- **Roles de usuario**: `user` (normal) y `admin` (administrador)
- **Rutas protegidas**: Solo administradores acceden al brandbook
- **Gestión de sesiones**: Tokens JWT auto-renovables

### Usuario Administrador
- Email: `cafemalusm@gmail.com`
- (Contraseña configurada en Supabase)

---

## 🎯 Características Principales

### Brandbook Digital
- Paleta de colores interactiva con copiado al portapapeles
- Showcase de tipografías con jerarquía visual
- Catálogo de elementos UI (botones, iconos)
- Galería de mood fotográfico

### Sitio Web
- Diseño responsive mobile-first
- Experiencia de usuario inmersiva
- Integración con sistema de autenticación
- Contenido protegido por roles

---

## 📝 Scripts Disponibles

En el directorio `web-page/pages`:

```bash
npm run dev      # Inicia servidor de desarrollo
npm run build    # Construye para producción
npm run preview  # Preview de build de producción
```

---

## 🤝 Contribución

Este es un proyecto privado. Para contribuir:

1. Crea un fork del repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📄 Licencia

Propietario: **Origen Sierra Nevada**  
Todos los derechos reservados © 2024

---

## 📧 Contacto

- **Email**: cafemalusm@gmail.com
- **Proyecto**: Café Origen Sierra Nevada

---

## 🙏 Agradecimientos

- Comunidades cafeteras de la Sierra Nevada de Santa Marta
- Diseñadores y desarrolladores que contribuyeron al proyecto
- [Supabase](https://supabase.com) por el backend
- [Vite](https://vitejs.dev) por la herramienta de build

---

**Hecho bajo el poder del diseño de [MODUS AXON](https://github.com/modusaxon-hub) con ☕ y ❤️ en Colombia**
