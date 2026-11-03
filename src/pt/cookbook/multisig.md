---
translation_locale: pt
translation_source: /cookbook/multisig.md
translation_source_hash: 7fca7feca0c27d41a14d1c38497c23aa9f1afe37c5ac19cd8e79c487dc35cc5e
translation_status: machine-validated
translation_engine: bing-translator-llm+claude-opus-5-5
---

# Multisig Ponderado {#weighted-multisig}

## Resultado {#outcome}

Registre uma conta multisig ponderada de três membros em Taira, proponha uma instrução de metadados, aprove-a com peso suficiente para atingir o quórum e verifique a execução a partir do estado da conta multisig.

## Pré-requisitos {#prerequisites}

- Três IDs de signatário canônicos I105 em `SIGNER_A`, `SIGNER_B` e `SIGNER_C`.
- Configurou Taira para os signatários criptográficos A e C. O proponente e cada aprovador pagam por sua própria transação.
- As gravações do CLI usam `--fee-payer authority`; o CLI cota a taxa exata, no ativo de taxa da Taira, antes de assinar.
- Um projeto de cliente Rust que depende de `iroha` e `iroha_model_base`, fixado na mesma revisão de origem Iroha que Taira, para a etapa de registro. As etapas posteriores de proposta e aprovação usam o CLI.
- O recurso multisig do executor atual está habilitado. O registro está disponível para contas comuns no ambiente de execução de software padrão Iroha 3, embora a política Taira e a cobrança de taxas ainda se apliquem; use a rede local se a implantação pública a negar.

```bash
SIGNER_A_CONFIG=./taira.signer-a.toml
SIGNER_C_CONFIG=./taira.signer-c.toml
test -n "$SIGNER_A"
test -n "$SIGNER_B"
test -n "$SIGNER_C"
```

## Passos {#steps}

### 1. Registre uma política ponderada {#_1-register-a-weighted-policy}

O signatário criptográfico C tem peso 2; A e B têm peso 1 cada. Um quórum de 3, portanto, requer C mais A ou B. Aqui `registrar` é um `iroha::blocking::Client`, cujo `submit` aguarda a finalização aplicada. Derive a conta canônica a partir dessa política exata antes do registro, em seguida passe o mesmo valor para `MultisigRegister::with_account`:

```rust
use std::{collections::BTreeMap, num::{NonZeroU16, NonZeroU64}};
use iroha::{
    data_model::{
        account::{MultisigMember, MultisigPolicy},
        prelude::*,
        transaction::FeePaymentIntent,
    },
    executor_data_model::isi::multisig::{
        MultisigApprove, MultisigProposalId, MultisigProposalNonce,
        MultisigPropose, MultisigRegister, MultisigSpec,
    },
};
use iroha_model_base::domain::DomainId;

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

registrar.submit::<InstructionBox>(
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

No commit fixado, o comando de registro CLI imprime sua semente temporária antes que o tempo de execução do software troque sua chave. Não reutilize essa semente como o controlador. Não há chave privada do controlador: a autoridade multisig vem apenas de propostas aprovadas. Para registrar pelo CLI em vez disso, passe o valor derivado da política para `ledger multisig register --account`.

### 2. Construa uma instrução sem enviá-la {#_2-build-one-instruction-without-submitting-it}

A opção global `--emit-instructions` imprime o array de instruções na saída padrão em vez de enviá-lo, portanto não gera nenhuma taxa.

```bash
printf '"approved"\n' |
  iroha --config "$SIGNER_A_CONFIG" --emit-instructions \
    account meta set \
    --id "$MULTISIG_ACCOUNT" \
    --key cookbook_quorum \
  > multisig-instructions.json

jq . multisig-instructions.json
```

### 3. Propor como signatário criptográfico A {#_3-propose-as-signer-a}

O proponente contribui automaticamente com seu próprio peso. Gere um novo nonce de proposta e guarde-o para qualquer nova tentativa. Capture o ID da proposta e o hash criptográfico da instrução impressos pelo CLI; as aprovações se vinculam a ambos.

```bash
PROPOSAL_NONCE="$(openssl rand -hex 32)"
PROPOSE_OUTPUT="$({
  iroha --config "$SIGNER_A_CONFIG" \
    --output-format text \
    --fee-payer authority \
    ledger multisig propose \
    --proposal-nonce "$PROPOSAL_NONCE" \
    --account "$MULTISIG_ACCOUNT" \
    < multisig-instructions.json
})"
printf '%s\n' "$PROPOSE_OUTPUT"

