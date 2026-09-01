---
translation_locale: hy
translation_source: /guide/advanced/running-iroha-on-bare-metal.md
translation_source_hash: 648e69f2a572a0bb3e88919831774d21c1a17438b8bde742224a1457880539c1
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Iroha-ի գործարկում ֆիզիկական սերվերի վրա {#running-iroha-on-bare-metal}

Օգտագործեք այս աշխատանքային հոսքը, երբ ցանկանում եք գործարկել հանգույցները ուղղակիորեն հյուրերի վրա, այլ ոչ թե Docker Compose միջոցով: Ներկայիս աղբյուրի ծառը տրամադրում է Kagami գեներատորներ, որոնք գրում են համընկնում genesis, peer config, client config եւ start / stop սցենարները:

## 1. Բինարների կառուցում {#_1-build-the-binaries}

Iroha վերածառային աշխատանքային տարածքից՝

```bash
cargo build --release \
  -p irohad --bin iroha3d \
  -p iroha_cli --bin iroha \
  -p iroha_kagami --bin kagami
```

Սա բերում է հետեւյալը.

- `target/release/iroha3d` հանգույցային դեյմոնի համար
- `target/release/iroha` համար CLI
- `target/release/kagami` բանալիների, գենեզների եւ տեղական ցանցերի արտադրության համար

## 2. Ստեղծեք տեղական ցանց {#_2-generate-a-local-network}

Ստեղծեք չորս հանգույցային Iroha 3 տեղական ցանց.

```bash
target/release/kagami localnet --peers 4 --out-dir ./localnet
```

Արտադրանքի ցուցակը պարունակում է առաջադրված `genesis.json`, `genesis.signed.nrt`, հանգույցային `config.toml` ֆայլեր, `client.toml`, օգնական սցենարներ եւ առաջադրվող `README.md` ՝ այդ փաթեթի համար ճշգրիտ հրամաններով:

## 3. Սկսեք հանգույցներ ունենալ {#_3-start-peers}

Ստեղծված մեկնարկային տեղական ցանցի համար օգտագործեք ստեղծված սցենարը.

```bash
./localnet/start.sh
```

Եթե պետք է յուրաքանչյուր հանգույց միացնեք գործընթացների կառավարչի, օրինակ՝ systemd-ի, օգտագործեք յուրաքանչյուր հանգույցի համար `./localnet/README.md`-ում գրանցված գործարկման հրամանը։ Յուրաքանչյուր հանգույցի `config.toml`-ը, մասնավոր բանալին, պահեստավորման գրացուցակը և նավահանգիստները պահեք առանձին։

## 4. Կառավարել ցանցը {#_4-operate-the-network}

Օգտագործեք ստեղծված հաճախորդի կարգավորումը.

```bash
target/release/iroha --config ./localnet/client.toml ledger domain list all
target/release/iroha --config ./localnet/client.toml --output-format text ops sumeragi status
```

Սեղմեք ստեղծված տեղական ցանցը հետեւյալով.

```bash
./localnet/stop.sh
```

## 5. Արտադրության արձանագրություններ {#_5-production-notes}

- Ստեղծեք արտադրության համար թարմ մասնավոր բանալիներ եւ պահեք դրանք պահեստից դուրս:
- Բոլոր հանգույցները պետք է համաձայնվեն նույն ստորագրված գենեզի գործարքի, տոպոլոգիայի, վստահելի հանգույցը եւ հաստատող PoPs մասին:
- Բինդ լսողը դիմում է հյուրընկալող տեղական ինտերֆեյսներին միայն այն ժամանակ, երբ հանգույցին չպետք է հասանելի լինի այլ մեքենաներից:
- Օգտագործեք հակադարձ պրոկսի կամ կրակի պատ Torii բացակայության համար, հիմնական auth, TLS եւ արագության սահմանափակում:
- Բարեւեք գենեզի կամ կոնսենսուսային տոպոլոգիայի փոփոխությունները որպես համակարգված միգրացիաներ, այլ ոչ թե մեկ հանգույցային ֆայլերի խմբագրում։

Կոնտեյներային տեղական զարգացման համար օգտագործեք [Lunch Iroha 3](../../get-started/launch-iroha.md) Docker Compose աշխատանքային հոսքը:
