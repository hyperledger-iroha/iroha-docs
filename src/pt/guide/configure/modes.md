---
translation_locale: pt
translation_source: /guide/configure/modes.md
translation_source_hash: 3f6c2d84c7b6d325d76fb1b1a3ec0efb75381521f7fc69e7924a96532679bc61
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Blockchains Públicas e Privadas {#public-and-private-blockchains}

Iroha pode ser executado em uma variedade de configurações. Como administrador da sua própria rede, você decide qual executor e política de permissões determinam se uma transação é aceita.

Os perfis comuns são redes privadas com permissão e redes públicas mais abertas. Ambos são configurados através do estado gênese da blockchain e da política do executor, não através de binários de nó separados.

A seguir, descrevemos as principais diferenças nesses dois casos de uso.

## Permissões {#permissions}

Em uma blockchain pública, a maioria das contas tem o mesmo conjunto de permissões. Em uma blockchain privada, cada conta recebe apenas suas permissões explícitas.

::: info

Consulte o [seção dedicada a permissões](/pt/blockchain/permissions.md) para mais detalhes.

:::

## pares de rede {#peers}

Em uma blockchain pública, a admissão de pares na rede faz parte da política da cadeia. Para uma blockchain privada, as implantações geralmente definem o conjunto de pares confiáveis na configuração e no gênesis da blockchain.

::: info

Consulte [gerenciamento de pares de rede](peer-management.md) para mais detalhes.

:::

## Registrando contas {#registering-accounts}

Dependendo de como você decidir configurar seu [bloco gênese da blockchain (`genesis.json`)](genesis.md), o processo para registrar uma conta pode seguir um de dois caminhos. Para entender o porquê, vamos falar sobre permissão primeiro.

O executor selecionado define quais verificações de permissão se aplicam. Você pode conceder o [tokens de permissão](/pt/blockchain/permissions.md) padrão na gênese da blockchain para criar uma rede privada gerenciada por administradores ou uma rede mais aberta. Uma vez que essas permissões estejam ativas, o processo de registro de contas é diferente.

As políticas de registro público e privado geralmente diferem:

- Uma política de registro público aceita registros de conta de qualquer usuário elegível[^1]. O usuário precisa de um cliente adequado, uma chave privada para um algoritmo suportado e uma solicitação de registro aceita pela política.

- Uma política de registro privado pode autorizar uma conta ou um contrato inteligente a enviar registros. Uma política personalizada pode limitar o registro a uma janela de tempo. Também pode exigir que o remetente gaste um token cujo fornecimento é fixo porque nenhum principal de autorização tem permissão para emitir mais.

- Com o padrão de rede privada padrão, uma conta existente envia o registro para cada nova conta.

Os validadores de permissão padrão abrangem o caso de uso típico de blockchain privada.

::: info

Modos públicos e privados são escolhas de política do executor e do gênese da blockchain. Ambos usam o mesmo binário de nó. Revise as permissões do executor e do gênese da blockchain selecionados antes de executar uma rede aberta.

:::

Consulte a seção sobre [instruções](/pt/blockchain/instructions.md#un-register) para mais detalhes sobre as instruções de `Register<Account>`.

[^1]: `Register<Account>` cria o estado do livro razão da blockchain para um `AccountId` canônico e sem domínio; o roteamento de domínios e os aliases são gerenciados separadamente.
