---
translation_locale: fr
translation_source: /get-started/operate-iroha-via-cli.md
translation_source_hash: 40714a6cd124d4b0342b0f6ecf321f286e714c0e236afd6fd7834c0cf0ad1165
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
---
# Faire fonctionner Iroha 3 via CLI {#operate-iroha-3-via-cli}

Le binaire `iroha` est le client en ligne de commande d'Iroha 3. Utilisez-le pour interroger l'état du registre, soumettre des transactions et inspecter les points d'accès destinés aux opérateurs.

## 1. Prérequis {#_1-prerequisites}

À partir d'une copie de travail d'Iroha à la révision source documentée, générez et démarrez un réseau local de quatre pairs :

```bash
cargo run --bin kagami -- localnet generate --peers 4 --out-dir ./localnet
./localnet/start.sh
```

Les exemples ci-dessous utilisent sa configuration client générée, `./localnet/client.toml`.

## 2. Configuration de base CLI {#_2-basic-cli-setup}

Afficher l'aide de niveau supérieur :

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --help
```

Le CLI est organisé en ces groupes de commandement de premier niveau :

- `account` pour les lectures et modifications de comptes
- `explorer` pour les flux de l'explorateur avec filtres et pagination communs
- `tx` pour l'état des transactions et les utilitaires de transaction
- `ledger` pour les lectures et écritures sur le registre
- `trigger` pour les lectures, écritures et exécutions de déclencheurs
- `ops` pour le diagnostic de l'opérateur
- `app` pour les assistants de l'application API
- `contract` pour les appels et vues de contrats et le débogage local ; déployez avec `kagami contract deploy` ou `musubi deploy`
- `tools` pour les diagnostics et les utilitaires pour développeurs
- `dataspace` pour planifier, appliquer et inspecter une définition d'espace de données
- `taira` pour les diagnostics Taira et l'intégration des comptes
- `offline` pour les encodeurs, rapports et diagnostics hors ligne
- `soracloud` pour les utilitaires de la plateforme applicative Soracloud
- `sccp` pour les lectures, transferts et preuves du protocole interchaînes SORA

Chaque commande soumettant une transaction exige un payeur de frais explicite, par exemple `--fee-payer authority` ; la CLI calcule les frais exacts avant la signature.

Utilisez `--output-format text` pour une sortie opérateur lisible par l'homme et `--machine` pour le mode d'automatisation strict.

## 3. Essayez le Testnet Public Taira {#_3-try-the-public-taira-testnet}

Vous pouvez essayer des vérifications en lecture seule Taira avant d'exécuter un pair réseau local ou de créer un signataire cryptographique. Ces commandes utilisent des routes publiques Torii JSON et ne dépensent pas de XOR sur le testnet.

Vérifier le statut de Taira :

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'
```

Listez les domaines visibles par un lecteur non authentifié :

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

Créez `taira.client.toml` uniquement lorsque vous êtes prêt à tester les commandes signées. Consultez [Se connecter aux espaces de données SORA Nexus](/fr/get-started/sora-nexus-dataspaces.md) pour la configuration, le faucet et les tests élémentaires. N'exécutez pas de commandes d'écriture sur Taira tant que le compte n'a pas été alimenté avec l'actif de frais du faucet.

Pour tout exemple de CLI Taira soumis à des frais, alimentez le compte signataire avec la procédure de faucet décrite dans [Obtenir des XOR de test sur Taira](/fr/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira), puis vérifiez le solde :

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET="$(
  curl -fsS https://taira.sora.org/v1/accounts/faucet/policy \
    | jq -er '.asset_definition_id'
)"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

Si une route du faucet renvoie `502`, attendez et réessayez. Cela indique un problème de disponibilité du testnet public, pas la nécessité de régénérer les clés du compte.

Une fois le solde visible, soumettez les écritures avec `--fee-payer authority`. La CLI calcule les frais exacts, dans l'actif de frais de Taira, avant la signature :

```bash
iroha --config ./taira.client.toml \
  --fee-payer authority \
  tx ping --msg "hello from faucet-funded taira"
```

## 4. Commandes de registre de blockchain de base {#_4-basic-ledger-commands}

Listez tous les domaines :

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list --all
```

La création de domaine ordinaire utilise le planificateur d'alias déclaratif ; la commande `ledger domain` n'a pas de sous-commande `register`. Préparez une intention `AliasSetupPlanRequestV1` sans secret pour `docs.universal` avec votre SDK ou service d'intégration, puis planifiez-la et appliquez-la :

```bash
cargo run --bin iroha -- --config ./localnet/client.toml \
  app alias setup plan \
  --intent-file ./docs-domain.intent.json \
  --plan-file ./docs-domain.plan.json

cargo run --bin iroha -- --config ./localnet/client.toml --fee-payer authority \
  app alias setup apply --plan-file ./docs-domain.plan.json
```

L'intention fixe l'identifiant de l'espace de données, le compte propriétaire canonique, la durée du bail et la condition de contrôle du devis actuel. Le planificateur vérifie l'état actif et renvoie le plan atomique `EnsureAlias` exact à soumettre. Ne recopiez pas manuellement les valeurs de contrôle d'un autre réseau.

Envoyez une simple transaction ping :

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --fee-payer authority tx ping --msg "hello from iroha"
```

Lisez un bloc récent ou abonnez-vous aux événements de bloc :

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger blocks 1 --timeout 30s
cargo run --bin iroha -- --config ./localnet/client.toml ledger events block
```

## 5. Commandes de l'opérateur {#_5-operator-commands}

Les commandes d'exploitation du consensus exigent une clé d'exécution figurant sur la liste d'autorisation. Gardez-la hors de `client.toml` et fournissez le chemin absolu de son fichier accessible au seul propriétaire :

```bash
# The generated localnet writes its allow-listed operator key here.
: "${OPERATOR_KEY_FILE:=$PWD/localnet/runtime/operator-signer.key}"

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

Voies de consensus inscrites dans l'état validé et état de l'instance de ce nœud :

```bash
cargo run --bin iroha -- \
  --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format text ops sumeragi lanes
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
- [Points d’accès Torii](/fr/reference/torii-endpoints.md)
- [Travailler avec des binaires Iroha](/fr/reference/binaries.md)
- [CLI README](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_cli/README.md)

Pour afficher l'aide complète au format Markdown depuis la copie de travail des sources, exécutez :

```bash
cargo run -p iroha_cli --bin iroha -- tools markdown-help > iroha-cli-help.md
```
