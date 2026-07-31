---
translation_locale: hy
translation_source: /reference/genesis.md
translation_source_hash: 6710e76508e6a38a6b68d274247cc1383de2472e74f10be85000b30f74cb04a6
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Գինեզիսի հղում {#genesis-reference}

Ներկայիս Iroha 3 աշխատանքային հոսքում, `genesis.json` մանիֆեսը նկարագրում է առաջին գործարքները եւ պարամետրերը, որոնք կիրառվելու են ցանցի մեկնարկից հետո:

Պարբերականներին տարածված ստորագրված արվեստի գործիքը Norito կոդավորված `.nrt` ֆայլ է, որը արտադրվել է `kagami genesis sign`:

## Հիմնական դաշտեր {#main-fields}

Ծննդաբերության մանիֆեսը կարող է սահմանել.

- `chain` շղթայի նույնականացման համար
- `executor` ընտրանքային կատարող վերանորոգման բայթքոդի ուղու համար
- `ivm_dir` IVM գրադարանների համար, որոնք օգտագործվում են գործարկիչներով եւ թարմացմամբ
- `consensus_mode` նախնական ռեժիմի համար, որը գովազդվում է ցուցակում:
- `transactions` կարգավորված պարամետրերի թարմացման, հրահանգների, գործարկիչների եւ տոպոլոգիայի համար:
- `crypto` նախնական կրիպտո լուսանկարի համար

`transactions` տոպոլոգիական գրառումները զուգահեռ նույնականացումներ եւ PoPs միասին:

```json
{
  "peer": "ea0130...",
  "pop_hex": "0xabcd..."
}
```

## Ստեղծեք մանիֆեստ {#generate-a-manifest}

Kagami օգտագործելով ձեւանմուշ ստեղծելու համար.

```bash
cargo run -p iroha_kagami -- genesis generate \
  --consensus-mode npos \
  --ivm-dir defaults \
  --genesis-public-key <PUBLIC_KEY> > genesis.json
```

Հանրային SORA Nexus տվյալների տարածքի համար, `npos` է ակնկալվող համաձայնության ռեժիմը: Այլ Iroha 3 տեղակայումները կարող են օգտագործել թույլատրված կամ NPoS ՝ կախված նպատակային պրոֆիլից:

## ստորագրեք հայտարարությունը {#sign-the-manifest}

JSON խմբագրման եւ վավերացման ավարտից հետո ստորագրել այն տեղադրելի `.nrt` բլոկում.

```bash
cargo run -p iroha_kagami -- genesis sign genesis.json \
  --private-key <PRIVATE_KEY> \
  --out-file genesis.signed.nrt
```

`kagami genesis sign` կարդում է գենեզի հանրային բանալին մանիֆիսից եւ օգտագործում է մատակարարված մասնավոր բանալին, սերմը եւ ալգորիթմը ՝ տեղադրելի ստորագրված բլոկը արտադրելու համար: Արդյունքը այն ֆայլն է, որը զուգընկերները պետք է հղումներ կատարեն իրենց կոնֆիգից:

## Կոնֆիգուրում `irohad` {#configure-irohad}

Նայեք դեյմոնին ստորագրված գեներիզային բլոկին.

```toml
[genesis]
file = "genesis.signed.nrt"
public_key = "<PUBLIC_KEY>"
```

## Համապատասխան գործիքներ {#related-tools}

- `kagami genesis validate`
- `kagami genesis normalize`
- `kagami genesis embed-pop`
- `kagami localnet`
- `cargo xtask kagami-profiles`

Գեներատորի իրականացման եւ հրամանի մանրամասների համար դիտեք [Kagami README](https://github.com/hyperledger-iroha/iroha/blob/main/crates/iroha_kagami/README.md):
