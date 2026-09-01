---
translation_locale: ka
translation_source: /reference/peer-config/index.md
translation_source_hash: dd44f8f12cc456d6f37e1ceb3e82cf4a979e80115c75e28dcb1fe4f29469aaf4
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# კონფიგურაცია Iroha {#configuring-iroha}

ადგილობრივი ქსელის კვანძების კონფიგურაცია დაყენებულია TOML ფაილები. ეს განსხვავდება ქსელზე კონფიგურაციისაგან, რომელიც შეიცვალა [`SetParameter`](/ka/blockchain/instructions.md#setparameter) ინსტრუქციები. წარმოების ქცევა უნდა იყოს წარმოდგენილი კონფიგურაციაში ფაილი ან ქსელზე პარამეტრი; გარემოს ცვლადი არ არის მახასიათებელი კარიბჭეები.

გამოყენება [`--config`](../iroha3d-cli#arg-config) CLI არგუმენტი საკონფიგურაციო ფაილის მიმართულების მითითებისთვის.

## შაბლონი {#template}

თითოეული პარამეტრის დეტალური აღწერისათვის, გთხოვთ იხილოთ [პარამეტრები](./params.md) რეფერენცია.

::: details `peer.template.toml`

<<< @/snippets/peer.template.toml

:::

## კონფიგურაციის ფაილების შედგენა {#composing-configuration-files}

TOML კონფიგურაციის ფაილებს აქვთ დამატებითი `extends` ველი, რომელიც მიუთითებს სხვა TOML ფაილებზე (((). ეს შეიძლება იყოს ერთი გზა ან მრავალ გზა:

::: code-group

```toml [Single]
extends = "single-path.toml"
```

```toml [Multiple]
extends = ["file1.toml", "file2.toml"]
```

:::

Iroha რეკურსიულად წაიკითხავს ყველა ფაილს, რომელიც მითითებულია `extends` და შეადგენს მას ფენებად, სადაც ეს უკანასკნელი გადაწერს წინა ფენებს პარამეტრის დონეზე. მაგალითად, თუ წაიკითხება `config.toml`:

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

შედეგიანი კონფიგურაცია იქნება `chain` `a.toml`-დან, `max_content_len` `b.toml`-დან და `torii.address` `config.toml`-დან (გადაწერილი `b.toml`).

## პრობლემების აღმოფხვრა {#troubleshooting}

გადაცემა [`--trace-config`](../iroha3d-cli#arg-trace-config) CLI დროშა იმისათვის, რომ ნახოთ კვალი როგორ არის კონფიგურაცია წაკითხული და პარალიზებული.
