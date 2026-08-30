---
translation_locale: mn
translation_source: /reference/peer-config/index.md
translation_source_hash: dd44f8f12cc456d6f37e1ceb3e82cf4a979e80115c75e28dcb1fe4f29469aaf4
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Iroha-ийн тохируулалт {#configuring-iroha}

TOML файлуудад орон нутгийн ижил төстэй конфигурацийг байгуулж байна. Энэ нь [`SetParameter`](/mn/blockchain/instructions.md#setparameter) заавар дамжуулан өөрчлөгдсөн зангилааны конфигурацыас ялгаатай. Үйлдвэрлэлийн зангилаа конфигурацийн файл эсвэл зангилаа дахь параметрээр илэрхийлэх ёстой; байгаль орчны хувьчлал нь онцлог дархан биш юм.

Байгалийн файлын замыг тодорхойлхын тулд [`--config`](../iroha3d-cli#arg-config) CLI аргументийг ашиглах.

## Нүүр хуудас {#template}

Арьсны параметрын дэлгэрэнгүй тодорхойлолт авахын тулд [Parameters](./params.md) нэвтрүүлэгт харна уу.

::: details `peer.template.toml`

<<< @/snippets/peer.template.toml

:::

## Конфигурацийн файлуудыг бүрдүүлэх {#composing-configuration-files}

TOML конфигурацийн файлууд нь бусад TOML файлуудад чиглэсэн нэмэлт `extends` талбайтай. Энэ бол нэг зам эсвэл олон зам байж болно:

::: code-group

```toml [Single]
extends = "single-path.toml"
```

```toml [Multiple]
extends = ["file1.toml", "file2.toml"]
```

:::

Iroha нь `extends` -д заасан бүх файлуудыг эргэлтээр уншиж, тэдгээрийг давхаргаар хувааж, сүүлийнх нь параметр түвшинд өмнөх файлуудыг давхар бичнэ. Жишээлбэл, `config.toml`-ийг уншдаг бол:

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

Үүнд хүрэх конфигурац нь: `chain` цаашид `a.toml`, `max_content_len` цаашид `b.toml`, болон `torii.address` цаашид `config.toml` (сэтгэгдэл) `b.toml`).

## Ашигтвортой байдлын асуудал {#troubleshooting}

[`--trace-config`](../iroha3d-cli#arg-trace-config)CLI зургийг дамжуулан конфигурацыг хэрхэн уншиж, шинжилгээ хийх талаар үзнэ үү.
