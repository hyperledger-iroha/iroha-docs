---
translation_locale: fr
translation_source: /guide/tutorials/javascript.md
translation_source_hash: feddadb1b50c5cc8beea188fd7053eeaae58d6ab9203687e9a1378f203229168
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# JavaScript et TypeScript {#javascript-and-typescript}

Le courant JavaScript SDK est le `@iroha/iroha-js` l'emballage dans le Iroha
L'arbre source. Node.js- Tout d'abord SDK pour Torii, Norito les constructeurs, la signature,
Paginaison, prévisualisation de connexion et transport des commandes Kagemusha.

## Construisez à partir de la source {#build-from-source}

Le paquet n'est pas actuellement disponible au public. npm Le registre, construisez-le
à partir du même pincé Iroha révision de la source comme nœud que vous ciblez:

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha/javascript/iroha_js
npm install
npm run build:native
npm run build:dist
```

Les enveloppes construites natives `cargo build -p iroha_js_host` et enregistre les
somme de contrôle spécifique à la plate-forme utilisée à SDK La source construit des lieux qui
l'hôte vérifié en `native/`. Ensemble `IROHA_JS_NATIVE_DIR` uniquement si c'est intentionnellement
Le paquet est fourni par un hôte construit séparément et vérifié en somme. ESM- uniquement;
à partir CommonJS, dynamique d'utilisation `import()`.

## Début rapide {#quickstart}

```js
import { ToriiClient } from "@iroha/iroha-js/torii";
import { generateKeyPair } from "@iroha/iroha-js/crypto";

const torii = new ToriiClient("http://127.0.0.1:8080", {
  authToken: "dev-token",
});

const keys = generateKeyPair();
console.log(keys.publicKey);
```

## Essayez ! Taira Lecture uniquement {#try-taira-read-only}

Utilisation intégrée `fetch` dans Node.js 24 à la sonde Taira avant d'ajouter la signature et
Norito code de transaction:

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

Réservez-le comme `taira-readonly.mjs`, puis l' exécuter:

```bash
node taira-readonly.mjs
```

Passer à signé SDK Les appels ne sont effectués qu'après que ces contrôles à lecture seule aient fonctionné. Taira
peut temporairement retourner une file d'attente saturée ou une erreur de passerelle, alors gardez le réseau en direct
les tests d'opt-in CI.

Importations utiles par sous-route:

```js
import { ToriiClient } from "@iroha/iroha-js/torii";
import { noritoEncodeInstruction } from "@iroha/iroha-js/norito";
import { generateKeyPair } from "@iroha/iroha-js/crypto";
```

Pour le démarrage Connecte uniquement pour navigateur, utiliser `@iroha/iroha-js/connect-browser`
au lieu d'importer le Node-first `ToriiClient` à la surface.

## Réservation de fonds propres {#native-escrow}

JavaScript et TypeScript les applications peuvent utiliser la fiducie native via Kotodama
Compilez les appels d'hôte avec
`@iroha/iroha-js/kotodama-compiler`; les constructeurs de transactions en fiducie directes natives
ne sont pas actuellement exposés par les JavaScript SDK. Vous voyez ?
[Réservation des actifs natifs](/fr/blockchain/escrow.md#javascript-and-typescript-kotodama)
pour l'exemple de l'appel d'accueil en escrow.

## Couverture actuelle {#current-coverage}

Les SDK se concentre sur:

- Torii HTTP et WebSocket les aides
- Norito constructeurs de transactions et d'instructions
- Kotodama compilation, y compris les intégrations d'appels d'hébergement de dépôt
- Ed25519 signature et génération de clés
- les aides à la pagination et à la réessayer
- Connectez les aides de démarrage du navigateur
- Prestance, complémentation, rachat et transport en état d'exploitation de Kagemusha
  les aides

## Références en amont {#upstream-references}

- `javascript/iroha_js/README.md`
- `javascript/iroha_js/package.json`
