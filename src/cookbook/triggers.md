# Triggers

## Outcome

Register a finite by-call trigger on Taira, execute it once, wait for
Applied finality, and confirm its successful completion from committed
block history.

## Prerequisites

- A funded signer, `taira.client.toml`, and `TAIRA_ACCOUNT_ID` from
  [Connect to Taira](./connect-to-taira.md). Writes use
  `--fee-payer authority`; the CLI quotes the exact fee, in Taira's fee
  asset, before signing.
- Taira permission to register a trigger for `TAIRA_ACCOUNT_ID` and execute
  the resulting trigger. The relevant tokens are `CanRegisterTrigger`
  scoped by `authority` and `CanExecuteTrigger` scoped by `trigger`.
- If those grants are unavailable, use a generated local network and its
  administrator client. The trigger authority also needs every permission
  required by the instructions the trigger will execute.

```bash
CONFIG=./taira.client.toml
TRIGGER_ID=cookbook_by_call_log
test -n "$TAIRA_ACCOUNT_ID"
```

## Steps

### 1. Register an instruction-backed trigger

`--instructions-stdin` accepts the JSON instruction array that
`--emit-instructions` prints. `tx ping` emits one `Log` instruction, which
keeps this example focused on trigger authorization rather than a second
ledger object's permissions.

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

The trigger can run at most three times. Its declared authority, not the
caller that happens to execute it, authorizes the instructions inside the
action.

### 2. Inspect the declaration before execution

```bash
iroha --config "$CONFIG" trigger get --id "$TRIGGER_ID"
iroha --config "$CONFIG" trigger inspect "$TRIGGER_ID"
```

Confirm the I105 authority, the execute filter, the remaining repetitions,
and the single encoded instruction in `executable` before spending another
fee.

### 3. Execute and wait for both layers

The execution transaction and the trigger action have distinct evidence.
`--wait` waits for Applied transaction finality; `--trace` also reports
runtime completion diagnostics.

```bash
iroha --config "$CONFIG" \
  --fee-payer authority \
  trigger execute \
  --wait \
  --trace \
  --timeout-ms 60000 \
  "$TRIGGER_ID"
```

Rust clients build the same two typed instructions. Here `authority` is an
`AccountId`, and `client` is an `iroha::blocking::Client` that signs as
that account; `submit` waits for Applied finality:

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

## Verify

Scan committed block history for the completion and inspect the decremented
repetition count:

```bash
iroha --config "$CONFIG" trigger completed list \
  --id "$TRIGGER_ID" \
  --outcome success \
  --limit 5

iroha --config "$CONFIG" trigger inspect "$TRIGGER_ID"
```

At least one completion must report success. The trigger must remain active
with two executions left. A successful submission without a successful
trigger completion is not sufficient verification.

## Troubleshooting

- Registration rejected as not permitted means the signer lacks
  `CanRegisterTrigger` for the declared authority. Execution requires the
  separately scoped `CanExecuteTrigger` token.
- A transaction can reach Applied while the trigger action reports failure.
  Read the completion outcome and error; then check the trigger authority's
  permissions for every embedded instruction.
- `Trigger with id … not found` can mean the registration transaction was
  rejected or a different Torii/chain configuration was used for execution.
- When repetitions reach zero, minting more repetitions is another
  privileged write. Do not silently change this recipe to an indefinite
  trigger.
- For cleanup, `trigger unregister --id "$TRIGGER_ID"` requires
  `CanUnregisterTrigger` for that trigger plus explicit fee selection.

## Source and related docs

- [By-call trigger integration tests at the pinned commit](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/triggers/by_call_trigger.rs)
- [Event and trigger integration tests at the pinned commit](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/events_and_triggers.rs)
- [Trigger instruction execution at the pinned commit](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_core/src/smartcontracts/isi/triggers/mod.rs)
- [Triggers](/blockchain/triggers.md)
- [Trigger examples](/blockchain/trigger-examples.md)
- [Events](./stream-events.md)
