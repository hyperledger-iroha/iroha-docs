---
translation_locale: ka
translation_source: /reference/peer-config/index.md
translation_source_hash: 5cc6ddf62a45f655d61a0ff3ebc7e20b939fe78c9d542087b717c2e17e19250d
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# კონფიგურაცია Iroha {#configuring-iroha}

ადგილობრივი თანატოლების კონფიგურაცია განისაზღვრება TOML ფაილებში. ეს განსხვავდება ქსელზე კონფიგურისგან, რომელიც შეცვლილია [`SetParameter`](/ka/blockchain/instructions.md#setparameter) ინსტრუქციებით. წარმოების ქცევა უნდა იყოს წარმოდგენილი კონფიგურირების ფაილში ან ქსელზე პარამეტრში; გარემოს ცვლადი არ არის მახასიათებლების კარი.

გამოიყენეთ [`--config`](../irohad-cli#arg-config) CLI არგუმენტი კონფიგურაციის ფაილის მიმართულების მითითებისთვის.

## შაბლონი {#template}

თითოეული პარამეტრის დეტალური აღწერისთვის, გთხოვთ იხილოთ [პარამეტრების ](./params.md) რეფერენცია.

::: details `peer.template.toml`

<<< @/snippets/peer.template.toml

:::

## კონფიგურაციის ფაილების შედგენა {#composing-configuration-files}

TOML კონფიგურაციის ფაილებს აქვთ დამატებითი `extends` ველი, რომელიც მიუთითებს სხვა TOML ფაილებზე (((). ეს შეიძლება იყოს ერთი გზა ან მრავალ გზა:

::: კოდის ჯგუფი

```toml [Single]
extends = "single-path.toml"
```

```toml [Multiple]
extends = ["file1.toml", "file2.toml"]
```

:::

Iroha რეკურსიულად წაიკითხავს ყველა ფაილს, რომელიც მითითებულია `extends` და შეადგენს მას ფენებად, სადაც ეს უკანასკნელი გადაწერს წინა ფენებს პარამეტრის დონეზე. მაგალითად, თუ წაიკითხება `config.toml`:

::: კოდის ჯგუფი

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

შედეგიანი კონფიგურაცია იქნება `chain` `a.toml`-დან, `max_content_len` `b.toml`-დან და `torii.address` `config.toml`-დან (გადაწერილი `b.toml`).

## პრობლემების აღმოფხვრა {#troubleshooting}

გაიარეთ [`--trace-config`](../irohad-cli#arg-trace-config) CLI დროშა, რომ ნახოთ კვალი როგორ არის კონფიგურაცია წაკითხული და პარსირებული.
