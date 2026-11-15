---
translation_locale: hy
translation_source: /reference/genesis.md
translation_source_hash: dda17468f39573a1fcf43474351bd01c4fea38e8b603fd4d8b21780b273c8649
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-delta
---
# Գենեզիսի հղում {#genesis-reference}

Ընթացքում Iroha 3 աշխատանքի ընթացք, ա `genesis.json` մանիֆեստը նկարագրում է առաջինը գործարքներ և պարամետրեր, որոնք կկիրառվեն ցանցի գործարկման ժամանակ:

Ստորագրված արտեֆակտը, որը բաժանվում է հանգույցներին, ա Norito- կոդավորված `.nrt` ֆայլ արտադրված է `kagami genesis sign`.

## Հիմնական դաշտերը {#main-fields}

Գենեզիսի մանիֆեստը կարող է սահմանել.

- `chain` շղթայի նույնացուցիչի համար
- `chain_discriminant`՝ մանիֆեստում հաշիվների բառացի ներկայացումները կոդավորող I105 ցանցային նախածանցի համար
- `executor` կամընտիր կատարողի արդիականացման բայթկոդի ուղու համար
- `ivm_dir` համար IVM գրադարաններ, որոնք օգտագործվում են գործարկիչների և արդիականացման միջոցով
- `consensus_mode` մանիֆեստի կողմից գովազդվող սկզբնական ռեժիմի համար
- `wire_protocol_version`՝ առաջին թողարկման կոնսենսուսի փոխանցման արձանագրության տարբերակի համար
- `consensus_fingerprint`՝ կոնսենսուսի պարամետրերի ընտրովի տիպավորված մատնահետքի համար, որը JSON մանիֆեստները բացահայտ նշում են
- `transactions` պատվիրված պարամետրերի թարմացումների, հրահանգների, գործարկիչների և տոպոլոգիայի համար
- `sumeragi_context`՝ ստորագրված Sumeragi բարձրության համատեքստի պարամետրերի համար
- `crypto_admission_policy`՝ շղթայի թույլատրած ստորագրման և կառավարիչի ճշգրիտ ալգորիթմների համար, որոնք թվարկված են `allowed_algorithms`-ում

Շրջանակներում `transactions`, տոպոլոգիայի գրառումները զույգ հանգույցների ID-ներ և PoPs միասին:

```json
{
  "peer": "ea0130...",
  "pop_hex": "0xabcd..."
}
```

## Ստեղծեք մանիֆեստ {#generate-a-manifest}

Ձևանմուշ ստեղծելու համար օգտագործեք Kagami։ Յուրաքանչյուր թույլատրված ալգորիթմի համար կրկնեք `--allowed-signing`-ը՝ աճող կանոնական հերթականությամբ․ Kagami-ն բաց թողնված ալգորիթմները չի լրացնում․

```bash
cargo run -p iroha_kagami -- genesis generate \
  --chain-id <CHAIN_ID> \
  --consensus-mode npos \
  --ivm-dir defaults \
  --genesis-public-key <PUBLIC_KEY> \
  --allowed-signing ed25519 \
  --allowed-signing bls_normal > genesis.json
```

Հանրային SORA Nexus տվյալների տարածքի համար ակնկալվող կոնսենսուսի ռեժիմը `npos` է։ Այլ Iroha 3 տեղակայումները կարող են օգտագործել թույլտվությամբ ռեժիմ կամ NPoS՝ ըստ թիրախ պրոֆիլի։

## Ստորագրեք Մանիֆեստը {#sign-the-manifest}

Խմբագրելուց և վավերացնելուց հետո JSON, ստորագրեք այն deployable-ում `.nrt` բլոկ:

```bash
cargo run -p iroha_kagami -- genesis sign genesis.json \
  --private-key-file <MODE_0600_PRIVATE_KEY_FILE> \
  --out-file genesis.signed.nrt \
  --expected-hash-out genesis.expected_hash
```

`kagami genesis sign`-ը գենեզիսի բանալիների զույգը ստանում է սեփականատիրոջ կողմից պահվող, մեկ հղումով սովորական ֆայլում գտնվող մասնավոր բանալուց և ստեղծում տեղակայվող ստորագրված բլոկը։ Փոխանցեք `--expected-public-key`՝ պահանջելու, որ այն համապատասխանի հրապարակված գենեզիսի հանրային բանալուն։ Ֆայլը պետք է պարունակի մեկ կանոնական մասնավոր բանալու մուլտիհեշ, որին հաջորդում է նոր տող. Kagami-ն մերժում է սիմվոլիկ հղումները և `0600`-ից տարբեր ռեժիմները։ Հում մասնավոր բանալիները հրամանի տողում չեն ընդունվում։ Արդյունքն այն ֆայլն է, որին հանգույցները պետք է հղում կատարեն իրենց կարգավորումից։

## Կարգավորել `iroha3d` {#configure-iroha3d}

Ծառայությանը նշեք ստորագրված ծագման բլոկը և դրա սպասվող հեշն ամրագրող ֆայլը։ Այդ ֆայլը գրում է `kagami genesis sign --expected-hash-out`-ը, իսկ հանգույցն այն պահանջում է առաջին և կրկնակի մեկնարկների ժամանակ․

```toml
[genesis]
file = "genesis.signed.nrt"
public_key = "<PUBLIC_KEY>"
expected_hash_file = "genesis.expected_hash"
```

## Առնչվող գործիքներ {#related-tools}

- `kagami genesis validate`
- `kagami genesis normalize`
- `kagami genesis embed-pop`
- `kagami localnet generate`
- `cargo xtask kagami-profiles`

Գեներատորի իրականացման և հրամանի մանրամասների համար տե՛ս [Kagami README](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_kagami/README.md).
