---
translation_locale: mn
translation_source: /guide/configure/client-configuration.md
translation_source_hash: 6da8a0abddc9723b16477a935a3953ebd497300f02eadd635e4e38027a11d095
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Клиент тохиргоо {#client-configuration}

Iroha CLI ба SDK хэрэглэгчид TOML тохиргоог ашигладаг. Сан нь одоогийн анхдагчыг `defaults/client.toml` дээр нийлүүлдэг; үүсгэсэн локал сүлжээнүүд мөн өөрсдийн гаралтын хавтсан руу тохирох `client.toml`-г бичдэг.

::: details Клиентийн тохиргооны загвар

<<< @/snippets/client.template.toml

:::

## Үндсэн талбарууд {#core-fields}

Хамгийн багадаа, клиент тохиргоо нь сүлжээ, Torii API төгсгөл цэг, болон гарын үсэг зурсан дансыг тодорхойлдог:

```toml
chain = "00000000-0000-0000-0000-000000000000"
torii_url = "http://127.0.0.1:8080"

[account]
domain = "wonderland.universal"
public_key = "ed0120..."
private_key = "802620..."
```

- `chain` илгээсэн гүйлгээг ямар гинжид хамаарахыг сонгодог.
- `torii_url` сүлжээний түнш Torii HTTP API руу зааж байна.
- `[account].domain` нь CLI товчлол болон хаяг-сонгогч кодчилолд ашиглагддаг; ганцхан протокол-стандарт `AccountId` нь өөрийн гэсэн домайнгүй.
- `[account].public_key` ба `[account].private_key` гүйлгээний баримтыг гарын үсэг зурна.

Тооцоо аль хэдийн блокчейн дээр байх ёстой. Анхдагч локал сүлжээнд үүнийг багцлагдсан блокчейн генезис техникийн manifest-аар удирддаг.

::: info Том жижиг үсгийн ялгаа

Iroha нэрүүд нь нэг протокол стандартын задлалыг хийсний дараа том жижиг үсэг ялгаатай байдаг. Жишээлбэл, `wonderland.universal`, `Wonderland.universal`, ба `looking_glass.universal` нь өөр өөр домэйн утгууд юм.

:::

## Үндсэн баталгаажуулалт {#basic-authentication}

Сонголтын `[basic_auth]` хэсэг нь клиентээс ирсэн хүсэлтэд HTTP `Authorization` толгой нэмдэг. Iroha сүлжээний хамтрагчид эдгээр нууц бичиг баримтыг шууд тайлбарлахгүй; үүнийг Torii Nginx гэх мэт урвуу проксины ард байхад ашиглана уу.

```toml
[basic_auth]
web_login = "mad_hatter"
password = "ilovetea"
```

## Гүйлгээний тохиргоо {#transaction-settings}

Гүйлгээний зан үйл нь `[transaction]` хэсэгт тохируулагддаг:

```toml
[transaction]
time_to_live_ms = 100000
status_timeout_ms = 15000
nonce = false
```

- `time_to_live_ms` нь гүйлгээний насжилт миллисекундээр байна.
- `status_timeout_ms` нь үйлчлүүлэгч транзакцийн төлөвийг хүлээх хугацааг хянадаг.
- `nonce = true` үйлчлүүлэгчээс давтагдсан гүйлгээ бүр өөр криптографийн хэш үүсгэхийн тулд криптографийн nonce утга оруулахыг хүсэж байна.

## Эрэмбэлэх Төлөвлөлтийн Тохиргоо {#connect-queue-settings}

Одоогийн Iroha хэрэглэгчид мөн орон нутгийн эгнээгийн төлөвийн хувилбар `[connect]` хэсгийг ашиглаж болно:

```toml
[connect]
queue_root = "./queue"
```

Энэ нь ажлын урсгалд удаан хадгалах чадвартай клиент талын ээлжийн сан хэрэгтэй үед ашиглагдана.

## Тохиргоонуудыг үүсгэж байна {#generating-configurations}

Түр хэрэглээний орон нутгийн сүлжээнүүдэд та Kagami-ийг илүүд үзээрэй, учир нь энэ нь тохирох Iroha 3 тохиргоонууд, блокчэйнын үүсгэл, скриптүүд, болон README-г бичдэг:

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
```

Үүсгэсэн `./localnet/client.toml`-ийг CLI–тэй ашиглана уу:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```
