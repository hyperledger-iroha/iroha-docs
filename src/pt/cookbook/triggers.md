---
translation_locale: pt
translation_source: /cookbook/triggers.md
translation_source_hash: 6c8f436b5a41cf41c0ac37aeed6b6cd8c73009cfcca2fe7f5642cef1ad115e6f
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Trigas {#triggers}

## Resultados {#outcome}

Registre um gatilho de chamada final no Taira, execute-o uma vez, espere a finalidade aplicada e confirme sua conclusão bem sucedida do histórico de blocos comprometidos.

## Pré-requisitos {#prerequisites}

- Um assinante financiado, `taira.client.toml`, `taira.tx-metadata.json`, e `TAIRA_ACCOUNT_ID` de [Conectar-se a Taira](./connect-to-taira.md).
- Taira Permissão para registrar um gatilho para `TAIRA_ACCOUNT_ID` E executar o gatilho resultante. `CanRegisterTrigger` abrangidos por: `authority` e `CanExecuteTrigger` abrangidos por: `trigger`.
- Se essas subvenções não estiverem disponíveis, utilize uma rede local gerada e o seu cliente administrador. A autoridade do gatilho também precisa de todas as permissões exigidas pelas instruções que o gatilho irá executar.

```bash
CONFIG=./taira.client.toml
FEE_METADATA=./taira.tx-metadata.json
TRIGGER_ID=cookbook_by_call_log
test -n "$TAIRA_ACCOUNT_ID"
```

## Passos {#steps}

### 1. Registrar um gatilho com apoio de instrução {#_1-register-an-instruction-backed-trigger}

`--instructions-stdin` aceita uma JSON Uma série de instruções. `Log` A instrução mantém este exemplo focado na autorização de desencadeamento em vez das permissões de um segundo objeto do livro maior.

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

O gatilho pode ser executado no máximo três vezes. Sua autoridade declarada, e não o chamador que acontece a executá-lo, autoriza as instruções dentro da ação.

### 2. Verificar a declaração antes da execução {#_2-inspect-the-declaration-before-execution}

```bash
iroha --config "$CONFIG" ledger trigger get --id "$TRIGGER_ID"
iroha --config "$CONFIG" ledger trigger inspect "$TRIGGER_ID"
```

Confirmar a autoridade I105, o filtro de execução, as repetições restantes e a instrução única `Log` antes de gastar outra taxa.

### 3. Execute e espere as duas camadas. {#_3-execute-and-wait-for-both-layers}

A transação de execução e a ação de desencadeamento têm evidências distintas. `--wait` aguarda a finalidade da transação aplicada; `--trace` também relata diagnósticos de conclusão do tempo de execução.

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

Os clientes Rust constroem as mesmas duas instruções tipografadas. Aqui `authority` é um `AccountId` e `client` sinais como essa conta:

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

## Verificar {#verify}

Escanar o histórico de blocos comprometidos para a conclusão e inspecionar a contagem de repetições decrementadas:

```bash
iroha --config "$CONFIG" ledger trigger completed list \
  --id "$TRIGGER_ID" \
  --outcome success \
  --limit 5

iroha --config "$CONFIG" ledger trigger inspect "$TRIGGER_ID"
```

Ao menos uma conclusão deve relatar sucesso. O gatilho deve permanecer ativo com duas execuções restantes. Uma submissão bem-sucedida sem a conclusão do gatilho com sucesso não é uma verificação suficiente.

## Resolução de problemas {#troubleshooting}

- Registro rejeitado como não permitido significa que o signatário carece de `CanRegisterTrigger` para a autoridade declarada. A execução exige o `CanExecuteTrigger` É um símbolo.
- Uma transação pode chegar ao aplicado enquanto a ação de desencadeamento relata falha. Leia o resultado da conclusão e erro; em seguida, verifique as permissões da autoridade do desencadeamento para cada instrução incorporada.
- O `trigger not found` pode significar que a transacção de registo foi rejeitada ou que uma configuração diferente da cadeia Torii/catena foi utilizada para a execução.
- Quando as repetições atingem o zero, fazer mais repetições é uma outra escrita privilegiada. Não alterem silenciosamente esta receita para um gatilho indefinido.
- Para a limpeza, `ledger trigger unregister --id "$TRIGGER_ID"` requer `CanUnregisterTrigger` para esse gatilho mais uma seleção explícita de taxa.

## Fonte e documentos relacionados {#source-and-related-docs}

- [Testes de integração do trigger de chamada indirecta no commit fixado](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/triggers/by_call_trigger.rs)
- [Ensaios de integração do evento e do desencadeamento no commit fixado](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/events_and_triggers.rs)
- [Execução de instruções de desencadeamento no commit fixado](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_core/src/smartcontracts/isi/triggers/mod.rs)
- [Trigores](/pt/blockchain/triggers.md)
- [Exemplos de gatilhos ](/pt/blockchain/trigger-examples.md)
- [Eventos](./stream-events.md)
