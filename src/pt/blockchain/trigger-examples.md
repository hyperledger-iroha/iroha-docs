---
translation_locale: pt
translation_source: /blockchain/trigger-examples.md
translation_source_hash: d40a0298466fdcbd30a9fdff979887b033e069646fcf3e437527d4d4ec2d0684
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Exemplo de Gatilho de Evento {#event-trigger-example}

Este exemplo usa IDs de conta sem domínio canônicos e definições de ativos projetadas no modelo de dados Iroha 3.

Suponha que uma rede tenha:

- uma conta canônica controlada pela chave de Alice
- uma conta canônica controlada pela chave do Mad Hatter
- uma definição de ativo projetada como `tea` sob `wonderland.universal`
- um saldo desse ativo mantido por cada conta

O objetivo é registrar um gatilho que observe o saldo de chá de Alice e envie uma transferência da conta Mad Hatter quando o evento de dados correspondente for emitido.

## 1. Prepare contas e ativos {#_1-prepare-accounts-and-assets}

Registre primeiro as contas participantes e a definição do ativo. No atual Iroha, os IDs das contas vêm dos controladores de contas, enquanto os domínios projetados usam o formulário `domain.dataspace`:

```text
domain: wonderland.universal
asset definition projection: tea in wonderland.universal
holder accounts: AccountId(controller=alice_key), AccountId(controller=mad_hatter_key)
```

A definição do ativo ainda possui um endereço opaco canônico. Armazene ou consulte esse endereço após o registro e use-o na ação do gatilho.

## 2. Escolha o principal de autorização do gatilho {#_2-choose-the-trigger-authority}

Defina a conta técnica do gatilho para uma conta dedicada sempre que possível. Uma conta dedicada deixa claro quais permissões são necessárias para a execução do gatilho e evita acoplar o gatilho à chave pessoal de assinatura de um operador.

A conta técnica já deve existir e deve ter permissão para enviar as instruções no executável do gatilho.

## 3. Defina o executável {#_3-define-the-executable}

O executável é a sequência de instruções que o acionador envia quando o filtro de evento corresponde. Para este exemplo, ele contém uma transferência:

```text
Transfer(
  source = AssetId(tea_definition, mad_hatter_account),
  value = Numeric(1),
  destination = AssetId(tea_definition, alice_account)
)
```

Use os construtores tipados atuais do SDK para o payload final da transação. Evite codificar IDs textuais antigos diretamente no código do gatilho; analise ou consulte IDs canônicos antes de construir o executável.

## 4. Defina o filtro de evento {#_4-define-the-event-filter}

Use um filtro de data-event que restrinja os eventos ao objeto que você se importa:

```text
EventFilterBox::Data(
  DataEventFilter for asset changes involving
  AssetId(tea_definition, alice_account)
)
```

Mantenha os filtros tão específicos quanto prático. Um filtro `AcceptAll` é útil para depuração, mas faz com que cada evento correspondente pague o custo da avaliação do gatilho.

## 5. Registrar o gatilho {#_5-register-the-trigger}

Registre o gatilho com:

- um estábulo `TriggerId`
- a sequência de instruções executáveis
- `Repeats::Indefinitely` ou `Repeats::Exactly(n)`
- a conta técnica
- o filtro de eventos
- metadados opcionais

O próprio registro do gatilho é uma transação normal, portanto, a conta que está registrando precisa de permissão para registrar gatilhos. A conta técnica precisa das permissões exigidas pelo executável do gatilho.

## Ordem de execução {#execution-order}

Quando um bloco é executado:

1. Instruções de transação normais são executadas primeiro.
2. Eventos de dados produzidos por essas instruções são coletados.
3. Os gatilhos cujos filtros correspondem a esses eventos são programados.
4. Os efeitos produzidos por gatilhos são tratados no pipeline de processamento de execução de blocos sem permitir a execução recursiva ilimitada de gatilhos.

Se um gatilho usar `Repeats::Exactly(n)`, registre um novo gatilho quando a contagem estiver esgotada e o mesmo comportamento for necessário novamente.
