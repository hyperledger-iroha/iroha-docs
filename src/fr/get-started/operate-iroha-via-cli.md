---
translation_locale: fr
translation_source: /get-started/operate-iroha-via-cli.md
translation_source_hash: ab8f3bf6d2259dc1ea649273e695429a992108b936475b263fe9d1fae59e8766
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Fonctionnement Iroha 3 par le biais CLI {#operate-iroha-3-via-cli}

Le `iroha` binaire est le client de ligne de commande pour Iroha 3. Utilisez-le pour consulter l'état du registre, soumettre des transactions et inspecter les terminaux de l'opérateur.

## 1. Les prérequis {#_1-prerequisites}

D' abord, lancez un réseau local:

- [Lancement Iroha 3](./launch-iroha.md)

Les exemples ci-dessous supposent la configuration client générée à partir du localnet créé dans [Launch Iroha 3 ](./launch-iroha.md):

```bash
./localnet/client.toml
```

## L'installation de base CLI {#_2-basic-cli-setup}

Montrez l'aide du plus haut niveau:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --help
```

Le CLI est organisé en ces groupes de commandement au plus haut niveau:

- `account` pour les raccourcis axés sur le compte
- `tx` pour les aides au niveau des opérations
- `ledger` pour la lecture et l'écriture du registre
- `ops` pour le diagnostic de l'opérateur
- `app` pour les assistants de l'application API
- `contract` pour le déploiement des contrats et les appels
- `tools` pour les services de diagnostic et d'équipement de développement
- `taira` pour les flux de travail orientés vers Taira et Nexus

Le groupe `ledger` contient également des aides à la transaction spécifiques à un domaine tels que `ledger transaction`.

Utilisez `--output-format text` pour la sortie de l'opérateur lisible par l'homme et `--machine` pour le mode d'automatisation strict.

## 3. Essayez le testnet public Taira {#_3-try-the-public-taira-testnet}

Vous pouvez essayer les contrôles Taira en lecture seulement avant d'exécuter un pair local ou de créer un signataire. Ces commandes utilisent des routes publiques Torii JSON et ne dépensent pas de testnet XOR.

Vérifiez l'état de Taira:

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'
```

Liste des domaines publics dans l'espace de données `universal`:

```bash
curl -fsS 'https://taira.sora.org/v1/domains?limit=10' \
  | jq -r '.items[].id'
```

Listez quelques définitions d'actifs et leur offre actuelle:

```bash
curl -fsS 'https://taira.sora.org/v1/assets/definitions?limit=10' \
  | jq -r '.items[] | [.id, .name, .mintable, .total_quantity] | @tsv'
```

Si vous avez le binary `iroha` actuel, utilisez l'aide au diagnostic Taira:

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

Créez `taira.client.toml` uniquement lorsque vous êtes prêt à tester les commandes signées. Voir [Connectez-vous à SORA Nexus Dataspaces](/fr/get-started/sora-nexus-dataspaces.md) pour la configuration, le robinet et le flux canarien. N'exécutez pas de commandes d'écriture contre Taira jusqu'à ce que le compte soit financé avec l'actif des frais du robinet.

Pour tout paiement de frais Taira CLI Par exemple, sauvez l'aide au robinet de [Prenez le testnet XOR sur le Taira](/fr/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) en tant que `taira_faucet_claim.py`, puis la plainte de testnet XOR Tout d'abord:

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle | jq .
python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

Si le puzzle du robinet ou la route de réclamation renvoie `502`, attendez et réessayez. Il s'agit d'un problème de disponibilité du réseau public, pas un signal pour régénérer les clés de compte.

Une fois que le solde est visible, joindre les métadonnées de l'actif des frais pour écrire:

```bash
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

iroha --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  ledger transaction ping --msg "hello from faucet-funded taira"
```

## 4. Les commandes de base du registre {#_4-basic-ledger-commands}

Liste de tous les domaines:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

La création de domaine ordinaire utilise le planificateur d'alias déclaratif; la commande `ledger domain` n'a pas de sous-commande `register`. Préparez une intention `AliasSetupPlanRequestV1` sans secret pour `docs.universal` avec votre service SDK ou d'intégration, puis planifiez-la et appliquez:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml \
  app alias setup plan \
  --intent-file ./docs-domain.intent.json \
  --plan-file ./docs-domain.plan.json

cargo run --bin iroha -- --config ./localnet/client.toml \
  app alias setup apply --plan-file ./docs-domain.plan.json
```

L'intention pin l'espace de données ID, le compte du propriétaire canonique, la durée du bail et la garde des devis courants. Le planificateur vérifie l'état en direct et renvoie le plan atomique exact `EnsureAlias` à soumettre.

Envoyez une simple transaction de ping:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger transaction ping --msg "hello from iroha"
```

Lisez un bloc récent ou abonnez-vous aux événements de blocage:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger blocks 1 --timeout 30s
cargo run --bin iroha -- --config ./localnet/client.toml ledger events block
```

## 5. Commandes de l'opérateur {#_5-operator-commands}

Statut du consensus:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --output-format text ops sumeragi status
```

Récapitulatif de la latence par phase:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --output-format text ops sumeragi phases
```

Disponibilité, collectionneur, arrière-plan RBC et instantané de VRF:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --output-format text ops sumeragi telemetry
```

Parametres de consensus sur la chaîne:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ops sumeragi params
```

## 6. Où aller ensuite? {#_6-where-to-go-next}

- [SDK tutoriels](/fr/guide/tutorials/)
- [points d'extrémité Torii](/fr/reference/torii-endpoints.md)
- [Travailler avec les binaires Iroha](/fr/reference/binaries.md)
- [CLI README](https://github.com/hyperledger-iroha/iroha/blob/main/crates/iroha_cli/README.md)

Pour régénérer une capture d'écran complète de l'aide Markdown à partir du guichet source, exécutez:

```bash
cargo run -p iroha_cli --bin iroha -- tools markdown-help > crates/iroha_cli/CommandLineHelp.md
```
