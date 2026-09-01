---
translation_locale: pt
translation_source: /cookbook/permissions-and-roles.md
translation_source_hash: 8d6fd7101094ba21cfc2c5fb9a89d2acd7e67f13ff47b9f8c8e01bbbd7bf2836
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Permissões e Funções {#permissions-and-roles}

## Resultado {#outcome}

Crie um papel que conceda a uma conta permissão para atualizar metadados em uma conta específica, atribua-o a um delegado, comprove a escrita delegada e mostre as instruções tipadas correspondentes Rust.

## Pré-requisitos {#prerequisites}

- Um cliente financiado Taira e metadados de taxas de [Conectar-se a Taira](./connect-to-taira.md).
- `TARGET_ACCOUNT` e `DELEGATE_ACCOUNT` definidos para os IDs de conta canônicos I105.
- A conta que assina deve ter permissão para gerenciar a permissão e os papéis de destino. Em Taira, esta é uma operação administrativa com permissão restrita; obtenha `CanManageRoles` e o principal de autorização necessário para conceder a permissão limitada, ou execute a receita em uma rede local gerada.

```bash
CONFIG=./taira.client.toml
FEE_METADATA=./taira.tx-metadata.json
ROLE_ID=cookbook_metadata_editors
test -n "$TARGET_ACCOUNT"
test -n "$DELEGATE_ACCOUNT"
```

Use uma segunda configuração de cliente para o delegado ao fornecer a gravação:

```bash
DELEGATE_CONFIG=./taira.delegate.toml
```

## Passos {#steps}

### 1. Registre um papel vazio {#_1-register-an-empty-role}

Cada comando CLI que altera o estado nomeia explicitamente o pagador da taxa. O arquivo de metadados contém o ativo de taxa Taira atual derivado da resposta do serviço de financiamento da testnet.

```bash
iroha --config "$CONFIG" \
  --fee-payer authority \
  --metadata "$FEE_METADATA" \
  ledger role register --id "$ROLE_ID"
```

### 2. Adicione uma permissão com escopo para a conta de destino {#_2-add-a-permission-scoped-to-the-target-account}

Os tokens de permissão são objetos do tipo JSON. Mantenha a conta dentro de `payload` como um ID I105; um alias não é válido neste campo restrito.

```bash
jq -cn --arg account "$TARGET_ACCOUNT" \
  '{name:"CanModifyAccountMetadata",payload:{account:$account}}' |
  iroha --config "$CONFIG" \
    --fee-payer authority \
    --metadata "$FEE_METADATA" \
    ledger role permission grant --id "$ROLE_ID"
```

### 3. Atribua o papel ao delegado {#_3-assign-the-role-to-the-delegate}

```bash
iroha --config "$CONFIG" \
  --fee-payer authority \
  --metadata "$FEE_METADATA" \
  ledger account role grant \
  --id "$DELEGATE_ACCOUNT" \
  --role "$ROLE_ID"
```

Funções e suas permissões não expiram. Revogue-as explicitamente quando o acesso não for mais necessário.

### 4. Exercite a permissão delegada {#_4-exercise-the-delegated-permission}

Use o signatário criptográfico do delegado e o saldo de taxas para a gravação. Os valores JSON são lidos da entrada padrão.

```bash
printf '"delegated"\n' |
  iroha --config "$DELEGATE_CONFIG" \
    --fee-payer authority \
    --metadata "$FEE_METADATA" \
    ledger account meta set \
    --id "$TARGET_ACCOUNT" \
    --key cookbook_access
```

O mesmo modelo está disponível para clientes Rust. Aqui `client` assina como `registrar_account`, que se torna o proprietário inicial do papel assim como acontece no fluxo CLI. Todas as três variáveis de conta já têm os valores `AccountId` analisados:

```rust
use iroha::data_model::{prelude::*, transaction::FeePaymentIntent};
use iroha_executor_data_model::permission::account::CanModifyAccountMetadata;

let role_id: RoleId = "cookbook_metadata_editors".parse()?;
let role = Role::new(role_id.clone(), registrar_account).add_permission(
    CanModifyAccountMetadata {
        account: target_account.clone(),
    },
);

client.submit_all_blocking::<InstructionBox>(
    [
        Register::role(role).into(),
        Grant::account_role(role_id, delegate_account).into(),
    ],
    FeePaymentIntent::authority(Vec::new(), None),
)?;
```

## Verificar {#verify}

Liste ambos os lados da tarefa, depois leia o valor exato escrito pelo delegado:

```bash
iroha --config "$CONFIG" ledger role permission list --id "$ROLE_ID"
iroha --config "$CONFIG" ledger account role list --id "$DELEGATE_ACCOUNT"

iroha --config "$CONFIG" ledger account meta get \
  --id "$TARGET_ACCOUNT" \
  --key cookbook_access
```

A lista de permissões deve conter `CanModifyAccountMetadata` com escopo em `TARGET_ACCOUNT`, a lista de funções do delegado deve conter `ROLE_ID`, e a leitura de metadados deve retornar `"delegated"`.

## Solução de problemas {#troubleshooting}

- `Not permitted` ao registrar, editar ou atribuir a função significa que o signatário criptográfico não possui o principal de autorização Taira necessário. Não substitua o token com escopo por um global; solicite a concessão exata ou use a rede local.
- Um erro de análise de carga útil geralmente significa que `account` foi colocado ao lado de `payload`, um alias foi fornecido em vez de um ID I105, ou o valor JSON foi citado duas vezes.
- Uma rejeição de taxa pertence ao signatário criptográfico que está submetendo essa etapa. Financie o gerente e delegue de forma independente e mantenha os metadados do ativo de taxa derivado do faucet.
- Uma concessão de função bem-sucedida não substitui o escopo codificado em seus tokens. Esta função pode modificar apenas a conta nomeada no payload de permissão.
- Para limpar, execute `ledger account role revoke`, depois `ledger role permission revoke` e, finalmente, `ledger role unregister`; cada um é uma gravação separada e deve incluir `--fee-payer authority` e os metadados de taxa.

## Fonte e documentos relacionados {#source-and-related-docs}

- [Executar testes de integração de função no commit fixado](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/roles.rs)
- [Testes de integração de permissão no commit fixado](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/permissions.rs)
- [Modelo de dados de permissão incorporado no commit fixado](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_executor_data_model/src/permission.rs)
- [Permissões e funções](/pt/blockchain/permissions.md)
- [Referência do token de permissão](/pt/reference/permissions.md)
- [Metadados](./metadata.md)
