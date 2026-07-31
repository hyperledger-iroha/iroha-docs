---
translation_locale: fr
translation_source: /help/integration-issues.md
translation_source_hash: f9f8a1e5f8c66714532523ef40467d3e79d4d023b3b353244f0317647e755b38
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Troubleshooting des problèmes d'intégration {#troubleshooting-integration-issues}

Cette section offre des conseils de résolution des problèmes pour Iroha 3 l'intégration.
Ce que vous expérimentez n'est pas décrit ici,
communiquer avec nous via [Télégramme](https://t.me/hyperledgeriroha).

## Le client ne peut pas se connecter {#client-cannot-connect}

Vérifiez que la configuration du client pointe vers celle des pairs Torii adresse:

```toml
torii_url = "http://127.0.0.1:8080/"
```

Pour CLI les contrôles, transmettent explicitement le même dossier:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

Si le paire arrive Docker ou Kubernetes, utilisez l'adresse de l'hôte ou du service qui
est accessible à partir du processus client. `127.0.0.1` à l'intérieur d'un conteneur n'est pas
la machine hôte.

Pour le public Taira les essais commencent par une sonde de point final non signée:

```bash
curl -fsS https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -fsS 'https://taira.sora.org/v1/domains?limit=5' \
  | jq -r '.items[].id'
```

Si ces commandes échouent avec `502`, TLS, DNS, ou des erreurs de temps d'arrêt, réparer le réseau
accès ou attendre le point final du réseau de test public avant de débogager le compte
clés ou charges utiles de transaction.

## Les transactions sont rejetées {#transactions-are-rejected}

La plupart des échecs de transaction sont causés par un désaccord d'identité ou d'autorisation:

- La clé publique du compte dans la configuration client ne correspond pas à la clé privée
  utilisé pour la signature
- le compte n'est pas enregistré en génèse ou par une transaction antérieure
- le compte ne dispose pas du jeton d'autorisation ou du rôle requis par l'exécution
  le validateur
- un domaine ID manque de sa qualification en matière d'espace de données, comme
  `domain.dataspace`

Utilisation `--output-format text` tout en débogage CLI commandes pour que les erreurs soient plus faciles
à lire:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --output-format text ledger transaction ping --msg "hello"
```

## Les requêtes renvoient des résultats vides {#queries-return-empty-results}

Les résultats de requête vides ne signifient pas toujours que la requête a échoué.

- la transaction qui devrait créer l'objet a été engagée
- le domaine demandé, la définition des actifs ou le compte ID est canonique
- la pagination ou les filtres n'excluent pas la ligne attendue
- le client est connecté au réseau prévu et non à un autre localnet

Pour les contrôles de domaine, commencez par la requête la plus large:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

## Les flux d' événements ou de blocages s' arrêtent plus tôt {#event-or-block-streams-stop-early}

Les exemples de flux de blocs et d'événements reposent sur Torii les points d'extrémité de streaming.
Peer est toujours en cours d'exécution, puis testez avec un délai:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger blocks 1 --timeout 30s
cargo run --bin iroha -- --config ./localnet/client.toml ledger events block
```

Pour HTTP les intégrations, comparer vos chemins de point final avec le courant
[Torii point de référence final](/fr/reference/torii-endpoints.md).
