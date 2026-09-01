---
translation_locale: pt
translation_source: /guide/tutorials/javascript.md
translation_source_hash: d12c715de68623a7dd671e4f2f91b93dbe9fdee42ed51e3a25fbad2a9b69ca8e
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# JavaScript e TypeScript {#javascript-and-typescript}

O atual JavaScript SDK é o pacote `@iroha/iroha-js` na árvore de origem Iroha. É o Node.js-primeiro SDK para Torii, construtores Norito, assinatura, paginação, visualizações do Connect e transporte de comando Kagemusha.

## Construir a partir do código-fonte {#build-from-source}

O pacote não está atualmente disponível no registro público npm. Construa-o a partir da mesma revisão de origem fixada Iroha que o nó que você está visando:

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha/javascript/iroha_js
npm install
npm run build:native
npm run build:dist
```

A versão nativa envolve `cargo build -p iroha_js_host` e registra o checksum específico da plataforma usado na inicialização de SDK. A versão de origem coloca esse host verificado em `native/`. Defina `IROHA_JS_NATIVE_DIR` apenas quando estiver fornecendo intencionalmente um host construído separadamente e com verificação de checksum. O pacote é apenas ESM; a partir de CommonJS, use `import()` dinâmico.

## Início Rápido {#quickstart}

```js
import { ToriiClient } from "@iroha/iroha-js/torii";
import { generateKeyPair } from "@iroha/iroha-js/crypto";

const torii = new ToriiClient("http://127.0.0.1:8080", {
  authToken: "dev-token",
});

const keys = generateKeyPair();
console.log(keys.publicKey);
```

## Tentar Taira Somente Leitura {#try-taira-read-only}

Use o `fetch` embutido em Node.js 24 para sondar Taira antes de adicionar a assinatura e o código de transação Norito:

```js
const root = "https://taira.sora.org";

const status = await fetch(`${root}/status`, {
  headers: { Accept: "application/json" },
}).then((res) => res.json());
console.log({
  blocks: status.blocks,
  queueSize: status.queue_size,
  peers: status.peers,
});

const domains = await fetch(`${root}/v1/domains?limit=5`).then((res) =>
  res.json(),
);
console.log(domains.items.map((domain) => domain.id));

const assets = await fetch(`${root}/v1/assets/definitions?limit=5`).then((res) =>
  res.json(),
);
for (const asset of assets.items) {
  console.log(asset.id, asset.name, asset.total_quantity);
}
```

Salve como `taira-readonly.mjs`, depois execute:

```bash
node taira-readonly.mjs
```

Mude para chamadas assinadas SDK apenas depois que essas verificações somente leitura funcionarem. O público Taira pode retornar temporariamente uma fila saturada ou erro de gateway, portanto mantenha os testes em rede ao vivo como opt-in em CI.

Importações úteis de subcaminho:

```js
import { ToriiClient } from "@iroha/iroha-js/torii";
import { noritoEncodeInstruction } from "@iroha/iroha-js/norito";
import { generateKeyPair } from "@iroha/iroha-js/crypto";
```

Para inicialização do Connect apenas no navegador, use `@iroha/iroha-js/connect-browser` em vez de importar a superfície `ToriiClient` priorizando o Node.

## Depósito em garantia nativo {#native-escrow}

As aplicações JavaScript e TypeScript podem usar escrow nativo através dos contratos Kotodama. Compile chamadas de host de escrow com `@iroha/iroha-js/kotodama-compiler`; construtores diretos de transações de escrow nativo não estão atualmente expostos pelo JavaScript SDK. Veja [Escrow de Ativo Nativo](/pt/blockchain/escrow.md#javascript-and-typescript-kotodama) para o exemplo de chamada de host de escrow.

## Cobertura Atual {#current-coverage}

O SDK foca em:

- Torii HTTP e WebSocket ajudantes
- Norito construtores de transações e instruções
- Kotodama compilação, incluindo funções internas de chamada de host de escrow
- Assinatura e geração de chave Ed25519
- auxiliares de paginação e tentativa
- Conectar helpers de inicialização do navegador
- Assistentes de transporte de prontidão, recarga, resgate e status de operação do Kagemusha

## Referências a Montante {#upstream-references}

- `javascript/iroha_js/README.md`
- `javascript/iroha_js/package.json`
