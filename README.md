# El Switcher

Proyecto de ingenieria de Software 1 2024 - FAMAF UNC

## Estructura del proyecto
    
```
├── public
└── src
    ├── components
    ├── pages
    ├── services
    |   ├── api
    |   └── state
    └── main.tsx
```

- **public**: Contiene los archivos estáticos de la aplicación (imagenes, fuentes, etc).
- **src**: Contiene el código fuente de la aplicación.
    - **components**: Contiene los componentes de React, que luego son utilizados en las páginas. También contiene el test correspondiente a cada componente.
    - **pages**: Contiene las páginas de la aplicación. Cada página es una vista que el usuario puede ver.
    - **services**: Contiene los servicios de la aplicación.
        - **api**: Contiene los servicios que se comunican con el backend.
        - **state**: Contiene los servicios que manejan el estado de la aplicación.
    - **App.tsx**: Componente principal de la aplicación.

## Comenzando 🚀

### Requisitos 📋

Para poder correr el proyecto necesitas tener instalado:
- [Docker](https://www.docker.com/)

Opcionalmente, si no queres usar Docker, necesitas tener instalado:
- [Node.js](https://nodejs.org/es/)


### Instalación

#### Linux

1. Clonar el repositorio
```bash
git clone git@github.com:NoSeRecursaMas/switcher-frontend.git
```

2. Ingresar al repositorio
```bash
cd switcher-frontend
```

3. Ejecutar el script de instalación
```bash
make build-docker
```

4. Iniciar el contenedor
```bash
make run-docker
```

5. Ingresar a la aplicación en [http://localhost:3000](http://localhost:3000)

#### Windows

1. Clonar el repositorio 
```bash
git clone git@github.com:NoSeRecursaMas/switcher-frontend.git
```

2. Ingresar al repositorio
```bash
cd switcher-frontend
```

3. Ejecutar el script de instalación
```bash
docker build -t frontend .
```

4. Iniciar el contenedor
```bash
docker run -p 8000:80 -v .:/app frontend
```

5. Ingresar a la aplicación en [http://localhost:3000](http://localhost:3000)

#### Sin Docker

1. Clonar el repositorio
```bash
git clone git@github.com:NoSeRecursaMas/switcher-frontend.git
```

2. Ingresar al repositorio
```bash
cd switcher-frontend
```

3. Instalar las dependencias
```bash
npm install
```

4. Correr la aplicación
```bash
npm run dev
```

5. Ingresar a la aplicación en [http://localhost:3000](http://localhost:3000)

## Otras tareas

### Ejecución de pruebas unitarias
```bash
make test
```
