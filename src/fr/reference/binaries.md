---
translation_locale: fr
translation_source: /reference/binaries.md
translation_source_hash: 2a9274f1590c2816c72625e5ffd9b93ee4c0b6bc73faf60cdc3273c1314e0c3a
translation_status: machine-validated
translation_engine: google-translate
---

# Travailler avec Iroha Binaires {#working-with-iroha-binaries}

Le Iroha 3 le flux de travail de l'opérateur s'articule autour de trois binaires principaux :

- [`irohad`](https://github.com/hyperledger-iroha/iroha/tree/main/crates/irohad) pour exécuter un démon homologue
- [`iroha`](https://github.com/hyperledger-iroha/iroha/tree/main/crates/iroha_cli) pour CLI et commandes opérateur
- [`kagami`](https://github.com/hyperledger-iroha/iroha/tree/main/crates/iroha_kagami) pour les clés, la genèse, les réseaux locaux et les profils

## Construire à partir de la source {#build-from-source}

Depuis la racine de l'espace de travail en amont :

```bash
cargo build --release -p irohad -p iroha_cli -p iroha_kagami
```

Les binaires de la version sont alors disponibles dans `target/release/`.

Pour inspecter la surface de commande :

```bash
./target/release/irohad --help
./target/release/iroha --help
./target/release/kagami --help
```

## Exécuter directement depuis le référentiel {#run-directly-from-the-repository}

Si vous ne souhaitez rien installer globalement, utilisez `cargo run`:

```bash
cargo run --bin irohad -- --help
cargo run --bin iroha -- --help
cargo run --bin kagami -- --help
```

## Docker Image {#docker-image}

L'espace de travail en amont utilise `kagami localnet` et `kagami docker` générer
Docker Compose fichiers qui correspondent au code extrait.Le `hyperledger/iroha:dev`
l'image peut être utilisée avec ces fichiers générés.

Exécutez le CLI dans un conteneur :

```bash
docker run -t hyperledger/iroha:dev iroha --help
```

Courir Kagami dans un conteneur :

```bash
docker run -t hyperledger/iroha:dev kagami --help
```

Pour un démarrage homologue, générez d'abord un fichier localnet et Compose :

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./localnet/docker-compose.yml --force
docker compose -f ./localnet/docker-compose.yml up
```

## Quel binaire dois-je utiliser ? {#which-binary-should-i-use}

- Utiliser `irohad` lorsque vous démarrez ou exploitez des pairs.
- Utiliser `iroha` lorsque vous devez interroger le grand livre, soumettre des transactions ou inspecter les points de terminaison de l'opérateur.
- Utiliser `kagami` lorsque vous avez besoin de clés, de manifestes Genesis, d'ensembles de profils ou d'actifs Localnet.

## Publication et déploiement de la version Kagemusha {#kagemusha-release-publication-and-rollout}

Kagemusha V4 la publication et l’activation traversent des frontières protégées distinctes :

- `iroha_authenticated_tool_controller promote-kagemusha-release-v4` est le
  Éditeur macOS uniquement et root uniquement.Il authentifie l'épinglé Kagami binaire et
  le candidat exact des seize dossiers, publie les absents
  `promotion-record-v4.norito` sans remplacement et signale uniquement le succès
  après la vérification de la version promue exacte de dix-sept fichiers.
- `iroha offline kagemusha rollout-v4 create-expectations` vérifie le signé
  réservation, quatre sceaux de qualification de validateur commandés, le
  fil de transaction déjà autorisé et l'ancre finalisée de confiance avant
  publier des attentes signées sans remplacement.
- `iroha offline kagemusha rollout-v4 submit` nécessite explicite
  `--write-authorized` consentement.Il journalise et revérifie durablement les informations exactes
  attentes avant qu’un réseau n’écrive ou réessaye.Un `Applied` le statut n'est pas
  ça suffit : la commande vérifie également le bloc validé, successeur de finalité
  chaîne et fil de transaction complet portant autorisation.
- `iroha offline kagemusha rollout-v4 finalize-receipt` recueille les mêmes
  éléments de preuve ancrés par la preuve uniquement après nouvelle vérification
  du journal exact de soumission, les signe avec l'émetteur de reçu indépendant
  et publie le reçu canonique sans remplacement.

Le flux de travail de préparation à la production de Kagemusha enregistré est uniquement une vérification.
Il n'appelle pas l'éditeur authentifié, publie la qualification du validateur
sceaux, soumettre une activation ou créer un reçu de finalité.Un flux de travail réussi
run ne prouve donc ni une promotion ni un déploiement en direct.

Ces commandes sont des primitives locales et ne remplacent pas des preuves réelles.UN
le déploiement en production reste bloqué sans véritable attestation physique d'application et
artefacts candidats, les quatre sceaux d'hôte protégés, la gouvernance d'exécution et
les entrées de signature, la soumission en direct par quatre validateurs et les preuves de finalité, et le
projection canonique de configuration efficace.Conservez les clés privées,
matériel d'authentification et identifiants spécifiques à la promotion dans des fichiers protégés
garde à l'exécution ;ne les copiez pas dans une documentation dont la source est contrôlée ou
billets d'opérateur.
