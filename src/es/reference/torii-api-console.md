---
translation_locale: es
translation_source: /reference/torii-api-console.md
translation_source_hash: a277d8c03a3909eb80d124f0bfed7b78e7c3ed886e443c72effe007d454718bf
translation_status: machine-validated
translation_engine: nllb-200-ct2

aside: false
pageClass: torii-api-console-page
---

# Con el uso de la consola Torii API {#torii-api-console}

Utilice el documento OpenAPI en vivo desde un punto final Torii en ejecución para inspeccionar las rutas, enviar solicitudes de prueba, copiar los comandos curl y generar código cliente.

<ToriiApiConsole />

## Requisitos {#requirements}

- El punto final Torii deberá exponer el `/openapi.json`.
- Las pruebas del navegador requieren CORS para permitir el origen de este documento.
- El navegador debe ser capaz de llegar directamente al punto final.
- La generación de código requiere Node.js, pnpm, y un tiempo de ejecución Java para el generador OpenAPI.

La consola se configura por defecto en `https://taira.sora.org`. El desarrollo local generalmente funciona con `http://127.0.0.1:8080` cuando ejecuta Torii en su máquina.

## Prueba primero Taira {#try-taira-first}

Antes de generar un cliente, compruebe si el documento público OpenAPI se puede acceder desde su máquina:

```bash
curl -fsS https://taira.sora.org/openapi.json -o /tmp/taira-openapi.json
jq '{title: .info.title, version: .info.version, paths: (.paths | length)}' \
  /tmp/taira-openapi.json
```

Luego ponga `https://taira.sora.org/openapi.json` en la consola y pruebe una ruta de sólo lectura como `GET /status`, `GET /v1/domains` o `GET /v1/assets/definitions`. Guarde transacciones firmadas y flujos de llaves privadas para un cliente SDK o CLI que cargue secretos de su entorno de tiempo de ejecución. .

## Los clientes generados {#generated-clients}

El comando del generador utiliza el mismo documento en vivo OpenAPI que la consola carga. Esto es útil para el operador, explorador, aplicación y rutas de telemetría JSON.

Para las transacciones firmadas en el libro mayor, consultas firmadas, y Norito- las cargas útiles nativas, prefieren el oficial Iroha SDKs. OpenAPI Los clientes no reúnen firmas, gestionan llaves de cuenta o codifican. Norito los organismos de transacciones para usted.

Para inspeccionar todos los generadores compatibles con el generador OpenAPI, ejecute:

```bash
pnpm dlx @openapitools/openapi-generator-cli list
```
