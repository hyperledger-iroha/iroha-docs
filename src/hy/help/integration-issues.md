---
translation_locale: hy
translation_source: /help/integration-issues.md
translation_source_hash: f9f8a1e5f8c66714532523ef40467d3e79d4d023b3b353244f0317647e755b38
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Ինտեգրացիայի խնդիրների լուծումը {#troubleshooting-integration-issues}

Այս բաժինը առաջարկում է խնդիրների լուծման խորհուրդներ Iroha 3 ինտեգրման համար: Եթե խնդիրը, որը դուք ունեք, չի նկարագրված այստեղ, կապվեք մեզ հետ [Telegram](https://t.me/hyperledgeriroha).

## Հաճախորդը չի կարող կապվել {#client-cannot-connect}

Ստուգեք, որ հաճախորդի կոնֆիգը մատնանշում է գործընկերոջ Torii հասցեն.

```toml
torii_url = "http://127.0.0.1:8080/"
```

CLI ստուգումների համար նույն ֆայլը բացարձակ փոխանցեք.

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

Եթե զուգընկերն անցնի Docker կամ Kubernetes, օգտագործեք հյուրընկալող կամ ծառայության հասցեն, որը հասանելի է հաճախորդի գործընթացի. `127.0.0.1` բեռի ներսում գտնվող սարքը հյուրընկալող չէ:

Հասարակական Taira փորձարկումների համար սկսեք առանց ստորագրության վերջնական կետի հետաքննությամբ.

```bash
curl -fsS https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -fsS 'https://taira.sora.org/v1/domains?limit=5' \
  | jq -r '.items[].id'
```

Եթե այս հրամանները ձախողվում են `502`, TLS, DNS կամ ժամանակահատվածային սխալների դեպքում, կարգավորեք ցանցի հասանելիությունը կամ սպասեք հանրային թեստնետի վերջնական կետին ՝ հաշիվների բանալիները կամ գործարքի օգտակար բեռնածությունները շտկելուց առաջ:

## Գործարքներ մերժվում են {#transactions-are-rejected}

Գործարքի ձախողումների մեծ մասը պայմանավորված է նույնականության կամ թույլտվությունների անհամապատասխանությամբ.

- Հաճախորդի կարգավորման հաշիվի հանրային բանալին չի համապատասխանում ստորագրության համար օգտագործվող մասնավոր բանալի:
- հաշիվը գրանցված չէ գեներիզմում կամ նախորդ գործարքի միջոցով
- հաշիվը բացակայում է վազման ժամանակի հավաստիացնողի կողմից պահանջվող թույլտվության նշան կամ դեր:
- ID տիրույթը բացակայում է տվյալների տարածքի որակավորման, օրինակ՝ `domain.dataspace`:

Օգտագործեք `--output-format text` ՝ շտկելով CLI հրամանները, որպեսզի սխալներն ավելի հեշտ ընթերցվեն.

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --output-format text ledger transaction ping --msg "hello"
```

## Հարցումները վերադարձնում են դատարկ արդյունքներ {#queries-return-empty-results}

Պակաս հարցման արդյունքները միշտ չէ, որ նշանակում են հարցումը ձախողվել. ստուգեք:

- գործարքը, որը պետք է ստեղծի օբյեկտը, կատարվել է
- հարցված տիրույթը, ակտիվի սահմանումը կամ հաշիվը ID կանոնիկ է
- pagination կամ ֆիլտրերը չեն բացառում ակնկալվող շարքը
- հաճախորդը կապված է նախատեսված ցանցի հետ, այլ ոչ թե մեկ այլ տեղական ցանցի

Դոմեյնների ստուգման համար սկսեք ամենամեծ հարցումից.

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

## Հանդիպման կամ արգելափակման հոսքերը վաղ դադարեցնում են {#event-or-block-streams-stop-early}

Բլոկի եւ իրադարձությունների հոսքի օրինակները կախված են Torii հոսող վերջային կետերից: Ստուգեք, որ զուգընկերն դեռեւս վազում է, ապա փորձարկեք ժամանակով:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger blocks 1 --timeout 30s
cargo run --bin iroha -- --config ./localnet/client.toml ledger events block
```

HTTP ինտեգրումների համար համեմատեք ձեր վերջնական կետի ուղիները ընթացիկ [Torii վերջային կետի հղման հետ](/hy/reference/torii-endpoints.md):
