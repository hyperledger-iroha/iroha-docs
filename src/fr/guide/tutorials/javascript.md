---
translation_locale: fr
translation_source: /guide/tutorials/javascript.md
translation_source_hash: d12c715de68623a7dd671e4f2f91b93dbe9fdee42ed51e3a25fbad2a9b69ca8e
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# JavaScript et TypeScript {#javascript-and-typescript}

Le JavaScript SDK actuel est le package `@iroha/iroha-js` dans l'arborescence source Iroha. C'est le Node.js-premier SDK pour Torii, les constructeurs Norito, la signature, la pagination, les aperçus Connect et le transport de commandes Kagemusha.

## Construire à partir du source {#build-from-source}

Le package n'est actuellement pas disponible à partir du registre public npm. Construisez-le à partir de la même révision source verrouillée Iroha que le nœud que vous ciblez :

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha/javascript/iroha_js
npm install
npm run build:native
npm run build:dist
```

La version native enveloppe `cargo build -p iroha_js_host` et enregistre la somme de contrôle spécifique à la plateforme utilisée au démarrage de SDK. La version source place cet hôte vérifié dans `native/`. Définir `IROHA_JS_NATIVE_DIR` uniquement lorsque vous fournissez intentionnellement un hôte construit séparément et vérifié par somme de contrôle. Le paquet est uniquement ESM ; à partir de CommonJS, utilisez `import()` dynamique.

## Démarrage rapide {#quickstart}

```js
import { ToriiClient } from "@iroha/iroha-js/torii";
import { generateKeyPair } from "@iroha/iroha-js/crypto";

const torii = new ToriiClient("http://127.0.0.1:8080", {
  authToken: "dev-token",
});

const keys = generateKeyPair();
console.log(keys.publicKey);
```

## Essayer Taira Lecture seule {#try-taira-read-only}

Utilisez `fetch` intégré dans Node.js 24 pour sonder Taira avant d'ajouter le code de signature et de transaction Norito :

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

Enregistrez-le sous `taira-readonly.mjs`, puis exécutez-le :

```bash
node taira-readonly.mjs
```

Passez aux appels signés SDK uniquement après que ces vérifications en lecture seule fonctionnent. Le Taira public peut temporairement renvoyer une file d'attente saturée ou une erreur de passerelle, donc gardez les tests sur le réseau en direct en option dans CI.

Importations de sous-chemins utiles :

```js
import { ToriiClient } from "@iroha/iroha-js/torii";
import { noritoEncodeInstruction } from "@iroha/iroha-js/norito";
import { generateKeyPair } from "@iroha/iroha-js/crypto";
```

Pour le bootstrap Connect uniquement pour navigateur, utilisez `@iroha/iroha-js/connect-browser` au lieu d'importer la surface `ToriiClient` orientée Node.

## Séquestre natif {#native-escrow}

Les applications JavaScript et TypeScript peuvent utiliser l'entiercement natif via les contrats Kotodama. Compilez les appels hôtes d'entiercement avec `@iroha/iroha-js/kotodama-compiler` ; les constructeurs de transactions d'entiercement natif directs ne sont actuellement pas exposés par le JavaScript SDK. Consultez [Compte séquestre d'actifs natifs](/fr/blockchain/escrow.md#javascript-and-typescript-kotodama) pour l'exemple d'appel hôte d'entiercement.

## Couverture actuelle {#current-coverage}

Le SDK se concentre sur :

- Torii HTTP et WebSocket aides
- Norito constructeurs de transactions et d'instructions
- Kotodama compilation, y compris les fonctions intégrées d'appel d'hôte en séquestre
- Signature et génération de clés Ed25519
- assistants de pagination et de réessai
- Connecter les assistants de démarrage du navigateur
- Aides au transport pour la préparation de Kagemusha, le rechargement, le remboursement et l'état de fonctionnement

## Références en amont {#upstream-references}

- `javascript/iroha_js/README.md`
- `javascript/iroha_js/package.json`
