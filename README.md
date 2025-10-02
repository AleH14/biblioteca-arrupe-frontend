# 📚 Biblioteca Arrupe - Frontend

Proyecto de interfaz de usuario (frontend) para la biblioteca digital del Colegio Arrupe. Permite a los usuarios navegar por el catálogo de libros, buscar títulos y ver los detalles de cada ejemplar.

> **🔗 Parte del Sistema Biblioteca Arrupe**: Este repositorio es el frontend de un sistema completo que incluye backend y infraestructura en repositorios separados.

## 🏗️ Arquitectura del Sistema

Este proyecto forma parte de una arquitectura de microservicios distribuida en tres repositorios:

| Repositorio | Descripción | Tecnología Principal |
|-------------|-------------|---------------------|
| **[biblioteca-arrupe-frontend](https://github.com/AleH14/biblioteca-arrupe-frontend)** | 🎨 Interfaz de usuario (este repositorio) | Next.js + React |
| **[biblioteca-arrupe-backend](https://github.com/AleH14/biblioteca-arrupe-backend)** | ⚙️ API y lógica de negocio | JavaScript/Node.js |
| **[infrastructure-biblioteca-arrupe](https://github.com/AleH14/infrastructure-biblioteca-arrupe)** | 🐳 Infraestructura y orquestación | Docker Compose + PowerShell |

## 🚀 Características

- **Sistema de Gestión de Biblioteca**: Interfaz moderna y responsiva para la gestión de biblioteca digital
- **Navegación por Catálogo**: Explora fácilmente el catálogo de libros disponibles
- **Búsqueda Avanzada**: Encuentra libros por título, autor o categoría
- **Sistema de Préstamos**: Gestiona préstamos y devoluciones de libros
- **Responsive Design**: Optimizado para dispositivos móviles y desktop
- **Integración con Backend**: Conectado con la API de gestión de biblioteca

## 🛠️ Tecnologías Utilizadas

- **Next.js 14** - Framework de React para aplicaciones web
- **React** - Biblioteca de JavaScript para interfaces de usuario
- **Bootstrap** - Framework CSS para diseño responsivo
- **CSS Modules** - Estilos modulares y escalables
- **Jest** - Framework de testing
- **Docker** - Containerización de la aplicación

## 📦 Instalación

### 🚀 Instalación Rápida con Docker (Recomendada)

Para ejecutar todo el sistema completo (frontend + backend + base de datos):

1. **Clona el repositorio de infraestructura**
```bash
git clone https://github.com/AleH14/infrastructure-biblioteca-arrupe.git
cd infrastructure-biblioteca-arrupe
```

2. **Ejecuta el sistema completo**
```bash
# Seguir las instrucciones del repositorio de infraestructura
# Esto levantará automáticamente el frontend, backend y base de datos
```

### ⚡ Desarrollo Local (Solo Frontend)

Si solo quieres trabajar en el frontend:

#### Prerrequisitos

- Node.js 18 o superior
- npm, yarn o pnpm
- Backend ejecutándose en `http://localhost:8000` (opcional para desarrollo)

#### Pasos de instalación

1. **Clona el repositorio**
```bash
git clone https://github.com/AleH14/biblioteca-arrupe-frontend.git
cd biblioteca-arrupe-frontend
```

2. **Instala las dependencias**
```bash
# Con npm
npm install

# Con yarn
yarn install

# Con pnpm
pnpm install
```

3. **Ejecuta el servidor de desarrollo**
```bash
# Con npm
npm run dev

# Con yarn
yarn dev

# Con pnpm
pnpm dev
```

4. **Abre tu navegador**
Visita [http://localhost:3000](http://localhost:3000) para ver la aplicación.

## 🐳 Docker

### Ejecutar solo el Frontend con Docker

```bash
# Construir la imagen
docker build -t biblioteca-arrupe-frontend .

# Ejecutar el contenedor
docker run -p 3000:3000 biblioteca-arrupe-frontend
```

### Ejecutar el Sistema Completo

Para ejecutar frontend + backend + base de datos, usa el repositorio de infraestructura:
👉 **[infrastructure-biblioteca-arrupe](https://github.com/AleH14/infrastructure-biblioteca-arrupe)**

## 🔗 Conexión con el Backend

Este frontend se conecta con la API del backend que proporciona:

- **Autenticación de usuarios**
- **Gestión de catálogo de libros**
- **Sistema de préstamos y devoluciones**
- **Base de datos de biblioteca**

🔗 **Backend Repository**: [biblioteca-arrupe-backend](https://github.com/AleH14/biblioteca-arrupe-backend)

## 🧪 Testing

```bash
# Ejecutar tests
npm run test

# Ejecutar tests en modo watch
npm run test:watch

# Generar reporte de cobertura
npm run test:coverage
```

## 📁 Estructura del Proyecto

```
biblioteca-arrupe-frontend/
├── src/
│   ├── app/                 # Páginas y layouts de Next.js
│   │   ├── globals.css      # Estilos globales
│   │   ├── layout.js        # Layout principal
│   │   └── page.js          # Página principal
│   ├── components/          # Componentes reutilizables
│   │   └── forms/           # Formularios específicos
│   └── styles/              # Estilos modulares
├── public/                  # Archivos estáticos
├── Dockerfile              # Configuración de Docker
├── jest.config.js          # Configuración de Jest
├── next.config.mjs         # Configuración de Next.js
└── package.json            # Dependencias y scripts
```

## 📱 Funcionalidades

### Sistema de Navegación
- **Menú Principal**: Acceso rápido a las diferentes secciones
- **Vista de Préstamos**: Gestión completa de préstamos de libros

### Interfaz Responsiva
- Diseño adaptativo para móviles y tablets
- Botones con iconos y efectos hover
- Tarjetas interactivas con animaciones

### Integración Backend
- Comunicación con API REST
- Manejo de estados de autenticación
- Sincronización de datos en tiempo real

## 🔧 Scripts Disponibles

```bash
npm run dev          # Inicia el servidor de desarrollo
npm run build        # Construye la aplicación para producción
npm run start        # Inicia la aplicación en modo producción
npm run lint         # Ejecuta el linter
npm run test         # Ejecuta las pruebas
```

## 🌐 Ecosistema Biblioteca Arrupe

### 🎯 Repositorios Relacionados

1. **Frontend (Este repositorio)**
   - Interfaz de usuario
   - Experiencia del usuario
   - Diseño responsivo

2. **[Backend](https://github.com/AleH14/biblioteca-arrupe-backend)**
   - API REST
   - Lógica de negocio
   - Gestión de base de datos
   - Autenticación

3. **[Infraestructura](https://github.com/AleH14/infrastructure-biblioteca-arrupe)**
   - Docker Compose
   - Scripts de despliegue
   - Configuración de entorno

### 🚀 Despliegue Completo

Para desplegar todo el sistema:

1. Usar el repositorio de infraestructura
2. Configurar variables de entorno
3. Ejecutar docker-compose
4. Acceder a la aplicación completa

## 🎨 Personalización

### Estilos
- Los estilos globales se encuentran en `src/app/globals.css`
- Cada componente puede tener sus propios estilos modulares
- Soporte para modo oscuro automático

### Componentes
- Estructura modular de componentes en `src/components/`
- Formularios especializados en `src/components/forms/`

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

## 👥 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Contribuir al Ecosistema

Si tu contribución afecta múltiples repositorios:
1. Crea issues en los repositorios correspondientes
2. Referencias cruzadas entre issues relacionados
3. Coordina los PRs entre repositorios

## 📞 Contacto

**Desarrollador**: [@AleH14](https://github.com/AleH14)

**Repositorios del Sistema**:
- 🎨 [Frontend](https://github.com/AleH14/biblioteca-arrupe-frontend)
- ⚙️ [Backend](https://github.com/AleH14/biblioteca-arrupe-backend)
- 🐳 [Infraestructura](https://github.com/AleH14/infrastructure-biblioteca-arrupe)

---

💡 **Nota**: Este proyecto forma parte del sistema de gestión integral de la biblioteca del Colegio Arrupe, diseñado para modernizar y digitalizar los procesos bibliotecarios mediante una arquitectura distribuida y escalable.
