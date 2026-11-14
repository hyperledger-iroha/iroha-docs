---
translation_locale: hy
translation_source: /guide/configure/client-configuration.md
translation_source_hash: b3cfc8d8bf51a43b88cefb5ac7fe641717b347f7c89d983bf4c2de80944f1bb8
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-delta
---
# Հաճախորդի կարգավորումը {#client-configuration}

Iroha CLI եւ SDK հաճախորդները օգտագործում են TOML կոֆիգուրացիան: Թղթադրամը ուղարկում է ընթացիկ կանխորոշումը `defaults/client.toml`; ստեղծված տեղական ցանցերը նույնպես գրում են համապատասխանող `client.toml` իրենց արտադրանքի ցուցահանդեսին:

::: details Հաճախորդի կարգավորման ձեւանմուշը

<<< @/snippets/client.template.toml

:::

## Հիմնական դաշտեր {#core-fields}

Հաճախորդի կարգավորումն առնվազն նույնացնում է շղթան, դրա ցանցային նույնությունը, Torii վերջնակետը, հաշվի ցանցային համատեքստը և ստորագրման բանալին․

```toml
chain = "00000000-0000-0000-0000-000000000000"
network_id = "hash:32C903E5B3497E34C2B844EBFE8A39C19E6CF8F95D44C1FFB8BA9DCB42F91149#A2F0"
torii_url = "http://127.0.0.1:8080/"

[account]
chain_discriminant = 753
public_key = "ed0120..."
private_key = "802620..."
```

- `chain` ընտրում է այն շղթան, որին պատկանում են ներկայացված գործարքները:
- `network_id`-ը ծագման վիճակից ստացված ցանցային նույնությունն է, որին կապվում է յուրաքանչյուր ստորագրված հարցում։ Կարգավորեք ճշգրիտ մեկը՝ `network_id` կամ `network_id_file`․ հանգույցը արժեքը հրապարակում է `GET /v1/accounts/capabilities`-ում։
- `torii_url` կետերը հանգույց Torii HTTP API:
- `[account].chain_discriminant`-ն ընտրում է ցանցի I105 հաշվի նախածանցը։ Հանրային ցանցերը կարող են փոխարենը օգտագործել `[account].profile = "taira"` կամ `"minamoto"`։ Այս երկուսից մեկը պարտադիր է, իսկ կանոնական `AccountId`-ն ինքնին տիրույթ չի պարունակում։
- `[account].public_key`-ը և `[account].private_key`-ը ստորագրում են գործարքները․ `private_key_file`-ը կարող է փոխարինել `private_key`-ին։

Հաշիվը պետք է արդեն գոյություն ունենա շղթայի վրա: Սովորական տեղական ցանցի համար դա կարգավորվում է փաթեթավորված գենեզիսային մանիֆեստում:

::: info Հավաքի զգայունությունը

Iroha անունները կանոնական զննարկումից հետո զգայուն են դեպքերի համար: Օրինակ, `wonderland.universal`, `Wonderland.universal` եւ `looking_glass.universal` տարբեր դոմեյնային բառեր են:

:::

## Հիմնական վավերացում {#basic-authentication}

Ընտրական `[basic_auth]` բաժինը հաճախորդի խնդրանքներին ավելացնում է HTTP `Authorization` գլուխը: Iroha հանգույցները ուղղակիորեն չեն մեկնաբանում այս հավատարմագրերը. օգտագործեք դրանք, երբ Torii-ը գտնվում է Nginx- ի նման հակառակ պրոկսի հետեւում:

```toml
[basic_auth]
web_login = "mad_hatter"
password = "ilovetea"
```

## Գործարքի կարգավորումները {#transaction-settings}

Գործարքի վարքագիծը կարգավորվում է `[transaction]` բաժնում.

```toml
[transaction]
time_to_live_ms = 100000
status_timeout_ms = 15000
nonce = false
```

- `time_to_live_ms`-ը գործարքի կյանքի ժամկետն է միլիսիկունդներով:
- `status_timeout_ms` վերահսկում է, թե որքան ժամանակ հաճախորդը սպասում է գործարքի կարգավիճակին:
- `nonce = true` պահանջում է հաճախորդին ներառել ոչ մի բան, այնպես որ կրկնվող գործարքները առաջացնում են տարբեր hashes:

## Կապակցեք հերթի կարգավորումները {#connect-queue-settings}

`iroha` CLI-ն տեղային հերթի վիճակի համար նաև կարդում է ոչ պարտադիր `[connect]` բաժինը։ Կրկնօգտագործվող SDK կարգավորումը դա չի ընդունում․

```toml
[connect]
queue_root = "./queue"
```

Օգտագործեք սա, երբ հոսքին պետք է հաճախորդի կողմում հերթի կայուն պահպանում։ `connect.queue_root`-ի լռելյայն արժեքը `~/.iroha/connect` է, իսկ հարաբերական ուղին հաշվարկվում է հաճախորդի TOML ֆայլը պարունակող պանակից։

## Կոնֆիգուրացիաների ստեղծում {#generating-configurations}

Տեղական ցանցերի համար նախընտրեք Kagami, քանի որ այն գրում է համընկնում Iroha 3 կոնֆիգներ, գենեզիս, սքրիպտներ եւ README:

```bash
cargo run --bin kagami -- localnet generate --peers 4 --out-dir ./localnet
```

Օգտագործեք արտադրված `./localnet/client.toml` ՝ CLI հետ:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list --all
```
