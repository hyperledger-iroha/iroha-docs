---
translation_locale: fr
translation_source: /guide/tutorials/musubi.md
translation_source_hash: 6b33c687fd1d81d931b932d38908d9a87e9c619e5aca5714d09d892160a6b704
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Musubi Kotodama Des colis {#musubi-kotodama-packages}

Musubi est le gestionnaire de paquets pour les packages sources Kotodama. Il offre aux développeurs un flux de travail semblable à Cargo pour partager des fonctions composables Kotodama tout en gardant l'identité du package liée aux espaces de noms SORA et Iroha au lieu d'une table de nommage globale.

Utilisez Musubi lorsque vous devez:

- publier des bibliothèques de source réutilisables Kotodama
- en `Musubi.lock` les dépendances exactes des sources transitives
- reconstituer la source de dépendance à partir des engagements d'archives vérifiés SoraFS
- connecter un espace nommé des paquets aux alias de contrat dapp dans le même espace nom
- inspecter, publier, retirer ou alias des paquets par le biais du registre en chaîne

## Nom des paquets {#package-names}

Utilisation des identifiants de colis canoniques:

```text
namespace/package
```

Utilisation des références de libération exactes:

```text
namespace/package@version
```

Il n'y a pas de préfixe `@` avant un espace namespace. Le séparateur `@` est réservé au suffixe version.

Le segment de l'espace nommé correspond au suffixe utilisé par les alias Kotodama dapp contract:

|Id du colis |Forme d' alias des contrats connexes |
| ------------------------- | ---------------------------- |
|`universal/math` |`router::universal` |
|`dex.universal/swap-core` |`router::dex.universal` |

Les espaces de noms ont le formulaire `<dataspace>` ou `<domain>.<dataspace>`. Lorsqu'un paquet a un lien dapp, Musubi vérifie que chaque alias contrat lié utilise le même suffixe d'espace de nom que le paquet.

## Manifesté {#manifest}

L'emballage commence par `Musubi.toml`:

```toml
[package]
namespace = "dex.universal"
name = "swap-core"
version = "0.1.0"

[dependencies.math]
package = "std.universal/math"
version = "^1.0.0"

[exports]
functions = ["quote"]

[dapp]
namespace = "dex.universal"
contracts = ["router::dex.universal"]
```

Les dépendances peuvent utiliser des versions exactes, des exigences en matière de soins et d'atténuation, des cartes sauvages telles que `1.*` ou des listes de comparaison telles que `>=1.0.0,<2.0.0`.

`Musubi.lock` enregistre le graphique transitif sélectionné du registre de la chaîne. Chaque nœud verrouillé stocke son package canonique ref, l'exigence sélectionnée, SoraFS digest manifeste, hash d'archive source, nombre de octets, nombre de fichiers, fonctions exportées, plan d'archivage de source déterministe et aliases de dépendance. Les pseudonymes courts sont résolus avant d'entrer dans le fichier de verrouillage.

## Flux de travail local {#local-workflow}

À partir de la racine de l'espace de travail Iroha en amont, exécuter Musubi par Cargo:

```bash
cargo run -p musubi -- init --namespace dex.universal --name swap-core --dapp
cargo run -p musubi -- add std.universal/math --version '^1.0.0' --alias math
cargo run -p musubi -- install --config client.toml
cargo run -p musubi -- build src/lib.ko --manifest-out target/lib.contract.json
cargo run -p musubi -- pack \
  --car-out source.car \
  --sorafs-manifest-out manifest.norito \
  --source-plan-out source-plan.norito
```

Utilisez `install --offline` pour écrire un fichier de verrouillage non résolu pour les dépendances de version exacte sans interroger un nœud. Utiliser `install --locked` dans CI pour rejeter un fichiers de verrouillages obsolètes.

`build` relie les sources de dépendance en cache en réécrivant des appels tels que `math::add()` aux noms de fonctions internes déterministes Kotodama. Il rejette les appels à des fonctions que la dépendance n'a pas exportées. Les bibliothèques Musubi v1 sont uniquement fonctionnelles: les sources de dépendance qui contiennent des déclarations d'état, des déclencheurs, des blocs de kotoba, des constantes ou d'autres éléments contractuels non fonctionnels sont rejetées.

## Retour à la source Archives {#fetching-source-archives}

Musubi peut récupérer les sources de dépendance manquantes lors de la résolution ou plus tard par le biais des sous-commandes du cache:

```bash
cargo run -p musubi -- install --config client.toml --fetch \
  --provider-payload math.payload

cargo run -p musubi -- cache import math --source-root ../math
cargo run -p musubi -- cache fetch math --provider-payload math.payload
```

Les prises en direct de passerelle utilisent une ou plusieurs spécifications du fournisseur de passerelle SoraFS:

```bash
cargo run -p musubi -- install --config client.toml --fetch \
  --gateway-provider 'name=hot-a,provider-id=1111111111111111111111111111111111111111111111111111111111111111,base-url=https://gw.example,stream-token=BASE64,package=math'
```

Les fichiers de charge utile du fournisseur et les fournisseurs de passerelles sont mutuellement exclusifs pour une opération de récupération. Si plus d'un paquet verrouillé est manquant, renseignez chaque fournisseur de passerelle par `package=<dependency-alias>`, `package=<namespace/package@version>`, `package=<namespace/package>` ou `manifest=<64-hex SoraFS manifest digest>`.

Portée `base-url` et `privacy-url` les valeurs doivent être utilisées `https://` par défaut. Les passerelles de test locales peuvent utiliser `http://localhost`, `http://127.0.0.1`, ou `http://[::1]` uniquement avec `--gateway-allow-insecure-localhost`. Les jetons de flux sont des identifiants d'exécution et ne sont pas inscrits dans `Musubi.lock`.

## Édition {#publishing}

`pack` compute le déterminisme BLAKE3-256 le hash de l'archive source plus le octet source et le nombre de fichiers. `--car-out`, `--sorafs-manifest-out`, ou `--source-plan-out` est fourni, il construit aussi la déterministique SoraFS CAR chargement utile, SoraFS manifestes, et Musubi plan d'archivage source du même ensemble de fichiers source.

Utilisez une course à sec avant de publier:

```bash
cargo run -p musubi -- publish --config client.toml --dry-run
```

Sans `--dry-run`, `publish` écrit des objets par défaut sous `.musubi/dist/<namespace>/<name>/<version>/`, optionnellement télécharger le manifeste et la charge utile à travers Torii C' est ... SoraFS point d'extrémité du pin de stockage avec `--upload`, enregistre les données générées SoraFS pin, et soumet `PublishMusubiRelease` par le biais de la configuration Iroha Le client.

Les communiqués de presse publiés doivent comprendre:

- une archive de source canonique non vide
- un plan d'archivage de source déterministe
- au moins une fonction Kotodama exportée
- enregistrements de dépendance qui ne sélectionnent pas les libérations tirées
- un lien dapp, le cas échéant, dont les pseudonymes contractuels correspondent à l'espace de nom du paquet

## Enquêtes sur le registre et cycle de vie {#registry-queries-and-lifecycle}

Recherche et inspection du registre avec:

```bash
cargo run -p musubi -- search swap --config client.toml
cargo run -p musubi -- versions dex.universal/swap-core --config client.toml
cargo run -p musubi -- alias resolve swap --config client.toml
```

Yanking cache une libération d'une nouvelle résolution, mais garde les fichiers de verrouillage existants reproductibles:

```bash
cargo run -p musubi -- yank dex.universal/swap-core@0.1.0 \
  --reason "bad archive" \
  --config client.toml \
  --dry-run
```

Musubi évite le squatting global du nom en faisant de `namespace/package` le nom canonique du paquet. La publication dans un espace de noms doit être autorisée par le même modèle d'autorisation délégué ou de propriété utilisé pour cet espace de nom d'app Kotodama. Les pseudonymes globaux courts sélectionnés sont séparés de la propriété du paquet: `SetMusubiShortAlias` nécessite l'autorisation `CanSetMusubiShortAlias`, et le paquet cible doit déjà avoir au moins une version active.

## Surfaces Iroha {#iroha-surfaces}

Musubi utilise des instructions et des requêtes de première classe Iroha:

|La surface|Objectif |
| ---------------------------- | -------------------------------------------------- |
|`PublishMusubiRelease` |Publier une version de l'emballage immuable. |
|`YankMusubiRelease` |Marquez une libération existante comme tirée. |
|`SetMusubiShortAlias` |Lier un sous-alias mondial curaté à une carte d'identité. |
|`AssertMusubiReleaseExists` |Requérir une version concrète de l'emballage. |
|`FindMusubiReleaseByRef` |Apportez un exemplaire par référence exacte. |
|`FindMusubiPackageVersions` |Liste des versions d'un identifiant de colis. |
|`FindMusubiPackageReleases` |Liste des résumés de la publication d' un identifiant de colis. |
|`SearchMusubiPackages` |Recherchez les résumés des paquets par espace de noms et texte. |
|`FindMusubiShortAliasByName` |Résolvez un pseudonyme court.|

Torii dévoile les Musubi HTTP famille de la route sous `/v1/musubi/`. Face à l'agent MCP les outils sont exposés comme `iroha.musubi.` Les pseudonymes. [Torii points d'expiration](/fr/reference/torii-endpoints.md) et [référence de requête](/fr/reference/queries.md) pour le plus large API Une carte.
