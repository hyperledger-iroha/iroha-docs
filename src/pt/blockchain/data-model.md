---
translation_locale: pt
translation_source: /blockchain/data-model.md
translation_source_hash: 147562d2286bf11e60a941969e6d52bffc1534c3cfc04d440e0bcf78598a1ca7
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Modelo de Dados {#data-model}

Iroha armazena o estado do livro-razão da blockchain no `World`. Seu modelo de dados da primeira versão utiliza as seguintes identidades e entidades canônicas:

- os domínios são qualificados por espaço de dados, por exemplo `payments.universal`
- as contas são canônicas e sem domínio; o ID da conta é derivado do controlador da conta
- definições de ativos podem manter uma projeção de domínio/nome, mas seu endereço textual canônico é um identificador opaco Base58
- ativos são saldos mantidos por contas para uma definição específica de ativo
- NFTs são registros exclusivamente possuídos com IDs qualificados por domínio e conteúdo de metadados
- RWAs são lotes de ID gerados que representam ativos fora da cadeia com proprietário atual, quantidade, proveniência, metadados, retenções, congelamentos e controles de ciclo de vida

```mermaid
classDiagram

class World
class Domain {
  id: DomainId
  logo: Option<SorafsUri>
  metadata: Metadata
  owned_by: AccountId
}
class Account {
  id: AccountId
  metadata: Metadata
  label: Option<AccountAlias>
  uaid: Option<UniversalAccountId>
  opaque_ids: Vec<OpaqueAccountId>
}
class AccountController {
  key
  multisig policy
}
class AssetDefinition {
  id: AssetDefinitionId
  spec
  mintable
  metadata
}
class Asset {
  id: AssetId
  value
}
class Nft {
  id: NftId
  content: Metadata
  owned_by: AccountId
}
class Rwa {
  id: RwaId
  owned_by: AccountId
  quantity
  spec
  primary_reference
  status
  metadata
  parents
  controls
  is_frozen
  held_quantity
}

World *-- Domain : registers
World *-- Account : registers
World *-- AssetDefinition : registers
World *-- Asset : stores balances
World *-- Nft : registers
World *-- Rwa : registers lots
Account --> AccountController : authorized by
Domain --> Account : owned_by
AssetDefinition --> Domain : optional projection
Asset --> AssetDefinition : definition
Asset --> Account : held by
Nft --> Domain : scoped by
Nft --> Account : owned_by
Rwa --> Account : owned_by
```

## Exemplo {#example}

Em uma rede Iroha 3, `wonderland.universal` é um domínio dentro do espaço de dados `universal`. As contas canônicas neste exemplo são controladas por suas chaves ou políticas e codificadas como IDs de conta I105 sem domínio. Rótulos legíveis, como `alice@wonderland.universal`, são aliases separados vinculados a esses IDs. Uma definição de ativo projetado ainda pode ser construída a partir de um domínio e nome, como `rose` em `wonderland.universal`, enquanto o endereço da definição de ativo canônica usado na transmissão do protocolo é o endereço Base58 gerado.

```mermaid
classDiagram

class domain_wonderland {
  id = "wonderland.universal"
}
class account_alice {
  id = "AccountId(controller=alice_key)"
  label = "alice"
}
class account_rabbit {
  id = "AccountId(controller=rabbit_key)"
  label = "rabbit"
}
class asset_rose {
  name projection = "rose"
  domain projection = "wonderland.universal"
}

domain_wonderland --> account_alice : owned_by
asset_rose --> domain_wonderland : projected under
account_alice --> asset_rose : holds balance
account_rabbit --> asset_rose : may receive balance
```

## Apelidos {#aliases}

Aliases são nomes voltados para humanos sobrepostos aos identificadores canônicos do livro-razão da blockchain. Eles são úteis em API, CLI, carteiras e limites de exploradores, mas os IDs canônicos continuam sendo os identificadores estáveis armazenados em campos rigorosos do livro-razão da blockchain.

|Alvo| Alvo canônico |Também literal|Modelo de suporte|
| -------------- | --------------------------------------------------- | ------------------------------------------------------ | ----------------------------------------------------------------------------- |
|Conta de usuário|domínio sem `AccountId` codificado como um endereço I105| `name@domain.dataspace` ou `name@dataspace`            | `AccountAlias`; alias principal é `Account.label`, aliases extras são bindings |
|Definição de ativo|endereçamento Base58 canônico `AssetDefinitionId`| `name#domain.dataspace` ou `name#dataspace`            |`AssetDefinitionAlias` vinculado a uma definição de ativo|
|Contrato|Bech32m canônico `ContractAddress`| `name::domain.dataspace` ou `name::dataspace`          | `ContractAlias` vinculado a um endereço de contrato implantado|
|Nome de domínio| `DomainId` em `domain.dataspace` forma               | `domain.dataspace`                                    | SNS `domain` registro de namespace                                                 |
|Nome do espaço de dados|numérico `DataSpaceId` do catálogo ativo Nexus|alias de espaço de dados como `universal`, `paynet` ou `zk`| SNS `dataspace` registro de namespace mais o catálogo de espaço de dados ativo|

Aliases de conta são os nomes de conta visíveis ao usuário. Eles permanecem mesmo após a mudança de chave da conta porque o alias aponta para o ID da conta ativa através de índices do estado global e registros de mudança de chave da conta. Use `SetPrimaryAccountAlias` para o rótulo principal da conta, `SetAccountAliasBinding` para aliases adicionais não principais, e `FindAccountByAlias` ou `FindAliasesByAccountId` para leituras. Aliases de conta normalmente requerem um aluguel de alias de conta ativo SNS adquirido com `AcquireAccountAliasLease` e renovado com `RenewAccountAliasLease`.

Aliases de ativos nomeiam definições de ativos, não saldos individuais de contas. Aliases de ativos e aliases de contrato são ligações diretas de um nome legível para um destino canônico existente. Os aliases de ativos são definidos com `SetAssetDefinitionAlias`; o segmento do nome do alias deve corresponder ao nome de exibição da definição do ativo ou ao nome da definição projetada. Os aliases de contrato são definidos com `SetContractAlias`; o alias dataspace deve corresponder ao dataspace codificado no endereço do contrato. Ambas as vinculações podem carregar `lease_expiry_ms`; após a expiração, elas deixam de resolver quando a janela de carência termina e são removidas dos índices do estado mundial.

Domínios não possuem um objeto `DomainAlias` separado. Um identificador de domínio já é um nome qualificado por espaço de dados, como `payments.universal`. SNS rastreia a propriedade do aluguel para nomes de domínio no namespace `domain` e para aliases de espaço de dados no namespace `dataspace`. O alias de espaço de dados reservado `universal` deve permanecer definido.

## Documentos relacionados {#related-docs}

| Tópico                                  |Para onde ir|
| -------------------------------------- | ------------------------------------------- |
|Domínios| [Domínios](/pt/blockchain/domains.md)           |
|Contas| [Contas](/pt/blockchain/accounts.md)         |
|Ativos| [Ativos](/pt/blockchain/assets.md)             |
| NFTs                                   | [NFTs](/pt/blockchain/nfts.md)                 |
|Ativos do mundo real| [Ativos do Mundo Real](/pt/blockchain/rwas.md)    |
|Metadados| [Metadados](/pt/blockchain/metadata.md)         |
|Instruções de registro e transferência| [Instruções](/pt/blockchain/instructions.md) |
|permissões de tempo de execução do software| [Permissões](/pt/blockchain/permissions.md)   |
|Regras de nomenclatura| [Regras de nomenclatura](/pt/reference/naming.md)        |
