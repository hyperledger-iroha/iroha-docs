---
translation_locale: fr
translation_source: /cookbook/triggers.md
translation_source_hash: 6c8f436b5a41cf41c0ac37aeed6b6cd8c73009cfcca2fe7f5642cef1ad115e6f
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Les déclencheurs {#triggers}

## Le résultat {#outcome}

Enregistrez un déclencheur d'appel par voie indirecte finie sur Taira, exécutez-le une fois, attendez la finalité appliquée et confirmez sa réussite à partir de l'historique des blocs engagés.

## Conditions préalables {#prerequisites}

- Un signataire financé, `taira.client.toml`, `taira.tx-metadata.json` et `TAIRA_ACCOUNT_ID` de [Connectez-vous à Taira](./connect-to-taira.md).
- Taira autorisation d'enregistrer un déclencheur pour `TAIRA_ACCOUNT_ID` et d'exécuter le déclenchement résultant. Les jetons pertinents sont `CanRegisterTrigger` avec la portée de `authority` et `CanExecuteTrigger` avec la porté de `trigger`.
- Si ces subventions ne sont pas disponibles, utilisez un réseau local généré et son client administrateur. L'autorité déclenchante a également besoin de toutes les autorisations requises par les instructions que le déclencheur exécutera.

```bash
CONFIG=./taira.client.toml
FEE_METADATA=./taira.tx-metadata.json
TRIGGER_ID=cookbook_by_call_log
test -n "$TAIRA_ACCOUNT_ID"
```

## Les étapes {#steps}

### 1. Enregistrer un déclencheur supporté par une instruction {#_1-register-an-instruction-backed-trigger}

`--instructions-stdin` accepte un ensemble d'instructions JSON. Une instruction `Log` garde cet exemple axé sur l'autorisation de déclenchement plutôt que les autorisations d'un deuxième objet de registre.

```bash
printf '%s\n' \
  '[{"Log":{"level":"INFO","message":"cookbook trigger executed"}}]' |
  iroha --config "$CONFIG" \
    --fee-payer authority \
    --metadata "$FEE_METADATA" \
    ledger trigger register \
    --id "$TRIGGER_ID" \
    --instructions-stdin \
    --repeats 3 \
    --authority "$TAIRA_ACCOUNT_ID" \
    --filter execute
```

Le déclencheur peut s'exécuter trois fois au maximum. Son autorité déclarée, et non l'appelant qui se trouve à l'exécution, autorise les instructions à l'intérieur de l'action.

### 2. Inspecter la déclaration avant l'exécution {#_2-inspect-the-declaration-before-execution}

```bash
iroha --config "$CONFIG" ledger trigger get --id "$TRIGGER_ID"
iroha --config "$CONFIG" ledger trigger inspect "$TRIGGER_ID"
```

Confirmez l'autorité I105, le filtre d'exécution, les répétitions restantes et l'instruction unique `Log` avant de dépenser une autre redevance.

### 3. Exécuter et attendre les deux couches. {#_3-execute-and-wait-for-both-layers}

La transaction d'exécution et l'action déclenchante présentent des preuves distinctes. `--wait` attend la finalisation de la transaction appliquée; `--trace` rapporte également les diagnostics d'achèvement du temps d'expérience.

```bash
iroha --config "$CONFIG" \
  --fee-payer authority \
  --metadata "$FEE_METADATA" \
  ledger trigger execute \
  --wait \
  --trace \
  --timeout-ms 60000 \
  "$TRIGGER_ID"
```

Les clients Rust construisent les mêmes deux instructions typées. Ici, `authority` est un signe `AccountId` et `client` comme ce compte:

```rust
use iroha::data_model::{prelude::*, transaction::FeePaymentIntent};

let trigger_id: TriggerId = "cookbook_by_call_log".parse()?;
let action = Action::new(
    vec![Log::new(Level::INFO, "cookbook trigger executed".to_owned()).into()],
    Repeats::Exactly(3),
    authority.clone(),
    ExecuteTriggerEventFilter::new()
        .for_trigger(trigger_id.clone())
        .under_authority(authority),
);
let fee = FeePaymentIntent::authority(Vec::new(), None);

client.submit_blocking(Register::trigger(Trigger::new(trigger_id.clone(), action)), fee.clone())?;
client.submit_blocking(ExecuteTrigger::new(trigger_id), fee)?;
```

## Vérifiez {#verify}

Scanner l'historique des blocs engagés pour la réalisation et inspecter le nombre de répétitions décrementées:

```bash
iroha --config "$CONFIG" ledger trigger completed list \
  --id "$TRIGGER_ID" \
  --outcome success \
  --limit 5

iroha --config "$CONFIG" ledger trigger inspect "$TRIGGER_ID"
```

Le déclencheur doit rester actif avec deux exécutions restantes. Une soumission réussie sans une réalisation réussie du déclenchement n'est pas une vérification suffisante.

## Résolution des problèmes {#troubleshooting}

- L'enregistrement refusé comme non autorisé signifie que le signataire n'a pas `CanRegisterTrigger` pour l'autorité déclarée. L'exécution exige que les `CanExecuteTrigger` - Je ne sais pas.
- Une transaction peut atteindre Applied pendant que l'action déclenchante rapporte une défaillance. Lisez le résultat de la réalisation et l'erreur; vérifiez ensuite les autorisations de l'autorité de déclenchement pour chaque instruction intégrée.
- `trigger not found` peut signifier que l'opération d'enregistrement a été rejetée ou qu'une configuration différente de la chaîne Torii a été utilisée pour l'exécution.
- Lorsque les répétitions atteignent le zéro, l'écriture est un autre privilège. Ne changez pas silencieusement cette recette en déclencheur indéfini.
- Pour le nettoyage, `ledger trigger unregister --id "$TRIGGER_ID"` exige `CanUnregisterTrigger` pour ce déclencheur plus une sélection explicite de frais.

## Sources et documents connexes {#source-and-related-docs}

- [Tests d'intégration du déclencheur de l'appel par défaut sur le commit fixé](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/triggers/by_call_trigger.rs)
- [Tests d'intégration de l'événement et du déclencheur dans le commit fixé](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/events_and_triggers.rs)
- [Exécution de l'instruction de déclenchement à la commande coincée](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_core/src/smartcontracts/isi/triggers/mod.rs)
- [Les déclencheurs ](/fr/blockchain/triggers.md)
- [Exemples de déclencheurs](/fr/blockchain/trigger-examples.md)
- [Les événements](./stream-events.md)
