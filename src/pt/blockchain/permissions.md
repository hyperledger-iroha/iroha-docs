---
translation_locale: pt
translation_source: /blockchain/permissions.md
translation_source_hash: 1a12b47fa14bb011c9a916e70a1a8b5c083061880e1564a0be861c13cf562a77
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Permissões {#permissions}

As contas precisam de tokens de permissão para várias ações em uma blockchain, por exemplo, para emitir ou queimar ativos.

Existe uma diferença entre uma blockchain pública e uma privada em termos de permissões concedidas aos usuários. Em uma blockchain pública, a maioria das contas possui o mesmo conjunto de permissões. Em uma blockchain privada, presume-se que a maioria das contas não seja capaz de fazer nada fora do princípio de autorização concedido a elas, a menos que a permissão relevante seja explicitamente concedida.

Ter permissão para fazer algo significa que a conta possui a correspondente `Permission`. Permissões podem ser concedidas diretamente ou através de um [`Role`](#permission-groups-roles), que agrupa um conjunto de permissões. As permissões são concedidas com o `Grant` instrução. Permissões e funções não expiram; remova-as com o `Revoke` instrução.

## Tokens de Permissão {#permission-tokens}

Tokens de permissão são objetos tipados definidos pelo executor ativo. Alguns tokens são globais, como `CanManagePeers`, e outros são restritos a um objeto específico de ledger de blockchain, como uma conta, ativo, definição de ativo, domínio, NFT, função ou gatilho.

Aqui estão alguns exemplos de parâmetros usados para vários tokens de permissão:

- Um token que concede permissão para modificar metadados de uma conta específica contém um campo `account`:

  ```json
  {
    "account": "<AccountId>"
  }
  ```

- Um token que concede permissão para transferir ativos para uma definição de ativo específica possui um campo `asset_definition`:

  ```json
  {
    "asset_definition": "<AssetDefinitionId>"
  }
  ```

- Um token global como `CanManagePeers` não possui campos:

  ```json
  {}
  ```

### Tokens de Permissão Pré-configurados {#pre-configured-permission-tokens}

Você pode encontrar a lista de tokens de permissão pré-configurados no capítulo [Referência](/pt/reference/permissions).

## Grupos de Permissão (Funções) {#permission-groups-roles}

Um conjunto de permissões é chamado de papel. De forma semelhante aos tokens de permissão, os papéis podem ser concedidos usando a instrução `Grant` e revogados usando a instrução `Revoke`.

Antes de conceder um papel a uma conta, o papel deve ser registrado primeiro.

Funções são úteis quando várias contas devem receber o mesmo conjunto de permissões. Registre a função uma vez, conceda permissões à função e então conceda ou revogue a função para contas individuais.

### Registrar um novo cargo {#register-a-new-role}

Vamos registrar um novo papel que, quando concedido, permitirá que outra conta acesse o [metadados](/pt/blockchain/metadata.md) na conta de Mouse:

```rust
let role_id = RoleId::from_str("ACCESS_TO_MOUSE_METADATA")?;
let role = iroha_data_model::role::Role::new(role_id.clone(), mouse_id.clone())
    .add_permission(CanModifyAccountMetadata {
        account: mouse_id.clone(),
    });
let register_role = Register::role(role);
```

### Conceder um papel {#grant-a-role}

Após a função ser registrada, Mouse pode concedê-la a Alice:

```rust
let grant_role = Grant::account_role(role_id, alice_id);
let grant_role_tx = TransactionBuilder::new(chain_id, mouse_id)
    .with_instructions([grant_role])
    .sign(mouse_private_key);
```

## Validadores de Permissão {#permission-validators}

As permissões existem para que apenas contas com o token de permissão necessário possam executar uma ação protegida. O executor padrão verifica as permissões durante a execução de instruções, consultas e expressões.

A superfície padrão do validador está agrupada por área do livro-razão da blockchain:

- gerenciamento de pares de rede
- domínios e contas
- ativos, NFTs, e cauções
- gatilhos
- funções e permissões
- executor e ambiente de execução, provas, pontes e módulos SORA/Nexus

A lista exata de tokens é suportada pela fonte no [Referência de Tokens de Permissão](/pt/reference/permissions.md).

### Validadores de tempo de execução de software {#runtime-validators}

As verificações de permissão são impostas pelo executor ativo. O executor padrão fornece os validadores de permissão integrados e definições de token, e uma rede pode mudar a política atualizando o executor que utiliza.

Os validadores retornam um veredicto de validação. Um validador pode permitir uma operação, negá-la com um motivo ou pulá-la se a operação estiver fora do escopo desse validador. O juiz selecionado combina esses veredictos para decidir se a instrução, consulta ou expressão pode prosseguir.

## Consultas Suportadas {#supported-queries}

Tokens de permissão e funções podem ser consultados.

Consultas por funções:

- [`FindRoles`](/pt/reference/queries.md#accounts-and-permissions)
- [`FindRoleIds`](/pt/reference/queries.md#accounts-and-permissions)
- [`FindRolesByAccountId`](/pt/reference/queries.md#accounts-and-permissions)

Consultas para tokens de permissão:

- [`FindPermissionsByAccountId`](/pt/reference/queries.md#accounts-and-permissions)
