---
translation_locale: pt
translation_source: /cookbook/triggers.md
translation_source_hash: 946309958fe4e23a7454206b1eb4557f8e853171ce4e04d5373cb36f46b13970
translation_status: machine-validated
translation_engine: bing-translator-llm+claude-opus-5-5
---

# Gatilhos {#triggers}

## Resultado {#outcome}

Registre um gatilho de chamada finita em Taira, execute-o uma vez, aguarde a finalização aplicada e confirme sua conclusão bem-sucedida a partir do histórico de blocos confirmados.

## Pré-requisitos {#prerequisites}

- Um signatário criptográfico financiado, `taira.client.toml` e `TAIRA_ACCOUNT_ID` de [Conectar-se a Taira](./connect-to-taira.md). As gravações usam `--fee-payer authority`; o CLI cota a taxa exata, no ativo de taxa da Taira, antes de assinar.
- Taira permissão para registrar um gatilho para `TAIRA_ACCOUNT_ID` e executar o gatilho resultante. Os tokens relevantes são `CanRegisterTrigger` com escopo de `authority` e `CanExecuteTrigger` com escopo de `trigger`.
- Se essas concessões não estiverem disponíveis, use uma rede local gerada e seu cliente administrador. O principal de autorização do gatilho também precisa de todas as permissões exigidas pelas instruções que o gatilho executará.

```bash
CONFIG=./taira.client.toml
TRIGGER_ID=cookbook_by_call_log
test -n "$TAIRA_ACCOUNT_ID"
```

## Passos {#steps}

### 1. Registrar um gatilho baseado em instrução {#_1-register-an-instruction-backed-trigger}

`--instructions-stdin` aceita o array JSON de instruções que `--emit-instructions` imprime. `tx ping` emite uma instrução `Log`, o que mantém este exemplo focado na autorização do gatilho em vez das permissões de um segundo objeto do livro-razão da blockchain.

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

O gatilho pode ser executado no máximo três vezes. Seu principal de autorização declarado, e não o chamador que por acaso o executa, autoriza as instruções dentro da ação.

### 2. Inspecione a declaração antes da execução {#_2-inspect-the-declaration-before-execution}

```bash
iroha --config "$CONFIG" trigger get --id "$TRIGGER_ID"
iroha --config "$CONFIG" trigger inspect "$TRIGGER_ID"
```

Confirme o principal de autorização I105, o filtro de execução, as repetições restantes e a instrução codificada única em `executable` antes de gastar outra taxa.

### 3. Execute e aguarde ambas as camadas {#_3-execute-and-wait-for-both-layers}

A transação de execução e a ação de disparo possuem evidências distintas. `--wait` aguarda a finalização da transação aplicada; `--trace` também relata diagnósticos de conclusão do tempo de execução do software.

```bash
iroha --config "$CONFIG" \
  --fee-payer authority \
  trigger execute \
  --wait \
  --trace \
  --timeout-ms 60000 \
  "$TRIGGER_ID"
```

Os clientes Rust constroem as mesmas duas instruções tipadas. Aqui `authority` é um `AccountId`, e `client` é um `iroha::blocking::Client` que assina como essa conta; `submit` aguarda a finalização aplicada:

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

## Verificar {#verify}

Verifique o histórico de blocos confirmados para a conclusão e inspecione a contagem de repetições decrementada:

```bash
iroha --config "$CONFIG" trigger completed list \
  --id "$TRIGGER_ID" \
  --outcome success \
  --limit 5

iroha --config "$CONFIG" trigger inspect "$TRIGGER_ID"
```

Pelo menos uma conclusão deve relatar sucesso. O gatilho deve permanecer ativo com duas execuções restantes. Uma submissão bem-sucedida sem uma conclusão de gatilho bem-sucedida não é verificação suficiente.

## Solução de problemas {#troubleshooting}

- Registro rejeitado por não ser permitido significa que o signatário criptográfico não possui `CanRegisterTrigger` para o principal de autorização declarado. A execução requer o token `CanExecuteTrigger` de escopo separado.
- Uma transação pode atingir Aplicado enquanto a ação do gatilho relata falha. Leia o resultado da conclusão e o erro; em seguida, verifique as permissões do principal de autorização do gatilho para cada instrução incorporada.
- `Trigger with id … not found` pode significar que a transação de registro foi rejeitada ou que uma configuração diferente de Torii/cadeia foi usada para a execução.
- Quando as repetições chegam a zero, emitir mais repetições é outra escrita privilegiada. Não altere silenciosamente esta receita para um gatilho indefinido.
- Para a limpeza, `trigger unregister --id "$TRIGGER_ID"` requer `CanUnregisterTrigger` para esse gatilho, além da seleção explícita de taxa.

## Fonte e documentos relacionados {#source-and-related-docs}

- [Testes de integração de gatilho por chamada no commit fixado](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/triggers/by_call_trigger.rs)
- [Testes de integração de eventos e gatilhos no commit fixado](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/events_and_triggers.rs)
- [Acionar a execução da instrução no commit fixado](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_core/src/smartcontracts/isi/triggers/mod.rs)
- [Gatilhos](/pt/blockchain/triggers.md)
- [Exemplos de gatilho](/pt/blockchain/trigger-examples.md)
- [Eventos](./stream-events.md)
