---
translation_locale: hy
translation_source: /guide/configure/keys-for-network-deployment.md
translation_source_hash: 9c9d3bcf68364768385cf1049d4595d6305d0556c2be2ec651dd30c04424da15
translation_status: machine-validated
translation_engine: nllb-200-ct2+codex-semantic-review
---

# Համացանցի տեղակայման բանալիները {#keys-for-network-deployment}

Յուրաքանչյուր ցանց պահանջում է հաճախորդների, գործընկերների, գենեզի ստորագրման եւ NPoS կամ Nexus պրոֆիլների համար տարբեր հիմնական նյութեր BLS վավերացնող նույնականացման համար:

## Որտեղ են օգտագործվում բանալիները {#where-keys-are-used}

- Հաճախորդի ստորագրման բանալիները պահվում են `client.toml` բաժնում՝ `[account]`:
- Պերային նույնականացման բանալիները պահվում են յուրաքանչյուր պերային `config.toml` որպես `public_key` եւ `private_key`:
- Պարբերականների հայտնաբերումը օգտագործում է յուրաքանչյուր պարբերականի հանրային բանալին `trusted_peers`
- BLS վավերացնող NPoS պրոֆիլների համար տիրապետման ապացույցները պահվում են `trusted_peers_pop` բաժնում:
- Ծննդոցի ստորագրությունը օգտագործում է `[genesis].public_key` զուգընկերների կարգավորման մեջ եւ համապատասխան մասնավոր բանալին, երբ ստորագրում է ցուցակ:

Տեղական կամ փորձարկման տեղակայման համար, թույլ տվեք Kagami ստեղծել բոլոր այս ֆայլերը միասին:

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
```

Ներկայացած ցանցի կամ պրոֆիլի համար օգտագործեք ուղեցույցային հոսքը.

```bash
cargo run --bin kagami -- wizard
```

## Ստեղծեք անհատական բանալիներ {#generate-individual-key-pairs}

Use `kagami keys` for standalone key material:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 \
  --out-dir ./client-key
```

For BLS validator material, include a Proof-of-Possession:

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop \
  --out-dir ./validator-key
```

Use `--seed-hex` only with an exact 32-byte hexadecimal secret for reproducible
development fixtures. For production deployment, omit it so Kagami uses
operating-system randomness, then move the unencrypted private-key export into
the approved custody boundary. The command never prints private keys.

## Դեռահասների համատեղություն {#peer-consistency}

Բոլոր վավերացողները պետք է համաձայնվեն նույն գենեզի գործարքի, տոպոլոգիայի, վստահելի զուգահեռ հանրային բանալիների եւ հավատարիմացողի PoPs վրա: Մեկ բացակայում կամ անհամապատասխան զուգահեռն բանալին կարող է խանգարել ցանցին սկսել կամ հասնել կոնսենսուսի.

Բyzantine- ի սխալների հանդուրժողական նվազագույն տեղակայման համար օգտագործեք առնվազն չորս զուգընկեր: Յուրաքանչյուր զուգընկերը պետք է ունենա իր սեփական մասնավոր բանալին, բայց յուրաքանչյուր զեկույցի կարգավորումն անհրաժեշտ է նույն վստահելի զեկույցային հավաքածու.

## Հաճախորդների հաշիվներ {#client-accounts}

Հաճախորդի հաշիվը `client.toml` պետք է արդեն գոյություն ունենա շղթայում: Այն կարող է գրանցվել գենեսիս մանիֆեստով կամ հետագա գործարքով: Մի օգտագործեք գենեսիսի ստորագրման նույնականությունը որպես երկարատեւ դիմումային հաշիվ; genesis արտոնությունները կիրառվում են միայն genesis շրջանի ընթացքում, եւ արտադրության հաճախորդները պետք է օգտագործեն իրենց սեփական հաշիվներն ու դերերը:
