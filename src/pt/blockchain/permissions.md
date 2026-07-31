---
translation_locale: pt
translation_source: /blockchain/permissions.md
translation_source_hash: 1a12b47fa14bb011c9a916e70a1a8b5c083061880e1564a0be861c13cf562a77
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Permissões {#permissions}

As contas precisam de tokens de permissão para várias ações em uma cadeia de blocos, por exemplo, para minar ou queimar ativos.

Há uma diferença entre um blockchain público e privado em termos de permissões concedidas aos usuários. Em um blockchain público, a maioria das contas tem o mesmo conjunto de permissão. Em um blockchain privado, a maioria das contas é assumida para não ser capaz de fazer nada fora da autoridade concedida a eles, a menos que explicitamente concedido a permissão pertinente.

Ter uma permissão para fazer algo significa que a conta tem o correspondente `Permission`. Permissões podem ser concedidas diretamente ou através de um [`Role`](#permission-groups-roles), que agrupa um conjunto de permissões. Permissões são concedidas com a instrução `Grant`. Permissões e funções não expiram; remova-as com a instrução `Revoke`.

## Tokens de Permissão {#permission-tokens}

Os tokens de permissão são objetos tipografados definidos pelo executor ativo. Alguns tokens são globais, como `CanManagePeers`, e outros têm alcance para um objeto específico do livro maior, como uma conta, ativos, definição de ativos, domínio, NFT, papel ou gatilho.

Aqui estão alguns exemplos de parâmetros utilizados para vários tokens de permissão:

- Um token que concede permissão para modificar metadados de uma conta específica tem um campo `account`:

  ```json
  {
    "account": "<AccountId>"
  }
  ```

- Um token que concede permissão para transferir ativos para uma definição específica de ativo possui um campo `asset_definition`:

  ```json
  {
    "asset_definition": "<AssetDefinitionId>"
  }
  ```

- Um token global como `CanManagePeers` não possui campos:

  ```json
  {}
  ```

### Tokens de Permissão pré-configurados {#pre-configured-permission-tokens}

A lista de tokens de permissão pré-configurados pode ser encontrada no capítulo [Referência ](/pt/reference/permissions).

## Grupos de autorização (funções) {#permission-groups-roles}

Um conjunto de permissões é chamado de um papel. Semelhante a tokens de permissão, os papéis podem ser concedidos usando a instrução `Grant` e revogados usando a instrucção `Revoke`.

Antes de atribuir um papel a uma conta, o papel deve ser registado em primeiro lugar.

Os papéis são úteis quando várias contas devem receber o mesmo conjunto de permissões. Registre o papel uma vez, conceda permissões ao papel e, em seguida, conceda ou revoque o papel para contas individuais.

### Registar um novo papel {#register-a-new-role}

Vamos registrar um novo papel que, quando concedido, permitirá o acesso de outra conta aos metadados [ ](/pt/blockchain/metadata.md) na conta do mouse:

```rust
let role_id = RoleId::from_str("ACCESS_TO_MOUSE_METADATA")?;
let role = iroha_data_model::role::Role::new(role_id.clone(), mouse_id.clone())
    .add_permission(CanModifyAccountMetadata {
        account: mouse_id.clone(),
    });
let register_role = Register::role(role);
```

### Concede um papel . {#grant-a-role}

Depois de o papel ser registrado, Mouse pode conceder-lhe a Alice:

```rust
let grant_role = Grant::account_role(role_id, alice_id);
let grant_role_tx = TransactionBuilder::new(chain_id, mouse_id)
    .with_instructions([grant_role])
    .sign(mouse_private_key);
```

## Validadores de permissão {#permission-validators}

As permissões existem para que apenas contas com o token de permissão necessário possam executar uma ação protegida.

A superfície padrão do validador é agrupada por área de contabilidade:

- Gerenciamento entre pares
- Domínios e contas
- Ativos, NFTs, e garantia
- desencadeadores
- funções e permissões
- Executor/tipo de execução, provas, pontes e módulos SORA/Nexus

A lista exata de tokens é confirmada pela fonte na referência [Permission Tokens ](/pt/reference/permissions.md).

### Validadores de tempo de execução {#runtime-validators}

As verificações de permissões são executadas pelo executor ativo. O executor padrão fornece os validadores de permissão e as definições do token incorporados, e uma rede pode alterar a política atualizando o executor que usa.

Os validadores retornam um veredicto de validação. Um validador pode permitir uma operação, negá-la com uma razão ou ignorá-la se a operação está fora do escopo desse validador. O juiz selecionado combina esses veredictos para decidir se a instrução, consulta ou expressão podem continuar.

## Questões apoiadas {#supported-queries}

Os tokens de permissão e os papéis podem ser consultados.

Questões de funções:

- [`FindRoles`](/pt/reference/queries.md#accounts-and-permissions)
- [`FindRoleIds`](/pt/reference/queries.md#accounts-and-permissions)
- [`FindRolesByAccountId`](/pt/reference/queries.md#accounts-and-permissions)

Pesquisas para tokens de permissão:

- [`FindPermissionsByAccountId`](/pt/reference/queries.md#accounts-and-permissions)
