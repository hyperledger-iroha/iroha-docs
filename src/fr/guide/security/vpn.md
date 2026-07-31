---
translation_locale: fr
translation_source: /guide/security/vpn.md
translation_source_hash: 4161cec5d601ad3a57decc19402738358a03648adad8502b5282e8e9bacc3fa8
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Réseaux privés virtuels {#virtual-private-networks}

Une <abbr title="Virtual Private Network">VPN</abbr> est un contrôle de réseau qui
les limites à atteindre Iroha Il est particulièrement utile pour les services privés et
déploiements de consortium dans lesquels des validateurs, des backends d'applications et des opérateurs
devraient communiquer par des adresses privées au lieu de lignes Internet ouvertes.

Une VPN ne remplace pas Iroha clés de pair, clés de compte, autorisations, pare-feu
Les règles, la surveillance ou le stockage sécurisé des clés.
limite de déploiement: VPN réduit l'accessibilité du réseau, tandis que Iroha
la configuration et la gouvernance décident de quels pairs et comptes sont fiables.

## Quand utiliser un VPN {#when-to-use-a-vpn}

Utilisez un VPN lorsque:

- Les validateurs sont exploités par des organisations différentes ou dans un hébergement différent.
  environnements
- Torii ne devrait être accessible que par les backends des applications, les opérateurs ou les utilisateurs fiables
  clients
- les statistiques, les journaux, SSH, ou d'autres endpoints administratifs doivent rester sur un
  réseau d'opérateur
- un réseau d'essai ou de mise en scène doit ressembler à des contrôles d'accès à la production sans
  exposant les points finaux publics

Une VPN Les réseaux publics peuvent délibérément
exposer Torii par une passerelle publique, un équilibreur de charge ou un proxy inverse.
dans ce cas, conserver les points d'extrémité de trafic et d'administration des validateurs sur un
réseau restreint chaque fois que cela est possible.

::: tip

Un navigateur VPN ne protège que le trafic de ce navigateur.
`irohad`, CLI, SDK, SSH, les mesures ou le trafic de sauvegarde, à moins que ces processus ne soient
Envoyé par le même réseau privé.

:::

## Modèle de déploiement {#deployment-pattern}

Pour un filet de validateur privé, donnez à chaque validateur une stable VPN adresse ou
privé DNS Configurer les pairs afin que leurs adresses publicitaires de pair à pair soient
accessibles par les autres validateurs sur ce réseau:

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

Utilisez l' adresse attribuée à la paire actuelle dans `network.address` et
`network.public_address`. Chaque paire devrait énumérer les mêmes identités de pairs de confiance,
mais avec des adresses accessibles à partir de son propre VPN la table de route.

Le client et CLI les configurations doivent indiquer une Torii point final accessible à travers
le VPN ou par une passerelle interne contrôlée:

```toml
torii_url = "http://10.20.0.11:8080"
```

Si Torii Il doit être disponible en dehors du VPN, le mettre derrière un proxy inverse ou
équilibre de charge qui fournit TLS, l'authentification, la limitation des tarifs et le dépistage.
Évitez d'exposer directement les ports ou les points finaux d'administration crus à la
Internet public.

## Règles de pare-feu {#firewall-rules}

Utilisez les règles de pare-feu d' hôte et de cloud même lorsque vous VPN est présent:

| Service | Accès recommandé |
| --- | --- |
| Port de pair à pair | Autres validateurs VPN adresses uniquement |
| Torii | Les arrière-plan d'application, les opérateurs ou le client de confiance VPN rangées |
| Mesures et contrôles de santé | Systèmes de surveillance sur le réseau des opérateurs |
| SSH et administration | Hôte bastion, opérateur privilégié VPN la gamme ou le procédé de rupture du verre |
| Les sauvegardes et la réplication du stockage | Systèmes de sauvegarde sur un réseau privé |

Les règles de refus par défaut sont plus faciles à vérifier que les règles générales d'autorisation.
s'inscrit dans le réseau, met à jour le VPN membres, liste d'autorisations du pare-feu et Iroha
la configuration des pairs de confiance en tant que changement coordonné.

## Liste de contrôle opérationnelle {#operational-checklist}

- Choisissez une entreprise vérifiée et activement entretenue VPN mise en œuvre, telles que
  WireGuard, IPsec, ou un réseau privé géré approuvé par l'organisation.
- Utilisation unique VPN les informations d'identification pour chaque hôte et opérateur. VPN les clés
  entre les validateurs.
- Restez VPN les informations d'identification séparées de Iroha clés privées et signature de la génèse
  le matériel.
- Moniteur VPN la latence, la perte de paquets, les reconnections et les changements de route.
  sensibles à une instabilité du réseau soutenue.
- Testez l'efficacité MTU. La fragmentation des paquets peut ressembler à une peer intermittente
  ou Torii Des échecs.
- Document qui VPN les intervalles sont autorisés à atteindre un niveau de peer-to-peer, Torii, les mesures,
  SSH, et des points d'arrêt de secours.
- Retour VPN les informations d'identification lorsqu'un hôte, un compte d'opérateur ou une organisation part
  le réseau.
- Évitez une seule VPN La seule voie entre les validateurs est la passerelle.
  des passerelles ou des itinéraires de site à site redondants pour les réseaux de production.
- Incluent VPN les défaillances dans les exercices de réponse aux incidents afin que les opérateurs sachent quand
  distinguer une partition réseau d'une Iroha défaillance du processus.

## Pages connexes {#related-pages}

- [Principes de sécurité](/fr/guide/security/security-principles.md)
- [Sécurité opérationnelle](/fr/guide/security/operational-security.md)
- [Les clés du déploiement des réseaux](/fr/guide/configure/keys-for-network-deployment.md)
- [Gestion par les pairs](/fr/guide/configure/peer-management.md)
- [Références pour la configuration par les pairs](/fr/reference/peer-config/index.md)
