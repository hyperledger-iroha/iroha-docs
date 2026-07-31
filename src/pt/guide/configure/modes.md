---
translation_locale: pt
translation_source: /guide/configure/modes.md
translation_source_hash: 141e640a596b419627c21dd4b22690f6ef97efe6ad2fc21ea5f806d0e262227f
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Cadeias de blocos públicas e privadas {#public-and-private-blockchains}

Iroha pode ser executado em uma variedade de configurações. Como administrador da sua própria rede, você decide qual executor e política de permissão determinar se uma transação é aceita.

Os perfis comuns são redes privadas com permissão e redes públicas mais abertas. Ambos são configurados através do estado de gênese e da política do executor, não por meio de binários de nós separados.

Abaixo descrevemos as principais diferenças entre estes dois casos de utilização.

## Permissões {#permissions}

Em um blockchain público, a maioria das contas tem o mesmo conjunto de permissões. em um blockchain privado, assume-se que a maior parte das contas não podem fazer nada fora da autoridade concedida a eles, a menos que seja explicitamente concedida a permissão relevante.

::: Informações

Consulte a secção [ dedicada às permissões ](/pt/blockchain/permissions.md) para obter mais informações.

:::

## Companheiros {#peers}

Em um blockchain público, a admissão de pares faz parte da política de cadeia. Para um blockchain privado, as implementações geralmente definem o conjunto de pares confiável na configuração e genésica.

::: Informações

Para obter mais informações, consulte [ gestão entre pares ](peer-management.md).

:::

## Conta de registo {#registering-accounts}

Dependendo da forma como você decide configurar o seu [bloqueio de gênese (`genesis.json`)](genesis.md), O processo para registrar uma conta pode ser de duas formas. Para entender o porquê, vamos falar primeiro sobre permissão.

O executor selecionado define quais verificações de permissões se aplicam. Você pode conceder os tokens de permissão padrão [ ](/pt/blockchain/permissions.md) em gênese para moldar uma rede privada, gerenciada pelo administrador ou uma rede mais aberta. Uma vez que essas permissões são ativas, o processo de registro de contas é diferente.

Quando se trata de registrar contas, a blockchain pública e privada têm as seguintes diferenças:

- Em um blockchain público, qualquer pessoa deve ser capaz de registrar uma conta[^1]. Então, em teoria, tudo o que você precisa é de um cliente adequado, uma maneira de gerar uma chave privada para um algoritmo suportado e política de permissão que aceita o registro.

- Em um blockchain privado, você pode ter qualquer processo para criar uma conta: pode ser que a instrução de registro tenha de ser enviada por uma conta específica, ou por um contrato inteligente que pede outros detalhes. Pode ser que em uma blockchain privada o registro de novas contas seja possível apenas em datas específicas, ou limitado por um token não-mintable (finito).

- Em um blockchain privado típico, ou seja, em um blockchain sem processos únicos para registrar contas, você precisa de uma conta para registrar outra conta.

Os validadores de permissão padrão cobrem o típico caso de uso privado da blockchain.

::: Informações

Os modos públicos e privados são perfis de política em vez de binários de nós separados. Reveja o executor e as permissões genéticas que você envia antes de executar uma rede aberta.

:::

Para obter mais informações sobre as instruções `Register<Account>`, consulte a secção [ instruções](/pt/blockchain/instructions.md#un-register).

[^1]: `Register<Account>` cria o estado do livro-razão para um canônico, sem domínio `AccountId`; roteamento de domínio e pseudônimos são geridos separadamente.
