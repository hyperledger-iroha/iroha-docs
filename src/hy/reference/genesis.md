---
translation_locale: hy
translation_source: /reference/genesis.md
translation_source_hash: 1312e80d9e662cc3e8cf4d0668ff4bb9e6ce3f74a60bb5287205aeeb5afd5de8
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Ծննդոց Հղում {#genesis-reference}

Ընթացքում Iroha 3 աշխատանքի ընթացք, ա `genesis.json` մանիֆեստը նկարագրում է առաջինը
գործարքներ և պարամետրեր, որոնք կկիրառվեն ցանցի գործարկման ժամանակ:

Ստորագրված արտեֆակտը, որը բաժանվում է հասակակիցներին, ա Norito- կոդավորված `.nrt` ֆայլ
արտադրված է `kagami genesis sign`.

## Հիմնական դաշտերը {#main-fields}

Ծննդոց մանիֆեստը կարող է սահմանել.

- `chain` շղթայի նույնացուցիչի համար
- `executor` կամընտիր կատարողի արդիականացման բայթկոդի ուղու համար
- `ivm_dir` համար IVM գրադարաններ, որոնք օգտագործվում են գործարկիչների և արդիականացման միջոցով
- `consensus_mode` մանիֆեստի կողմից գովազդվող սկզբնական ռեժիմի համար
- `transactions` պատվիրված պարամետրերի թարմացումների, հրահանգների, գործարկիչների և տոպոլոգիայի համար
- `crypto` սկզբնական կրիպտո պատկերի համար

Շրջանակներում `transactions`, տոպոլոգիայի գրառումները զույգ գործընկերների ID-ներ և PoPs միասին:

```json
{
  "peer": "ea0130...",
  "pop_hex": "0xabcd..."
}
```

## Ստեղծեք մանիֆեստ {#generate-a-manifest}

Օգտագործեք Kagami ձևանմուշ ստեղծելու համար.

```bash
cargo run -p iroha_kagami -- genesis generate \
  --consensus-mode npos \
  --ivm-dir defaults \
  --genesis-public-key <PUBLIC_KEY> > genesis.json
```

Հանրության համար SORA Nexus տվյալների տարածություն, `npos` ակնկալվող կոնսենսուսային ռեժիմն է:
Այլ Iroha 3 տեղակայումները կարող են օգտագործել թույլատրված կամ NPoS՝ կախված թիրախից
պրոֆիլը.

## Ստորագրեք Մանիֆեստը {#sign-the-manifest}

Խմբագրելուց և վավերացնելուց հետո JSON, ստորագրեք այն deployable-ում `.nrt` արգելափակել:

```bash
cargo run -p iroha_kagami -- genesis sign genesis.json \
  --private-key-file <MODE_0600_PRIVATE_KEY_FILE> \
  --out-file genesis.signed.nrt
```

`kagami genesis sign` կարդում է Ծննդոց հանրային բանալին մանիֆեստից և օգտագործում
մասնավոր բանալին սեփականատիրոջ կողմից պահվող, մեկ հղումով սովորական ֆայլից՝ արտադրելու համար
տեղակայվող ստորագրված բլոկ:Ֆայլը պետք է պարունակի մեկ կանոնական մասնավոր բանալի
multihash, որին հաջորդում է նոր տող; Kagami մերժում է խորհրդանշական հղումները և այլ եղանակներ
քան `0600`. Հում անձնական բանալիները չեն ընդունվում հրամանի տողում:Արդյունքը
այն ֆայլն է, որին հասակակիցները պետք է հղում կատարեն իրենց կազմաձևից:

## Կարգավորել `iroha3d` {#configure-iroha3d}

Ուղղեք դեմոնին ստորագրված ծագման բլոկի վրա.

```toml
[genesis]
file = "genesis.signed.nrt"
public_key = "<PUBLIC_KEY>"
```

## Առնչվող գործիքներ {#related-tools}

- `kagami genesis validate`
- `kagami genesis normalize`
- `kagami genesis embed-pop`
- `kagami localnet`
- `cargo xtask kagami-profiles`

Գեներատորի իրականացման և հրամանի մանրամասների համար տե՛ս
[Kagami README](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_kagami/README.md).
