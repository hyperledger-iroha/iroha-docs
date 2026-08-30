---
translation_locale: pt
translation_source: /cookbook/permissions-and-roles.md
translation_source_hash: 7ee18275d25837da53f533f5e9205906ccaa71b48afd9b11ffad79b599da7f21
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Permissões e Funções {#permissions-and-roles}

## Resultados {#outcome}

Criar uma função que conceda permissão a uma conta para atualizar metadados em uma conta específica, atribuí-los a um delegado, provar a escrita delegada e mostrar as instruções correspondentes digitalizadas Rust.

## Pré-requisitos {#prerequisites}

- Um cliente financiado Taira e metadados de taxas a partir de [Conectar-se a Taira](./connect-to-taira.md).
- `TARGET_ACCOUNT` e `DELEGATE_ACCOUNT` definidos na conta canônica I105 IDs.
- A conta de assinatura deve ser autorizada a gerenciar as permissões e funções-alvo. Em Taira, esta é uma operação administrativa com limite de permissão; obter `CanManageRoles` e a autoridade necessária para conceder a autorização definida, ou executar a receita em uma rede local gerada.

```bash
CONFIG=./taira.client.toml
FEE_METADATA=./taira.tx-metadata.json
ROLE_ID=cookbook_metadata_editors
test -n "$TARGET_ACCOUNT"
test -n "$DELEGATE_ACCOUNT"
```

Use uma segunda configuração do cliente para o delegado ao provar a escrita:

```bash
DELEGATE_CONFIG=./taira.delegate.toml
```

## Passos {#steps}

### 1. Registrar um papel vazio {#_1-register-an-empty-role}

Cada comando CLI com alteração de estado nomeia explicitamente o pagador da taxa. O arquivo de metadados contém o ativo atual da taxa Taira derivado da resposta do torneiro.

```bash
iroha --config "$CONFIG" \
  --fee-payer authority \
  --metadata "$FEE_METADATA" \
  ledger role register --id "$ROLE_ID"
```

### 2. Adicionar uma permissão no âmbito da conta-alvo {#_2-add-a-permission-scoped-to-the-target-account}

Os tokens de permissão são digitados JSON objetos. Mantenha a conta dentro de `payload` como um I105 ID; um alias não é válido neste campo rigoroso.

```bash
jq -cn --arg account "$TARGET_ACCOUNT" \
  '{name:"CanModifyAccountMetadata",payload:{account:$account}}' |
  iroha --config "$CONFIG" \
    --fee-payer authority \
    --metadata "$FEE_METADATA" \
    ledger role permission grant --id "$ROLE_ID"
```

### 3. Assinar o papel ao delegado {#_3-assign-the-role-to-the-delegate}

```bash
iroha --config "$CONFIG" \
  --fee-payer authority \
  --metadata "$FEE_METADATA" \
  ledger account role grant \
  --id "$DELEGATE_ACCOUNT" \
  --role "$ROLE_ID"
```

As funções e as suas subvenções não expiram, revogá-las explicitamente quando o acesso não for mais necessário.

### 4. Exercer a permissão delegada {#_4-exercise-the-delegated-permission}

Usar a assinatura do delegado e o saldo das taxas para a escrita. Os valores JSON são lidos a partir da entrada padrão.

```bash
printf '"delegated"\n' |
  iroha --config "$DELEGATE_CONFIG" \
    --fee-payer authority \
    --metadata "$FEE_METADATA" \
    ledger account meta set \
    --id "$TARGET_ACCOUNT" \
    --key cookbook_access
```

O mesmo modelo está disponível para os clientes Rust. Aqui `client` marca como `registrar_account`, que se torna o proprietário inicial do papel assim como faz no fluxo CLI. Todas as três variáveis da conta já são analisadas valores `AccountId`:

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

Faça uma lista dos dois lados da tarefa, e leia o valor exato escrito pelo delegado:

```bash
iroha --config "$CONFIG" ledger role permission list --id "$ROLE_ID"
iroha --config "$CONFIG" ledger account role list --id "$DELEGATE_ACCOUNT"

iroha --config "$CONFIG" ledger account meta get \
  --id "$TARGET_ACCOUNT" \
  --key cookbook_access
```

A lista de permissões deve conter `CanModifyAccountMetadata` abrangida por `TARGET_ACCOUNT`, a lista de funções do delegado deve conter`ROLE_ID` e os metadados lidos devem retornar `"delegated"`.

## Resolução de problemas {#troubleshooting}

- `Not permitted` ao registrar, editar ou atribuir a função significa que o signatário não tem a autoridade necessária Taira. Não substituir o token com alcance global; solicitar a concessão exata ou usar localnet.
- Um erro de análise da carga útil geralmente significa que `account` foi colocado ao lado de `payload`, um alias foi fornecido em vez de uma I105 ID ou o valor JSON foi citado duas vezes.
- Uma denúncia de taxa pertence ao signatário que submeter esse passo. Financiar o gestor e delegar de forma independente e reter os metadados dos ativos da taxa derivada do torneiro.
- Uma concessão de papel bem-sucedida não supere o âmbito codificado nos seus tokens. Esta função só pode modificar a conta nomeada na carga útil de permissão.
- Para limpar, executar `ledger account role revoke`, em seguida, `ledger role permission revoke` e finalmente `ledger role unregister`; cada um é uma escrita separada e deve incluir `--fee-payer authority` e metadados de taxas.

## Fonte e documentos relacionados {#source-and-related-docs}

- [Ensaios de integração de funções no commit fixado](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/roles.rs)
- [Ensaios de integração de permissões no compromisso fixado ](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/permissions.rs)
- [Modelo de dados de permissão embutido no commit fixado](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_executor_data_model/src/permission.rs)
- [Permissões e funções ](/pt/blockchain/permissions.md)
- [Referência de token de permissão ](/pt/reference/permissions.md)
- [Metadados ](./metadata.md)
