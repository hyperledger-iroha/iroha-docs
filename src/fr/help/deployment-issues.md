---
translation_locale: fr
translation_source: /help/deployment-issues.md
translation_source_hash: 6f35ac59053e312f56a716810c8f0b625752500d1fc64b27d93cbd8317b6cc19
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Résolution des problèmes de déploiement {#troubleshooting-deployment-issues}

Cette section offre des conseils de résolution des problèmes pour Iroha 3 Les déploiements.
Ce que vous expérimentez n'est pas décrit ici,
communiquer avec nous via [Télégramme](https://t.me/hyperledgeriroha).

## Commencez par les objets générés {#start-with-generated-artifacts}

Pour les déploiements locaux et d'essai, préférer des artefacts générés par Kagami au lieu de cela
de dossiers écrits à la main:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
```

Le répertoire généré contient des config, du matériel de la génèse, le début
les scripts, et un README pour le Iroha 3 la ligne de construction.

## Les pairs ne commencent pas {#peer-does-not-start}

Vérifiez d'abord ces éléments:

- `irohad --config <path>` les points de l'équivalent TOML Le dossier.
- `public_key` et `private_key` dans la config par les pairs appartiennent à la même clé
  Je vous en prie.
- `genesis.public_key` correspond à la clé utilisée pour signer la transaction génétique.
- utilisation d'identités par les pairs de validateur BLS- Des clés normales, et `trusted_peers_pop`
  contient des entrées de preuve de possession pour la clé locale et les pairs de confiance.
- ports pour Torii et P2P sont déjà non liés par un autre processus.
- le Kura le répertoire de magasin appartient à la même chaîne et n'a pas été copié d'une
  un profil réseau différent.

Utilisez le traçage de configuration lorsque le daemon lit plus d' une TOML couche:

```bash
cargo run --bin irohad -- --config ./config.toml --trace-config
```

## Docker et composer {#docker-and-compose}

Générer Composer à partir du courant Kagami la sortie de localnet donc la ligne de commande
Les arguments et les fichiers de configuration correspondent au code déconnecté:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./localnet/docker-compose.yml --force
docker compose -f ./localnet/docker-compose.yml up
```

Si un déploiement compose commence et s'arrête, inspectons les journaux de daemon pour:

- non égalés `chain`
- un homologue utilisant une transaction ou un manifeste génétique différent
- publicité P2P adresses qui ne fonctionnent que dans le réseau de conteneurs
- réutilisation du volume local après la régénération de la génèse

Lorsque vous testez une nouvelle génèse, enlevez l'ancienne Kura volumes avant le redémarrage
Garder les anciens blocs avec une nouvelle génèse va faire échouer la répétition.

## Les Kubernètes {#kubernetes}

Pour Kubernetes, traiter chaque validateur comme une infrastructure d'état:

- donner à chaque paire une clé d'identité stable et un volume persistant stable
- exposer P2P adresses que d'autres pairs peuvent résoudre à l'intérieur du cluster
- Monter les fichiers de configuration et de génèse comme configuration immuable pour un déploiement
- déployer tous les changements de génèse ou de topologie délibérément, et non comme un
  mise à jour de la carte de configuration

Si une capsule est redémarrée à plusieurs reprises, comparez la configuration rendue dans la capsule
attendu [`peer.template.toml`](/fr/reference/peer-config/index.md#template) et
Vérifiez si le pair est en train de reproduire Kura les données.

## Profil de Sora {#sora-profile}

Iroha 3 déploiements qui utilisent Nexus, SoraFS, ou les flux multi-lignes devraient commencer
le démon avec le profil Sora activé:

```bash
cargo run --bin irohad -- --config ./config.toml --sora
```

Utilisez le même profil de manière cohérente entre les validateurs du même réseau.
