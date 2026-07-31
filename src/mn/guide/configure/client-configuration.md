---
translation_locale: mn
translation_source: /guide/configure/client-configuration.md
translation_source_hash: 0d897a79e6118de2e7e88a45f1daf1444b515fd35e7b2562f7c1cc18ed0a83b4
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Хэрэглэгчийн тохируулалт {#client-configuration}

Iroha CLI болон SDK үйлчлүүлэгчид ашигладаг TOML Хэвлэлийн сан нь
одоогийн алдаа `defaults/client.toml`; орон нутгийн сүлжээ үүсгэсэн нь мөн
нийлүүлэх `client.toml` тэдгээрийн гаргах товчоонд.

::: details Хэрэглэгчийн конфигурацийн загвар

<<< @/snippets/client.template.toml

:::

## Нүүрний талбар {#core-fields}

Хамгийн багадаа клиентийн конфигурац нь зангилаа тодорхойлдог. Torii эцсийн цэг,
гарын үсэг зурах бүртгэл:

```toml
chain = "00000000-0000-0000-0000-000000000000"
torii_url = "http://127.0.0.1:8080"

[account]
domain = "wonderland.universal"
public_key = "ed0120..."
private_key = "802620..."
```

- `chain` өргөн мэдүүлсэн гүйлгээний зангилаа сонгоно.
- `torii_url` тэнцвэрт оноо Torii HTTP API.
- `[account].domain` ашигладаг CLI товч зам, хаягийн сонгогчд зориулсан кодлолт;
  Каноникийн `AccountId` Үүнээс гадна, энэ нь доменгүй юм.
- `[account].public_key` болон `[account].private_key` гүйлгээний гарын үсэг зурна.

Эдгээрийн орон нутгийн сүлжээний хувьд энэ нь
Гениз-Манифестээр зохицуулагдсан.

::: info Хэрэгний мэдрэмж

Iroha Тухайлбал, "Хэрэв нэгдмэл хэрэглэгчийн нэр" гэдэг нь "Хэрэг хэрэглэгчид" гэсэн үг.
`wonderland.universal`, `Wonderland.universal`, болон
`looking_glass.universal` Энэ нь өөр хоорондын утга зохиол юм.

:::

## Бага санхүүжилт {#basic-authentication}

Үндэсний сонголт `[basic_auth]` бүлэг нь HTTP `Authorization` товч
үйлчлүүлэгчдийн хүсэлт. Iroha энэ итгэлийг хамтарсан хүмүүс шууд тайлбарлахгүй; ашиглах
тэдгээрийг Torii Nginx гэх мэт эргэлтийн төлөөлөгчийн ард байдаг.

```toml
[basic_auth]
web_login = "mad_hatter"
password = "ilovetea"
```

## Арилжааны тохируулалт {#transaction-settings}

Транзакцын үйл ажиллагаа нь `[transaction]` хэсэг:

```toml
[transaction]
time_to_live_ms = 100000
status_timeout_ms = 15000
nonce = false
```

- `time_to_live_ms` гүйлгээний хугацаа нь милсекунд байна.
- `status_timeout_ms` үйлчлүүлэгчийн гүйлгээг хүлээх хугацааг хянах
  байдал.
- `nonce = true` үйлчлүүлэгчийг давтамжсан гүйлгээний санхүүжилтийг тусгахыг шаардаж байна
  янз бүрийн хашиг үйлдвэрлэх.

## Хаврын тохируулгыг холбох {#connect-queue-settings}

Цахилгаан Iroha үйлчлүүлэгчид бас сонголттой `[connect]` орон нутгийн бүлэг
шуурлын байдал:

```toml
[connect]
queue_root = "./queue"
```

Ажлын урсгалд үйлчлүүлэгч тасагт тогтвортой шуурхай хадгалах шаардлагатай бол үүнийг ашигла.

## Нөхөрлөлтийг бий болгох {#generating-configurations}

Нэг удаа ашиглах орон нутгийн сүлжээний хувьд Kagami Учир нь энэ нь тохирох бичиж байна Iroha
3 хувилбар, эх үүсвэр, бичиг баримт, README:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
```

Үргэлжүүлсэн `./localnet/client.toml` . CLI:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```
