---
translation_locale: fr
translation_source: /help/integration-issues.md
translation_source_hash: c5f169e423806fa2a9e9d198971588d1aa0b199a28d64e8b089b9f81727550a5
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Résolution des problèmes d'intégration {#troubleshooting-integration-issues}

Cette section offre des conseils de dépannage pour l'intégration de Iroha 3. Si le problème que vous rencontrez n'est pas décrit ici, contactez-nous via [Télégramme](https://t.me/hyperledgeriroha).

## Le client ne peut pas se connecter {#client-cannot-connect}

Vérifiez que la configuration du client pointe vers l'adresse Torii du pair réseau :

```toml
torii_url = "http://127.0.0.1:8080/"
```

Pour les vérifications CLI, passez explicitement le même fichier :

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

Si le pair réseau fonctionne dans Docker ou Kubernetes, utilisez l'adresse de l'hôte ou du service qui est accessible depuis le processus client. `127.0.0.1` à l'intérieur d'un conteneur n'est pas la machine hôte.

Pour les tests publics Taira, commencez par une sonde de point de terminaison API non signée :

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -fsS 'https://taira.sora.org/v1/domains?limit=5' \
  | jq -r '.items[].id'
```

Si ces commandes échouent avec les erreurs `502`, TLS, DNS ou de dépassement de délai, corrigez l'accessibilité du réseau ou attendez le point de terminaison API du testnet public avant de déboguer les clés de compte ou les charges utiles des transactions.

## Les transactions sont rejetées {#transactions-are-rejected}

La plupart des échecs de transaction sont causés par une incompatibilité d'identité ou d'autorisation :

- la clé publique du compte dans la configuration du client ne correspond pas à la clé privée utilisée pour la signature
- le compte n'est pas enregistré dans le génésis de la blockchain ni par une transaction antérieure
- le compte ne dispose pas du jeton de permission ou du rôle requis par le validateur d'exécution du logiciel
- un identifiant de domaine manque de sa qualification d’espace de données, comme `domain.dataspace`

Utilisez `--output-format text` lors du débogage des commandes CLI afin que les erreurs soient plus faciles à lire :

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --output-format text ledger transaction ping --msg "hello"
```

## Les requêtes renvoient des résultats vides {#queries-return-empty-results}

Des résultats de requête vides ne signifient pas toujours que la requête a échoué. Vérifiez :

- la transaction qui devrait créer l'objet a été validée
- le domaine interrogé, la définition de l'actif ou l'ID de compte est canonique
- la pagination ou les filtres n'excluent pas la ligne attendue
- le client est connecté au réseau prévu, et non à un autre réseau local

Pour les vérifications de domaine, commencez par la requête la plus large :

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

## Les flux d’événements ou de blocs s’arrêtent prématurément {#event-or-block-streams-stop-early}

Les exemples de flux de blocs et d'événements dépendent des points de terminaison de streaming Torii API. Vérifiez que le pair réseau fonctionne toujours, puis testez avec un délai d'attente :

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger blocks 1 --timeout 30s
cargo run --bin iroha -- --config ./localnet/client.toml ledger events block
```

Pour les intégrations HTTP, comparez vos chemins d'endpoint API avec le [Torii API référence de point de terminaison](/fr/reference/torii-endpoints.md) actuel.
