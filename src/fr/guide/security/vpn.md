---
translation_locale: fr
translation_source: /guide/security/vpn.md
translation_source_hash: 4161cec5d601ad3a57decc19402738358a03648adad8502b5282e8e9bacc3fa8
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Les réseaux privés virtuels {#virtual-private-networks}

Un <abbr title="Virtual Private Network">VPN</abbr> est un contrôle réseau qui limite ceux qui peuvent accéder aux services Iroha. Il est le plus utile pour les déploiements privés et de consortiums où les validateurs, les backends d'applications et les opérateurs doivent communiquer via des adresses privées au lieu de routes Internet ouvertes.

Un VPN ne remplace pas les clés de pair Iroha, les clés du compte, les autorisations, les règles du pare-feu, la surveillance ou le stockage sécurisé des clés. le VPN réduit l'accessibilité du réseau, tandis que la configuration et la gouvernance de Iroha décident des pairs et comptes à qui on peut faire confiance.

## Quand utiliser un VPN {#when-to-use-a-vpn}

Utilisez un VPN lorsque:

- Les validateurs sont exploités par différentes organisations ou dans différents environnements d'hébergement.
- Torii ne devrait être accessible qu'aux backends, aux opérateurs ou aux clients de confiance des applications.
- Les données métriques, les journaux, SSH ou autres points finaux d'administration doivent rester sur un réseau d'opérateur privé.
- un réseau d'essai ou de mise en scène doit ressembler à des contrôles d'accès à la production sans exposer les terminaux publics

Un VPN n'est pas nécessaire pour chaque déploiement. Les réseaux publics peuvent intentionnellement exposer Torii via une passerelle publique, un équilibreur de charge ou un proxy inverse. Même dans ce cas, gardez les points d'arrêt du trafic et de l'administration des validateurs peer-to-peer sur un réseau restreint autant que possible.

::: astuce

Un navigateur VPN ne protège que le trafic de ce navigateur. Il ne protège pas `irohad`, CLI, SDK, SSH, les métriques ou le trafic de sauvegarde à moins que ces processus ne soient routés par le même réseau privé.

:::

## Le modèle de déploiement {#deployment-pattern}

Pour un réseau de validateurs privés, donnez à chaque validateur une adresse stable VPN ou un nom privé DNS. Configurez les pairs afin que leurs adresses peer-to-peer annoncées soient accessibles par les autres validateurs sur ce réseau:

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

Utilisez l'adresse attribuée au paire actuel dans `network.address` et `network.public_address`. Chaque paire doit énumérer les mêmes identités de pairs fiables, mais avec des adresses accessibles à partir de sa propre table d'itinéraires VPN.

Les configurations client et CLI doivent être dirigées vers un point d'extrémité Torii accessible par l'intermédiaire du VPN ou d'une passerelle interne contrôlée:

```toml
torii_url = "http://10.20.0.11:8080"
```

Si Torii doit être disponible en dehors du VPN, mettez-le derrière un proxy inverse ou un équilibreur de charge qui fournit TLS, l'authentification, la limitation des tarifs et le dépistage. Évitez d'exposer directement les ports peer-to-peer ou les terminaux d'administration à Internet public.

## Règles de pare-feu {#firewall-rules}

Utilisez les règles d'hébergement et de pare-feu en nuage même lorsqu'un VPN est présent:

|Service |Accès recommandé |
| --- | --- |
|Port de pair à pair |Autres adresses de validateur VPN uniquement |
|Torii |Les arrière-plan d'application, les opérateurs ou les clients de confiance VPN |
|Mesures et contrôles de santé |Systèmes de surveillance sur le réseau des opérateurs |
|SSH et l'administration |L'hôte bastion, l'opérateur privilégié VPN ou le processus de rupture du verre |
|Des sauvegardes et des répliques de stockage |Les systèmes de sauvegarde sur un réseau privé |

Les règles de refus par défaut sont plus faciles à vérifier que les règles générales d'autorisation. Lorsqu'un nouveau paire rejoint le réseau, mettez à jour l'adhésion VPN, la liste des autorisations du pare-feu et la configuration de paires de confiance Iroha en tant que changement coordonné.

## Liste de contrôle opérationnelle {#operational-checklist}

- Choisissez une mise en œuvre VPN vérifiée et maintenue activement, telle que WireGuard, IPsec ou un réseau privé géré approuvé par l'organisation.
- Utilisez des identifiants VPN uniques pour chaque hôte et opérateur. Ne partagez pas les clés VPN entre les validateurs.
- Gardez les identifiants VPN distincts des clés privées Iroha et du matériel de signature de la génèse.
- Surveiller VPN la latence, la perte de paquets, les reconnections et les changements de route.
- Testez l'efficacité MTU. La fragmentation des paquets peut ressembler à des défaillances intermittentes ou Torii.
- Document dans lequel les intervalles VPN sont autorisés à atteindre des points de repère par rapport aux autres, Torii, des mesures, SSH et des points d'extrémité de sauvegarde.
- Retourner les identifiants VPN lorsqu'un hébergeur, un compte d'opérateur ou une organisation quitte le réseau.
- Évitez une seule passerelle VPN comme unique route entre les validateurs.
- Incluez des défaillances VPN dans les exercices de réponse aux incidents afin que les opérateurs sachent quand distinguer une partition réseau d'une défaillance du processus Iroha.

## Pages connexes {#related-pages}

- [Principaux de sécurité](/fr/guide/security/security-principles.md)
- [Sécurité opérationnelle ](/fr/guide/security/operational-security.md)
- [Les clés pour le déploiement du réseau ](/fr/guide/configure/keys-for-network-deployment.md)
- [Gestion par les pairs ](/fr/guide/configure/peer-management.md)
- [Références pour la configuration par les pairs ](/fr/reference/peer-config/index.md)
