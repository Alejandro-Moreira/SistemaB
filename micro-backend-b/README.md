# Sistema B — Micro-Backend de Descifrado KMS

## ¿Qué es este servicio?
Este servicio es un micro-backend aislado desarrollado en Node.js y Express que se encarga exclusivamente de interactuar con AWS Key Management Service (KMS) para realizar la operación crítica de descifrado de llaves de datos (Data Keys) y el posterior descifrado de los payloads cifrados de facturas.

## Responsabilidad única
La responsabilidad única de este microservicio es recibir un payload con datos cifrados (factura) y una llave de datos cifrada (Data Key), validar el token de autenticación del usuario (Bearer JWT de Keycloak), solicitar a AWS KMS (o mock local) el descifrado de la llave de datos, descifrar los datos de la factura con el algoritmo simétrico AES-256-GCM y retornar el JSON limpio en texto plano. No maneja base de datos, lógica de negocio de facturación, ni almacenamiento de archivos.

## Requisitos previos
- Node.js >= 18
- Docker (para la ejecución de la infraestructura base y Keycloak)
- Cuenta de AWS o LocalStack (si se usa modo real de AWS KMS)

## Variables de entorno (.env)
Las siguientes variables de entorno deben estar configuradas en el archivo `.env`:

- `PORT`: Puerto en el que corre el microservicio (por defecto `3003`).
- `ALLOWED_ORIGIN`: Origen permitido para CORS (típicamente `http://localhost:3002`, correspondiente a Sistema A).
- `KMS_MODE`: Modo de funcionamiento. Valores posibles: `mock` (utiliza criptografía local con `node:crypto` simulación en memoria) o `aws` (utiliza un cliente de AWS KMS real o LocalStack).
- `AWS_REGION`: Región de AWS (ej. `us-east-1`, requerido solo si `KMS_MODE=aws`).
- `AWS_ACCESS_KEY_ID`: ID de clave de acceso de AWS (requerido solo si `KMS_MODE=aws`).
- `AWS_SECRET_ACCESS_KEY`: Clave de acceso secreta de AWS (requerido solo si `KMS_MODE=aws`).
- `KMS_KEY_ARN`: ARN de la clave maestra de KMS (requerido solo si `KMS_MODE=aws`).
- `KMS_ENDPOINT`: Endpoint personalizado para KMS (ej. `http://localhost:4566` para LocalStack, opcional).
- `KEYCLOAK_URL`: URL base del servidor de Keycloak (ej. `http://localhost:8080`).
- `KEYCLOAK_REALM`: Realm de Keycloak utilizado para la validación de firmas de tokens (ej. `facturacion-realm`).

## Instalación
Para instalar las dependencias desde cero, ejecuta el siguiente comando en el directorio raíz de este servicio:
```bash
npm install
```

## Ejecución
Para iniciar el servicio en modo de desarrollo (con recarga automática mediante nodemon):
```bash
npm run dev
```

Para iniciar el servicio en modo de producción:
```bash
npm start
```

## Endpoint disponible

### `POST /decrypt`
Desencripta una factura utilizando la llave de datos envuelta provista.

- **Headers requeridos:**
  - `Content-Type: application/json`
  - `Authorization: Bearer <JWT_TOKEN>` (Token de acceso emitido por Keycloak, validado contra JWKS).

- **Body esperado (JSON):**
  ```json
  {
    "encryptedData": "U2FsdGVkX1+vO132M45G...",
    "encryptedKey": "AQIDAHgdb5Z...",
    "iv": "R01DdW12...",
    "authTag": "bWljcm9..."
  }
  ```

- **Response exitosa (200 OK):**
  ```json
  {
    "invoice": {
      "id": 1,
      "numero": "FAC-2026-0001",
      "fecha": "2026-06-26T01:58:38Z",
      "cliente": "Alpina Ecuador",
      "monto": 15000.00,
      "forma_pago": "Transferencia Bancaria",
      "estado": "pagada",
      "items": [
        { "descripcion": "Día de rodaje (crew completo)", "cantidad": 1, "precio": 8000 },
        { "descripcion": "Post-producción y color grading", "cantidad": 1, "precio": 5000 },
        { "descripcion": "Motion graphics", "cantidad": 1, "precio": 2000 }
      ]
    }
  }
  ```

- **Códigos de error posibles:**
  - `400 Bad Request`: Payload incompleto o mal estructurado (ej. falta `encryptedData` o `encryptedKey`).
  - `401 Unauthorized`: Token ausente, expirado, con firma inválida, o sin roles adecuados.
  - `500 Internal Server Error`: Fallo en la comunicación con AWS KMS o error en el proceso criptográfico de descifrado.

## Seguridad
- **Aislamiento de Material Criptográfico:** Este servicio NUNCA expone ni devuelve la llave de datos (Data Key) en texto plano al cliente ni al Sistema A. La llave descifrada por KMS reside en la memoria volátil del proceso de Node.js solo durante el instante del descifrado AES-256-GCM y luego es destruida por el Garbage Collector.
- **Validación del Token JWT (Zero Trust):** En cada petición, el middleware `keycloakGuard` obtiene dinámicamente las claves públicas de Keycloak mediante el endpoint de certificados JWKS y verifica criptográficamente la firma del Bearer token enviado por el cliente.
- **Restricción CORS Estricta:** Solo se permiten peticiones originadas desde el puerto del Sistema A (`ALLOWED_ORIGIN`), bloqueando accesos directos no deseados desde navegadores en otros dominios.

## Diagrama del flujo

```
[ Frontend React (5173) ]
         │
         │ (1) Solicita descifrado de Factura
         │     con Bearer Token JWT en cabecera
         ▼
[ Sistema A (3002) ]
         │
         │ (2) Reenvía petición de descifrado 
         │     (payload cifrado + Data Key cifrada + JWT)
         ▼
[ Micro-Backend B (3003) ] 
         │
         │ (3) Valida JWT contra JWKS de Keycloak (8080)
         │ (4) Envía Data Key cifrada a descifrar
         ▼
    [ AWS KMS ]  (o Mock Local en memoria)
         │
         │ (5) Retorna Data Key en texto plano (en memoria de B)
         ▼
[ Micro-Backend B (3003) ]
         │
         │ (6) Desencripta los datos con AES-256-GCM usando la Data Key
         │ (7) Devuelve JSON limpio en texto plano
         ▼
[ Sistema A (3002) ]
         │
         │ (8) Retorna factura descifrada a React
         ▼
[ Frontend React (5173) ]
```
