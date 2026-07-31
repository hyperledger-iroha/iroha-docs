---
translation_locale: ka
translation_source: /reference/peer-config/index.md
translation_source_hash: 5cc6ddf62a45f655d61a0ff3ebc7e20b939fe78c9d542087b717c2e17e19250d
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# კონფიგურაცია Iroha {#configuring-iroha}

ადგილობრივი თანატოლების კონფიგურაცია დაყენებულია TOML ეს განსხვავდება ქსელზე არსებული ფაილებისგან.
კონფიგურაცია შეცვლილია [`SetParameter`](/ka/blockchain/instructions.md#setparameter)
ინსტრუქციები. წარმოების ქცევა უნდა იყოს წარმოდგენილი კონფიგურაციის ფაილში
ან ჯაჭვზე პარამეტრი; გარემოს ცვლადი არ არის ფუნქციური კარიბჭეები.

გამოყენება [`--config`](../irohad-cli#arg-config) CLI არგუმენტი კონფიგურაციის ფაილის მიმართულების მითითებისთვის.

## შაბლონი {#template}

თითოეული პარამეტრის დეტალური აღწერისთვის, გთხოვთ იხილოთ [პარამეტრები](./params.md) რეფერენცია.

::: details `peer.template.toml`

<<< @/snippets/peer.template.toml

:::

## კონფიგურაციის ფაილების შედგენა {#composing-configuration-files}

TOML კონფიგურაციის ფაილებს აქვთ დამატებითი `extends` სხვა მიმართულებით მიუთითებს TOML ფაილი (((s). ეს შეიძლება იყოს ერთი გზა ან
მრავალჯერადი გზები:

::: code-group

```toml [Single]
extends = "single-path.toml"
```

```toml [Multiple]
extends = ["file1.toml", "file2.toml"]
```

:::

Iroha რეკურსიულად წაიკითხავს ყველა ფაილს, რომელიც მითითებულია `extends` და დავამრავლოთ ისინი ფენებად, სადაც უკანასკნელნი გადაწერენ
წინა მონაცემები პარამეტრის დონეზე. მაგალითად, თუ კითხვა `config.toml`:

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

The შედეგად კონფიგურაცია იქნება `chain` საგანგებო `a.toml`, `max_content_len` საგანგებო `b.toml`, და `torii.address` საგანგებო
`config.toml` (გადაწერილები) `b.toml`).

## პრობლემების აღმოფხვრა {#troubleshooting}

გადაცემა [`--trace-config`](../irohad-cli#arg-trace-config) CLI დროშა, რათა ნახოთ კვალი როგორ კონფიგურაცია წაიკითხა და parsed.
