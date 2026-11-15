---
translation_locale: mn
translation_source: /guide/configure/client-configuration.md
translation_source_hash: b3cfc8d8bf51a43b88cefb5ac7fe641717b347f7c89d983bf4c2de80944f1bb8
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
---
# Клиент тохиргоо {#client-configuration}

Iroha CLI ба SDK хэрэглэгчид TOML тохиргоог ашигладаг. Сан нь одоогийн анхдагчыг `defaults/client.toml` дээр нийлүүлдэг; үүсгэсэн локал сүлжээнүүд мөн өөрсдийн гаралтын хавтсан руу тохирох `client.toml`-г бичдэг.

::: details Клиентийн тохиргооны загвар

<<< @/snippets/client.template.toml

:::

## Үндсэн талбарууд {#core-fields}

Үйлчлүүлэгчийн тохиргоо хамгийн багадаа сүлжээ, түүний сүлжээний таних тэмдэг, Torii төгсгөлийн цэг, дансны сүлжээний нөхцөл болон гарын үсгийн түлхүүрийг тодорхойлно:

```toml
chain = "00000000-0000-0000-0000-000000000000"
network_id = "hash:32C903E5B3497E34C2B844EBFE8A39C19E6CF8F95D44C1FFB8BA9DCB42F91149#A2F0"
torii_url = "http://127.0.0.1:8080/"

[account]
chain_discriminant = 753
public_key = "ed0120..."
private_key = "802620..."
```

- `chain` илгээсэн гүйлгээг ямар гинжид хамаарахыг сонгодог.
- `network_id` нь эхлэл төлөвөөс үүссэн, гарын үсэгтэй хүсэлт бүр холбогдох сүлжээний таних тэмдэг юм. `network_id` эсвэл `network_id_file`-ийн яг нэгийг тохируулна; зангилаа утгыг `GET /v1/accounts/capabilities` дээр зарлана.
- `torii_url` сүлжээний түнш Torii HTTP API руу зааж байна.
- `[account].chain_discriminant` нь сүлжээний I105 дансны угтварыг сонгоно. Нийтэд нээлттэй сүлжээнүүд оронд нь `[account].profile = "taira"` эсвэл `"minamoto"` ашиглаж болно. Энэ хоёр сонголтын нэг шаардлагатай бөгөөд каноник `AccountId` өөрөө домэйнгүй.
- `[account].public_key` ба `[account].private_key` нь гүйлгээнд гарын үсэг зурна; `private_key_file` нь `private_key`-г орлож болно.

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

`iroha` CLI дотоод дарааллын төлөвт зориулсан, заавал байх албагүй `[connect]` хэсгийг мөн уншина. Дахин ашиглах SDK тохиргоо үүнийг хүлээн авахгүй:

```toml
[connect]
queue_root = "./queue"
```

Ажлын урсгал үйлчлүүлэгч талд дарааллыг найдвартай хадгалах шаардлагатай үед үүнийг ашиглана. `connect.queue_root`-ийн анхдагч утга `~/.iroha/connect`; харьцангуй замыг үйлчлүүлэгчийн TOML файл байгаа хавтсаас тооцно.

## Тохиргоонуудыг үүсгэж байна {#generating-configurations}

Түр хэрэглээний орон нутгийн сүлжээнүүдэд та Kagami-ийг илүүд үзээрэй, учир нь энэ нь тохирох Iroha 3 тохиргоонууд, блокчэйнын үүсгэл, скриптүүд, болон README-г бичдэг:

```bash
cargo run --bin kagami -- localnet generate --peers 4 --out-dir ./localnet
```

Үүсгэсэн `./localnet/client.toml`-ийг CLI–тэй ашиглана уу:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list --all
```
