---
translation_locale: fr
translation_source: /help/overview.md
translation_source_hash: d0e20c3784c9456f74a68821530920043b0ed5d65890e97d488be304c1249f3b
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Résolution des problèmes {#troubleshooting}

Cette section est destinée à vous aider si vous rencontrez des problèmes en travaillant avec
Iroha. Si quelque chose ne va pas, s'il vous plaît [Vérifiez les clés](#check-the-keys)
Si cela ne vous aide pas, vérifiez les instructions de dépannage pour
chaque étape:

- [Problèmes d'installation](./installation-issues.md)
- [Problèmes de configuration](./configuration-issues.md)
- [Problèmes de déploiement](./deployment-issues.md)
- [Questions d'intégration](./integration-issues.md)

Si le problème que vous rencontrez n'est pas décrit ici, contactez-nous par
[Télégramme](https://t.me/hyperledgeriroha).

## Vérifiez les clés . {#check-the-keys}

La plupart des problèmes résultent de clés inégalées.
pour respecter cette règle: **Si quelque chose ne va pas, vérifiez les clés.
tout d'abord**.

Voici une explication rapide: il est impossible de différencier l'erreur
messages qui apparaissent lorsque les clés des pairs ne correspondent pas aux clés de l'ensemble de
les pairs de confiance parce que cela exposerait la clé publique des pairs.
disposer de diagrammes Helm ou de déploiements Kubernetes avec des clés définies par l'environnement
les variables, comparer les configurations
[`public_key`](/fr/reference/peer-config/params.md#param-public-key),
[`private_key`](/fr/reference/peer-config/params.md#param-private-key), et
[`trusted_peers`](/fr/reference/peer-config/params.md#param-trusted-peers)
des valeurs avant d'enquêter sur les défaillances de niveau supérieur.

En cas de doute, [générer une nouvelle paire de clés](/fr/guide/security/generating-cryptographic-keys.md).
