---
translation_locale: pt
translation_source: /blockchain/trigger-examples.md
translation_source_hash: d40a0298466fdcbd30a9fdff979887b033e069646fcf3e437527d4d4ec2d0684
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Exemplo de Trigger de Eventos {#event-trigger-example}

Este exemplo utiliza a conta canónica sem domínio IDs e as definições de activos projetadas no modelo de dados Iroha 3.

Suponha que uma rede tenha:

- Uma conta canónica controlada pela chave de Alice.
- Uma conta canônica controlada pela chave do Chapeleiro Louco.
- Uma definição de ativo projetada como `tea` no `wonderland.universal`
- um saldo desse ativo detido por cada conta

O objetivo é registrar um gatilho que observe o saldo de chá de Alice e envia uma transferência da conta do Hatter Louco quando o evento de dados correspondentes for emitido.

## 1. Preparar contas e ativos {#_1-prepare-accounts-and-assets}

Registre primeiro as contas participantes e a definição de ativo. Na corrente Iroha, a conta IDs vem dos controladores da conta, enquanto os domínios projetados usam o formulário `domain.dataspace`:

```text
domain: wonderland.universal
asset definition projection: tea in wonderland.universal
holder accounts: AccountId(controller=alice_key), AccountId(controller=mad_hatter_key)
```

A definição do ativo ainda tem um endereço opaco canônico. Armazenar ou consultar esse endereço após o registro e usá-lo na ação de gatilho.

## 2. Escolha a autoridade de desencadeamento {#_2-choose-the-trigger-authority}

Configurar a conta técnica do gatilho para uma conta dedicada quando possível. Uma conta dedicada deixa claro quais permissões são necessárias para execução de gatilho e evita acoplar o gatilho à chave pessoal de assinatura de um operador.

A conta técnica deve já existir e ter permissão para apresentar as instruções no trigger executável.

## 3. Definir o executável {#_3-define-the-executable}

O executável é a sequência de instruções que o gatilho envia quando o filtro do evento coincide. Para este exemplo, contém uma transferência:

```text
Transfer(
  source = AssetId(tea_definition, mad_hatter_account),
  value = Numeric(1),
  destination = AssetId(tea_definition, alice_account)
)
```

Use os construtores atualmente digitalizados do SDK para a carga útil final da transação. Evite codificar o texto antigo IDs em código de gatilho; parse ou query canonical IDs antes de construir o executável.

## 4. Defina o filtro de eventos {#_4-define-the-event-filter}

Use um filtro de eventos de dados que restringe os eventos para o objeto do qual você se importa:

```text
EventFilterBox::Data(
  DataEventFilter for asset changes involving
  AssetId(tea_definition, alice_account)
)
```

Mantém os filtros tão específicos quanto práticos. Um filtro `AcceptAll` é útil para depurar, mas faz com que cada evento de correspondência pague o custo da avaliação do gatilho.

## 5. Registre o gatilho. {#_5-register-the-trigger}

Registre o gatilho com:

- uma estabilidade `TriggerId`
- A sequência de instruções executáveis
- `Repeats::Indefinitely` ou `Repeats::Exactly(n)`
- a conta técnica
- o filtro de eventos
- Metadados opcionais

O registro do gatilho em si é uma transação normal, então a conta de registo precisa de permissão para registrar gatilhos. A conta técnica precisa das permissões exigidas pelo gatilho executável.

## Ordem de execução {#execution-order}

Quando um bloco é executado:

1. As instruções normais de transacção são executadas primeiro.
2. Foram recolhidos os dados relativos aos eventos produzidos por essas instruções.
3. Os gatilhos cujos filtros coincidem com os eventos estão programados.
4. Os efeitos produzidos pelo gatilho são manuseados no processo de execução do bloco sem permitir a execução do gatilho recursivo ilimitada.

Se um gatilho utilizar `Repeats::Exactly(n)`, registar um novo gatilho quando a contagem estiver esgotada e o mesmo comportamento for necessário novamente.
