---
translation_locale: fr
translation_source: /guide/configure/overview.md
translation_source_hash: 24eae3295459781d774369521241f1c2da5b24fe51eb8a2b086911b923395846
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Configuration et gestion {#configuration-and-management}

Iroha la configuration a deux couches d'autorité:

- **configuration locale de pair et client**, stockés dans TOML les dossiers et lire à
  démarrage du processus
- **configuration en chaîne**, modifié par des transactions à travers
  [`SetParameter`](/fr/blockchain/instructions.md#setparameter)

Utiliser la configuration locale pour l'identité des nœuds, les adresses, le dépôt de journaux, le stockage et
Utilisez la configuration en chaîne pour les valeurs qui doivent être convenues
par le réseau et reproduit de manière déterministe.

Le comportement de production doit provenir de ces couches de configuration.
les variables peuvent être pratiques pour fournir des entrées d'essai aux outils locaux, mais
Ils ne sont pas des portes de caractéristiques de production et ne remplacent pas les engagés
la configuration.

Les principaux points d'entrée de la configuration sont:

- [Genèse](/fr/guide/configure/genesis.md)
- [Configuration du client](/fr/guide/configure/client-configuration.md)
- [Les clés pour le déploiement du réseau](/fr/guide/configure/keys-for-network-deployment.md)
- [On marche sur le métal nu](/fr/guide/advanced/running-iroha-on-bare-metal.md)
- [Références de configuration par les pairs](/fr/reference/peer-config/index.md)
