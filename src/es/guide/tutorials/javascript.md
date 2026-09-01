---
translation_locale: es
translation_source: /guide/tutorials/javascript.md
translation_source_hash: d12c715de68623a7dd671e4f2f91b93dbe9fdee42ed51e3a25fbad2a9b69ca8e
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# JavaScript y TypeScript {#javascript-and-typescript}

El actual JavaScript SDK es el paquete `@iroha/iroha-js` en el árbol de código fuente Iroha. Es el Node.js-primero SDK para Torii, constructores Norito, firma, paginación, vistas previas de Connect y transporte de comandos Kagemusha.

## Construir desde la fuente {#build-from-source}

El paquete no está disponible actualmente en el registro público npm. Compílalo desde la misma revisión de fuente fijada Iroha que el nodo al que apuntas:

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha/javascript/iroha_js
npm install
npm run build:native
npm run build:dist
```

La versión nativa envuelve `cargo build -p iroha_js_host` y registra la suma de verificación específica de la plataforma utilizada en el inicio de SDK. La versión de origen coloca ese host verificado en `native/`. Establezca `IROHA_JS_NATIVE_DIR` solo cuando se suministre intencionalmente un host construido por separado y verificado con suma de comprobación. El paquete es solo ESM; desde CommonJS, use `import()` dinámico.

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

## Probar Taira Solo lectura {#try-taira-read-only}

Utilice el `fetch` integrado en Node.js 24 para sondear Taira antes de agregar la firma y el código de transacción Norito:

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

Guárdalo como `taira-readonly.mjs`, luego ejecútalo:

```bash
node taira-readonly.mjs
```

Pasa a llamadas firmadas SDK solo después de que estas comprobaciones de solo lectura funcionen. La Taira pública puede devolver temporalmente una cola saturada o un error de puerta de enlace, así que mantén las pruebas en red en vivo como opcionales en CI.

Importaciones de subrutas útiles:

```js
import { ToriiClient } from "@iroha/iroha-js/torii";
import { noritoEncodeInstruction } from "@iroha/iroha-js/norito";
import { generateKeyPair } from "@iroha/iroha-js/crypto";
```

Para la inicialización de Connect solo en navegador, use `@iroha/iroha-js/connect-browser` en lugar de importar la superficie `ToriiClient` orientada a Node.

## Fideicomiso Nativo {#native-escrow}

Las aplicaciones JavaScript y TypeScript pueden usar custodia nativa a través de los contratos Kotodama. Compile las llamadas al host de custodia con `@iroha/iroha-js/kotodama-compiler`; los constructores directos de transacciones de custodia nativa no están actualmente expuestos por el JavaScript SDK. Vea [Custodia de Activos Nativos](/es/blockchain/escrow.md#javascript-and-typescript-kotodama) para el ejemplo de llamada al host de custodia.

## Cobertura Actual {#current-coverage}

El SDK se centra en:

- Torii HTTP y WebSocket ayudantes
- Norito constructores de transacciones e instrucciones
- Kotodama compilación, incluyendo funciones integradas de llamada de host en custodia
- Generación de claves y firma Ed25519
- auxiliares de paginación y reintento
- Conectar los ayudantes de arranque del navegador
- Asistentes de transporte para preparación de Kagemusha, recarga, redención y estado de operación

## Referencias ascendentes {#upstream-references}

- `javascript/iroha_js/README.md`
- `javascript/iroha_js/package.json`
