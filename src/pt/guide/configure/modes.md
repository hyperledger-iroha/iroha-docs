---
translation_locale: pt
translation_source: /guide/configure/modes.md
translation_source_hash: 3f6c2d84c7b6d325d76fb1b1a3ec0efb75381521f7fc69e7924a96532679bc61
translation_status: machine-validated
translation_engine: nllb-200-ct2+codex-semantic-review
---

# Cadeias de blocos públicas e privadas {#public-and-private-blockchains}

Iroha pode ser executado em uma variedade de configurações. Como administrador da sua própria rede, você decide qual executor e política de permissão determinar se uma transação é aceita.

Os perfis comuns são redes privadas com permissão e redes públicas mais abertas. Ambos são configurados através do estado de gênese e da política do executor, não por meio de binários de nós separados.

Abaixo descrevemos as principais diferenças entre estes dois casos de utilização.

## Permissões {#permissions}

Em um blockchain público, a maioria das contas tem o mesmo conjunto de permissões. em um blockchain privado, cada conta recebe apenas suas permissões explícitas.

::: info

Consulte a secção [ dedicada às permissões ](/pt/blockchain/permissions.md) para obter mais informações.

:::

## Companheiros {#peers}

Em um blockchain público, a admissão de pares faz parte da política de cadeia. Para um blockchain privado, as implementações geralmente definem o conjunto de pares confiável na configuração e genésica.

::: info

Para obter mais informações, consulte [ gestão entre pares ](peer-management.md).

:::

## Conta de registo {#registering-accounts}

Dependendo da forma como você decide configurar o seu [bloqueio de gênese (`genesis.json`)](genesis.md), O processo para registrar uma conta pode ser de duas formas. Para entender o porquê, vamos falar primeiro sobre permissão.

O executor selecionado define quais verificações de permissões se aplicam. Você pode conceder os tokens de permissão padrão [ ](/pt/blockchain/permissions.md) em gênese para moldar uma rede privada, gerenciada pelo administrador ou uma rede mais aberta. Uma vez que essas permissões são ativas, o processo de registro de contas é diferente.

As políticas de registo público e privado geralmente diferem:

- Uma política de registo público aceita registros de contas de qualquer usuário elegível[^1]. O usuário precisa de um cliente adequado, uma chave privada para um algoritmo suportado e um pedido de registo aceito pela política.

- Uma política de registo privado pode autorizar uma conta ou um contrato inteligente para enviar registros. Uma política personalizada pode limitar o registro a uma janela de tempo. Também pode exigir que o enviador gaste um token cuja oferta é fixa porque nenhuma autoridade tem permissão para fazer mais moeda.

- Com o padrão de rede privada padrão, uma conta existente apresenta o registo para cada nova conta.

Os validadores de permissão padrão cobrem o típico caso de uso privado da blockchain.

::: info

Os modos público e privado são opções de executor e gênese política. Ambos usam o mesmo nó binário. Revisar o executor selecionado e gênesis permissões antes de executar uma rede aberta.

:::

Para obter mais informações sobre as instruções `Register<Account>`, consulte a secção [ instruções](/pt/blockchain/instructions.md#un-register).

[^1]: `Register<Account>` cria o estado do livro-razão para um canônico, sem domínio `AccountId`; roteamento de domínio e pseudônimos são geridos separadamente.
