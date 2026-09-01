---
translation_locale: hy
translation_source: /guide/configure/client-configuration.md
translation_source_hash: 6da8a0abddc9723b16477a935a3953ebd497300f02eadd635e4e38027a11d095
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Հաճախորդի կարգավորումը {#client-configuration}

Iroha CLI եւ SDK հաճախորդները օգտագործում են TOML կոֆիգուրացիան: Թղթադրամը ուղարկում է ընթացիկ կանխորոշումը `defaults/client.toml`; ստեղծված տեղական ցանցերը նույնպես գրում են համապատասխանող `client.toml` իրենց արտադրանքի ցուցահանդեսին:

::: details Հաճախորդի կարգավորման ձեւանմուշը

<<< @/snippets/client.template.toml

:::

## Հիմնական դաշտեր {#core-fields}

Առնվազն հաճախորդի կարգավորումը բացահայտում է շղթան, Torii վերջային կետը եւ ստորագրման հաշիվը.

```toml
chain = "00000000-0000-0000-0000-000000000000"
torii_url = "http://127.0.0.1:8080"

[account]
domain = "wonderland.universal"
public_key = "ed0120..."
private_key = "802620..."
```

- `chain` ընտրում է այն շղթան, որին պատկանում են ներկայացված գործարքները:
- `torii_url` կետերը հանգույց Torii HTTP API:
- `[account].domain`-ը օգտագործվում է CLI շտապուղներով եւ հասցեների ընտրողի կոդավորմամբ, իսկ քանոնիկ `AccountId`-ը ինքնուրույն դոմեյնային չէ:
- `[account].public_key` եւ `[account].private_key` ստորագրման գործարքներ:

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

Ներկայիս Iroha հաճախորդները կարող են նաեւ օգտագործել տեղական հերթի վիճակի համար ընտրական `[connect]` բաժինը.

```toml
[connect]
queue_root = "./queue"
```

Օգտագործեք սա, երբ աշխատանքային հոսքը պահանջում է մշտական հաճախորդի կողմի հերթային պահեստավորում:

## Կոնֆիգուրացիաների ստեղծում {#generating-configurations}

Տեղական ցանցերի համար նախընտրեք Kagami, քանի որ այն գրում է համընկնում Iroha 3 կոնֆիգներ, գենեզիս, սքրիպտներ եւ README:

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
```

Օգտագործեք արտադրված `./localnet/client.toml` ՝ CLI հետ:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```
