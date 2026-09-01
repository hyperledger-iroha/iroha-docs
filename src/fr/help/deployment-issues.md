---
translation_locale: fr
translation_source: /help/deployment-issues.md
translation_source_hash: c220e127bc8081c9b457dfd67101aa44fb80d79c461cc7a7eda99584d74a8f19
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Résolution des problèmes de déploiement {#troubleshooting-deployment-issues}

Cette section offre des conseils de dépannage pour les déploiements Iroha 3. Si le problème que vous rencontrez n'est pas décrit ici, contactez-nous via [Télégramme](https://t.me/hyperledgeriroha).

## Commencez par les artefacts générés {#start-with-generated-artifacts}

Pour les déploiements locaux et de test, privilégiez les artefacts générés par Kagami plutôt que les fichiers de pairs réseau écrits à la main :

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
```

Le répertoire généré contient des configurations de pairs réseau, du matériel de genèse de blockchain, des scripts de démarrage et un README pour la ligne de construction Iroha 3.

## le pair du réseau ne démarre pas {#peer-does-not-start}

Vérifiez d'abord ces articles :

- `iroha3d --config <path>` pointe vers le propre fichier TOML du pair réseau.
- `public_key` et `private_key` dans la configuration du pair réseau appartiennent à la même paire de clés.
- `genesis.public_key` correspond à la clé utilisée pour signer la transaction de genèse de la blockchain.
- Les identités des pairs du réseau de validateurs utilisent des clés BLS-Normales, et `trusted_peers_pop` contient des entrées de preuve de possession pour la clé locale et les pairs du réseau de confiance.
- les ports pour Torii et P2P ne sont pas déjà occupés par un autre processus.
- L'annuaire des magasins Kura appartient à la même chaîne et n'a pas été copié à partir d'un profil réseau différent.

Utilisez le traçage de configuration lorsque le démon lit plus d'une couche TOML :

```bash
cargo run -p irohad --bin iroha3d -- --config ./config.toml --trace-config
```

## Docker et Docker Compose {#docker-and-compose}

Générez Compose à partir de la sortie localnet actuelle Kagami afin que les arguments de la ligne de commande et les fichiers de configuration correspondent au code extrait :

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./docker-compose.yml --force
docker compose -f ./docker-compose.yml up
```

Si un déploiement Compose démarre puis se bloque, inspectez les journaux du démon pour :

- incompatible `chain`
- un pair de réseau utilisant une transaction de genèse de blockchain différente ou un manifeste technique différent
- adresses P2P annoncées qui ne fonctionnent que dans le réseau du conteneur
- réutilisation du volume local après la régénération du genesis de la blockchain

Lors du test d'une nouvelle genèse de blockchain, supprimez les anciens volumes Kura avant de redémarrer la pile. Conserver l'ancien stockage de blocs avec une nouvelle genèse de blockchain fera échouer la relecture.

## Kubernetes {#kubernetes}

Pour Kubernetes, considérez chaque validateur comme une infrastructure avec état :

- donner à chaque pair du réseau une clé d'identité stable et un volume persistant stable
- exposer les adresses P2P que d'autres pairs du réseau peuvent résoudre depuis l'intérieur du cluster
- monter les fichiers de configuration et de genèse de la blockchain en tant que configuration immuable pour un déploiement
- déployer délibérément tous les changements de genèse ou de topologie, non comme une actualisation automatique de la configuration

Si un pod redémarre sans cesse, comparez sa configuration générée avec celle prévue dans [`peer.template.toml`](/fr/reference/peer-config/index.md#template) et vérifiez si le pair relit d’anciennes données Kura.

## Profil de Sora {#sora-profile}

Les déploiements privés ou locaux Iroha 3 qui utilisent Nexus, SoraFS ou des flux multi-voies devraient démarrer le démon standard avec le profil Sora activé :

```bash
cargo run -p irohad --bin iroha3d -- --config ./config.toml --sora
```

Utilisez le même profil de manière constante sur les validateurs du même réseau.

Les validateurs publics Taira utilisent le lanceur dédié, qui applique la chaîne exacte de Taira, la liste, le stockage intégré désactivé SoraFS, et le profil de signataire d'exécution. Validez la configuration rendue Taira avant de la démarrer :

```bash
iroha3d_taira --sora \
  --config /etc/iroha/taira/config.toml \
  --check-config
```

Ne démarrez pas un public Taira validateur avec générique `iroha3d`; voir le [`iroha3d` CLI référence](/fr/reference/iroha3d-cli.md) pour le profil imposé.
