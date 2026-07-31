---
translation_locale: pt
translation_source: /guide/tutorials/javascript.md
translation_source_hash: feddadb1b50c5cc8beea188fd7053eeaae58d6ab9203687e9a1378f203229168
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# JavaScript e TypeScript {#javascript-and-typescript}

A corrente JavaScript SDK é o `@iroha/iroha-js` embalagem no Iroha A árvore de origem. Node.js- Primeiro. SDK para Torii, Norito Construtores, assinatura, paginação, visualizações do Connect e transporte de comando Kagemusha.

## Construir com base na fonte {#build-from-source}

O pacote não está atualmente disponível no registro público npm. Construa-o a partir da mesma revisão de fonte Iroha fichada que o nó que você pretende:

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha/javascript/iroha_js
npm install
npm run build:native
npm run build:dist
```

A construção nativa envolve `cargo build -p iroha_js_host` e registar o montante de verificação específico da plataforma utilizado em SDK A fonte constrói locais que verificaram o host em `native/`. Conjunto `IROHA_JS_NATIVE_DIR` Só se for fornecido intencionalmente um anfitrião construído separadamente, verificado em quantidade de verificação. ESM- somente; CommonJS, Dinâmica de utilização `import()`.

## Rapido arranque {#quickstart}

```js
import { ToriiClient } from "@iroha/iroha-js/torii";
import { generateKeyPair } from "@iroha/iroha-js/crypto";

const torii = new ToriiClient("http://127.0.0.1:8080", {
  authToken: "dev-token",
});

const keys = generateKeyPair();
console.log(keys.publicKey);
```

## Tente Taira Apenas leitura {#try-taira-read-only}

Usar `fetch` embutido no Node.js 24 para sondar Taira antes de adicionar o código de assinatura e transação Norito:

```js
const root = "https://taira.sora.org";

const status = await fetch(`${root}/status`).then((res) => res.json());
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

Salva-o como `taira-readonly.mjs`, em seguida, execute:

```bash
node taira-readonly.mjs
```

Mover para as chamadas assinadas SDK somente depois que essas verificações de somente leitura funcionem. O público Taira pode retornar temporariamente uma fila saturada ou um erro de gateway, então mantenha os testes da rede ao vivo opt-in em CI.

Importações úteis de subcaminhos:

```js
import { ToriiClient } from "@iroha/iroha-js/torii";
import { noritoEncodeInstruction } from "@iroha/iroha-js/norito";
import { generateKeyPair } from "@iroha/iroha-js/crypto";
```

No caso do bootstrap Connect de navegador exclusivo, use `@iroha/iroha-js/connect-browser` em vez de importar a superfície do nó-primeiro `ToriiClient`.

## Empréstimo Nativo {#native-escrow}

JavaScript e TypeScript As aplicações podem usar o escrow nativo através Kotodama Comparar chamadas de hospedeiros em custódia com `@iroha/iroha-js/kotodama-compiler`; Os construtores directos de transacções em escrow native não estão atualmente expostos pela JavaScript SDK. Veja . [Escrow de ativos nativos](/pt/blockchain/escrow.md#javascript-and-typescript-kotodama) Para o exemplo da chamada de hospedeiro em custódia.

## Cobertura atual {#current-coverage}

O SDK concentra-se em:

- Auxiliares Torii HTTP e WebSocket
- Norito Construtores de transações e instruções
- Compilação Kotodama, incluindo as edificações de chamadas host escrow
- Ed25519 assinatura e geração de chaves
- auxiliares de paginação e retest
- Conectar auxiliares de arranque do navegador
- Preparação de Kagemusha, reabastecimento, resgate e assistentes de transporte em estado de operação

## Referências a montante {#upstream-references}

- `javascript/iroha_js/README.md`
- `javascript/iroha_js/package.json`
