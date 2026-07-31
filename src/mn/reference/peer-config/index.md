---
translation_locale: mn
translation_source: /reference/peer-config/index.md
translation_source_hash: 5cc6ddf62a45f655d61a0ff3ebc7e20b939fe78c9d542087b717c2e17e19250d
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Байгууллага Iroha {#configuring-iroha}

Орон нутгийн хамтын ажиллагааны тохируулалт TOML Энэ нь зах зээлийн системээс ялгаатай
конфигурацыг өөрчилсөн [`SetParameter`](/mn/blockchain/instructions.md#setparameter)
заавар. Үйлдвэрлэлийн зан үйл нь конфигурацийн файл дээр илэрхийлэх ёстой
эсвэл зах зээлийн параметр; байгаль орчны өөрчлөлтөд гадаргууд байхгүй.

Хэрэглээ [`--config`](../irohad-cli#arg-config) CLI тохируулалтын файлын замыг тодорхойлох аргумент.

## Үргэлт {#template}

Барилгын хэсгүүдийн дэлгэрэнгүй тодорхойлолт [Параметр](./params.md) дуудлага.

::: details `peer.template.toml`

<<< @/snippets/peer.template.toml

:::

## Конфигурацийн файлуудыг бүрдүүлэх {#composing-configuration-files}

TOML конфигурацийн файлууд нь нэмэлт `extends` бусад талбайг зааж TOML Энэ нь ганц зам эсвэл
хэд хэдэн зам:

::: code-group

```toml [Single]
extends = "single-path.toml"
```

```toml [Multiple]
extends = ["file1.toml", "file2.toml"]
```

:::

Iroha Энэ нь бүх файлуудыг дахин уншдаг `extends` Тэдгээрийг нэг хэсэгээр бүрдүүлж,
урьдчилсан хэсгүүдийн параметрын түвшинд. `config.toml`:

::: code-group

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

The үр дүнд хүрсэн конфигурац нь `chain` цаашид `a.toml`, `max_content_len` цаашид `b.toml`, болон `torii.address` цаашид
`config.toml` (загварт бичигддэг) `b.toml`).

## Хөгжлийн асуудлыг шийдвэрлэх {#troubleshooting}

Үргэлт [`--trace-config`](../irohad-cli#arg-trace-config) CLI Бэлэг нь конфигурацыг хэрхэн уншиж, шинжилгээ хийх талаар баримтлах болно.
