---
translation_locale: fr
translation_source: /guide/configure/overview.md
translation_source_hash: 24eae3295459781d774369521241f1c2da5b24fe51eb8a2b086911b923395846
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Configuration et gestion {#configuration-and-management}

Iroha la configuration a deux niveaux d'autorité :

- configuration des pairs et des clients du réseau local, stockée dans des fichiers TOML et lue au démarrage du processus
- configuration sur la chaîne, modifiée par des transactions via [`SetParameter`](/fr/blockchain/instructions.md#setparameter)

Utilisez la configuration locale pour l'identité du nœud, les adresses, la journalisation, le stockage et les clés de signature client. Utilisez la configuration sur chaîne pour les valeurs qui doivent être approuvées par le réseau et rejouées de manière déterministe.

Le comportement en production doit provenir de ces couches de configuration. Les variables d'environnement peuvent être pratiques pour fournir des entrées de test aux outils locaux, mais elles ne sont pas des interrupteurs de fonctionnalités en production et ne remplacent pas la configuration validée.

Les principaux points d'entrée de configuration sont :

- [genèse de la blockchain](/fr/guide/configure/genesis.md)
- [Configuration du client](/fr/guide/configure/client-configuration.md)
- [Clés pour le déploiement réseau](/fr/guide/configure/keys-for-network-deployment.md)
- [Exécution sur métal nu](/fr/guide/advanced/running-iroha-on-bare-metal.md)
- [référence de configuration des pairs réseau](/fr/reference/peer-config/index.md)
