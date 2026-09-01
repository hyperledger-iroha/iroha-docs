---
translation_locale: es
translation_source: /reference/torii-api-console.md
translation_source_hash: a277d8c03a3909eb80d124f0bfed7b78e7c3ed886e443c72effe007d454718bf
translation_status: machine-validated
translation_engine: bing-translator-llm

aside: false
pageClass: torii-api-console-page
---

# Torii API Consola {#torii-api-console}

Utilice el documento en vivo OpenAPI de un endpoint en funcionamiento Torii API para inspeccionar rutas, enviar solicitudes de prueba, copiar comandos curl y generar código de cliente.

<ToriiApiConsole />

## Requisitos {#requirements}

- El endpoint Torii API debe exponer `/openapi.json`.
- Las pruebas en el navegador requieren CORS para permitir este origen de documentos.
- El navegador debe poder acceder al endpoint API directamente.
- La generación de código requiere Node.js, pnpm y un entorno de ejecución de software Java para OpenAPI Generator.

La consola por defecto es `https://taira.sora.org`. El desarrollo local generalmente funciona con `http://127.0.0.1:8080` cuando ejecutas Torii en tu máquina.

## Prueba Taira primero {#try-taira-first}

Antes de generar un cliente, verifica que el documento público OpenAPI sea accesible desde tu máquina:

```bash
curl -fsS https://taira.sora.org/openapi.json -o /tmp/taira-openapi.json
jq '{title: .info.title, version: .info.version, paths: (.paths | length)}' \
  /tmp/taira-openapi.json
```

Luego pega `https://taira.sora.org/openapi.json` en la consola y prueba una ruta de solo lectura como `GET /status`, `GET /v1/domains` o `GET /v1/assets/definitions`. Guarda las transacciones firmadas y los flujos de clave privada para un cliente SDK o CLI que cargue secretos desde tu entorno de ejecución de software.

## Clientes Generados {#generated-clients}

El comando del generador utiliza el mismo documento en vivo OpenAPI que carga la consola. Esto es útil para las rutas de operador, explorador, aplicación y telemetría JSON.

Para transacciones del libro mayor blockchain firmadas, consultas firmadas y cargas útiles nativas de Norito, prefiera el Iroha SDKs oficial. Los clientes OpenAPI no ensamblan firmas, ni gestionan claves de cuenta, ni codifican los cuerpos de transacción de Norito por usted.

Para inspeccionar cada generador compatible con el Generador OpenAPI, ejecute:

```bash
pnpm dlx @openapitools/openapi-generator-cli list
```
