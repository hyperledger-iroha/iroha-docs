---
translation_locale: fr
translation_source: /cookbook/triggers.md
translation_source_hash: 946309958fe4e23a7454206b1eb4557f8e853171ce4e04d5373cb36f46b13970
translation_status: machine-validated
translation_engine: bing-translator-llm+claude-opus-5-5
---

# Déclencheurs {#triggers}

## Résultat {#outcome}

Enregistrez un déclencheur à appel fini sur Taira, exécutez-le une fois, attendez la finalité appliquée, et confirmez son achèvement réussi à partir de l'historique des blocs validés.

## Prérequis {#prerequisites}

- Un signataire cryptographique financé, `taira.client.toml` et `TAIRA_ACCOUNT_ID` de [Connectez-vous à Taira](./connect-to-taira.md). Les écritures utilisent `--fee-payer authority` ; le CLI établit le devis exact des frais, dans l'actif de frais de Taira, avant la signature.
- Taira autorisation d'enregistrer un déclencheur pour `TAIRA_ACCOUNT_ID` et d'exécuter le déclencheur résultant. Les jetons pertinents sont `CanRegisterTrigger` soumis à `authority` et `CanExecuteTrigger` soumis à `trigger`.
- Si ces subventions ne sont pas disponibles, utilisez un réseau local généré et son client administrateur. Le principal d'autorisation du déclencheur a également besoin de toutes les autorisations requises par les instructions que le déclencheur exécutera.

```bash
CONFIG=./taira.client.toml
TRIGGER_ID=cookbook_by_call_log
test -n "$TAIRA_ACCOUNT_ID"
```

## Étapes {#steps}

### 1. Enregistrer un déclencheur basé sur une instruction {#_1-register-an-instruction-backed-trigger}

`--instructions-stdin` accepte le tableau JSON d'instructions qu'imprime `--emit-instructions`. `tx ping` émet une instruction `Log`, ce qui maintient cet exemple centré sur l'autorisation du déclencheur plutôt que sur les permissions d'un deuxième objet de registre blockchain.

```bash
iroha --config "$CONFIG" --emit-instructions \
  tx ping --log-level INFO --msg 'cookbook trigger executed' |
  iroha --config "$CONFIG" \
    --fee-payer authority \
    trigger register \
    --id "$TRIGGER_ID" \
    --instructions-stdin \
    --repeats 3 \
    --authority "$TAIRA_ACCOUNT_ID" \
    --filter execute
```

Le déclencheur peut s'exécuter au maximum trois fois. Son principal d'autorisation déclaré, et non l'appelant qui se trouve à l'exécuter, autorise les instructions à l'intérieur de l'action.

### 2. Inspecter la déclaration avant l'exécution {#_2-inspect-the-declaration-before-execution}

```bash
iroha --config "$CONFIG" trigger get --id "$TRIGGER_ID"
iroha --config "$CONFIG" trigger inspect "$TRIGGER_ID"
```

Confirmez le principal d'autorisation I105, le filtre d'exécution, les répétitions restantes et l'instruction encodée unique dans `executable` avant de dépenser d'autres frais.

### 3. Exécutez et attendez que les deux couches soient terminées {#_3-execute-and-wait-for-both-layers}

La transaction d'exécution et l'action de déclenchement ont des preuves distinctes. `--wait` attend la finalité de la transaction appliquée ; `--trace` rapporte également les diagnostics de fin d'exécution du logiciel.

```bash
iroha --config "$CONFIG" \
  --fee-payer authority \
  trigger execute \
  --wait \
  --trace \
  --timeout-ms 60000 \
  "$TRIGGER_ID"
```

Les clients Rust construisent les deux mêmes instructions typées. Ici, `authority` est un `AccountId`, et `client` est un `iroha::blocking::Client` qui signe en tant que ce compte ; `submit` attend la finalité appliquée :

```rust
use iroha::data_model::{prelude::*, transaction::FeePaymentIntent};

let trigger_id: TriggerId = "cookbook_by_call_log".parse()?;
let action = Action::new(
    vec![Log::new(Level::INFO, "cookbook trigger executed".to_owned())],
    Repeats::Exactly(3),
    authority.clone(),
    ExecuteTriggerEventFilter::new()
        .for_trigger(trigger_id.clone())
        .under_authority(authority),
)?;
let fee = FeePaymentIntent::authority(Vec::new(), None);

client.submit(Register::trigger(Trigger::new(trigger_id.clone(), action)), fee.clone())?;
client.submit(ExecuteTrigger::new(trigger_id), fee)?;
```

## Vérifier {#verify}

Analysez l'historique des blocs validés pour l'achèvement et examinez le nombre de répétitions décrémenté :

```bash
iroha --config "$CONFIG" trigger completed list \
  --id "$TRIGGER_ID" \
  --outcome success \
  --limit 5

iroha --config "$CONFIG" trigger inspect "$TRIGGER_ID"
```

Au moins une réalisation doit signaler le succès. Le déclencheur doit rester actif avec deux exécutions restantes. Une soumission réussie sans une réalisation réussie du déclencheur ne constitue pas une vérification suffisante.

## Dépannage {#troubleshooting}

- Inscription rejetée car non autorisée signifie que le signataire cryptographique ne dispose pas de `CanRegisterTrigger` pour le principal d'autorisation déclaré. L'exécution nécessite le jeton `CanExecuteTrigger` à portée séparée.
- Une transaction peut atteindre Appliqué tandis que l'action du déclencheur signale un échec. Lisez le résultat de l'exécution et l'erreur ; puis vérifiez les autorisations du principal de l'autorisation du déclencheur pour chaque instruction intégrée.
- `Trigger with id … not found` peut signifier que la transaction d'enregistrement a été rejetée ou qu'une configuration différente Torii/chaîne a été utilisée pour l'exécution.
- Lorsque les répétitions atteignent zéro, émettre plus de répétitions constitue une autre écriture privilégiée. Ne changez pas silencieusement cette recette en un déclencheur indéfini.
- Pour le nettoyage, `trigger unregister --id "$TRIGGER_ID"` nécessite `CanUnregisterTrigger` pour ce déclencheur ainsi qu'une sélection explicite des frais.

## Source et documents connexes {#source-and-related-docs}

- [Tests d'intégration de déclenchement à la demande sur le commit épinglé](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/triggers/by_call_trigger.rs)
- [Tests d'intégration des événements et des déclencheurs au commit épinglé](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/events_and_triggers.rs)
- [Déclencher l'exécution de l'instruction au commit épinglé](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_core/src/smartcontracts/isi/triggers/mod.rs)
- [Déclencheurs](/fr/blockchain/triggers.md)
- [Exemples de déclencheurs](/fr/blockchain/trigger-examples.md)
- [Événements](./stream-events.md)
