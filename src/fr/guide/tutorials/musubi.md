---
translation_locale: fr
translation_source: /guide/tutorials/musubi.md
translation_source_hash: 621d1795fd1c3cc62462a9a91af68fe684c0ff5293f5e77801420dc8318bac38
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Musubi Kotodama Paquets {#musubi-kotodama-packages}

Musubi est le gestionnaire de paquets de première version pour les paquets sources Kotodama. Il résout un graphe de dépendances exact en chaîne et authentifie SoraFS les archives sources, compile et teste l'espace de travail sélectionné, construit des archives canoniques CAR, et publie des versions immuables via Iroha.

Utilisez Musubi lorsque vous devez :

- publier des bibliothèques de fonctions Kotodama réutilisables
- épingler un graphe transitif exact dans `Musubi.lock`
- reconstruire la source de dépendance à partir des engagements archivés finalisés SoraFS
- construire et tester un package ou un espace de travail multi-package
- inspecter, publier, retirer, maintenir ou créer des alias pour des paquets via le registre en chaîne

## Noms de paquet {#package-names}

Les sélecteurs de paquet canoniques utilisent :

```text
namespace/package
```

Les identifiants de version exacts ajoutent une version :

```text
namespace/package@version
```

Il n'y a pas de `@` initial avant un espace de noms. Un espace de noms est soit une racine de zone de données telle que `universal`, soit un espace de données qualifié par domaine tel que `dex.universal`. Le registre de la blockchain lie cet espace de noms structurel à un espace de données principal stable avant qu'un paquet puisse être revendiqué.

## manifeste technique et fichier de verrouillage {#manifest-and-lockfile}

Un package utilise le schéma fermé de première version `Musubi.toml`. Le manifeste technique doit déclarer `manifest-version = 1`, Kotodama édition `"1"`, et IVM ABI version `1` ; il n’existe pas de manifeste technique alternatif ni de mode ABI.

```toml
manifest-version = 1

[package]
namespace = "dex.universal"
name = "swap-core"
version = "0.1.0"
edition = "1"
abi-version = 1

[lib]
source-dir = "src"
exports = ["quote"]

[dependencies.math]
package = "std.universal/math"
version = "^1.0.0"
```

Les dépendances peuvent utiliser des versions exactes, des exigences avec accent circonflexe ou tilde, des caractères génériques tels que `1.*`, et des ensembles de comparateurs séparés par des virgules tels que `>=1.0.0,<2.0.0`. La clé du tableau des dépendances est l'alias d'importation local-parent ; `package` est toujours le sélecteur de registre canonique.

`Musubi.lock` lie le graphe au `NetworkId` dérivé du genèse exact et à un instantané de registre finalisé. Il enregistre les racines de l'espace de travail sélectionnées et les nœuds de version immuables, y compris la version, la source, l'interface, l'archive, ABI et les engagements exacts des dépendances. Des versions parallèles sont autorisées lorsque le graphe résolu les nécessite.

## Configurer Taira SoraFS Récupération {#configure-taira-sorafs-fetching}

Taira est le testnet public pour ce flux de travail. Commencez à partir d'une configuration client Taira avec la chaîne enregistrée et l'identité réseau dérivée du genesis actuelle épinglée, puis ajoutez les liaisons de récupération authentifiées spécifiques au fournisseur ci-dessous. Une réinitialisation Taira peut modifier le `NetworkId` ; actualisez-le à partir du profil de déploiement signé au lieu de l'inférer à partir de la chaîne stable UUID. Le matériel de signature du compte et les clés de l'opérateur fournisseur doivent rester dans des fichiers d'exécution logiciels accessibles uniquement au propriétaire.

```toml
torii_url = "https://taira.sora.org/"
chain = "fc56984b-2be7-431d-840e-21514d1883f0"
network_id = "hash:82531CE8EAE8BFF6BEECA4698BFD13A3BC8BEC5F0EE0D23D428C97FC17AB0F3B#3E94"

[musubi.fetch]
network_id = "hash:82531CE8EAE8BFF6BEECA4698BFD13A3BC8BEC5F0EE0D23D428C97FC17AB0F3B#3E94"
client_id = "musubi-taira"
request_timeout_ms = 30000

[[musubi.fetch.provider_gateways]]
provider_id = "REPLACE_WITH_ADMITTED_PROVIDER_ID_HEX"
url = "REPLACE_WITH_ADVERTISED_PROVIDER_HTTPS_ORIGIN"
operator_public_key = "REPLACE_WITH_PROVIDER_AUTHORIZED_OPERATOR_PUBLIC_KEY"
operator_private_key_file = "./secrets/taira-sorafs-provider.key"
```

Découvrez les fournisseurs admis de Taira à partir de la racine du testnet public :

```bash
export TAIRA_ROOT=https://taira.sora.org
curl -fsS "$TAIRA_ROOT/v1/sorafs/providers?limit=20" | jq '.providers'
```

Le catalogue fournit les identités des fournisseurs et les points de terminaison API annoncés. Obtenez auprès du fournisseur choisi l’autorisation d’opérateur correspondante. L’environnement d’exécution utilise cette clé pour demander des jetons de flux limités ; ces jetons ne sont ni des arguments de CLI ni le contenu du fichier de verrouillage.

N'utilisez pas un Taira pin de validateur URL comme `url`. Les validateurs enregistrés ont le stockage intégré SoraFS désactivé. Leurs points de terminaison `https://taira-validator-{1,2,3,4}.sora.org` API acceptent l'enregistrement de pin, tandis que les lectures d'archive utilisent l'origine HTTPS du fournisseur admis sélectionné.

## Flux de travail local {#local-workflow}

À partir de la racine de l'espace de travail amont Iroha, créez ou entrez dans le répertoire du paquet et exécutez Musubi via Cargo :

```bash
mkdir -p examples/swap-core
cd examples/swap-core

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  init . --namespace dex.universal --name swap-core --export quote

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  add std.universal/math --version '^1.0.0' --rename math

cargo run --manifest-path ../../Cargo.toml -p musubi -- fetch --config client.toml
cargo run --manifest-path ../../Cargo.toml -p musubi -- check --config client.toml
cargo run --manifest-path ../../Cargo.toml -p musubi -- build --config client.toml
cargo run --manifest-path ../../Cargo.toml -p musubi -- test --config client.toml
cargo run --manifest-path ../../Cargo.toml -p musubi -- package --config client.toml
```

`fetch` résout le graphe du registre finalisé, met à jour `Musubi.lock` lorsque cela est autorisé, et remplit le cache local immuable à partir des emplacements authentifiés SoraFS. `check`, `build`, `test` et `package` effectuent les mêmes vérifications du graphe et du cache avant leur propre travail.

Utilisez `--locked` pour rejeter toute modification du fichier de verrouillage. Utilisez `--offline` uniquement lorsque l'index du registre et chaque archive requise sont déjà en cache. `--frozen` combine ces deux contraintes. Un échec de cache hors ligne se produit ; Musubi n'écrit jamais un fichier de verrouillage non résolu.

Les sources de dépendance sont reliées en réécrivant les appels qualifiés tels que `math::add()` vers des noms internes déterministes Kotodama. Un appel de dépendance à une fonction non exportée est rejeté. Les bibliothèques importées exposent des fonctions ; les cibles locales `[[contract]]` et `[[test]]` restent des cibles de package explicites.

## Vérification et réparation du cache {#cache-verification-and-repair}

Les commandes de cache public fonctionnent sur des archives immuables, engagées dans le registre :

```bash
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  cache verify --all --config client.toml

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  cache repair --config client.toml

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  cache prune --dry-run --config client.toml
```

`cache repair` met en quarantaine les descendants de confiance corrompus et récupère à nouveau les archives exactes lorsque les preuves du fournisseur finalisé le permettent. L'élagage est délibérément en échec fermé pour les mutations actives non vides ; utilisez `--dry-run` pour inspecter les candidats classifiés.

## Emballage et publication {#packaging-and-publishing}

Inspectez l'ensemble de fichiers positifs propres avant d'écrire une archive, puis construisez le paquet canonique :

```bash
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  package --list --locked --config client.toml

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  package --locked --config client.toml
```

`package` écrit `target/package/<namespace>-<name>-<version>.car`. Le CAR lie le manifeste technique du paquet canonique, le manifeste technique de publication sémantique, le verrouillage exact de vérification, l'arborescence source, valeur de condensé cryptographique de l'interface, et engagement d'archive SoraFS. Il n'existe pas de commandes séparées `pack`, `--car-out`, `--sorafs-manifest-out` ou `--source-plan-out` dans la première version CLI.

La publication est un flux de travail réseau signé et reprenable. Le `client.toml` sélectionné doit contenir les liaisons `[musubi.publication]` requises ainsi que le compte et la configuration réseau Taira. Emballez exactement un membre de l'espace de travail :

```bash
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  publish -p dex.universal/swap-core --locked --config client.toml
```

Utilisez `--detach` pour revenir après que le journal d'opération et la limite d'entrée des semences soient durables. Continuez une opération durable avec `publish --resume <operation-id> --config client.toml`. Le chemin plus étroit `--recover <operation-id>` ne reconstruit que enregistrements auxiliaires immuables manquants pour un journal pré-ingress pristine. Il n'y a pas de publication `--dry-run` ni de solution de repli de téléchargement public générique ; exécutez `package --list` et `package` pour le prévol local.

## Requêtes du registre et cycle de vie {#registry-queries-and-lifecycle}

Recherchez et inspectez le registre finalisé avec la même configuration client Taira :

```bash
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  search swap --config client.toml
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  info dex.universal/swap-core --config client.toml
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  versions dex.universal/swap-core --config client.toml
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  alias resolve swap --config client.toml
```

Le retrait exclut une version immuable des nouvelles résolutions tandis que les verrous exacts existants restent reproductibles. Lisez d'abord la révision de retrait actuelle, puis soumettez une mutation comparer-et-définir :

```bash
: "${EXPECTED_YANK_REVISION:?set the current non-zero yank revision}"

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  yank dex.universal/swap-core 0.1.0 \
  --expected-revision="$EXPECTED_YANK_REVISION" \
  --reason="bad archive" \
  --config client.toml
```

Utilisez `unyank` avec le même package, la même version et la révision récemment lue pour inverser cet état. La propriété du package et les rôles de mainteneur contrôlent la publication, le retrait, les métadonnées, et les autorisations de localisation d'archive. Les alias globaux ont leur propre enregistrement tarifé, historique de retargeting et révisions de comparaison et de mise à jour ; ce ne sont pas des raccourcis de propriété de paquet.

## Interfaces d’Iroha {#iroha-surfaces}

Musubi utilise les instructions et requêtes V1 de première version :

|Surface|But|
| ---------------------------------------------------- | -------------------------------------------------------------- |
| `RegisterMusubiNamespaceBindingV1`                   |Lier un espace de noms à son espace de données stable.|
| `RegisterMusubiArchiveV1`                            |Enregistrez un engagement de source d'archive authentifiée immuable.|
| `AddMusubiArchiveLocationV1`                         |Ajouter ou renouveler un emplacement d'archive SoraFS éprouvé.|
| `PublishMusubiReleaseV1`                             |Réclamez ou mettez à jour un paquet et publiez une version immuable.|
| `SetMusubiReleaseYankV1`                             |Comparer et définir l'état extrait d'une version exacte.|
| `InviteMusubiPackageMaintainerV1`                    |Démarrez le flux d'invitation au rôle de package explicite.|
| `RegisterMusubiAliasV1` / `RetargetMusubiAliasV1`    |Enregistrez ou reciblez un alias global géré.|
| `AssertMusubiReleaseDigestV1`                        |Affirmez la valeur exacte et immuable du digest cryptographique de la version.|
| `FindMusubiExactPackageV1`                           |Lire un paquet exact et ses révisions.|
| `FindMusubiExactReleaseV1`                           |Lire un instantané de version exact.|
| `FindMusubiResolverIndexV1` / `FindMusubiVersionsV1` |Résoudre ou lister les candidats à la publication finalisés.|
| `FindMusubiArchiveLocationsV1`                       |Lisez les emplacements d'archives finalisés pris en charge par le fournisseur.|
| `FindMusubiAliasV1` / `FindMusubiAliasHistoryV1`     |Lisez la cible d'alias actuelle ou son historique immuable.|

Torii expose la famille de routes de l'application sous `/v1/musubi/*`. Les outils MCP utilisent les noms actuels `iroha.musubi.queries.*` et `iroha.musubi.instructions.*`. Voir [Torii API points de terminaison](/fr/reference/torii-endpoints.md) et le [référence de requête](/fr/reference/queries.md) pour la carte plus large API.
