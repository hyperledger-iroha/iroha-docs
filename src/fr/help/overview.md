---
translation_locale: fr
translation_source: /help/overview.md
translation_source_hash: d0e20c3784c9456f74a68821530920043b0ed5d65890e97d488be304c1249f3b
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Dépannage {#troubleshooting}

Cette section vous aide à résoudre les problèmes rencontrés avec Iroha. En cas d’échec, [vérifiez d’abord les clés](#check-the-keys). Si cela ne suffit pas, consultez les instructions propres à chaque étape :

- [Problèmes d'installation](./installation-issues.md)
- [Problèmes de configuration](./configuration-issues.md)
- [Problèmes de déploiement](./deployment-issues.md)
- [Problèmes d'intégration](./integration-issues.md)

Si le problème que vous rencontrez n'est pas décrit ici, contactez-nous via [Télégramme](https://t.me/hyperledgeriroha).

## Vérifiez les clés {#check-the-keys}

La plupart des problèmes proviennent de clés qui ne correspondent pas. Nous recommandons donc cette règle : **en cas d’échec, vérifiez d’abord les clés**.

La raison est simple : il est impossible de distinguer les messages d’erreur dus à des clés de pairs qui ne correspondent pas à celles de l’ensemble des pairs de confiance, car cela exposerait la clé publique du pair. Si vous utilisez des charts Helm ou des déploiements Kubernetes dont les clés proviennent de variables d’environnement, comparez les valeurs configurées de [`public_key`](/fr/reference/peer-config/params.md#param-public-key), [`private_key`](/fr/reference/peer-config/params.md#param-private-key) et [`trusted_peers`](/fr/reference/peer-config/params.md#param-trusted-peers) avant d’examiner des défaillances de niveau supérieur.

En cas de doute, [générez une nouvelle paire de clés](/fr/guide/security/generating-cryptographic-keys.md).
