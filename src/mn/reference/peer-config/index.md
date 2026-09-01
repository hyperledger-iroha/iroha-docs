---
translation_locale: mn
translation_source: /reference/peer-config/index.md
translation_source_hash: dd44f8f12cc456d6f37e1ceb3e82cf4a979e80115c75e28dcb1fe4f29469aaf4
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Iroha тохируулах {#configuring-iroha}

Орон нутгийн сүлжээний хамтрагчийн тохиргоо нь энд тохируулагдана TOML файлууд. Энэ нь гинж дээрх тохиргоо өөрчлөгдсөнөөс ялгаатай юм [`SetParameter`](/mn/blockchain/instructions.md#setparameter) заавар. Үйлдвэрлэлийн үйлдлийг тохиргоонд илэрхийлэх ёстой файл эсвэл сүлжээнд байгаа параметр; орчны хувьсагчууд нь онцлогийн хаалт биш юм.

Хэрэглэх [`--config`](../iroha3d-cli#arg-config) CLI төлөвлөлтийн файлын замыг заах аргумент.

## Хавтлага {#template}

Тус бүр параметрийн дэлгэрэнгүй тайлбарын хувьд, [Параметрүүд](./params.md) лавлах материалд хандахыг хүснэ үү.

::: details `peer.template.toml`

<<< @/snippets/peer.template.toml

:::

## Тохиргооны файлуудыг зохиох {#composing-configuration-files}

TOML тохиргооны файлууд нь нэмэлт `extends` талбартай бөгөөд энэ нь бусад TOML файлууд руу зааж өгдөг. Энэ нь нэг зам эсвэл хэд хэдэн зам байж болно:

::: code-group

```toml [Single]
extends = "single-path.toml"
```

```toml [Multiple]
extends = ["file1.toml", "file2.toml"]
```

:::

Iroha нь `extends`-д заасан бүх файлыг дахин давтан уншиж, давхаргад нэгтгэх бөгөөд сүүлд нь уншигдсан файлууд өмнөх файлуудын параметрүүдийг давхарлах болно. Жишээлбэл, хэрэв `config.toml`-ийг уншиж байвал:

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

Үр дүнд гарах тохиргоо нь `a.toml`-аас `chain`, `b.toml`-аас `max_content_len`, мөн `config.toml`-аас `torii.address` ( `b.toml`-г түр давтана) байх болно.

## Алдааг олох болон засах {#troubleshooting}

Амжилттай [`--trace-config`](../iroha3d-cli#arg-trace-config) CLI Тохиргоог хэрхэн уншиж, задлан шинжлээд байгааг харах туг.
