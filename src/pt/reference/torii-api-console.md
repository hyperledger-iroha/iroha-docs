---
translation_locale: pt
translation_source: /reference/torii-api-console.md
translation_source_hash: a277d8c03a3909eb80d124f0bfed7b78e7c3ed886e443c72effe007d454718bf
translation_status: machine-validated
translation_engine: nllb-200-ct2

aside: false
pageClass: torii-api-console-page
---

# Torii API Consola {#torii-api-console}

Use o documento OpenAPI ao vivo de um endpoint Torii em execução para inspecionar as rotas, enviar pedidos de teste, copiar os comandos curl e gerar código do cliente.

<ToriiApiConsole />

## Requisitos {#requirements}

- O ponto final Torii deve exponer o `/openapi.json`.
- Os testes de navegador exigem CORS para permitir a origem deste documento.
- O navegador deve ser capaz de atingir directamente o ponto final.
- A geração de código requer Node.js, pnpm, e um tempo de execução Java para o gerador OpenAPI.

O console é padrão para `https://taira.sora.org`. Desenvolvimento local geralmente funciona com `http://127.0.0.1:8080` quando você executa Torii em sua máquina.

## Tente Taira Primeiro. {#try-taira-first}

Antes de gerar um cliente, verifique se o documento público OpenAPI é acessível a partir da sua máquina:

```bash
curl -fsS https://taira.sora.org/openapi.json -o /tmp/taira-openapi.json
jq '{title: .info.title, version: .info.version, paths: (.paths | length)}' \
  /tmp/taira-openapi.json
```

Em seguida, coloque `https://taira.sora.org/openapi.json` no console e tente uma rota de somente leitura como `GET /status`, `GET /v1/domains` ou `GET /v1/assets/definitions`. Salve transações assinadas e fluxos de chaves privadas para um cliente SDK ou CLI que carrega segredos do seu ambiente de execução.

## Clientes gerados {#generated-clients}

O comando do gerador usa o mesmo ao vivo OpenAPI O documento que o console carrega. JSON operadores, exploradores, aplicativos e rotas de telemetria.

Para transações de contabilidade assinadas, consultas assinadas e cargas úteis nativas Norito, prefira-se o oficial Iroha SDKs. Os clientes OpenAPI não montam assinaturas, gerenciam chaves de contas ou codificam corpos de transação Norito para você.

Para inspeccionar todos os geradores suportados pelo gerador OpenAPI, executar:

```bash
pnpm dlx @openapitools/openapi-generator-cli list
```
