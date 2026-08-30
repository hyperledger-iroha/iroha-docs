---
translation_locale: mn
translation_source: /guide/configure/client-configuration.md
translation_source_hash: 6da8a0abddc9723b16477a935a3953ebd497300f02eadd635e4e38027a11d095
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Хэрэглэгчийн тохируулалт {#client-configuration}

Iroha CLI болон SDK үйлчлүүлэгчид TOML конфигурацийг ашигладаг. хадгаламж нь одоогийн урьдчилан сэргийлэх хэсгийг `defaults/client.toml` -д илгээдэг; үүсгэсэн орон нутгийн сүлжээүүд мөн тэдгээрийн гарааны жагсаалтад тохиромжтой `client.toml` бичнэ.

::: details Хэрэглэгчийн конфигурацийн загвар

<<< @/snippets/client.template.toml

:::

## Хөдөөний талбар {#core-fields}

Хэрэглэгчийн конфигурац нь зах зээлийн сүлжээ, Torii төгсгөлийн цэг болон гарын үсэг зурагч дансыг тодорхойлдог:

```toml
chain = "00000000-0000-0000-0000-000000000000"
torii_url = "http://127.0.0.1:8080"

[account]
domain = "wonderland.universal"
public_key = "ed0120..."
private_key = "802620..."
```

- `chain` нь өргөн мэдүүлсэн гүйлгээний зангилаа сонгодог.
- `torii_url` тэнцвэрт оноо Torii HTTP API.
- `[account].domain` нь CLI товчоо болон хаягийн сонгон шалгаруулалтын кодлолтоор ашиглагддаг; Canonical `AccountId` өөрөө доменгүй байдаг.
- `[account].public_key` болон `[account].private_key` гарын үсэг зурсан гүйлгээ.

Тухайн хуудсууд хэдийнээ зах зээл дээр байх ёстой. Үндсэн орон нутгийн сүлжээний хувьд энэ нь нэгдсэн эх үүсвэрийн манифестээр зохицуулагддаг.

::: info Хориотой байдал

Iroha нэрүүд нь каноникийн шинжилгээний дараа тохиолдлын мэдрэмжтэй байдаг. Тухайлбал, `wonderland.universal`, `Wonderland.universal` болон `looking_glass.universal` нь өөр хоорондын доменийн утга юм.

:::

## Үндсэн баталгаажуулах {#basic-authentication}

Сонгон шалгаруулах `[basic_auth]` хэсэг нь үйлчлүүлэгчдийн хүсэлтэд HTTP `Authorization` товчлогыг нэмнэ. Iroha өрсөлдөгчид эдгээр итгэлийг шууд тайлбарлахгүй; Torii нь Nginx зэрэг эргэн төлөөлөгчийн ард байх үед ашиглана.

```toml
[basic_auth]
web_login = "mad_hatter"
password = "ilovetea"
```

## Арилжааны тохируулалт {#transaction-settings}

Транзакцын үйл ажиллагааг `[transaction]` хэсэгт тохируулж байна:

```toml
[transaction]
time_to_live_ms = 100000
status_timeout_ms = 15000
nonce = false
```

- `time_to_live_ms` нь гүйлгээний хугацаа тэргүүн секундэд байна.
- `status_timeout_ms` нь үйлчлүүлэгчийн гүйлгээний байдлыг хүлээх хугацааг хянаж байна.
- `nonce = true` нь үйлчлүүлэгчээс дахин давтамжлах гүйлгээний төрөл бүрийн хэшийг бий болгохын тулд бусдыг багтаахыг хүсч байна.

## Хаврын тохируулгаг холбоно {#connect-queue-settings}

Одоогийн Iroha үйлчлүүлэгчид орон нутгийн шуурхай байдлын хувьд сонголттой `[connect]` хэсгийг ашиглаж болно:

```toml
[connect]
queue_root = "./queue"
```

Хөдөлмөрийн урсгалын хувьд үйлчлүүлэгчийн талд тогтвортой хувилбарыг хадгалах шаардлагатай бол үүнийг ашигла.

## Урьдчилгааг бий болгох {#generating-configurations}

Нэг удаа ашиглах орон нутгийн сүлжээний хувьд Kagami -ийг сонгоно, учир нь энэ нь Iroha 3-ийн тохиромжтой конфигурац, генез, скрипт болон README -г бичиж байна:

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
```

Нэрлэгдсэн `./localnet/client.toml` нь CLI:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```
