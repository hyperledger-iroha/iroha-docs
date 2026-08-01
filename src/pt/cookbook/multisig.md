---
translation_locale: pt
translation_source: /cookbook/multisig.md
translation_source_hash: 7090228c4fea7321c93fe0d2c67ef6de842de95bc3befa11d83c12b9f15b4752
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Multisig ponderado {#weighted-multisig}

## Resultados {#outcome}

Registre uma conta multisig ponderada de três membros na Taira, propor uma instrução de metadados, aprová-la com peso suficiente para atender ao quórum e verificar a execução do estado da conta multisig.

## Pré-requisitos {#prerequisites}

- Três canônicos I105 signatário IDs em `SIGNER_A`, `SIGNER_B`, e `SIGNER_C`.
- Configurações financiadas Taira para os signatários A e C. O proponente e cada homologador pagam a sua própria transacção.
- `taira.tx-metadata.json` construído a partir da resposta atual à torneira, nunca a partir de um ativo de taxa copiado ID.
- A. Rust Projeto cliente fixado para o mesmo Iroha Revisão da fonte como Taira Os passos posteriores de proposta e aprovação utilizam os seguintes elementos: CLI.
- A função multisig do executor atual foi ativada. O registro está disponível para contas ordinárias no tempo de execução padrão Iroha 3, embora a política e a admissão de taxas Taira ainda se apliquem; use localnet se a implantação pública o negar.

```bash
SIGNER_A_CONFIG=./taira.signer-a.toml
SIGNER_C_CONFIG=./taira.signer-c.toml
FEE_METADATA=./taira.tx-metadata.json
test -n "$SIGNER_A"
test -n "$SIGNER_B"
test -n "$SIGNER_C"
```

## Passos {#steps}

### 1. Registrar uma política ponderada {#_1-register-a-weighted-policy}

O signer C tem peso 2; A e B têm peso 1 cada. Um quórum de 3 requer, portanto, C mais ou menos A ou B. Derivar a conta canônica dessa política exata antes do registo, em seguida, passar o mesmo valor para `MultisigRegister::with_account`:

```rust
use std::{collections::BTreeMap, num::{NonZeroU16, NonZeroU64}};
use iroha::{
    data_model::{
        account::{MultisigMember, MultisigPolicy},
        prelude::*,
        transaction::FeePaymentIntent,
    },
    executor_data_model::isi::multisig::{
        MultisigApprove, MultisigPropose, MultisigRegister, MultisigSpec,
    },
};

let spec = MultisigSpec::new(
    BTreeMap::from([
        (signer_a.clone(), 1),
        (signer_b.clone(), 1),
        (signer_c.clone(), 2),
    ]),
    NonZeroU16::new(3).unwrap(),
    NonZeroU64::new(3_600_000).unwrap(),
);
let members = spec
    .signatories
    .iter()
    .map(|(account, weight)| {
        let key = account
            .controller()
            .single_signatory()
            .expect("multisig members must be single-key accounts");
        MultisigMember::new(key.clone(), u16::from(*weight))
            .expect("weights are nonzero")
    })
    .collect();
let policy = MultisigPolicy::new(spec.quorum.get(), members)?;
let multisig_account = AccountId::new_multisig(policy);
let register = MultisigRegister::with_account(
    multisig_account.clone(),
    None::<DomainId>,
    spec,
);

registrar.submit_blocking::<InstructionBox>(
    register.into(),
    FeePaymentIntent::authority(Vec::new(), None),
)?;
println!("{}", multisig_account.canonical_i105()?);
```

Salvar o valor impresso para as etapas CLI:

```bash
MULTISIG_ACCOUNT='<POLICY_DERIVED_I105_ACCOUNT_ID>'
test -n "$MULTISIG_ACCOUNT"
```

No comit fixado, o comando de registo CLI imprime a sua semente temporária antes que o tempo de execução a reinicie. Não reutilize essa semente como controlador. Não existe a chave privada do controlador: a autoridade multisig vem apenas de propostas aprovadas.

### 2. Construa uma instrução sem enviá-la. {#_2-build-one-instruction-without-submitting-it}

O interruptor global `-o` serializa um conjunto de instruções para saída padrão. Não apresenta uma transacção e, por conseguinte, não gasta nenhuma taxa.

```bash
printf '"approved"\n' |
  iroha --config "$SIGNER_A_CONFIG" -o \
    ledger account meta set \
    --id "$MULTISIG_ACCOUNT" \
    --key cookbook_quorum \
  > multisig-instructions.json

jq . multisig-instructions.json
```

### 3. Propõe como assinante A {#_3-propose-as-signer-a}

O proponente contribui automaticamente com seu próprio peso. Capture o hash exato de instrução impresso pelo CLI; aprovações ligam a esse hash.

```bash
PROPOSE_OUTPUT="$({
  iroha --config "$SIGNER_A_CONFIG" \
    --output-format text \
    --fee-payer authority \
    --metadata "$FEE_METADATA" \
    ledger multisig propose \
    --account "$MULTISIG_ACCOUNT" \
    < multisig-instructions.json
})"
printf '%s\n' "$PROPOSE_OUTPUT"

INSTRUCTIONS_HASH="$({
  printf '%s\n' "$PROPOSE_OUTPUT" |
    sed -n 's/^instructions_hash: //p' |
    head -n 1
})"
test -n "$INSTRUCTIONS_HASH"
```

Listar a proposta ainda pendente com um selector finito explícito:

```bash
iroha --config "$SIGNER_A_CONFIG" ledger multisig list all \
  --multisig-selector "$MULTISIG_ACCOUNT"
```

### 4. Aprovar como signatário C {#_4-approve-as-signer-c}

O peso de A 1 mais o peso de C 2 atinge o quórum 3 e executa a instrução proposta como a conta multisig.

```bash
iroha --config "$SIGNER_C_CONFIG" \
  --fee-payer authority \
  --metadata "$FEE_METADATA" \
  ledger multisig approve \
  --account "$MULTISIG_ACCOUNT" \
  --instructions-hash "$INSTRUCTIONS_HASH"
```

O cliente Rust pode prosseguir com a mesma conta derivada da política e as duas instruções do ciclo de vida usadas acima:

```rust
let instructions = vec![SetKeyValue::account(
    multisig_account.clone(),
    "cookbook_quorum".parse()?,
    Json::from("approved"),
).into()];
let instructions_hash = HashOf::new(&instructions);
signer_a_client.submit_blocking::<InstructionBox>(
    MultisigPropose::new(multisig_account.clone(), instructions, None).into(),
    FeePaymentIntent::authority(Vec::new(), None),
)?;
signer_c_client.submit_blocking::<InstructionBox>(
    MultisigApprove::new(multisig_account, instructions_hash).into(),
    FeePaymentIntent::authority(Vec::new(), None),
)?;
```

## Verificar {#verify}

Leia o pós-estado e confirme que a proposta não está mais pendente:

```bash
iroha --config "$SIGNER_A_CONFIG" ledger account meta get \
  --id "$MULTISIG_ACCOUNT" \
  --key cookbook_quorum

iroha --config "$SIGNER_A_CONFIG" ledger multisig list all \
  --multisig-selector "$MULTISIG_ACCOUNT"

iroha --config "$SIGNER_A_CONFIG" ledger multisig inspect \
  --account "$MULTISIG_ACCOUNT" \
  --json |
  jq .
```

O valor dos metadados deve ser `"approved"`, o hash de instrução capturado não deve mais aparecer pendente e o controlador inspeccionado deve mostrar os pesos `1, 1, 2` com quorum `3`.

## Resolução de problemas {#troubleshooting}

- `signatory is not part of multisig` significa que o cliente que propõe ou aprova não corresponde a um dos I105 IDs registados na apólice.
- Uma aprovação final pode ser rejeitada quando a conta multisig não tem permissão para executar as instruções propostas. Concede autoridade à conta multisig, não apenas aos seus assinantes individuais, e depois deixe que um signatário restante tente novamente.
- Uma proposta pendente faltante pode significar que o quórum já foi alcançado, o TTL expirou ou o hash/selector de conta de instrução errado foi usado.
- As homologações duplicadas não adicionam peso, cada signatário registrado contribui com o seu peso configurado no máximo uma vez.
- A assinatura direta de uma transacção normal como o controlador é proibido. `MultisigPropose` e `MultisigApprove`.
- Se os comandos posteriores não conseguirem encontrar a conta impressa durante o registro CLI, você capturou a semente temporária. Derive a conta canônica da política ordenada e registre com esse valor como mostrado acima.

## Fonte e documentos relacionados {#source-and-related-docs}

- [Testes de integração multisig no commit fixado](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/integration_tests/tests/multisig.rs)
- [Modelo de dados multisig no commit fixado](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_executor_data_model/src/isi.rs)
- [Implementação multisig CLI no compromisso fixado](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_cli/src/main_shared.rs)
- [Transações ](/pt/blockchain/transactions.md)
- [Permissões e funções ](./permissions-and-roles.md)
