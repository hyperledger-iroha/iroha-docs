---
translation_locale: fr
translation_source: /help/integration-issues.md
translation_source_hash: f9f8a1e5f8c66714532523ef40467d3e79d4d023b3b353244f0317647e755b38
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Troubleshooting des problèmes d'intégration {#troubleshooting-integration-issues}

Cette section propose des conseils de dépannage pour l'intégration Iroha 3. Si le problème que vous rencontrez n'est pas décrit ici, contactez-nous via [Telegram](https://t.me/hyperledgeriroha).

## Le client ne peut pas se connecter {#client-cannot-connect}

Vérifiez que la configuration du client pointe vers l'adresse Torii de son homologue:

```toml
torii_url = "http://127.0.0.1:8080/"
```

Pour les contrôles CLI, passez explicitement le même dossier:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

Si le pair fonctionne dans Docker ou Kubernetes, utilisez l'adresse hôte ou service accessible à partir du processus client. `127.0.0.1` à l'intérieur d'un conteneur n'est pas la machine hôte.

Pour les essais publics Taira, commencez par une sonde d'extrémité non signée:

```bash
curl -fsS https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -fsS 'https://taira.sora.org/v1/domains?limit=5' \
  | jq -r '.items[].id'
```

Si ces commandes échouent avec `502`, TLS, DNS ou des erreurs de délais, corrigez l'accessibilité du réseau ou attendez le point d'extrémité du testnet public avant de débogager les clés de compte ou les charges utiles des transactions.

## Les transactions sont rejetées {#transactions-are-rejected}

La plupart des échecs de transaction sont causés par un défaut d'identité ou d'autorisation:

- La clé publique du compte dans la configuration du client ne correspond pas à la clé privée utilisée pour signer.
- le compte n'est pas enregistré dans la génèse ou par une transaction antérieure
- Le compte ne dispose pas du jeton d'autorisation ou du rôle requis par le validateur de l'exécution.
- un domaine ID manque de sa qualification d'espace de données, tel que `domain.dataspace`

Utilisez `--output-format text` lors de la débogage des commandes CLI pour que les erreurs soient plus faciles à lire:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --output-format text ledger transaction ping --msg "hello"
```

## Les requêtes renvoient des résultats vides {#queries-return-empty-results}

Les résultats de requête vides ne signifient pas toujours l'échec de la requête.

- l'opération qui devrait créer l'objet a été engagée
- le domaine demandé, la définition des actifs ou le compte ID est canonique;
- la pagination ou les filtres n'excluent pas la ligne attendue
- le client est connecté au réseau prévu, et non à un autre localnet

Pour les contrôles de domaine, commencez par la requête la plus large:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

## Les flux d' événements ou de blocs s' arrêtent plus tôt {#event-or-block-streams-stop-early}

Les exemples de flux de blocs et d'événements s'appuient sur les terminaux de streaming Torii. Vérifiez que le pair est toujours en cours d'exécution, puis testez avec un délai:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger blocks 1 --timeout 30s
cargo run --bin iroha -- --config ./localnet/client.toml ledger events block
```

Pour les intégrations HTTP, comparez vos chemins de point d'extrémité avec la référence actuelle [Torii du point d'Extrémité ](/fr/reference/torii-endpoints.md).
