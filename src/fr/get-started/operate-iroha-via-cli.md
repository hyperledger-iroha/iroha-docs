---
translation_locale: fr
translation_source: /get-started/operate-iroha-via-cli.md
translation_source_hash: c070c86b715b36079a7b6a47de2e31144187d7ebc6309f294a346be61a372660
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Faire fonctionner Iroha 3 via CLI {#operate-iroha-3-via-cli}

Le binaire `iroha` est le client en ligne de commande pour Iroha 3. Utilisez-le pour interroger l'état du registre de la blockchain, soumettre des transactions et inspecter les points de terminaison API de l'opérateur.

## 1. Prérequis {#_1-prerequisites}

Démarrez d'abord un réseau local :

- [Lancer Iroha 3](./launch-iroha.md)

Les exemples ci-dessous supposent la configuration client générée à partir du réseau local créé dans [Lancer Iroha 3](./launch-iroha.md) :

```bash
./localnet/client.toml
```

## 2. Configuration de base CLI {#_2-basic-cli-setup}

Afficher l'aide de niveau supérieur :

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --help
```

Le CLI est organisé en ces groupes de commandement de premier niveau :

- `account` pour les raccourcis orientés compte
- `tx` pour les assistants au niveau des transactions
- `ledger` pour les lectures et écritures sur le registre
- `ops` pour le diagnostic de l'opérateur
- `app` pour les assistants de l'application API
- `contract` pour le déploiement et les appels de contrat
- `tools` pour les diagnostics et les utilitaires pour développeurs
- `taira` pour les flux de travail orientés Taira et Nexus

Le groupe `ledger` contient également des assistants de transaction spécifiques au domaine tels que `ledger transaction`.

Utilisez `--output-format text` pour une sortie opérateur lisible par l'homme et `--machine` pour le mode d'automatisation strict.

## 3. Essayez le Testnet Public Taira {#_3-try-the-public-taira-testnet}

Vous pouvez essayer des vérifications en lecture seule Taira avant d'exécuter un pair réseau local ou de créer un signataire cryptographique. Ces commandes utilisent des routes publiques Torii JSON et ne dépensent pas de XOR sur le testnet.

Vérifier le statut de Taira :

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'
```

Listez les domaines publics dans l'espace de données `universal` :

```bash
curl -fsS 'https://taira.sora.org/v1/domains?limit=10' \
  | jq -r '.items[].id'
```

Listez quelques définitions d'actifs et leur offre actuelle :

```bash
curl -fsS 'https://taira.sora.org/v1/assets/definitions?limit=10' \
  | jq -r '.items[] | [.id, .name, .mintable, .total_quantity] | @tsv'
```

Si vous avez le binaire actuel `iroha`, exécutez l'assistant de diagnostic Taira :

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

Créez `taira.client.toml` uniquement lorsque vous êtes prêt à tester les commandes signées. Consultez [Connecter aux espaces de données SORA Nexus](/fr/get-started/sora-nexus-dataspaces.md) pour la configuration, le service de financement testnet et le flux canari. N'exécutez pas de commandes d'écriture contre Taira tant que le compte n'est pas financé avec l'actif de frais du service de financement testnet.

Pour tout exemple Taira CLI payant, enregistrez l'assistant de service de financement testnet de [Obtenir le Testnet XOR sur Taira](/fr/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) sous `taira_faucet_claim.py`, puis réclamez d'abord le XOR testnet :

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle | jq .
python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

Si le puzzle de service de financement du testnet ou la route de réclamation retourne `502`, patientez et réessayez. Il s'agit d'un problème de disponibilité du testnet public, et non d'un signal pour régénérer les clés du compte.

Après que le solde soit visible, joignez les métadonnées de l'actif de frais aux écritures :

```bash
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

iroha --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  ledger transaction ping --msg "hello from faucet-funded taira"
```

## 4. Commandes de registre de blockchain de base {#_4-basic-ledger-commands}

Listez tous les domaines :

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

La création de domaine ordinaire utilise le planificateur d'alias déclaratif ; la commande `ledger domain` n'a pas de sous-commande `register`. Préparez une intention `AliasSetupPlanRequestV1` sans secret pour `docs.universal` avec votre SDK ou service d'intégration, puis planifiez-la et appliquez-la :

```bash
cargo run --bin iroha -- --config ./localnet/client.toml \
  app alias setup plan \
  --intent-file ./docs-domain.intent.json \
  --plan-file ./docs-domain.plan.json

cargo run --bin iroha -- --config ./localnet/client.toml \
  app alias setup apply --plan-file ./docs-domain.plan.json
```

L'intention fixe l'ID de l'espace de données, le compte propriétaire canonique, la durée du bail et le mécanisme actuel de protection de cotation. Le planificateur vérifie l'état en direct et renvoie le plan atomique exact `EnsureAlias` à soumettre. Ne copiez pas à la main les valeurs de garde d'un autre réseau.

Envoyez une simple transaction ping :

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger transaction ping --msg "hello from iroha"
```

Lisez un bloc récent ou abonnez-vous aux événements de bloc :

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger blocks 1 --timeout 30s
cargo run --bin iroha -- --config ./localnet/client.toml ledger events block
```

## 5. Commandes de l'opérateur {#_5-operator-commands}

Les commandes de l'opérateur de consensus nécessitent une clé d'exécution logicielle autorisée. Gardez-la en dehors de `client.toml` et transmettez explicitement le fichier réservé au propriétaire :

```bash
: "${OPERATOR_KEY_FILE:=./secrets/operator.key}"

cargo run --bin iroha -- \
  --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format text ops sumeragi status
```

File d'attente non autoritaire, pipeline de traitement, élection et diagnostics de voie d'exécution :

```bash
cargo run --bin iroha -- \
  --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format text ops sumeragi diagnostics
```

Certificats de quorum de consensus les plus élevés et verrouillés :

```bash
cargo run --bin iroha -- \
  --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format text ops sumeragi qc
```

Paramètres de consensus sur la chaîne :

```bash
cargo run --bin iroha -- \
  --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format text ops sumeragi params
```

## 6. Où aller ensuite {#_6-where-to-go-next}

- [SDK tutoriels](/fr/guide/tutorials/)
- [Torii API points de terminaison](/fr/reference/torii-endpoints.md)
- [Travailler avec des binaires Iroha](/fr/reference/binaries.md)
- [CLI README](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli/README.md)

Pour régénérer un instantané complet de l’aide en Markdown depuis la copie de travail du code source, exécutez :

```bash
cargo run -p iroha_cli --bin iroha -- tools markdown-help > crates/iroha_cli/CommandLineHelp.md
```
