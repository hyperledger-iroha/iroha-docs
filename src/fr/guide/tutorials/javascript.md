---
translation_locale: fr
translation_source: /guide/tutorials/javascript.md
translation_source_hash: d12c715de68623a7dd671e4f2f91b93dbe9fdee42ed51e3a25fbad2a9b69ca8e
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# JavaScript et TypeScript {#javascript-and-typescript}

Le courant JavaScript SDK est le `@iroha/iroha-js` l'emballage dans Iroha l'arbre source, c'est le Node.js- d'abord SDK pour Torii, Norito Les constructeurs, la signature, la pagination, les prévisualisations Connect et le transport de commandes Kagemusha

## Construisez à partir de la source {#build-from-source}

Le paquet n'est pas actuellement disponible dans le registre public npm. Construisez-le à partir de la même révision de source fichée Iroha que le nœud visé:

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha/javascript/iroha_js
npm install
npm run build:native
npm run build:dist
```

Les enveloppes de construction natives `cargo build -p iroha_js_host` et enregistre la somme de contrôle spécifique à la plateforme utilisée aux SDK La source construit des endroits qui ont vérifié l'hôte dans `native/`. Réglage `IROHA_JS_NATIVE_DIR` Il ne s'agit que lorsque vous fournissez intentionnellement un hébergeur construit séparément, vérifié par la somme de contrôle. ESM- uniquement; CommonJS, dynamique d'utilisation `import()`.

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

## Essayez Taira En lisant seulement {#try-taira-read-only}

Utilisez `fetch` intégré dans Node.js 24 pour sonder Taira avant d'ajouter le code de signature et de transaction Norito:

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

Sauvegarder comme `taira-readonly.mjs`, puis exécuter:

```bash
node taira-readonly.mjs
```

Passer aux appels signés SDK seulement après que ces vérifications en lecture seule aient fonctionné. Le public Taira peut temporairement retourner une file d'attente saturée ou une erreur de passerelle, alors conservez l'opt-in des tests de réseau en direct dans CI.

Importations utiles par sous-route:

```js
import { ToriiClient } from "@iroha/iroha-js/torii";
import { noritoEncodeInstruction } from "@iroha/iroha-js/norito";
import { generateKeyPair } from "@iroha/iroha-js/crypto";
```

Pour la bande de démarrage Connect à navigateur uniquement, utilisez `@iroha/iroha-js/connect-browser` au lieu d'importer la surface du nœud-premier `ToriiClient`.

## Réservation de fonds propres {#native-escrow}

JavaScript et TypeScript les applications peuvent utiliser l'escrow native via Kotodama Compiler les appels de l'hôte avec `@iroha/iroha-js/kotodama-compiler`; Les constructeurs d'opérations de garantie directe native ne sont pas actuellement exposés par les JavaScript SDK. Vous voyez ? [Réservation des actifs natifs](/fr/blockchain/escrow.md#javascript-and-typescript-kotodama) pour l'exemple de l'appel d'accueil en escrow.

## Couverture actuelle {#current-coverage}

Le SDK se concentre sur:

- Auxiliaires Torii HTTP et WebSocket
- Norito constructeurs de transactions et d'instructions
- Kotodama compilation, y compris les intégrations d'appels à l'hôte de la fiducie
- Ed25519 signature et génération de clé
- les aides à la pagination et à la réessayer
- Connectez les aides de démarrage du navigateur
- Les aides à la préparation, au remplissage, au rachat et à l'exploitation des services de transport Kagemusha.

## Références en amont {#upstream-references}

- `javascript/iroha_js/README.md`
- `javascript/iroha_js/package.json`
