---
translation_locale: fr
translation_source: /guide/configure/overview.md
translation_source_hash: 24eae3295459781d774369521241f1c2da5b24fe51eb8a2b086911b923395846
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Configuration et gestion {#configuration-and-management}

La configuration Iroha est constituée de deux couches d'autorité:

- Configuration locale par les pairs et les clients, stockée dans des fichiers TOML et lue lors du démarrage du processus
- configuration en chaîne, modifiée par des transactions effectuées à travers [`SetParameter`](/fr/blockchain/instructions.md#setparameter)

Utilisez la configuration locale pour l'identité du nœud, les adresses, le dépôt de jour, le stockage et les clés de signature du client. Utilisez la configuration sur chaîne pour les valeurs qui doivent être convenues par le réseau et reproduites de manière déterministe.

Le comportement de production doit provenir de ces couches de configuration. Les variables environnementales peuvent être pratiques pour fournir des entrées d'essai à l'outillage local, mais elles ne sont pas des portes de fonctionnalités de production et ne remplacent pas la configuration engagée.

Les points d'entrée de la configuration sont les suivants:

- [Genèse ](/fr/guide/configure/genesis.md)
- [Configuration du client ](/fr/guide/configure/client-configuration.md)
- [Les clés du déploiement de réseau ](/fr/guide/configure/keys-for-network-deployment.md)
- [Fonctionnant sur le métal nu](/fr/guide/advanced/running-iroha-on-bare-metal.md)
- [Référence de configuration par rapport aux pairs ](/fr/reference/peer-config/index.md)
