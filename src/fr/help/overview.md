---
translation_locale: fr
translation_source: /help/overview.md
translation_source_hash: d0e20c3784c9456f74a68821530920043b0ed5d65890e97d488be304c1249f3b
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Résolution des problèmes {#troubleshooting}

Cette section est destinée à vous aider si vous rencontrez des problèmes pendant que vous travaillez avec Iroha. Si quelque chose ne va pas, veuillez d'abord vérifier [ les touches ](#check-the-keys).

- [Problèmes d'installation ](./installation-issues.md)
- [Problèmes de configuration ](./configuration-issues.md)
- [Enjeux de déploiement](./deployment-issues.md)
- [Problèmes d'intégration ](./integration-issues.md)

Si le problème que vous rencontrez n'est pas décrit ici, contactez-nous par l'intermédiaire de [Télégramme ](https://t.me/hyperledgeriroha).

## Vérifiez les clés . {#check-the-keys}

C'est pourquoi nous vous recommandons de suivre cette règle: si quelque chose ne va pas, vérifiez d'abord les touches.

Voici une explication rapide: il n'est pas possible de différencier les messages d'erreur qui se produisent lorsque les clés des pairs ne correspondent pas aux clés du tableau des pairs de confiance car cela exposerait la clé publique des pairs. Par conséquent, si vous avez des graphiques Helm ou des déploiements Kubernetes avec des clés définies via des variables environnementales, comparez les valeurs configurées [`public_key`](/fr/reference/peer-config/params.md#param-public-key), [`private_key`](/fr/reference/peer-config/params.md#param-private-key), et [`trusted_peers`](/fr/reference/peer-config/params.md#param-trusted-peers) avant d'enquêter sur les défaillances de niveau supérieur.

En cas de doute, [ génère une nouvelle paire de clés](/fr/guide/security/generating-cryptographic-keys.md).
