# Sistema B - Gestión de Inventario

Sistema web desarrollado con **React** que actúa como el **Sistema B** del proyecto de Desarrollo de Software Seguro. Este sistema expone servicios para la consulta y gestión de inventario, integrándose con el Sistema A mediante una comunicación segura.

## Requisitos Previos

Antes de ejecutar el proyecto, asegúrate de tener instalado:

* Node.js 18 o superior
* npm (incluido con Node.js)
* Git (opcional)

## Instalación

1. Clonar o descargar el proyecto.

2. Abrir una terminal dentro de la carpeta del proyecto.

3. Instalar las dependencias:

```bash
npm install
```

## Ejecución

Para iniciar la aplicación en modo desarrollo, ejecuta:

```bash
npm start
```

La aplicación estará disponible en:

```
http://localhost:3000
```

Cada vez que se realicen cambios en el código, React actualizará automáticamente la aplicación en el navegador.

## Compilación para Producción

Para generar la versión optimizada del proyecto:

```bash
npm run build
```

Los archivos compilados se almacenarán en la carpeta:

```
build/
```

## Estructura del Proyecto

```
src/
│
├── components/      Componentes reutilizables
├── pages/           Vistas principales
├── services/        Comunicación con APIs
├── assets/          Imágenes y recursos
├── App.js           Componente principal
└── index.js         Punto de entrada
```

## Funcionalidades

* Consulta de productos.
* Visualización del inventario.
* Gestión de existencias.
* Integración con el Sistema A mediante servicios REST.
* Preparado para autenticación mediante Keycloak (SSO).
* Preparado para comunicación segura utilizando un KMS.

## Tecnologías Utilizadas

* React
* JavaScript
* HTML5
* CSS3
* Node.js
* npm

## Integración con el Proyecto

Este proyecto corresponde al **Sistema B** dentro de la arquitectura del proyecto de Desarrollo de Software Seguro.

Su función principal es recibir solicitudes provenientes del **Sistema A**, procesarlas y responder mediante servicios REST. En la versión final del proyecto, la comunicación entre ambos sistemas estará protegida mediante cifrado utilizando un servicio de Key Management Service (KMS), mientras que la autenticación y autorización serán administradas por Keycloak.
