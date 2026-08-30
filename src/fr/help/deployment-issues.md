---
translation_locale: fr
translation_source: /help/deployment-issues.md
translation_source_hash: 5c7d26b39d4ddf4e7e164f7bef79c9e1659db51587fb0dde9cf3f1dc0e3b057b
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Troubleshooting des problèmes de déploiement {#troubleshooting-deployment-issues}

Cette section offre des conseils de dépannage pour les déploiements Iroha 3. Si le problème que vous rencontrez n'est pas décrit ici, contactez-nous via [Telegram](https://t.me/hyperledgeriroha).

## Commencez par les objets générés . {#start-with-generated-artifacts}

Pour les déploiements locaux et de test, préférer les artefacts générés par Kagami au lieu des fichiers d'écriture manuscrite:

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
```

Le répertoire généré contient des config, du matériel de génèse, des scripts de démarrage et une README pour la ligne de construction Iroha 3.

## Le parcours ne commence pas {#peer-does-not-start}

Vérifiez d'abord ces éléments:

- `iroha3d --config <path>` points dans le dossier TOML du coéquipier lui-même.
- `public_key` et `private_key` dans la configuration de pair appartiennent à la même paire de clés.
- `genesis.public_key` correspond à la clé utilisée pour signer l'opération de génèse.
- les identités des coéquipiers validateurs utilisent BLS-clés normaux, et `trusted_peers_pop` contient des entrées de preuve de possession pour la clé locale et les coéquipierts de confiance.
- les ports Torii et P2P ne sont pas déjà liés par un autre procédé.
- Le répertoire de magasins Kura appartient à la même chaîne et n'a pas été copié à partir d'un profil réseau différent.

Utilisez le traçage de la configuration lorsque le démon lit plus d'une couche TOML:

```bash
cargo run -p irohad --bin iroha3d -- --config ./config.toml --trace-config
```

## Docker et le composé {#docker-and-compose}

Générer Composez à partir de la sortie localnet actuelle Kagami afin que les arguments de ligne de commande et les fichiers de configuration correspondent au code démarré:

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./docker-compose.yml --force
docker compose -f ./docker-compose.yml up
```

Si un déploiement compose démarre et s'arrête, vérifiez les journaux de démon pour:

- ne correspondant pas `chain`
- une paire utilisant une transaction ou un manifeste génétique différent
- les adresses annoncées P2P qui ne fonctionnent que dans le réseau de conteneurs
- réutilisation du volume local après la régénération de la génèse

Lors du test d'une nouvelle génèse, retirez les anciens Kura volumes avant de redémarrer la pile. Garder un ancien bloc de stockage avec une nouvelle génèse fera que la répétition échoue.

## Les Kubernètes {#kubernetes}

Pour Kubernetes, traiter chaque validateur comme une infrastructure d'état:

- donner à chaque paire une clé d'identité stable et un volume persistant stable
- exposer les adresses P2P que d'autres pairs peuvent résoudre à l'intérieur du groupe.
- Monter les fichiers de configuration et génèse comme un configuration immuable pour une déploiement
- déployer toutes les modifications de génèse ou de topologie délibérément, et non comme une mise à jour automatique de la carte de configuration

Si une capsule est redémarrée à plusieurs reprises, comparez la configuration rendue dans la capsule avec les données attendues [`peer.template.toml`](/fr/reference/peer-config/index.md#template) et vérifiez si le pair reproduit des données anciennes Kura.

## Profil de Sora {#sora-profile}

Les déploiements Iroha 3 qui utilisent des flux Nexus, SoraFS ou multi-lignes devraient démarrer le démon avec le profil Sora activé:

```bash
cargo run -p irohad --bin iroha3d -- --config ./config.toml --sora
```

Utilisez le même profil de manière cohérente entre les validateurs du même réseau.
