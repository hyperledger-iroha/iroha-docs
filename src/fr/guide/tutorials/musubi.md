---
translation_locale: fr
translation_source: /guide/tutorials/musubi.md
translation_source_hash: 6b33c687fd1d81d931b932d38908d9a87e9c619e5aca5714d09d892160a6b704
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Musubi Kotodama Les colis {#musubi-kotodama-packages}

Musubi est le gestionnaire de forfaits pour Kotodama Les paquets source.
développeurs un flux de travail semblable à Cargo pour le partage composable Kotodama fonctions
tout en conservant l'identité du colis liée à SORA et Iroha espaces de noms au lieu
une table mondiale des prénoms de premier venu.

Utilisation Musubi lorsque vous devez:

- publier réutilisable Kotodama bibliothèques sources
- définir les dépendances exactes des sources transitives en `Musubi.lock`
- reconstituer la source de dépendance à partir d'une source vérifiée SoraFS engagements en matière d'archives
- connecter un espace de nom du paquet aux aliases dapp dans le même
  espace de noms
- inspecter, publier, extraire ou alias des paquets à travers le registre en chaîne

## Nom des paquets {#package-names}

Utilisation des identifiants de colis canoniques:

```text
namespace/package
```

Utilisation des références de libération exactes:

```text
namespace/package@version
```

Il n' y a pas de leader `@` avant un espace de noms. `@` le séparateur est réservé
pour le suffixe de version.

Le segment de l'espace nommé correspond au suffixe utilisé par Kotodama contrat dapp
les pseudonymes:

| Identifiant du colis                | Forme de pseudonyme du contrat associé |
| ------------------------- | ---------------------------- |
| `universal/math`          | `router::universal`          |
| `dex.universal/swap-core` | `router::dex.universal`      |

Les espaces de nom ont `<dataspace>` ou `<domain>.<dataspace>` une forme.
l'emballage a un lien dapp, Musubi Vérifie que chaque alias de contrat lié
utilise le même suffixe d'espace de noms que l'emballage.

## Manifesté {#manifest}

Un paquet commence par: `Musubi.toml`:

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

Les dépendances peuvent utiliser des versions exactes, les exigences de soins, le tilde
Les exigences, les cartes sauvages telles que `1.*`, ou des listes de comparaison telles que
`>=1.0.0,<2.0.0`.

`Musubi.lock` enregistre le graphique transitif sélectionné à partir de la chaîne
chaque nœud verrouillé stocke son package canonique ref, sélectionné
l'exigence, SoraFS dépistage du manifeste, hash de l'archive source, nombre de octets, fichier
compte, fonctions exportées, plan d'archives de source déterministe et
Les pseudonymes courts sont résolus avant d'entrer dans le
Le dossier de verrouillage.

## Flux de travail local {#local-workflow}

De l'au-dessus Iroha racine de l'espace de travail, exécution Musubi à travers la cargaison:

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

Utilisation `install --offline` écrire un fichier de verrouillage non résolu pour la version exacte
dépendances sans demander un nœud. `install --locked` dans CI à
rejeter un fichier de verrouillage obsolète.

`build` liens des sources de dépendance cachées en réécrivant des appels tels que
`math::add()` à l'interne déterministe Kotodama les noms des fonctions.
les appels à des fonctions que la dépendance n'a pas exportées. Musubi bibliothèques v1
sont uniquement fonctionnels: sources de dépendance contenant des déclarations d'État,
des déclencheurs, des blocs de kotoba, des constantes ou d'autres éléments contractuels non fonctionnels
sont rejetées.

## Retour à la source Archives {#fetching-source-archives}

Musubi peut récupérer les sources de dépendance manquantes pendant la résolution ou plus tard
à travers les sous-commandes du cache:

```bash
cargo run -p musubi -- install --config client.toml --fetch \
  --provider-payload math.payload

cargo run -p musubi -- cache import math --source-root ../math
cargo run -p musubi -- cache fetch math --provider-payload math.payload
```

Les téléchargements en direct utilisent un ou plusieurs SoraFS spécifications du fournisseur de passerelle:

```bash
cargo run -p musubi -- install --config client.toml --fetch \
  --gateway-provider 'name=hot-a,provider-id=1111111111111111111111111111111111111111111111111111111111111111,base-url=https://gw.example,stream-token=BASE64,package=math'
```

Les fichiers de charge utile du fournisseur et les fournisseurs de passerelles sont mutuellement exclus pour un
Si plus d'un paquet verrouillé est manquant,
fournisseur de passerelle avec `package=<dependency-alias>`,
`package=<namespace/package@version>`, `package=<namespace/package>`, ou
`manifest=<64-hex SoraFS manifest digest>`.

La porte `base-url` et `privacy-url` les valeurs doivent être utilisées `https://` par défaut.
Les passerelles de test locales peuvent être utilisées `http://localhost`, `http://127.0.0.1`, ou
`http://[::1]` uniquement avec `--gateway-allow-insecure-localhost`. Retour
Les jetons sont des informations d'identification en cours de fonctionnement et ne sont pas inscrits dans `Musubi.lock`.

## Édition {#publishing}

`pack` computes le déterminisme BLAKE3-256 hash de l'archive source plus le
le nombre de octets source et le nombre de fichiers. `--car-out`, `--sorafs-manifest-out`, ou
`--source-plan-out` est fourni, il construit aussi la déterministique SoraFS
CAR charge utile, SoraFS manifestes, et Musubi plan d'archivage source de la même
ensemble de fichiers source.

Utilisez une course sèche avant de publier:

```bash
cargo run -p musubi -- publish --config client.toml --dry-run
```

Sans `--dry-run`, `publish` écrit des objets par défaut sous
`.musubi/dist/<namespace>/<name>/<version>/`, optionnellement télécharger le
manifeste et charge utile à travers Torii Je suis là . SoraFS point d'extrémité du pin de stockage avec
`--upload`, enregistre le généré SoraFS d'une valeur de l'équipement
`PublishMusubiRelease` par le biais de la configuration Iroha Le client.

Les communiqués publiés doivent inclure:

- une archive source canonique non vide
- un plan d'archivage de source déterministe
- au moins une exportation Kotodama fonction
- enregistrements de dépendance qui ne sélectionnent pas les émissions tirées
- un lien dapp, s'il y a lieu, dont les pseudonymes contractuels correspondent au paquet
  espace de noms

## Questions de registre et cycle de vie {#registry-queries-and-lifecycle}

Recherche et inspection du registre avec:

```bash
cargo run -p musubi -- search swap --config client.toml
cargo run -p musubi -- versions dex.universal/swap-core --config client.toml
cargo run -p musubi -- alias resolve swap --config client.toml
```

Yanking cache une libération de la nouvelle résolution, mais garde les fichiers verrouillés existants
reproductibles:

```bash
cargo run -p musubi -- yank dex.universal/swap-core@0.1.0 \
  --reason "bad archive" \
  --config client.toml \
  --dry-run
```

Musubi évitant de faire passer le nom du monde entier `namespace/package` le
Nom canonique du paquet. La publication dans un espace de noms doit être autorisée par
le même modèle de propriété ou d'autorisation déléguée utilisé pour ce Kotodama
les abréviations globales sont séparées du paquet
propriété: `SetMusubiShortAlias` Il est nécessaire de: `CanSetMusubiShortAlias`
l'autorisation, et le paquet cible doit déjà avoir au moins un actif
La libération.

## Iroha Surfaces {#iroha-surfaces}

Musubi utilisation de première classe Iroha instructions et requêtes:

| Surfaces                      | Le but                                            |
| ---------------------------- | -------------------------------------------------- |
| `PublishMusubiRelease`       | Publier une version immutable du paquet.              |
| `YankMusubiRelease`          | Marquez une libération existante comme tirée.                |
| `SetMusubiShortAlias`        | Lier un pseudonyme global à l'identifiant du paquet. |
| `AssertMusubiReleaseExists`  | Exiger une version concrète de l'emballage.       |
| `FindMusubiReleaseByRef`     | Apportez un exemplaire selon la référence de l'emballage.        |
| `FindMusubiPackageVersions`  | Liste des versions d'un identifiant de colis.                    |
| `FindMusubiPackageReleases`  | Liste des résumés de la publication pour un identifiant d'emballage.           |
| `SearchMusubiPackages`       | Recherchez les résumés des paquets par espace de noms et texte.    |
| `FindMusubiShortAliasByName` | Résolvez un pseudonyme.                     |

Torii dévoile les Musubi HTTP famille de route sous `/v1/musubi/*`.
Face à l'agent MCP les outils sont exposés comme `iroha.musubi.*` Les pseudonymes.
[Torii points de fin](/fr/reference/torii-endpoints.md) et
[référence de requête](/fr/reference/queries.md) pour le plus large API Une carte.
