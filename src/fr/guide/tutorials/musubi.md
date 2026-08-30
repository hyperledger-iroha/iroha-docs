---
translation_locale: fr
translation_source: /guide/tutorials/musubi.md
translation_source_hash: 4a76626522ecb9fe32e98e9c1e4552223cf820d40d0de16690dc589b0f40c901
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Musubi Kotodama Des colis {#musubi-kotodama-packages}

Musubi est le gestionnaire de paquets de première sortie pour les packages source Kotodama. Il résolve un graphique exact de dépendance sur la chaîne, authentifie SoraFS les archives de source, compile et teste l'espace de travail sélectionné, crée des archives canoniques CAR et publie des versions immuables par le biais de Iroha.

Utilisez Musubi lorsque vous devez:

- publier des bibliothèques de fonctions réutilisables Kotodama
- insérer un graphique transitif exact en `Musubi.lock`
- reconstituer la source de dépendance à partir des engagements d'archives définis SoraFS
- construire et tester un espace de travail composé d'un seul ou plusieurs paquets;
- d'inspecter, de publier, de retirer, de maintenir ou d'alias les paquets via le registre en chaîne

## Nom des paquets {#package-names}

Les sélecteurs de colis canoniques utilisent:

```text
namespace/package
```

Les identifiants de sortie exacts ajoutent une version:

```text
namespace/package@version
```

Il n'y a pas de leader `@` avant un espace de noms. Un espace de nom est soit une racine de l'espace de données telle que `universal` ou un espace des données qualifié par domaine tel que `dex.universal`. Le registre lie cet espace de namespace structurel à un espace d'origine stable avant qu'un paquet puisse être revendiqué.

## Manifeste et fichier verrouillé {#manifest-and-lockfile}

Un paquet utilise la première version fermée `Musubi.toml` Le manifeste doit déclarer: `manifest-version = 1`, Kotodama édition `"1"`, et IVM ABI version `1`; il n'y a pas de manifeste alternatif ou ABI le mode.

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

Les dépendances peuvent utiliser des versions exactes, des exigences de soins ou d'atténuation, des cartes sauvages telles que `1.*`, et ensembles de comparateurs séparés par des virgules, tels que: `>=1.0.0,<2.0.0`. La clé de la table des dépendances est le surnom d'importation par parent local; `package` est toujours le sélecteur du registre canonique.

`Musubi.lock` lie le graphique à la génèse exacte dérivée `NetworkId` et une capture d'écran du registre finalisé. Il enregistre les racines de l'espace de travail sélectionnées et les nœuds de sortie immuables, comprenant la libération, la source, l'interface, l'archivage, ABI et les engagements exacts de bord de dépendance. Les versions parallèles sont autorisées lorsque le graphique résolu en exige.

## Configuration Taira SoraFS Remplacement {#configure-taira-sorafs-fetching}

Taira est le réseau de test public pour ce flux de travail. Commencez par une configuration client Taira avec la chaîne et l'identité du réseau vérifiées, puis ajoutez les liaisons d'authentification spécifique au fournisseur ci-dessous. Le matériel de signature du compte et les clés de l'opérateur fournisseur doivent rester dans des fichiers d'exécution réservés au propriétaire.

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

Découvrez les fournisseurs admis de Taira à partir de la racine publique du testnet:

```bash
export TAIRA_ROOT=https://taira.sora.org
curl -fsS "$TAIRA_ROOT/v1/sorafs/providers?limit=20" | jq '.providers'
```

Le catalogue du fournisseur fournit les identités des fournisseurs et les points d'extrémité annoncés. Obtenez l'autorisation de l'opérateur correspondant auprès du fournisseurs choisi. Le runtime utilise cette clé pour demander des jetons de flux limités; les jetons ne sont ni arguments CLI ni contenu de fichier verrouillé.

Ne pas utiliser un Taira épingle de validation URL en tant que `url`. Les validateurs enregistrés ont intégré: SoraFS le stockage désactivé. `https://taira-validator-{1,2,3,4}.sora.org` Les endpoints acceptent l'enregistrement des pin, tandis que les lectures d'archives utilisent la version du fournisseur admis sélectionné. HTTPS de l'origine.

## Flux de travail local {#local-workflow}

À partir de la racine de l'espace de travail Iroha en amont, créez ou entrez le répertoire des paquets et exécutez Musubi par Cargo:

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

`fetch` résolve le graphique de registre finalisé, les mises à jour `Musubi.lock` lorsque cela est autorisé, et remplit le cache local immutable à partir d'authentifiés SoraFS les lieux. `check`, `build`, `test`, et `package` effectuer les mêmes vérifications de graphes et de cache avant leur propre travail.

Utilisez `--locked` pour rejeter toute modification du fichier de verrouillage. Utiliseze `--offline` seulement lorsque l'index du registre et tous les archives requises sont déjà mis en cache. `--frozen` combine ces deux contraintes. Un cache hors ligne échoue; Musubi n'écrit jamais un fichier à verrouille non résolu.

Les sources de dépendance sont liées en réécrivant des appels qualifiés tels que: `math::add()` à l'interne déterministe Kotodama les noms. Un appel de dépendance à une fonction non exportée est rejeté. Les bibliothèques importées exposent des fonctions; `[[contract]]` et `[[test]]` les objectifs restent des objectifs explicites du paquet.

## Vérification et réparation du cache {#cache-verification-and-repair}

Les commandes du cache public fonctionnent sur des archives immutables engagées dans le registre:

```bash
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  cache verify --all --config client.toml

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  cache repair --config client.toml

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  cache prune --dry-run --config client.toml
```

`cache repair` La quarantaine corrompt les descendants de confiance et refait des archives exactes lorsque la preuve du fournisseur final le permet. Musubi rejette une mutation de taille non vide vivante. `--dry-run` l'inspection des candidats classifiés.

## Emballage et édition {#packaging-and-publishing}

Inspectez le fichier positif propre avant d'écrire une archive, puis créez le paquet canonique:

```bash
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  package --list --locked --config client.toml

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  package --locked --config client.toml
```

`package` écrit `target/package/<namespace>-<name>-<version>.car`. Les États membres CAR lient le manifeste du paquet canonique, le manifeste de libération sémantique, la serrure de vérification exacte, l'arbre source, la digestion d'interface et SoraFS Il n'y a pas d'engagement à l'archivage. `pack`, `--car-out`, `--sorafs-manifest-out`, ou `--source-plan-out` commandes dans la première version CLI.

La publication est un flux de travail réseau signé et réalisable. Le `client.toml` sélectionné doit contenir les liaisons de production `[musubi.publication]` ainsi que le compte et la configuration du réseau Taira.

```bash
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  publish -p dex.universal/swap-core --locked --config client.toml
```

Utilisation `--detach` Retourner après que le journal d'opération et la limite d'entrée des semences soient durables. `publish --resume <operation-id> --config client.toml`. Le plus étroit `--recover <operation-id>` le chemin seulement reconstruit manquant immutable sidecars pour un journal avant l'entrée vierge. `--dry-run` ou des téléchargements publics génériques; exécuter `package --list` et `package` pour le pré-vol local.

## Enquêtes sur le registre et cycle de vie {#registry-queries-and-lifecycle}

Recherche et inspection du registre finalisé avec la même configuration de client Taira:

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

Yanking exclut une libération immuable de nouvelles résolutions tandis que les verrous exacts existants restent reproductibles. Lisez d'abord la revue de yank actuelle, puis soumettez une mutation comparer et régler:

```bash
: "${EXPECTED_YANK_REVISION:?set the current non-zero yank revision}"

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  yank dex.universal/swap-core 0.1.0 \
  --expected-revision="$EXPECTED_YANK_REVISION" \
  --reason="bad archive" \
  --config client.toml
```

Utilisez `unyank` avec le même package, la version et la révision de lecture fraîche pour inverser cet état. Les pseudonymes mondiaux ont leur propre enregistrement à prix, l'historique de retargeting et les révisions de comparaison et d'établissement; ils ne sont pas des raccourcis en matière de propriété du package.

## Surfaces Iroha {#iroha-surfaces}

Musubi utilise les instructions et les requêtes de première édition V1:

|La surface|Objectif |
| -------------------------------------------------- | -------------------------------------------------------------- |
|`RegisterMusubiNamespaceBindingV1` |Lier un espace nommé à son espace de données stable. |
|`RegisterMusubiArchiveV1` |Enregistrer un engagement d'archivage de source authentifié immuable. |
|`AddMusubiArchiveLocationV1` |Ajouter ou renouveler un emplacement d'archivage SoraFS prouvé. |
|`PublishMusubiReleaseV1` |Demandez ou mettez à jour un package et publiez une version immuable. |
|`SetMusubiReleaseYankV1` |Comparaison et réglage de l'état tiré d'une libération exacte.|
|`InviteMusubiPackageMaintainerV1` |Démarrer le flux d'invitation explicite aux rôles de packages. |
|`RegisterMusubiAliasV1` / `RetargetMusubiAliasV1` |Enregistrer ou rediriger un alias global réglementé. |
|`AssertMusubiReleaseDigestV1` |Assurez-vous l'immutable digestion de libération exacte. |
|`FindMusubiExactPackageV1` |Lisez un paquet précis et ses révisions. |
|`FindMusubiExactReleaseV1` |Lisez une photo de sortie exacte. |
|`FindMusubiResolverIndexV1` / `FindMusubiVersionsV1` |Résolvez ou listez les candidats à la libération définie. |
|`FindMusubiArchiveLocationsV1` |Lisez les emplacements d'archives définis par le fournisseur. |
|`FindMusubiAliasV1` / `FindMusubiAliasHistoryV1` |Lisez l'alias actuel de la cible ou son historique immuable. |

Torii expose la famille de routes d'applications sous `/v1/musubi/`. MCP les outils utilisent le courant `iroha.musubi.queries.` et `iroha.musubi.instructions.*` les noms. Voir [Torii points d'arrêt](/fr/reference/torii-endpoints.md) et le [référence de requête](/fr/reference/queries.md) pour le plus large API Une carte.
