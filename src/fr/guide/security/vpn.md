---
translation_locale: fr
translation_source: /guide/security/vpn.md
translation_source_hash: 020591f0d7c5560dfb2e9f3f4537f429cbeba864c3eb022856d42addcf32e225
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Réseaux privés virtuels {#virtual-private-networks}

Un <abbr title="Virtual Private Network">VPN</abbr> est un contrôle de réseau qui limite qui peut accéder aux services Iroha. Il est le plus utile pour les déploiements privés et en consortium où les validateurs, les serveurs d'applications et les opérateurs devraient communiquer via des adresses privées plutôt que par des routes Internet ouvertes.

Un VPN ne remplace ni les clés des pairs Iroha, ni les clés de compte, les autorisations, les règles de pare-feu, la surveillance ou le stockage sécurisé des clés. Considérez-le comme une couche de la limite de déploiement : le VPN restreint l’accessibilité du réseau, tandis que la configuration et la gouvernance d’Iroha déterminent les pairs et comptes de confiance.

## Quand utiliser un VPN {#when-to-use-a-vpn}

Utilisez un VPN lorsque :

- les validateurs sont exploités par différentes organisations ou dans différents environnements d'hébergement
- Torii ne devrait être accessible que par les backends de l'application, les opérateurs ou les clients de confiance
- les métriques, les journaux, SSH, ou d'autres points de terminaison d'administration API doivent rester sur un réseau privé de l'opérateur
- un réseau de test ou de préproduction devrait ressembler aux contrôles d'accès en production sans exposer les points de terminaison publics API

Un VPN n'est pas requis pour chaque déploiement. Les réseaux publics peuvent intentionnellement exposer Torii via une passerelle publique, un équilibreur de charge ou un proxy inverse. Même dans ce cas, gardez le trafic pair-à-pair des validateurs et les points de terminaison d'administration API sur un réseau restreint autant que possible.

::: tip

Un navigateur VPN ne protège que le trafic de ce navigateur. Il ne protège pas `iroha3d`, CLI, SDK, SSH, les données de mesure ou le trafic de sauvegarde, à moins que ces processus ne soient acheminés par le même réseau privé.

:::

## Modèle de déploiement {#deployment-pattern}

Pour un maillage de validateurs privé, donnez à chaque validateur une adresse stable VPN ou un nom privé DNS. Configurez les pairs du réseau afin que leurs adresses pair-à-pair annoncées soient accessibles par les autres validateurs sur ce réseau :

```toml
trusted_peers = [
  "PUBLIC_KEY_1@10.20.0.11:1337",
  "PUBLIC_KEY_2@10.20.0.12:1337",
  "PUBLIC_KEY_3@10.20.0.13:1337",
  "PUBLIC_KEY_4@10.20.0.14:1337",
]

[network]
address = "10.20.0.11:1337"
public_address = "10.20.0.11:1337"

[torii]
address = "10.20.0.11:8080"
```

Utilisez l'adresse attribuée au pair réseau actuel dans `network.address` et `network.public_address`. Chaque pair réseau doit répertorier les mêmes identités de pairs réseau de confiance, mais avec des adresses accessibles depuis sa propre table de routage VPN.

Les configurations du client et de CLI doivent pointer vers un point de terminaison API Torii accessible via le VPN ou via une passerelle interne contrôlée :

```toml
torii_url = "http://10.20.0.11:8080"
```

Si Torii doit être accessible hors du VPN, placez-le derrière un proxy inverse ou un répartiteur de charge qui fournit TLS, l’authentification, la limitation de débit et la journalisation. Évitez d’exposer directement sur Internet les ports pair-à-pair bruts ou les points de terminaison d’administration de l’API.

## Règles de pare-feu {#firewall-rules}

Utilisez les règles de pare-feu de l'hôte et du cloud même lorsqu'un VPN est présent :

|Service|Accès recommandé|
| --- | --- |
|Port pair-à-pair|Accessible uniquement aux autres validateurs du VPN|
| Torii |Backends d'application, opérateurs ou client de confiance VPN plages|
|Métriques et contrôles de santé|Systèmes de surveillance sur le réseau de l'opérateur|
| SSH et administration |Hôte bastion, opérateur privilégié VPN plage, ou processus de rupture d'urgence|
|Sauvegardes et réplication de stockage|Systèmes de sauvegarde sur un réseau privé|

Les règles de refus par défaut sont plus faciles à auditer que les règles d'autorisation larges. Lorsqu'un nouveau pair réseau rejoint le réseau, mettez à jour l'adhésion VPN, la liste d'autorisation du pare-feu et la configuration du pair réseau de confiance Iroha en un seul changement coordonné.

## Liste de contrôle opérationnelle {#operational-checklist}

- Choisissez une implémentation VPN auditée et activement maintenue, telle que WireGuard, IPsec, ou un réseau privé géré approuvé par l'organisation.
- Utilisez des identifiants VPN uniques pour chaque hôte et opérateur. Ne partagez pas les clés VPN entre les validateurs.
- Gardez les identifiants VPN séparés des clés privées Iroha et du matériel de signature de la genèse de la blockchain.
- Surveillez la latence, la perte de paquets, les reconnexions et les changements de route de VPN. Le consensus est sensible à une instabilité réseau prolongée.
- Testez l'efficacité de MTU. La fragmentation des paquets peut ressembler à des défaillances intermittentes du pair réseau ou de Torii.
- Documentez quelles plages du VPN sont autorisées à joindre le réseau pair-à-pair, Torii, les métriques, SSH et les points de terminaison de sauvegarde de l’API.
- Faites pivoter les identifiants VPN lorsqu'un hôte, un compte opérateur ou une organisation quitte le réseau.
- Évitez qu'une seule passerelle VPN soit la seule route entre les validateurs. Prévoyez des passerelles redondantes ou des routes site à site pour les réseaux de production.
- Inclure les pannes VPN dans les exercices de réponse aux incidents afin que les opérateurs sachent quand distinguer une partition réseau d'une panne de processus Iroha.

## Pages liées {#related-pages}

- [Principes de sécurité](/fr/guide/security/security-principles.md)
- [Sécurité opérationnelle](/fr/guide/security/operational-security.md)
- [Clés pour le déploiement réseau](/fr/guide/configure/keys-for-network-deployment.md)
- [Gestion des pairs réseau](/fr/guide/configure/peer-management.md)
- [Référence de configuration des pairs réseau](/fr/reference/peer-config/index.md)
