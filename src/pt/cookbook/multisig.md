---
translation_locale: pt
translation_source: /cookbook/multisig.md
translation_source_hash: e1b57e1c4310dd0db8be8d9f5a15e1d4f693abb90b634772857eb4b1e86e4baf
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Multisig Ponderado {#weighted-multisig}

## Resultado {#outcome}

Registre uma conta multisig ponderada de três membros em Taira, proponha uma instrução de metadados, aprove-a com peso suficiente para atingir o quórum e verifique a execução a partir do estado da conta multisig.

## Pré-requisitos {#prerequisites}

- Três IDs de signatário canônicos I105 em `SIGNER_A`, `SIGNER_B` e `SIGNER_C`.
- Configurou Taira para os signatários criptográficos A e C. O proponente e cada aprovador pagam por sua própria transação.
- `taira.tx-metadata.json` construído a partir da resposta do serviço de financiamento da testnet atual, nunca a partir de um ID de ativo de taxa copiado.
- Um projeto de cliente Rust fixado na mesma revisão de origem Iroha que Taira para a etapa de registro. As etapas posteriores de proposta e aprovação usam o CLI.
- O recurso multisig do executor atual está habilitado. O registro está disponível para contas comuns no ambiente de execução de software padrão Iroha 3, embora a política Taira e a cobrança de taxas ainda se apliquem; use a rede local se a implantação pública a negar.

```bash
SIGNER_A_CONFIG=./taira.signer-a.toml
SIGNER_C_CONFIG=./taira.signer-c.toml
FEE_METADATA=./taira.tx-metadata.json
test -n "$SIGNER_A"
test -n "$SIGNER_B"
test -n "$SIGNER_C"
```

## Passos {#steps}

### 1. Registre uma política ponderada {#_1-register-a-weighted-policy}

o signatário criptográfico C tem peso 2; A e B têm peso 1 cada. Um quórum de 3, portanto, requer C mais A ou B. Derive a conta canônica a partir dessa política exata antes do registro, em seguida passe o mesmo valor para `MultisigRegister::with_account`:

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

Salve o valor impresso para os passos CLI:

```bash
MULTISIG_ACCOUNT='<POLICY_DERIVED_I105_ACCOUNT_ID>'
test -n "$MULTISIG_ACCOUNT"
```

No commit fixado, o comando de registro CLI imprime sua semente temporária antes que o tempo de execução do software a recodifique. Não reutilize essa semente como o controlador. Não há chave privada do controlador: o principal de autorização multisig vem apenas de propostas aprovadas.

### 2. Construa uma instrução sem enviá-la {#_2-build-one-instruction-without-submitting-it}

O switch global `-o` serializa um array de instruções para a saída padrão. Ele não envia uma transação e, portanto, não gera nenhuma taxa.

```bash
printf '"approved"\n' |
  iroha --config "$SIGNER_A_CONFIG" -o \
    ledger account meta set \
    --id "$MULTISIG_ACCOUNT" \
    --key cookbook_quorum \
  > multisig-instructions.json

jq . multisig-instructions.json
```

### 3. Propor como signatário criptográfico A {#_3-propose-as-signer-a}

O proponente contribui automaticamente com seu próprio peso. Capture o hash criptográfico da instrução exata impresso pelo CLI; aprovações se vinculam a esse hash criptográfico.

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

Liste a proposta ainda pendente com um seletor finito explícito:

```bash
iroha --config "$SIGNER_A_CONFIG" ledger multisig list all \
  --multisig-selector "$MULTISIG_ACCOUNT"
```

### 4. Aprovar como signatário criptográfico C {#_4-approve-as-signer-c}

O peso 1 de A mais o peso 2 de C atingem o quórum 3 e executam a instrução proposta como a conta multisig.

```bash
iroha --config "$SIGNER_C_CONFIG" \
  --fee-payer authority \
  --metadata "$FEE_METADATA" \
  ledger multisig approve \
  --account "$MULTISIG_ACCOUNT" \
  --instructions-hash "$INSTRUCTIONS_HASH"
```

O cliente Rust pode continuar com a mesma conta derivada da política e as duas instruções de ciclo de vida usadas acima:

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

Leia o estado pós e confirme que a proposta não está mais pendente:

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

O valor dos metadados deve ser `"approved"`, o hash criptográfico da instrução capturada não deve mais aparecer como pendente, e o controlador inspecionado deve mostrar os pesos `1, 1, 2` com quórum `3`.

## Solução de problemas {#troubleshooting}

- `signatory is not part of multisig` significa que o cliente proponente ou aprovador não corresponde a um dos IDs I105 registrados na apólice.
- Uma aprovação final pode ser rejeitada quando a conta multisig não tem permissão para executar as instruções propostas. Conceda o principal de autorização à conta multisig, não apenas aos seus signatários criptográficos individuais, e então permita que um signatário criptográfico restante tente novamente.
- Uma proposta pendente ausente pode significar que o quórum já foi alcançado, que o TTL expirou ou que o hash de instrução/selecionador de conta errado foi usado. Consulte o estado posterior antes de propor novamente.
- Aprovações duplicadas não adicionam peso. Cada signatário registrado contribui com seu peso configurado no máximo uma vez.
- Assinar diretamente uma transação normal como o controlador é proibido. Sempre use `MultisigPropose` e `MultisigApprove`.
- Se comandos posteriores não conseguirem encontrar a conta impressa durante o registro CLI, você capturou a semente temporária. Derive a conta canônica a partir da política ordenada e registre-se com esse valor conforme mostrado acima.

## Fonte e documentos relacionados {#source-and-related-docs}

- [Testes de integração Multisig no commit fixado](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/multisig.rs)
- [Modelo de dados multisig no commit fixado](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_executor_data_model/src/isi.rs)
- [CLI implementação multisig no commit fixado](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli/src/main_shared.rs)
- [Transações](/pt/blockchain/transactions.md)
- [Permissões e funções](./permissions-and-roles.md)