PROPOSAL_ID="$({
  printf '%s\n' "$PROPOSE_OUTPUT" |
    sed -n 's/^proposal_id: //p' |
    head -n 1
})"
INSTRUCTIONS_HASH="$({
  printf '%s\n' "$PROPOSE_OUTPUT" |
    sed -n 's/^instructions_hash: //p' |
    head -n 1
})"
test -n "$PROPOSAL_ID"
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
  ledger multisig approve \
  --account "$MULTISIG_ACCOUNT" \
  --proposal-id "$PROPOSAL_ID" \
  --instructions-hash "$INSTRUCTIONS_HASH"
```

O cliente Rust pode continuar com a mesma conta derivada da política e as duas instruções de ciclo de vida usadas acima. Cada cliente signatário é um `iroha::blocking::Client`; o ID da proposta é derivado da rede do cliente, da conta multisig e de um novo nonce:

```rust
let instructions = vec![SetKeyValue::account(
    multisig_account.clone(),
    "cookbook_quorum".parse()?,
    Json::from("approved"),
).into()];
let instructions_hash = HashOf::new(&instructions);
// A fresh nonzero nonce, for example from `openssl rand -hex 32`.
let proposal_nonce: MultisigProposalNonce = "<FRESH_64_HEX_NONCE>".parse()?;
let proposal_id = MultisigProposalId::derive(
    signer_a_client.client().network_id(),
    &multisig_account,
    &proposal_nonce,
);
signer_a_client.submit::<InstructionBox>(
    MultisigPropose::new(
        multisig_account.clone(),
        proposal_nonce,
        instructions,
        None,
    )
    .into(),
    FeePaymentIntent::authority(Vec::new(), None),
)?;
signer_c_client.submit::<InstructionBox>(
    MultisigApprove::new(multisig_account, proposal_id, instructions_hash)
        .into(),
    FeePaymentIntent::authority(Vec::new(), None),
)?;
```

## Verificar {#verify}

Leia o estado pós e confirme que a proposta não está mais pendente:

```bash
iroha --config "$SIGNER_A_CONFIG" account meta get \
  --id "$MULTISIG_ACCOUNT" \
  --key cookbook_quorum

iroha --config "$SIGNER_A_CONFIG" ledger multisig list all \
  --multisig-selector "$MULTISIG_ACCOUNT"

iroha --config "$SIGNER_A_CONFIG" ledger multisig inspect \
  --account "$MULTISIG_ACCOUNT" \
  --json |
  jq .
```

O valor dos metadados deve ser `"approved"`, o ID da proposta e o hash criptográfico da instrução capturados não devem mais aparecer como pendentes, e o controlador inspecionado deve mostrar `threshold` `3`, `total_weight` `4` e pesos de membros 1, 1 e 2; os membros são listados na ordem das chaves públicas.

## Solução de problemas {#troubleshooting}

- `not qualified to propose multisig` ou `not qualified to approve multisig` significa que o cliente proponente ou aprovador não corresponde a um dos IDs I105 registrados na política.
- Uma aprovação final pode ser rejeitada quando a conta multisig não tem permissão para executar as instruções propostas. Conceda o principal de autorização à conta multisig, não apenas aos seus signatários criptográficos individuais, e então permita que um signatário criptográfico restante tente novamente.
- Uma proposta pendente ausente pode significar que o quórum já foi alcançado, que o TTL expirou ou que foi usado um ID de proposta, hash de instrução ou seletor de conta errado. Consulte o estado posterior antes de propor novamente com um novo nonce.
- Aprovações duplicadas não adicionam peso. Cada signatário registrado contribui com seu peso configurado no máximo uma vez.
- Assinar diretamente uma transação normal como o controlador é proibido. Sempre use `MultisigPropose` e `MultisigApprove`.
- Se comandos posteriores não conseguirem encontrar a conta impressa durante o registro CLI, você capturou a semente temporária. Derive a conta canônica a partir da política ordenada e registre-se com esse valor conforme mostrado acima.

## Fonte e documentos relacionados {#source-and-related-docs}

- [Testes de integração Multisig no commit fixado](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/multisig.rs)
- [Modelo de dados multisig no commit fixado](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_executor_data_model/src/isi.rs)
- [CLI implementação multisig no commit fixado](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_cli/src/main_shared.rs)
- [Transações](/pt/blockchain/transactions.md)
- [Permissões e funções](./permissions-and-roles.md)
