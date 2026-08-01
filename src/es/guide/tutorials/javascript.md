---
translation_locale: es
translation_source: /guide/tutorials/javascript.md
translation_source_hash: feddadb1b50c5cc8beea188fd7053eeaae58d6ab9203687e9a1378f203229168
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# JavaScript y TypeScript {#javascript-and-typescript}

La corriente JavaScript SDK es el `@iroha/iroha-js` en el paquete Iroha El árbol de origen. Node.js-Primero SDK para Torii, Norito los constructores, la firma, el paginado, las vistas previas de conexión y el transporte de comandos Kagemusha.

## Construye desde la fuente {#build-from-source}

El paquete no está disponible actualmente en el registro público npm. Construirlo desde la misma revisión de fuente fijada Iroha que el nodo que se dirige:

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha/javascript/iroha_js
npm install
npm run build:native
npm run build:dist
```

Los envueltos nativos de la construcción `cargo build -p iroha_js_host` y registra la suma de control específica de la plataforma utilizada en SDK La fuente construye lugares que han verificado el host en `native/`. Conjunto `IROHA_JS_NATIVE_DIR` Sólo cuando se suministra intencionalmente un anfitrión construido por separado y verificado en cantidades de comprobación. ESM- únicamente; de CommonJS, el uso dinámico `import()`.

## Inicio rápido {#quickstart}

```js
import { ToriiClient } from "@iroha/iroha-js/torii";
import { generateKeyPair } from "@iroha/iroha-js/crypto";

const torii = new ToriiClient("http://127.0.0.1:8080", {
  authToken: "dev-token",
});

const keys = generateKeyPair();
console.log(keys.publicKey);
```

## Prueba Taira Sólo para lectura {#try-taira-read-only}

Utilice `fetch` incorporado en Node.js 24 para sondear Taira antes de añadir el código de firma y la transacción Norito:

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

Guardarlo como `taira-readonly.mjs`, luego ejecutarlo:

```bash
node taira-readonly.mjs
```

Moverse a las llamadas firmadas SDK sólo después de que estas verificaciones solo para lectura funcionen. El público Taira puede devolver temporalmente una cola saturada o un error en la puerta de entrada, así que mantenga las pruebas de red en vivo opt-in en CI.

Importes útiles por subcamino:

```js
import { ToriiClient } from "@iroha/iroha-js/torii";
import { noritoEncodeInstruction } from "@iroha/iroha-js/norito";
import { generateKeyPair } from "@iroha/iroha-js/crypto";
```

Para la bandeja de arranque Connect solo para el navegador, utilice `@iroha/iroha-js/connect-browser` en lugar de importar la superficie del nodo primero `ToriiClient`.

## Escrow nativo {#native-escrow}

Las aplicaciones JavaScript y TypeScript pueden utilizar escrow nativo a través de contratos Kotodama. Compila las llamadas de host de escrow con `@iroha/iroha-js/kotodama-compiler`; los constructores directos de transacciones de escrow nativos no están actualmente expuestos por el JavaScript SDK. Vea [Native Asset Escrow](/es/blockchain/escrow.md#javascript-and-typescript-kotodama) para el ejemplo de llamada del anfitrión de la fianza.

## Cobertura actual {#current-coverage}

El SDK se centra en:

- Torii HTTP y WebSocket ayudantes
- Norito constructores de transacciones e instrucciones
- Compilación Kotodama, incluidas las construcciones de llamadas host escrow
- Ed25519 firma y generación de llaves
- auxiliares de paginado y reutilización
- Conectar los asistentes de arranque del navegador
- Preparación de Kagemusha, refuerzo, rescate y ayuda al transporte con estado de operación

## Referencias de aguas arriba {#upstream-references}

- `javascript/iroha_js/README.md`
- `javascript/iroha_js/package.json`
