---
translation_locale: pt
translation_source: /reference/torii-api-console.md
translation_source_hash: a277d8c03a3909eb80d124f0bfed7b78e7c3ed886e443c72effe007d454718bf
translation_status: machine-validated
translation_engine: bing-translator-llm

aside: false
---

# Ferramenta interativa da API Torii {#torii-api-console}

Use o documento ao vivo OpenAPI de um endpoint Torii API em execução para inspecionar rotas, enviar solicitações de teste, copiar comandos curl e gerar código do cliente.

<ToriiApiConsole />

## Requisitos {#requirements}

- O endpoint Torii API deve expor `/openapi.json`.
- O teste de navegador requer CORS para permitir esta origem de documentos.
- O navegador deve ser capaz de alcançar o endpoint API diretamente.
- A geração de código requer Node.js, pnpm e um tempo de execução de software Java para o OpenAPI Generator.

O console padrão é `https://taira.sora.org`. O desenvolvimento local geralmente funciona com `http://127.0.0.1:8080` quando você executa Torii na sua máquina.

## Tente Taira primeiro {#try-taira-first}

Antes de gerar um cliente, verifique se o documento público OpenAPI é acessível a partir da sua máquina:

```bash
curl -fsS https://taira.sora.org/openapi.json -o /tmp/taira-openapi.json
jq '{title: .info.title, version: .info.version, paths: (.paths | length)}' \
  /tmp/taira-openapi.json
```

Então cole `https://taira.sora.org/openapi.json` no console e tente uma rota apenas de leitura, como `GET /status`, `GET /v1/domains` ou `GET /v1/assets/definitions`. Salve transações assinadas e fluxos de chave privada para um cliente SDK ou CLI que carregue segredos a partir do seu ambiente de execução de software.

## Clientes Gerados {#generated-clients}

O comando do gerador usa o mesmo documento ao vivo OpenAPI que o console carrega. Isso é útil para JSON operador, explorador, aplicativo e rotas de telemetria.

Para transações de livro-razão blockchain assinadas, consultas assinadas e cargas nativas Norito, prefira o Iroha SDKs oficial. Clientes OpenAPI não montam assinaturas, não gerenciam chaves de conta, nem codificam corpos de transação Norito para você.

Para inspecionar todos os geradores suportados pelo Gerador OpenAPI, execute:

```bash
pnpm dlx @openapitools/openapi-generator-cli list
```
