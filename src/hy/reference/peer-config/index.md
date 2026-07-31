---
translation_locale: hy
translation_source: /reference/peer-config/index.md
translation_source_hash: 5cc6ddf62a45f655d61a0ff3ebc7e20b939fe78c9d542087b717c2e17e19250d
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Iroha կազմավորումը {#configuring-iroha}

Տեղական զուգընկերային կոֆիգուրացիան սահմանվում է TOML ֆայլերում: Սա տարբերվում է շղթայի վրա փոփոխված կոնֆիգորացիայից, որը փոխվում է [`SetParameter`](/hy/blockchain/instructions.md#setparameter) հրահանգների միջոցով: Արտադրման վարքագիծը պետք է ներկայացվի կազմավորման ֆայլում կամ շղթայի մեջ պարամետրով. Շրջակա միջավայրի փոփոխվողները չեն առանձնահատկությունների դարպասներ.

Օգտագործեք [`--config`](../irohad-cli#arg-config) CLI փաստարկը ՝ կոնֆիգուրացիոն ֆայլի ուղին նշելու համար:

## Թեմա {#template}

Յուրաքանչյուր պարամետրի մանրամասն նկարագրության համար խնդրում ենք ծանոթանալ [Parameters](./params.md) հղմանը:

::: details `peer.template.toml`

<<< @/snippets/peer.template.toml

:::

## Կոմպոզիտորային ֆայլերի կազմում {#composing-configuration-files}

TOML կոնֆիգուրացիոն ֆայլերը ունեն լրացուցիչ `extends` դաշտ, որը ցույց է տալիս այլ TOML ֆայլեր: Դա կարող է լինել մեկ ուղին կամ բազմաթիվ ուղիներ.

::: կոդային խումբ

```toml [Single]
extends = "single-path.toml"
```

```toml [Multiple]
extends = ["file1.toml", "file2.toml"]
```

:::

Iroha-ը կրկնօրինակի կերպով կարդում է `extends` կետում նշված բոլոր ֆայլերը եւ դրանք կազմում շերտերով, որտեղ վերջինները վերագրում են նախորդները պարամետրային մակարդակով: Օրինակ, եթե կարդում են `config.toml`-ը՝

::: կոդային խումբ

```toml [config.toml]
extends = ["a.toml", "b.toml"]

[torii]
address = "0.0.0.0:8080"
```

```toml [a.toml]
chain = "whatever"
```

```toml [b.toml]
[torii]
address = "localhost:4000"
max_content_len = 2048
```

:::

Արդյունքում կազմավորումը կլինի `chain`՝ `a.toml`, `max_content_len` ՝ `b.toml` եւ `torii.address` ՝ `config.toml` (overscreened `b.toml`) ։

## Խնդիրների լուծում {#troubleshooting}

Անցնել [`--trace-config`](../irohad-cli#arg-trace-config)CLI դրոշը ՝ տեսնելու համար, թե ինչպես է ընթերցվում եւ վերլուծվում կոնֆիգուրացիան:
